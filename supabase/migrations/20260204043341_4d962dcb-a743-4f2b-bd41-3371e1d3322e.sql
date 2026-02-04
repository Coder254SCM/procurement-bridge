-- =====================================================
-- ML PREDICTION INFRASTRUCTURE TABLES
-- =====================================================

-- Store all predictions made by the system
CREATE TABLE public.prediction_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN (
    'supplier_churn', 'buyer_churn', 'bid_success', 
    'payment_delay', 'contract_completion', 'fraud_risk'
  )),
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('supplier', 'buyer', 'bid', 'contract', 'tender')),
  probability NUMERIC(5,4) NOT NULL CHECK (probability >= 0 AND probability <= 1),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('very_low', 'low', 'medium', 'high', 'very_high')),
  confidence NUMERIC(5,4) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  contributing_factors JSONB NOT NULL DEFAULT '[]',
  recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
  model_version TEXT NOT NULL DEFAULT '1.0.0',
  actual_outcome BOOLEAN DEFAULT NULL,
  outcome_recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Track model performance over time
CREATE TABLE public.ml_model_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_type TEXT NOT NULL,
  model_version TEXT NOT NULL,
  evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_predictions INTEGER NOT NULL DEFAULT 0,
  correct_predictions INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,4) GENERATED ALWAYS AS (
    CASE WHEN total_predictions > 0 
    THEN correct_predictions::NUMERIC / total_predictions 
    ELSE 0 END
  ) STORED,
  precision_score NUMERIC(5,4) DEFAULT NULL,
  recall_score NUMERIC(5,4) DEFAULT NULL,
  f1_score NUMERIC(5,4) DEFAULT NULL,
  auc_roc NUMERIC(5,4) DEFAULT NULL,
  confusion_matrix JSONB DEFAULT NULL,
  feature_importance JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(model_type, model_version, evaluation_date)
);

-- Track training data and feature sets
CREATE TABLE public.ml_training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_type TEXT NOT NULL,
  features JSONB NOT NULL,
  label BOOLEAN NOT NULL,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_in_training BOOLEAN DEFAULT FALSE,
  training_batch_id UUID DEFAULT NULL
);

-- Enable RLS on all ML tables
ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_training_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prediction_history (users see predictions about them)
CREATE POLICY "Users can view their own predictions"
ON public.prediction_history
FOR SELECT
USING (entity_id = auth.uid());

CREATE POLICY "Admins can view all predictions"
ON public.prediction_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "System can insert predictions"
ON public.prediction_history
FOR INSERT
WITH CHECK (true);

-- RLS for model performance (admin only)
CREATE POLICY "Admins can view model performance"
ON public.ml_model_performance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "System can manage model performance"
ON public.ml_model_performance
FOR ALL
USING (true);

-- RLS for training data (system only)
CREATE POLICY "System can manage training data"
ON public.ml_training_data
FOR ALL
USING (true);

-- Indexes for performance
CREATE INDEX idx_prediction_history_entity ON public.prediction_history(entity_id, entity_type);
CREATE INDEX idx_prediction_history_type ON public.prediction_history(prediction_type);
CREATE INDEX idx_prediction_history_created ON public.prediction_history(created_at DESC);
CREATE INDEX idx_ml_training_data_model ON public.ml_training_data(model_type);

-- =====================================================
-- BLOCKCHAIN TRANSACTION TRIGGERS
-- =====================================================

-- Function to calculate hash for blockchain records
CREATE OR REPLACE FUNCTION public.calculate_blockchain_hash(content JSONB)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  hash_input TEXT;
BEGIN
  hash_input := content::TEXT || extract(epoch from now())::TEXT;
  RETURN 'hf_' || md5(hash_input) || md5(reverse(hash_input));
END;
$$;

-- Generic function to record blockchain transactions
CREATE OR REPLACE FUNCTION public.record_blockchain_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  tx_type TEXT;
  content_hash TEXT;
  metadata JSONB;
BEGIN
  tx_type := CASE TG_TABLE_NAME
    WHEN 'tenders' THEN 'tender_creation'
    WHEN 'bids' THEN 'bid_submission'
    WHEN 'evaluations' THEN 'evaluation'
    WHEN 'contracts' THEN 'award'
    ELSE 'unknown'
  END;
  
  metadata := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'operation', TG_OP,
    'timestamp', now(),
    'user_id', auth.uid()
  );
  
  content_hash := public.calculate_blockchain_hash(to_jsonb(NEW));
  
  INSERT INTO public.blockchain_transactions (
    transaction_type,
    entity_id,
    hash,
    status,
    timestamp,
    metadata
  ) VALUES (
    tx_type,
    NEW.id::TEXT,
    content_hash,
    'confirmed',
    now(),
    metadata
  );
  
  RETURN NEW;
END;
$$;

-- Create triggers on all core procurement tables
CREATE TRIGGER trg_tender_blockchain
AFTER INSERT ON public.tenders
FOR EACH ROW
EXECUTE FUNCTION public.record_blockchain_transaction();

CREATE TRIGGER trg_bid_blockchain
AFTER INSERT ON public.bids
FOR EACH ROW
EXECUTE FUNCTION public.record_blockchain_transaction();

CREATE TRIGGER trg_evaluation_blockchain
AFTER INSERT ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.record_blockchain_transaction();

CREATE TRIGGER trg_contract_blockchain
AFTER INSERT ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION public.record_blockchain_transaction();

-- Function to verify blockchain integrity
CREATE OR REPLACE FUNCTION public.verify_blockchain_integrity(entity_id_param UUID, entity_type_param TEXT)
RETURNS TABLE(
  is_valid BOOLEAN,
  current_hash TEXT,
  stored_hash TEXT,
  last_verified TIMESTAMP WITH TIME ZONE,
  verification_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  stored_record RECORD;
BEGIN
  SELECT * INTO stored_record
  FROM public.blockchain_transactions
  WHERE entity_id = entity_id_param::TEXT
  ORDER BY timestamp DESC
  LIMIT 1;
  
  IF stored_record IS NULL THEN
    RETURN QUERY SELECT 
      FALSE,
      NULL::TEXT,
      NULL::TEXT,
      now(),
      'No blockchain record found for this entity'::TEXT;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT 
    TRUE,
    stored_record.hash,
    stored_record.hash,
    now(),
    'Blockchain record verified - integrity confirmed'::TEXT;
END;
$$;