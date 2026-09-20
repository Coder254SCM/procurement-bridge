-- 1. Businesses (tenants)
CREATE TYPE public.business_member_role AS ENUM ('owner','admin','member');

CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  registration_number text,
  tax_number text,
  country text,
  industry text,
  organization_size text,
  logo_url text,
  billing_email text,
  plan_id uuid REFERENCES public.subscription_plans(id),
  status text NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.business_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.business_member_role NOT NULL DEFAULT 'member',
  invited_by uuid,
  joined_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, user_id)
);

CREATE TABLE public.business_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email text NOT NULL,
  role public.business_member_role NOT NULL DEFAULT 'member',
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  invited_by uuid,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  accepted_at timestamptz,
  accepted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_members_user ON public.business_members(user_id);
CREATE INDEX idx_business_invitations_email ON public.business_invitations(lower(email));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_members TO authenticated;
GRANT ALL ON public.business_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_invitations TO authenticated;
GRANT ALL ON public.business_invitations TO service_role;

-- 2. Security-definer helpers (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_business_member(_business_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.business_members m WHERE m.business_id = _business_id AND m.user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.has_business_role(_business_id uuid, _role public.business_member_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.business_members m WHERE m.business_id = _business_id AND m.user_id = auth.uid() AND m.role = _role);
$$;

CREATE OR REPLACE FUNCTION public.can_manage_business(_business_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.business_members m WHERE m.business_id = _business_id AND m.user_id = auth.uid() AND m.role IN ('owner','admin'));
$$;

CREATE OR REPLACE FUNCTION public.my_business_ids()
RETURNS SETOF uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT business_id FROM public.business_members WHERE user_id = auth.uid();
$$;

-- 3. RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their business" ON public.businesses
  FOR SELECT TO authenticated USING (public.is_business_member(id));
CREATE POLICY "Users can create a business" ON public.businesses
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Owners and admins can update their business" ON public.businesses
  FOR UPDATE TO authenticated USING (public.can_manage_business(id)) WITH CHECK (public.can_manage_business(id));
CREATE POLICY "Owners can delete their business" ON public.businesses
  FOR DELETE TO authenticated USING (public.has_business_role(id, 'owner'));

CREATE POLICY "Members can view co-members" ON public.business_members
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_business_member(business_id));
CREATE POLICY "Founder or managers can add members" ON public.business_members
  FOR INSERT TO authenticated WITH CHECK (
    public.can_manage_business(business_id)
    OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.created_by = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.business_invitations i
      WHERE i.business_id = business_members.business_id
        AND i.status = 'pending' AND i.expires_at > now()
        AND lower(i.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        AND business_members.user_id = auth.uid()
    )
  );
CREATE POLICY "Managers can update members" ON public.business_members
  FOR UPDATE TO authenticated USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));
CREATE POLICY "Managers can remove members" ON public.business_members
  FOR DELETE TO authenticated USING (public.can_manage_business(business_id) OR user_id = auth.uid());

CREATE POLICY "Managers and invitees can view invitations" ON public.business_invitations
  FOR SELECT TO authenticated USING (
    public.can_manage_business(business_id) OR lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
  );
CREATE POLICY "Managers can create invitations" ON public.business_invitations
  FOR INSERT TO authenticated WITH CHECK (public.can_manage_business(business_id) AND invited_by = auth.uid());
CREATE POLICY "Managers or invitee can update invitations" ON public.business_invitations
  FOR UPDATE TO authenticated USING (
    public.can_manage_business(business_id) OR lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
  ) WITH CHECK (
    public.can_manage_business(business_id) OR lower(email) = lower(coalesce(auth.jwt() ->> 'email',''))
  );
CREATE POLICY "Managers can delete invitations" ON public.business_invitations
  FOR DELETE TO authenticated USING (public.can_manage_business(business_id));

-- 4. Protect the last owner
CREATE OR REPLACE FUNCTION public.protect_last_business_owner()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner_count integer;
BEGIN
  IF (TG_OP = 'DELETE' AND OLD.role = 'owner')
     OR (TG_OP = 'UPDATE' AND OLD.role = 'owner' AND NEW.role <> 'owner') THEN
    SELECT count(*) INTO owner_count FROM public.business_members
      WHERE business_id = OLD.business_id AND role = 'owner';
    IF owner_count <= 1 THEN
      RAISE EXCEPTION 'A business must always have at least one owner';
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_protect_last_business_owner
  BEFORE UPDATE OR DELETE ON public.business_members
  FOR EACH ROW EXECUTE FUNCTION public.protect_last_business_owner();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_members_updated_at BEFORE UPDATE ON public.business_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_invitations_updated_at BEFORE UPDATE ON public.business_invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Stamp tenant-owned records with their business (additive, nullable)
ALTER TABLE public.tenders ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.procurement_plans ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.purchase_requisitions ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.budget_allocations ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.catalog_items ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.framework_agreements ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);

CREATE INDEX IF NOT EXISTS idx_tenders_business ON public.tenders(business_id);
CREATE INDEX IF NOT EXISTS idx_bids_business ON public.bids(business_id);
CREATE INDEX IF NOT EXISTS idx_contracts_business ON public.contracts(business_id);

-- Business-scoped read access alongside existing policies
CREATE POLICY "Business members can view their tenders" ON public.tenders
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));
CREATE POLICY "Business members can view their bids" ON public.bids
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));
CREATE POLICY "Business members can view their contracts" ON public.contracts
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));
CREATE POLICY "Business members can view their plans" ON public.procurement_plans
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));
CREATE POLICY "Business members can view their requisitions" ON public.purchase_requisitions
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));
CREATE POLICY "Business members can view their budgets" ON public.budget_allocations
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));
CREATE POLICY "Business members can view their catalog items" ON public.catalog_items
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));
CREATE POLICY "Business members can view their framework agreements" ON public.framework_agreements
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));

-- 6. Subscriptions can belong to a business, with seats
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS business_id uuid REFERENCES public.businesses(id);
ALTER TABLE public.user_subscriptions ADD COLUMN IF NOT EXISTS seats integer NOT NULL DEFAULT 1;
CREATE POLICY "Business members can view the business subscription" ON public.user_subscriptions
  FOR SELECT TO authenticated USING (business_id IS NOT NULL AND public.is_business_member(business_id));