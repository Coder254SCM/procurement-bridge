
-- Complete the previous tables and add remaining ones

-- ===== COMPLETE REPORTING & ANALYTICS =====
CREATE TABLE public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('procurement', 'financial', 'compliance', 'performance', 'supplier')),
  query_template JSONB NOT NULL,
  parameters JSONB DEFAULT '[]',
  output_format TEXT DEFAULT 'pdf' CHECK (output_format IN ('pdf', 'excel', 'csv', 'json')),
  access_roles JSONB DEFAULT '["admin"]',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.report_templates(id) NOT NULL,
  generated_by UUID REFERENCES auth.users(id) NOT NULL,
  parameters_used JSONB DEFAULT '{}',
  file_path TEXT,
  file_size BIGINT,
  generation_time INTERVAL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===== ERP INTEGRATION =====
CREATE TABLE public.erp_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  erp_system TEXT NOT NULL CHECK (erp_system IN ('sap', 'oracle', 'microsoft_dynamics', 'odoo', 'sage', 'custom')),
  connection_name TEXT NOT NULL,
  endpoint_url TEXT,
  api_version TEXT,
  authentication_method TEXT DEFAULT 'api_key' CHECK (authentication_method IN ('api_key', 'oauth', 'basic_auth', 'certificate')),
  connection_config JSONB DEFAULT '{}',
  sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('real_time', 'hourly', 'daily', 'weekly', 'manual')),
  last_sync TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'active' CHECK (sync_status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.erp_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.erp_connections(id) NOT NULL,
  sync_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  sync_duration INTERVAL,
  error_details JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ===== MULTI-LANGUAGE SUPPORT =====
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code TEXT NOT NULL CHECK (language_code IN ('en', 'sw', 'fr', 'ar')),
  translation_key TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(language_code, translation_key)
);

-- ===== MOBILE APP SUPPORT =====
CREATE TABLE public.mobile_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  device_id TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('ios', 'android', 'tablet')),
  device_info JSONB DEFAULT '{}',
  app_version TEXT NOT NULL,
  push_token TEXT,
  last_active TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, device_id)
);

CREATE TABLE public.push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  delivery_status TEXT DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===== COMPLETE MISSING TABLES FROM PREVIOUS REQUEST =====
-- E-CATALOG MANAGEMENT
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id),
  code TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.product_categories(id) NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  unit_of_measure TEXT NOT NULL,
  base_price NUMERIC(15,2),
  currency TEXT DEFAULT 'KES',
  specifications JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  supplier_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SUPPLIER QUALIFICATION SYSTEM
CREATE TABLE public.supplier_qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id UUID REFERENCES public.product_categories(id) NOT NULL,
  qualification_level TEXT DEFAULT 'basic' CHECK (qualification_level IN ('basic', 'standard', 'preferred', 'strategic')),
  certification_documents JSONB DEFAULT '[]',
  financial_capacity NUMERIC(15,2),
  technical_capacity JSONB DEFAULT '{}',
  quality_rating NUMERIC(3,2) DEFAULT 0.00,
  compliance_score NUMERIC(3,2) DEFAULT 0.00,
  valid_until DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PURCHASE REQUISITION MANAGEMENT
CREATE TABLE public.purchase_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requisition_number TEXT UNIQUE NOT NULL,
  requester_id UUID REFERENCES auth.users(id) NOT NULL,
  department TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  justification TEXT NOT NULL,
  budget_code TEXT,
  estimated_value NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  required_date DATE NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'submitted', 'approved', 'rejected', 'cancelled')),
  items JSONB DEFAULT '[]',
  approvers JSONB DEFAULT '[]',
  approval_workflow JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- BUDGET MANAGEMENT
