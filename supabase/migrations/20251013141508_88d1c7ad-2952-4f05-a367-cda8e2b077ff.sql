-- ============================================
-- FILL ALL MONETIZATION GAPS (CORRECTED)
-- ============================================

-- 1. Add organization_type to profiles for buyer classification
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS organization_type TEXT CHECK (organization_type IN ('government', 'parastatal', 'private', 'ngo', 'other'));

-- 2. Add payment tracking to contract_milestones
ALTER TABLE public.contract_milestones
ADD COLUMN IF NOT EXISTS payment_received_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'mobile_money', 'check', 'cash', 'other')),
ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- 3. Add geographic data to tenders
ALTER TABLE public.tenders
ADD COLUMN IF NOT EXISTS county TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS location_details JSONB DEFAULT '{}'::jsonb;

-- 4. Add supplier size classification to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS company_size TEXT CHECK (company_size IN ('micro', 'small', 'medium', 'large', 'enterprise')),
ADD COLUMN IF NOT EXISTS annual_revenue_range TEXT,
ADD COLUMN IF NOT EXISTS employee_count INTEGER;

-- 5. Add standardized category codes to tenders
ALTER TABLE public.tenders
ADD COLUMN IF NOT EXISTS category_code TEXT,
ADD COLUMN IF NOT EXISTS category_standard TEXT CHECK (category_standard IN ('UNSPSC', 'CPV', 'NIGP', 'custom'));

-- 6. Create dispute_resolution table
CREATE TABLE IF NOT EXISTS public.dispute_resolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES public.tenders(id) ON DELETE SET NULL,
  dispute_type TEXT NOT NULL CHECK (dispute_type IN ('payment', 'quality', 'delivery', 'contract_breach', 'specification', 'other')),
  raised_by UUID NOT NULL,
  raised_against UUID NOT NULL,
  dispute_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT NOT NULL,
  amount_disputed NUMERIC,
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'mediation', 'arbitration', 'resolved', 'closed')),
  resolution_method TEXT CHECK (resolution_method IN ('negotiation', 'mediation', 'arbitration', 'legal', 'withdrawn')),
  resolution_date TIMESTAMP WITH TIME ZONE,
  resolution_details TEXT,
  outcome TEXT CHECK (outcome IN ('favored_supplier', 'favored_buyer', 'compromise', 'withdrawn', 'escalated')),
  mediator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on dispute_resolution
ALTER TABLE public.dispute_resolution ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dispute_resolution
CREATE POLICY "Contract parties can view disputes"
ON public.dispute_resolution FOR SELECT
USING (
  auth.uid() = raised_by 
  OR auth.uid() = raised_against
  OR auth.uid() = mediator_id
  OR has_role(auth.uid(), 'admin'::user_role)
);

CREATE POLICY "Users can create disputes"
ON public.dispute_resolution FOR INSERT
WITH CHECK (auth.uid() = raised_by);

CREATE POLICY "Dispute parties can update"
ON public.dispute_resolution FOR UPDATE
USING (
  auth.uid() = raised_by 
  OR auth.uid() = raised_against 
  OR auth.uid() = mediator_id
  OR has_role(auth.uid(), 'admin'::user_role)
);

-- 7. Add indexes for TenderIntel analytics
CREATE INDEX IF NOT EXISTS idx_profiles_organization_type ON public.profiles(organization_type) WHERE organization_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenders_county ON public.tenders(county) WHERE county IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenders_category_code ON public.tenders(category_code) WHERE category_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contract_milestones_payment_date ON public.contract_milestones(payment_received_date) WHERE payment_received_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_bids_supplier_tender ON public.bids(supplier_id, tender_id);
CREATE INDEX IF NOT EXISTS idx_dispute_resolution_status ON public.dispute_resolution(status);

-- 8. Create function to calculate payment delay
CREATE OR REPLACE FUNCTION public.calculate_payment_delay_days(
  completion_date TIMESTAMP WITH TIME ZONE,
  payment_date TIMESTAMP WITH TIME ZONE
) RETURNS INTEGER AS $$
BEGIN
  IF payment_date IS NOT NULL AND completion_date IS NOT NULL THEN
    RETURN EXTRACT(DAY FROM (payment_date - completion_date))::INTEGER;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 9. Create data access logging table
CREATE TABLE IF NOT EXISTS public.data_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('api_call', 'export', 'report_generation', 'analytics_query')),
  endpoint TEXT NOT NULL,
  query_parameters JSONB,
  data_accessed TEXT NOT NULL,
  record_count INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.data_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view access logs"
ON public.data_access_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "System can insert access logs"
ON public.data_access_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_data_access_logs_user ON public.data_access_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_access_logs_endpoint ON public.data_access_logs(endpoint);