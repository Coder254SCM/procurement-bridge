-- Missing tables for complete RTH implementation and fraud detection

-- Create fraud alerts table
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  description TEXT NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
  assigned_to UUID,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tender fairness metrics table
CREATE TABLE IF NOT EXISTS public.tender_fairness_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  supplier_accessibility NUMERIC(5,2) NOT NULL,
  requirement_clarity NUMERIC(5,2) NOT NULL,
  timeline_adequacy NUMERIC(5,2) NOT NULL,
  evaluation_transparency NUMERIC(5,2) NOT NULL,
  budget_realism NUMERIC(5,2) NOT NULL,
  overall_fairness NUMERIC(5,2) NOT NULL,
  recommendations JSONB DEFAULT '[]'::jsonb,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create capability matching results table
CREATE TABLE IF NOT EXISTS public.capability_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL,
  match_score NUMERIC(5,2) NOT NULL,
  match_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  invitation_sent BOOLEAN DEFAULT false,
  invitation_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create submission wizard progress table
CREATE TABLE IF NOT EXISTS public.submission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('tender', 'bid', 'requisition')),
  entity_id UUID,
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL,
  step_data JSONB DEFAULT '{}'::jsonb,
  is_draft BOOLEAN DEFAULT true,
  last_saved_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_fairness_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fraud_alerts (using admin role which exists)
CREATE POLICY "Admins can view all fraud alerts"
  ON public.fraud_alerts FOR SELECT
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "System can create fraud alerts"
  ON public.fraud_alerts FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Admins can update fraud alerts"
  ON public.fraud_alerts FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for tender_fairness_metrics
CREATE POLICY "Buyers can view fairness metrics for their tenders"
  ON public.tender_fairness_metrics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.tenders
    WHERE tenders.id = tender_fairness_metrics.tender_id
    AND tenders.buyer_id = auth.uid()
  ));

CREATE POLICY "System can create fairness metrics"
  ON public.tender_fairness_metrics FOR INSERT
  WITH CHECK (true);

-- RLS Policies for capability_matches
CREATE POLICY "Buyers can view capability matches for their tenders"
  ON public.capability_matches FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.tenders
    WHERE tenders.id = capability_matches.tender_id
    AND tenders.buyer_id = auth.uid()
  ));

CREATE POLICY "Suppliers can view their own matches"
  ON public.capability_matches FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "System can create capability matches"
  ON public.capability_matches FOR INSERT
  WITH CHECK (true);

-- RLS Policies for submission_progress
CREATE POLICY "Users can view their own submission progress"
  ON public.submission_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submission progress"
  ON public.submission_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submission progress"
  ON public.submission_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submission progress"
  ON public.submission_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_entity ON public.fraud_alerts(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_severity ON public.fraud_alerts(severity, status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_detected ON public.fraud_alerts(detected_at DESC);

CREATE INDEX IF NOT EXISTS idx_fairness_tender ON public.tender_fairness_metrics(tender_id);
CREATE INDEX IF NOT EXISTS idx_fairness_score ON public.tender_fairness_metrics(overall_fairness DESC);

CREATE INDEX IF NOT EXISTS idx_matches_tender ON public.capability_matches(tender_id);
CREATE INDEX IF NOT EXISTS idx_matches_supplier ON public.capability_matches(supplier_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON public.capability_matches(match_score DESC);

CREATE INDEX IF NOT EXISTS idx_progress_user ON public.submission_progress(user_id, entity_type);

-- Comments for documentation
COMMENT ON TABLE public.fraud_alerts IS 'Fraud detection alerts and investigation tracking';
COMMENT ON TABLE public.tender_fairness_metrics IS 'Fairness analysis metrics for tenders ensuring balance for buyers and suppliers';
COMMENT ON TABLE public.capability_matches IS 'AI-powered capability matching between tenders and suppliers';
COMMENT ON TABLE public.submission_progress IS 'Wizard-based submission progress tracking with draft support';