CREATE TABLE public.budget_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_code TEXT NOT NULL,
  budget_name TEXT NOT NULL,
  financial_year TEXT NOT NULL,
  department TEXT NOT NULL,
  category_id UUID REFERENCES public.product_categories(id),
  total_allocation NUMERIC(15,2) NOT NULL,
  committed_amount NUMERIC(15,2) DEFAULT 0,
  spent_amount NUMERIC(15,2) DEFAULT 0,
  available_amount NUMERIC(15,2) GENERATED ALWAYS AS (total_allocation - committed_amount - spent_amount) STORED,
  currency TEXT DEFAULT 'KES',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- APPROVAL WORKFLOWS
CREATE TABLE public.approval_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  entity_type TEXT NOT NULL,
  conditions JSONB NOT NULL,
  steps JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.approval_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.approval_workflows(id) NOT NULL,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approver_actions JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FRAMEWORK AGREEMENTS
CREATE TABLE public.framework_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  buyer_organization TEXT NOT NULL,
  category_id UUID REFERENCES public.product_categories(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_value NUMERIC(15,2),
  currency TEXT DEFAULT 'KES',
  terms_conditions JSONB DEFAULT '{}',
  evaluation_criteria JSONB DEFAULT '[]',
  suppliers JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CONTRACT PERFORMANCE MONITORING
CREATE TABLE public.contract_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) NOT NULL,
  milestone_name TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  deliverables JSONB DEFAULT '[]',
  payment_percentage NUMERIC(5,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')),
  completion_date DATE,
  verification_documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.performance_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) NOT NULL,
  evaluator_id UUID REFERENCES auth.users(id) NOT NULL,
  evaluation_period_start DATE NOT NULL,
  evaluation_period_end DATE NOT NULL,
  quality_score NUMERIC(3,2) DEFAULT 0.00,
  timeliness_score NUMERIC(3,2) DEFAULT 0.00,
  compliance_score NUMERIC(3,2) DEFAULT 0.00,
  overall_score NUMERIC(3,2) DEFAULT 0.00,
  comments TEXT,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- REVERSE AUCTIONS
CREATE TABLE public.reverse_auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) NOT NULL,
  auction_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reserve_price NUMERIC(15,2),
  minimum_bid_decrement NUMERIC(15,2) DEFAULT 1000,
  bid_extension_time INTEGER DEFAULT 300,
  current_lowest_bid NUMERIC(15,2),
  current_leader_id UUID,
  total_bids INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES public.reverse_auctions(id) NOT NULL,
  bidder_id UUID REFERENCES auth.users(id) NOT NULL,
  bid_amount NUMERIC(15,2) NOT NULL,
  bid_time TIMESTAMPTZ DEFAULT now(),
  is_automatic BOOLEAN DEFAULT false,
  rank_at_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PAYMENT PROCESSING
CREATE TABLE public.payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) NOT NULL,
  milestone_id UUID REFERENCES public.contract_milestones(id),
  payment_number INTEGER NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  due_date DATE NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'overdue', 'disputed')),
  payment_method TEXT,
  reference_number TEXT,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SUPPLIER RISK ASSESSMENT
CREATE TABLE public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES auth.users(id) NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('financial', 'operational', 'reputational', 'compliance', 'comprehensive')),
  risk_score NUMERIC(3,2) DEFAULT 0.00,
  risk_level TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN risk_score >= 4.5 THEN 'very_high'
      WHEN risk_score >= 3.5 THEN 'high'
      WHEN risk_score >= 2.5 THEN 'medium'
      WHEN risk_score >= 1.5 THEN 'low'
      ELSE 'very_low'
    END
  ) STORED,
  assessment_criteria JSONB NOT NULL,
  findings JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  mitigation_actions JSONB DEFAULT '[]',
  assessor_id UUID REFERENCES auth.users(id) NOT NULL,
  assessment_date DATE DEFAULT CURRENT_DATE,
  next_assessment_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== ROW LEVEL SECURITY POLICIES =====

