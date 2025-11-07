-- RTH (Resonant Tender Harmonics) Database Schema
-- Based on patent: Wave-based multi-party consensus for blockchain procurement

-- RTH Verifier Network
CREATE TABLE IF NOT EXISTS public.rth_verifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  verifier_type TEXT NOT NULL CHECK (verifier_type IN ('finance', 'technical', 'quality', 'delivery', 'legal')),
  reputation_amplitude NUMERIC DEFAULT 0.7 CHECK (reputation_amplitude >= 0 AND reputation_amplitude <= 1),
  response_frequency NUMERIC DEFAULT 0.5,
  consistency_period NUMERIC DEFAULT 24,
  total_verifications INTEGER DEFAULT 0,
  correct_verifications INTEGER DEFAULT 0,
  last_verification_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RTH Verification Sessions
CREATE TABLE IF NOT EXISTS public.rth_verification_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.contract_milestones(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('delivery', 'quality', 'payment', 'milestone_completion')),
  required_verifiers INTEGER DEFAULT 4 CHECK (required_verifiers >= 4),
  current_verifiers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'consensus_reached', 'no_consensus', 'blocked')),
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  average_phase NUMERIC,
  circular_variance NUMERIC,
  consensus_result JSONB DEFAULT '{}'::jsonb,
  outlier_detected BOOLEAN DEFAULT false,
  outlier_verifier_id UUID REFERENCES public.rth_verifiers(id),
  outlier_confidence NUMERIC,
  decision TEXT CHECK (decision IN ('AUTHORIZE', 'CAUTION', 'BLOCK')),
  blockchain_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '48 hours')
);

-- Individual Verifications (the "waves")
CREATE TABLE IF NOT EXISTS public.rth_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.rth_verification_sessions(id) ON DELETE CASCADE NOT NULL,
  verifier_id UUID REFERENCES public.rth_verifiers(id) ON DELETE CASCADE NOT NULL,
  verification_data JSONB NOT NULL,
  verified_value NUMERIC NOT NULL,
  phase_angle NUMERIC,
  response_time_seconds INTEGER,
  amplitude NUMERIC NOT NULL,
  frequency NUMERIC,
  wavelength NUMERIC,
  comments TEXT,
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Phase Matrix (pairwise comparisons)
CREATE TABLE IF NOT EXISTS public.rth_phase_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.rth_verification_sessions(id) ON DELETE CASCADE NOT NULL,
  verifier_i UUID REFERENCES public.rth_verifiers(id) NOT NULL,
  verifier_j UUID REFERENCES public.rth_verifiers(id) NOT NULL,
  phase_angle NUMERIC NOT NULL,
  interference_type TEXT CHECK (interference_type IN ('constructive', 'partial', 'destructive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, verifier_i, verifier_j)
);

-- Dual-Field Validation (objective vs subjective)
CREATE TABLE IF NOT EXISTS public.rth_field_validation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.rth_verification_sessions(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL,
  objective_value NUMERIC,
  objective_source TEXT,
  subjective_value NUMERIC,
  subjective_source TEXT,
  field_phase_angle NUMERIC,
  interference_classification TEXT CHECK (interference_classification IN ('constructive', 'partial', 'destructive')),
  fraud_likelihood NUMERIC CHECK (fraud_likelihood >= 0 AND fraud_likelihood <= 100),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Risk Pressure Monitoring
CREATE TABLE IF NOT EXISTS public.rth_risk_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL,
  tax_compliance_score NUMERIC DEFAULT 0,
  credit_score NUMERIC DEFAULT 0,
  regulatory_compliance_score NUMERIC DEFAULT 0,
  performance_score NUMERIC DEFAULT 0,
  total_risk_pressure NUMERIC CHECK (total_risk_pressure >= 0 AND total_risk_pressure <= 100),
  risk_state TEXT CHECK (risk_state IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
  verification_frequency TEXT,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Historical Pattern Library
CREATE TABLE IF NOT EXISTS public.rth_pattern_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id),
  pattern_vector JSONB NOT NULL,
  success_metric NUMERIC CHECK (success_metric >= 0 AND success_metric <= 1),
  pattern_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rth_verifiers_user ON public.rth_verifiers(user_id);
CREATE INDEX IF NOT EXISTS idx_rth_verifiers_type ON public.rth_verifiers(verifier_type);
CREATE INDEX IF NOT EXISTS idx_rth_sessions_contract ON public.rth_verification_sessions(contract_id);
CREATE INDEX IF NOT EXISTS idx_rth_sessions_milestone ON public.rth_verification_sessions(milestone_id);
CREATE INDEX IF NOT EXISTS idx_rth_sessions_status ON public.rth_verification_sessions(status);
CREATE INDEX IF NOT EXISTS idx_rth_verifications_session ON public.rth_verifications(session_id);
CREATE INDEX IF NOT EXISTS idx_rth_verifications_verifier ON public.rth_verifications(verifier_id);
CREATE INDEX IF NOT EXISTS idx_rth_phase_matrix_session ON public.rth_phase_matrix(session_id);
CREATE INDEX IF NOT EXISTS idx_rth_field_validation_session ON public.rth_field_validation(session_id);
CREATE INDEX IF NOT EXISTS idx_rth_risk_supplier ON public.rth_risk_monitoring(supplier_id);

-- Enable RLS
ALTER TABLE public.rth_verifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rth_verification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rth_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rth_phase_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rth_field_validation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rth_risk_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rth_pattern_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rth_verifiers
CREATE POLICY "Users can view their own verifier profile" ON public.rth_verifiers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all verifiers" ON public.rth_verifiers
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Anyone authenticated can view verifiers" ON public.rth_verifiers
  FOR SELECT USING (auth.role() = 'authenticated'::text);

-- RLS Policies for rth_verification_sessions
CREATE POLICY "Contract parties can view sessions" ON public.rth_verification_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id
      AND (c.buyer_id = auth.uid() OR c.supplier_id = auth.uid())
    )
  );

