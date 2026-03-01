
-- Create generic updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- PROCUREMENT PLANS TABLE
-- Implements: PPADA 2015 S.53, S.44(c)(i), PFM Reg 51(3)-(5)
-- ============================================================
CREATE TABLE public.procurement_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NULL,
  created_by UUID NOT NULL,
  approved_by UUID NULL,
  financial_year TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'annual' CHECK (plan_type IN ('annual', 'multi_year', 'supplementary')),
  plan_reference TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  department TEXT NOT NULL,
  total_budget_allocation NUMERIC NOT NULL DEFAULT 0,
  total_planned_expenditure NUMERIC NOT NULL DEFAULT 0,
  budget_currency TEXT NOT NULL DEFAULT 'KES',
  budget_allocation_id UUID NULL REFERENCES budget_allocations(id),
  agpo_reserved_percentage NUMERIC NOT NULL DEFAULT 30 CHECK (agpo_reserved_percentage >= 30),
  agpo_reserved_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'submitted_ppra', 'submitted_treasury', 'active', 'completed', 'revised')),
  ppra_submission_date TIMESTAMPTZ NULL,
  ppra_submission_reference TEXT NULL,
  treasury_submission_date TIMESTAMPTZ NULL,
  treasury_submission_reference TEXT NULL,
  approval_date TIMESTAMPTZ NULL,
  approval_remarks TEXT NULL,
  multi_year_start TEXT NULL,
  multi_year_end TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PROCUREMENT PLAN ITEMS TABLE
-- Implements: PFM Reg 51(4)
-- ============================================================
CREATE TABLE public.procurement_plan_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES procurement_plans(id) ON DELETE CASCADE,
  item_number INTEGER NOT NULL,
  item_description TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_of_measure TEXT NOT NULL DEFAULT 'unit',
  unit_cost NUMERIC NOT NULL DEFAULT 0,
  estimated_contract_value NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'KES',
  procurement_method TEXT NOT NULL DEFAULT 'open_tender',
  is_agpo_reserved BOOLEAN NOT NULL DEFAULT false,
  agpo_category TEXT NULL,
  min_responsive_suppliers INTEGER NOT NULL DEFAULT 3,
  planned_start_date DATE NULL,
  planned_end_date DATE NULL,
  delivery_schedule TEXT NULL,
  budget_line_item TEXT NULL,
  funding_source TEXT NULL DEFAULT 'government',
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'tendered', 'awarded', 'completed', 'cancelled', 'deferred')),
  tender_id UUID NULL,
  contract_id UUID NULL,
  actual_expenditure NUMERIC NULL DEFAULT 0,
  splitting_flag BOOLEAN NOT NULL DEFAULT false,
  splitting_reason TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE public.procurement_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plan creators can manage their plans"
  ON public.procurement_plans FOR ALL
  USING (auth.uid() = created_by);

CREATE POLICY "Buyers can view all plans"
  ON public.procurement_plans FOR SELECT
  USING (has_role(auth.uid(), 'buyer'::user_role));

CREATE POLICY "Admins can manage all plans"
  ON public.procurement_plans FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Finance users can view plans"
  ON public.procurement_plans FOR SELECT
  USING (has_role(auth.uid(), 'evaluator_finance'::user_role));

CREATE POLICY "Plan item access via plan ownership"
  ON public.procurement_plan_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM procurement_plans
    WHERE procurement_plans.id = procurement_plan_items.plan_id
    AND procurement_plans.created_by = auth.uid()
  ));

CREATE POLICY "Buyers can view all plan items"
  ON public.procurement_plan_items FOR SELECT
  USING (has_role(auth.uid(), 'buyer'::user_role));

CREATE POLICY "Admins can manage all plan items"
  ON public.procurement_plan_items FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_procurement_plans_financial_year ON public.procurement_plans(financial_year);
CREATE INDEX idx_procurement_plans_status ON public.procurement_plans(status);
CREATE INDEX idx_procurement_plans_created_by ON public.procurement_plans(created_by);
CREATE INDEX idx_plan_items_plan_id ON public.procurement_plan_items(plan_id);
CREATE INDEX idx_plan_items_status ON public.procurement_plan_items(status);
CREATE INDEX idx_plan_items_category ON public.procurement_plan_items(category);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER update_procurement_plans_updated_at
  BEFORE UPDATE ON public.procurement_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_procurement_plan_items_updated_at
  BEFORE UPDATE ON public.procurement_plan_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