-- Product Categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON public.product_categories FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage categories" ON public.product_categories FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Catalog Items
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active catalog items" ON public.catalog_items FOR SELECT USING (status = 'active');
CREATE POLICY "Suppliers can manage their catalog items" ON public.catalog_items FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Admins can manage all catalog items" ON public.catalog_items FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Supplier Qualifications
ALTER TABLE public.supplier_qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers can view their qualifications" ON public.supplier_qualifications FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Buyers can view approved qualifications" ON public.supplier_qualifications FOR SELECT USING (status = 'approved');
CREATE POLICY "Admins can manage qualifications" ON public.supplier_qualifications FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Purchase Requisitions
ALTER TABLE public.purchase_requisitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their requisitions" ON public.purchase_requisitions FOR SELECT USING (auth.uid() = requester_id);
CREATE POLICY "Users can create requisitions" ON public.purchase_requisitions FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update their draft requisitions" ON public.purchase_requisitions FOR UPDATE USING (auth.uid() = requester_id AND approval_status = 'draft');
CREATE POLICY "Approvers can view assigned requisitions" ON public.purchase_requisitions FOR SELECT USING (
  EXISTS(SELECT 1 FROM jsonb_array_elements(approvers) AS approver WHERE (approver->>'user_id')::uuid = auth.uid())
);

-- Budget Allocations
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Finance users can manage budgets" ON public.budget_allocations FOR ALL USING (has_role(auth.uid(), 'evaluator_finance'));
CREATE POLICY "Buyers can view relevant budgets" ON public.budget_allocations FOR SELECT USING (has_role(auth.uid(), 'buyer'));
CREATE POLICY "Admins can manage all budgets" ON public.budget_allocations FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Approval Workflows
ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage workflows" ON public.approval_workflows FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view active workflows" ON public.approval_workflows FOR SELECT USING (active = true);

-- Approval Instances
ALTER TABLE public.approval_instances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their approval instances" ON public.approval_instances FOR SELECT USING (
  EXISTS(SELECT 1 FROM jsonb_array_elements(
    (SELECT steps FROM approval_workflows WHERE id = workflow_id)
  ) AS step WHERE (step->>'approver_id')::uuid = auth.uid())
);

-- Framework Agreements
ALTER TABLE public.framework_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published agreements" ON public.framework_agreements FOR SELECT USING (status IN ('published', 'active'));
CREATE POLICY "Buyers can manage their agreements" ON public.framework_agreements FOR ALL USING (has_role(auth.uid(), 'buyer'));
CREATE POLICY "Qualified suppliers can view agreements" ON public.framework_agreements FOR SELECT USING (
  EXISTS(SELECT 1 FROM jsonb_array_elements(suppliers) AS supplier WHERE (supplier->>'supplier_id')::uuid = auth.uid())
);

-- Contract Milestones
ALTER TABLE public.contract_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contract parties can view milestones" ON public.contract_milestones FOR SELECT USING (
  EXISTS(SELECT 1 FROM contracts WHERE id = contract_id AND (buyer_id = auth.uid() OR supplier_id = auth.uid()))
);
CREATE POLICY "Buyers can manage milestones" ON public.contract_milestones FOR ALL USING (
  EXISTS(SELECT 1 FROM contracts WHERE id = contract_id AND buyer_id = auth.uid())
);

-- Performance Evaluations
ALTER TABLE public.performance_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contract parties can view evaluations" ON public.performance_evaluations FOR SELECT USING (
  EXISTS(SELECT 1 FROM contracts WHERE id = contract_id AND (buyer_id = auth.uid() OR supplier_id = auth.uid()))
);
CREATE POLICY "Evaluators can manage their evaluations" ON public.performance_evaluations FOR ALL USING (auth.uid() = evaluator_id);

-- Reverse Auctions
ALTER TABLE public.reverse_auctions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auction participants can view auctions" ON public.reverse_auctions FOR SELECT USING (
  EXISTS(SELECT 1 FROM tenders WHERE id = tender_id AND (buyer_id = auth.uid() OR status = 'published'))
);
CREATE POLICY "Buyers can manage their auctions" ON public.reverse_auctions FOR ALL USING (
  EXISTS(SELECT 1 FROM tenders WHERE id = tender_id AND buyer_id = auth.uid())
);

