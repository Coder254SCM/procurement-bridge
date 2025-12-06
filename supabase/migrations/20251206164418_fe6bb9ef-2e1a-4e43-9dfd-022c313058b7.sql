-- ============================================
-- AGPO (Access to Government Procurement Opportunities) System
-- Kenya Public Procurement preference for Youth, Women, PWDs
-- ============================================

-- AGPO Categories enum-like tracking
CREATE TABLE IF NOT EXISTS public.agpo_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code TEXT NOT NULL UNIQUE,
  category_name TEXT NOT NULL,
  description TEXT,
  preference_percentage NUMERIC NOT NULL DEFAULT 30,
  reservation_limit NUMERIC DEFAULT 0.30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert Kenya AGPO categories
INSERT INTO public.agpo_categories (category_code, category_name, description, preference_percentage, reservation_limit) VALUES
  ('YOUTH', 'Youth-Owned Enterprise', 'Businesses majority owned by persons aged 18-35 years', 30, 0.30),
  ('WOMEN', 'Women-Owned Enterprise', 'Businesses majority owned by women', 30, 0.30),
  ('PWD', 'PWD-Owned Enterprise', 'Businesses majority owned by Persons with Disabilities', 30, 0.30),
  ('MARGINALIZED', 'Marginalized Groups', 'Businesses from marginalized communities per PPRA guidelines', 30, 0.20);

-- Supplier AGPO registration
CREATE TABLE IF NOT EXISTS public.supplier_agpo_registration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL,
  agpo_category_id UUID NOT NULL REFERENCES public.agpo_categories(id),
  certificate_number TEXT NOT NULL,
  certificate_expiry DATE NOT NULL,
  certificate_document_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(supplier_id, agpo_category_id)
);

-- Tender AGPO reservation settings
CREATE TABLE IF NOT EXISTS public.tender_agpo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  agpo_reserved BOOLEAN DEFAULT false,
  reserved_categories TEXT[] DEFAULT '{}',
  reservation_percentage NUMERIC DEFAULT 30,
  exclusive_agpo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tender_id)
);

-- ============================================
-- APPEAL HANDLING SYSTEM
-- Per PPRA Regulations - 14 days appeal window
-- ============================================

CREATE TABLE IF NOT EXISTS public.procurement_appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id),
  appellant_id UUID NOT NULL,
  appellant_type TEXT NOT NULL CHECK (appellant_type IN ('supplier', 'consortium')),
  appeal_type TEXT NOT NULL CHECK (appeal_type IN ('bid_evaluation', 'award_decision', 'tender_cancellation', 'disqualification', 'specification_dispute', 'other')),
  appeal_grounds TEXT NOT NULL,
  supporting_evidence JSONB DEFAULT '[]',
  appeal_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  standstill_triggered BOOLEAN DEFAULT true,
  
  -- Response tracking
  response_deadline TIMESTAMP WITH TIME ZONE,
  buyer_response TEXT,
  buyer_response_date TIMESTAMP WITH TIME ZONE,
  buyer_response_by UUID,
  
  -- Review process
  assigned_reviewer UUID,
  review_committee_members JSONB DEFAULT '[]',
  review_notes TEXT,
  
  -- Decision
  decision TEXT CHECK (decision IN ('upheld', 'dismissed', 'partially_upheld', 'pending')),
  decision_date TIMESTAMP WITH TIME ZONE,
  decision_rationale TEXT,
  remedial_actions JSONB DEFAULT '[]',
  
  -- Escalation to PPARB
  escalated_to_pparb BOOLEAN DEFAULT false,
  pparb_reference_number TEXT,
  pparb_decision TEXT,
  pparb_decision_date TIMESTAMP WITH TIME ZONE,
  
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'awaiting_response', 'decided', 'escalated', 'closed')),
  blockchain_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Appeal timeline tracking
CREATE TABLE IF NOT EXISTS public.appeal_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appeal_id UUID NOT NULL REFERENCES public.procurement_appeals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  event_by UUID,
  event_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  documents JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT false
);

-- ============================================
-- ERP INTEGRATION CONNECTORS
-- Actual connector configuration for SAP, Oracle, MS Dynamics
-- ============================================

-- ERP connector configurations (extends existing erp_connections table)
CREATE TABLE IF NOT EXISTS public.erp_connector_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.erp_connections(id) ON DELETE CASCADE,
  connector_type TEXT NOT NULL CHECK (connector_type IN ('sap_s4hana', 'sap_ariba', 'oracle_fusion', 'oracle_ebs', 'ms_dynamics_365', 'custom')),
  
  -- SAP specific
  sap_client TEXT,
  sap_system_id TEXT,
  sap_logon_group TEXT,
  
  -- Oracle specific
  oracle_service_name TEXT,
  oracle_wallet_path TEXT,
  
  -- MS Dynamics specific
  dynamics_tenant_id TEXT,
  dynamics_environment_url TEXT,
  
  -- Common
  field_mappings JSONB NOT NULL DEFAULT '{}',
  sync_entities TEXT[] DEFAULT '{}',
  transformation_rules JSONB DEFAULT '{}',
  error_handling_config JSONB DEFAULT '{"retries": 3, "backoff_multiplier": 2}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ERP data sync queue
