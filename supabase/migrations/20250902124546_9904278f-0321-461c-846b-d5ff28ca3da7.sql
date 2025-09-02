-- Add missing tables for comprehensive procurement system

-- Payment schedules table for contract payments
CREATE TABLE IF NOT EXISTS public.payment_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL,
  milestone_id UUID,
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  payment_amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_reference TEXT,
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;

-- Payment schedules policies
CREATE POLICY "Contract parties can view payment schedules"
  ON public.payment_schedules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM contracts 
    WHERE contracts.id = payment_schedules.contract_id 
    AND (contracts.buyer_id = auth.uid() OR contracts.supplier_id = auth.uid())
  ));

CREATE POLICY "Buyers can manage payment schedules"
  ON public.payment_schedules FOR ALL
  USING (EXISTS (
    SELECT 1 FROM contracts 
    WHERE contracts.id = payment_schedules.contract_id 
    AND contracts.buyer_id = auth.uid()
  ));

-- Document templates table
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  category TEXT NOT NULL,
  template_content JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Document templates policies
CREATE POLICY "Anyone can view active templates"
  ON public.document_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON public.document_templates FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Supplier performance history table
CREATE TABLE IF NOT EXISTS public.supplier_performance_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL,
  contract_id UUID NOT NULL,
  evaluation_period_start DATE NOT NULL,
  evaluation_period_end DATE NOT NULL,
  overall_score NUMERIC DEFAULT 0.00,
  quality_score NUMERIC DEFAULT 0.00,
  delivery_score NUMERIC DEFAULT 0.00,
  service_score NUMERIC DEFAULT 0.00,
  evaluator_id UUID NOT NULL,
  evaluation_notes TEXT,
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.supplier_performance_history ENABLE ROW LEVEL SECURITY;

-- Supplier performance policies
CREATE POLICY "Suppliers can view their performance"
  ON public.supplier_performance_history FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Buyers can view supplier performance"
  ON public.supplier_performance_history FOR SELECT
  USING (has_role(auth.uid(), 'buyer'::user_role));

CREATE POLICY "Evaluators can manage performance records"
  ON public.supplier_performance_history FOR ALL
  USING (auth.uid() = evaluator_id);

-- Vendor blacklist table
CREATE TABLE IF NOT EXISTS public.vendor_blacklist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL,
  blacklisted_by UUID NOT NULL,
  blacklist_reason TEXT NOT NULL,
  blacklist_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  supporting_documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_blacklist ENABLE ROW LEVEL SECURITY;

-- Blacklist policies
CREATE POLICY "Admins can manage blacklist"
  ON public.vendor_blacklist FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Buyers can view blacklist"
  ON public.vendor_blacklist FOR SELECT
  USING (has_role(auth.uid(), 'buyer'::user_role));

-- System settings table for configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- System settings policies
CREATE POLICY "Anyone can view public settings"
  ON public.system_settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can manage all settings"
  ON public.system_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('procurement_methods', '["open_tender", "restricted_tender", "direct_procurement", "request_for_proposal", "request_for_quotation", "framework_agreement", "design_competition", "two_stage_tendering", "electronic_reverse_auction", "competitive_dialogue", "innovation_partnership"]', 'array', 'Available procurement methods', true),
('currency_settings', '{"default": "KES", "supported": ["KES", "USD", "EUR", "GBP"]}', 'object', 'Currency configuration', true),
('tender_validity_days', '90', 'number', 'Default tender validity period in days', true),
('evaluation_weights', '{"technical": 0.7, "financial": 0.3}', 'object', 'Default evaluation criteria weights', true),
('storage_fallback_enabled', 'true', 'boolean', 'Enable fallback storage system', false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_schedules_contract_id ON public.payment_schedules(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_due_date ON public.payment_schedules(due_date);
CREATE INDEX IF NOT EXISTS idx_supplier_performance_supplier_id ON public.supplier_performance_history(supplier_id);
CREATE INDEX IF NOT EXISTS idx_vendor_blacklist_supplier_id ON public.vendor_blacklist(supplier_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(setting_key);