-- Auction Bids
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bidders can view their own bids" ON public.auction_bids FOR SELECT USING (auth.uid() = bidder_id);
CREATE POLICY "Bidders can create bids" ON public.auction_bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);
CREATE POLICY "Auction owners can view all bids" ON public.auction_bids FOR SELECT USING (
  EXISTS(SELECT 1 FROM reverse_auctions ra JOIN tenders t ON ra.tender_id = t.id WHERE ra.id = auction_id AND t.buyer_id = auth.uid())
);

-- Payment Schedules
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contract parties can view payments" ON public.payment_schedules FOR SELECT USING (
  EXISTS(SELECT 1 FROM contracts WHERE id = contract_id AND (buyer_id = auth.uid() OR supplier_id = auth.uid()))
);
CREATE POLICY "Finance users can manage payments" ON public.payment_schedules FOR ALL USING (has_role(auth.uid(), 'evaluator_finance'));

-- Risk Assessments
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers can view their assessments" ON public.risk_assessments FOR SELECT USING (auth.uid() = supplier_id);
CREATE POLICY "Assessors can manage their assessments" ON public.risk_assessments FOR ALL USING (auth.uid() = assessor_id);
CREATE POLICY "Buyers can view supplier assessments" ON public.risk_assessments FOR SELECT USING (has_role(auth.uid(), 'buyer'));

-- Report Templates
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users with proper roles can view templates" ON public.report_templates FOR SELECT USING (
  access_roles ? (SELECT role::text FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage templates" ON public.report_templates FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Generated Reports
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their generated reports" ON public.generated_reports FOR SELECT USING (auth.uid() = generated_by);
CREATE POLICY "Users can create reports" ON public.generated_reports FOR INSERT WITH CHECK (auth.uid() = generated_by);

-- ERP Connections
ALTER TABLE public.erp_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage ERP connections" ON public.erp_connections FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ERP Sync Logs
ALTER TABLE public.erp_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view sync logs" ON public.erp_sync_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Translations
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Admins can manage translations" ON public.translations FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Mobile Sessions
ALTER TABLE public.mobile_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their mobile sessions" ON public.mobile_sessions FOR ALL USING (auth.uid() = user_id);

-- Push Notifications
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their notifications" ON public.push_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.push_notifications FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ===== AUDIT TRIGGERS =====
CREATE TRIGGER audit_product_categories AFTER INSERT OR UPDATE OR DELETE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_catalog_items AFTER INSERT OR UPDATE OR DELETE ON public.catalog_items FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_purchase_requisitions AFTER INSERT OR UPDATE OR DELETE ON public.purchase_requisitions FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_framework_agreements AFTER INSERT OR UPDATE OR DELETE ON public.framework_agreements FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_reverse_auctions AFTER INSERT OR UPDATE OR DELETE ON public.reverse_auctions FOR EACH ROW EXECUTE FUNCTION log_audit_trail();
CREATE TRIGGER audit_payment_schedules AFTER INSERT OR UPDATE OR DELETE ON public.payment_schedules FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- ===== CREATE INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_catalog_items_category ON public.catalog_items(category_id);
CREATE INDEX idx_catalog_items_supplier ON public.catalog_items(supplier_id);
CREATE INDEX idx_requisitions_requester ON public.purchase_requisitions(requester_id);
CREATE INDEX idx_requisitions_status ON public.purchase_requisitions(approval_status);
CREATE INDEX idx_budget_allocations_code ON public.budget_allocations(budget_code);
CREATE INDEX idx_auction_bids_auction ON public.auction_bids(auction_id);
CREATE INDEX idx_auction_bids_bidder ON public.auction_bids(bidder_id);
CREATE INDEX idx_risk_assessments_supplier ON public.risk_assessments(supplier_id);