CREATE TABLE IF NOT EXISTS public.erp_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.erp_connections(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete', 'sync')),
  payload JSONB NOT NULL,
  priority INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.agpo_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_agpo_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_agpo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appeal_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erp_connector_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.erp_sync_queue ENABLE ROW LEVEL SECURITY;

-- AGPO Categories (public read)
CREATE POLICY "Anyone can view AGPO categories" ON public.agpo_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage AGPO categories" ON public.agpo_categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Supplier AGPO Registration
CREATE POLICY "Suppliers can register for AGPO" ON public.supplier_agpo_registration FOR INSERT WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "Suppliers can view their AGPO registrations" ON public.supplier_agpo_registration FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Admins can manage all AGPO registrations" ON public.supplier_agpo_registration FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Buyers can view verified AGPO suppliers" ON public.supplier_agpo_registration FOR SELECT USING (verification_status = 'verified' AND has_role(auth.uid(), 'buyer'));

-- Tender AGPO Settings
CREATE POLICY "Buyers can manage tender AGPO settings" ON public.tender_agpo_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM tenders WHERE tenders.id = tender_agpo_settings.tender_id AND tenders.buyer_id = auth.uid())
);
CREATE POLICY "Anyone can view published tender AGPO settings" ON public.tender_agpo_settings FOR SELECT USING (
  EXISTS (SELECT 1 FROM tenders WHERE tenders.id = tender_agpo_settings.tender_id AND tenders.status = 'published')
);

-- Procurement Appeals
CREATE POLICY "Appellants can create appeals" ON public.procurement_appeals FOR INSERT WITH CHECK (auth.uid() = appellant_id);
CREATE POLICY "Appellants can view their appeals" ON public.procurement_appeals FOR SELECT USING (auth.uid() = appellant_id);
CREATE POLICY "Buyers can view appeals on their tenders" ON public.procurement_appeals FOR SELECT USING (
  EXISTS (SELECT 1 FROM tenders WHERE tenders.id = procurement_appeals.tender_id AND tenders.buyer_id = auth.uid())
);
CREATE POLICY "Buyers can respond to appeals" ON public.procurement_appeals FOR UPDATE USING (
  EXISTS (SELECT 1 FROM tenders WHERE tenders.id = procurement_appeals.tender_id AND tenders.buyer_id = auth.uid())
);
CREATE POLICY "Admins can manage all appeals" ON public.procurement_appeals FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Appeal Timeline
CREATE POLICY "Appeal parties can view timeline" ON public.appeal_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM procurement_appeals pa WHERE pa.id = appeal_timeline.appeal_id AND (
    pa.appellant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM tenders t WHERE t.id = pa.tender_id AND t.buyer_id = auth.uid()) OR
    has_role(auth.uid(), 'admin')
  ))
);
CREATE POLICY "System can insert timeline events" ON public.appeal_timeline FOR INSERT WITH CHECK (true);

-- ERP Connector Configs
CREATE POLICY "Admins can manage ERP connectors" ON public.erp_connector_configs FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ERP Sync Queue
CREATE POLICY "Admins can view sync queue" ON public.erp_sync_queue FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "System can manage sync queue" ON public.erp_sync_queue FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_supplier_agpo_supplier ON public.supplier_agpo_registration(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_agpo_status ON public.supplier_agpo_registration(verification_status);
CREATE INDEX IF NOT EXISTS idx_appeals_tender ON public.procurement_appeals(tender_id);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON public.procurement_appeals(status);
CREATE INDEX IF NOT EXISTS idx_appeals_appellant ON public.procurement_appeals(appellant_id);
CREATE INDEX IF NOT EXISTS idx_erp_queue_status ON public.erp_sync_queue(status, scheduled_at);

-- ============================================
-- RETENTION POLICY AUTOMATION
-- Per Kenya PPRA 2015 - 7 year retention
-- ============================================
CREATE TABLE IF NOT EXISTS public.data_retention_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  retention_years INTEGER NOT NULL DEFAULT 7,
  legal_basis TEXT NOT NULL,
  data_category TEXT NOT NULL,
  purge_method TEXT DEFAULT 'anonymize' CHECK (purge_method IN ('delete', 'anonymize', 'archive')),
  last_purge_run TIMESTAMP WITH TIME ZONE,
  next_purge_scheduled TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert retention schedules per Kenya law
INSERT INTO public.data_retention_schedule (table_name, retention_years, legal_basis, data_category, purge_method) VALUES
  ('tenders', 7, 'PPRA 2015 Section 67', 'procurement_records', 'archive'),
  ('bids', 7, 'PPRA 2015 Section 67', 'procurement_records', 'archive'),
  ('contracts', 7, 'PPRA 2015 Section 67', 'procurement_records', 'archive'),
  ('evaluations', 7, 'PPRA 2015 Section 67', 'procurement_records', 'archive'),
  ('audit_logs', 10, 'PPRA 2015 + Kenya Evidence Act', 'audit_records', 'archive'),
  ('blockchain_transactions', 0, 'Immutable by design', 'blockchain', 'archive'),
  ('profiles', 7, 'Kenya Data Protection Act 2019', 'personal_data', 'anonymize'),
  ('notifications', 2, 'Internal policy', 'operational', 'delete'),
  ('procurement_appeals', 7, 'PPRA 2015 Section 168', 'dispute_records', 'archive');

-- RLS for retention schedule
ALTER TABLE public.data_retention_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage retention schedules" ON public.data_retention_schedule FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view retention schedules" ON public.data_retention_schedule FOR SELECT USING (true);