CREATE POLICY "Verifiers can view their assigned sessions" ON public.rth_verification_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rth_verifications rv
      JOIN public.rth_verifiers rver ON rv.verifier_id = rver.id
      WHERE rv.session_id = rth_verification_sessions.id
      AND rver.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage sessions" ON public.rth_verification_sessions
  FOR ALL USING (auth.role() = 'service_role'::text);

-- RLS Policies for rth_verifications
CREATE POLICY "Verifiers can create their verifications" ON public.rth_verifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rth_verifiers
      WHERE id = verifier_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view verifications for their sessions" ON public.rth_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rth_verification_sessions rvs
      JOIN public.contracts c ON rvs.contract_id = c.id
      WHERE rvs.id = session_id
      AND (c.buyer_id = auth.uid() OR c.supplier_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.rth_verifiers
      WHERE id = verifier_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for phase matrix
CREATE POLICY "Users can view phase matrix for their sessions" ON public.rth_phase_matrix
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rth_verification_sessions rvs
      JOIN public.contracts c ON rvs.contract_id = c.id
      WHERE rvs.id = session_id
      AND (c.buyer_id = auth.uid() OR c.supplier_id = auth.uid())
    )
  );

CREATE POLICY "Service role can manage phase matrix" ON public.rth_phase_matrix
  FOR ALL USING (auth.role() = 'service_role'::text);

-- RLS Policies for field validation
CREATE POLICY "Users can view field validation for their sessions" ON public.rth_field_validation
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.rth_verification_sessions rvs
      JOIN public.contracts c ON rvs.contract_id = c.id
      WHERE rvs.id = session_id
      AND (c.buyer_id = auth.uid() OR c.supplier_id = auth.uid())
    )
  );

CREATE POLICY "Service role can manage field validation" ON public.rth_field_validation
  FOR ALL USING (auth.role() = 'service_role'::text);

-- RLS Policies for risk monitoring
CREATE POLICY "Suppliers can view their risk monitoring" ON public.rth_risk_monitoring
  FOR SELECT USING (auth.uid()::text = supplier_id::text);

CREATE POLICY "Buyers can view supplier risk monitoring" ON public.rth_risk_monitoring
  FOR SELECT USING (has_role(auth.uid(), 'buyer'::user_role));

CREATE POLICY "Service role can manage risk monitoring" ON public.rth_risk_monitoring
  FOR ALL USING (auth.role() = 'service_role'::text);

-- RLS Policies for pattern library
CREATE POLICY "Anyone can view pattern library" ON public.rth_pattern_library
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage pattern library" ON public.rth_pattern_library
  FOR ALL USING (auth.role() = 'service_role'::text);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_rth_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers
CREATE TRIGGER update_rth_verifiers_updated_at
  BEFORE UPDATE ON public.rth_verifiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_rth_updated_at();

-- Function to update verifier reputation
CREATE OR REPLACE FUNCTION public.update_verifier_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_correct BOOLEAN;
  v_delta NUMERIC;
BEGIN
  -- Determine if verification was correct based on consensus
  SELECT (decision = 'AUTHORIZE') INTO v_correct
  FROM public.rth_verification_sessions
  WHERE id = NEW.session_id;
  
  IF v_correct THEN
    v_delta := 0.10;
  ELSE
    v_delta := -0.25;
  END IF;
  
  -- Update verifier reputation using exponential moving average
  UPDATE public.rth_verifiers
  SET 
    reputation_amplitude = GREATEST(0, LEAST(1, reputation_amplitude + v_delta)),
    total_verifications = total_verifications + 1,
    correct_verifications = CASE WHEN v_correct THEN correct_verifications + 1 ELSE correct_verifications END,
    last_verification_at = now()
  WHERE id = NEW.verifier_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_verifier_reputation_on_verification
  AFTER INSERT ON public.rth_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_verifier_reputation();