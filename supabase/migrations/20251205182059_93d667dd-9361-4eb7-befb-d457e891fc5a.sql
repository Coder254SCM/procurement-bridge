-- Consortium Management Tables
CREATE TABLE public.consortium_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id),
  lead_partner_id UUID NOT NULL,
  consortium_name TEXT NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_members INTEGER DEFAULT 1,
  combined_turnover NUMERIC,
  joint_liability_accepted BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.consortium_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consortium_id UUID NOT NULL REFERENCES public.consortium_registrations(id) ON DELETE CASCADE,
  member_user_id UUID NOT NULL,
  member_role TEXT NOT NULL DEFAULT 'partner',
  percentage_share NUMERIC NOT NULL CHECK (percentage_share > 0 AND percentage_share <= 100),
  responsibilities JSONB DEFAULT '[]',
  documents_submitted JSONB DEFAULT '{}',
  document_verification_status TEXT DEFAULT 'pending',
  financial_capacity NUMERIC,
  accepted_terms BOOLEAN DEFAULT false,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Addendum Management Tables
CREATE TABLE public.tender_addendums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id),
  addendum_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  changes_summary JSONB NOT NULL DEFAULT '[]',
  original_values JSONB DEFAULT '{}',
  new_values JSONB DEFAULT '{}',
  extends_deadline BOOLEAN DEFAULT false,
  new_deadline TIMESTAMP WITH TIME ZONE,
  issued_by UUID NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  requires_acknowledgment BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tender_id, addendum_number)
);

CREATE TABLE public.addendum_acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  addendum_id UUID NOT NULL REFERENCES public.tender_addendums(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  UNIQUE(addendum_id, supplier_id)
);

-- Buyer Specification Requirements
CREATE TABLE public.tender_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  specification_type TEXT NOT NULL,
  specification_key TEXT NOT NULL,
  specification_value TEXT NOT NULL,
  unit_of_measure TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  tolerance_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.specification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  template_name TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '[]',
  mandatory_documents TEXT[] DEFAULT '{}',
  min_specifications INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consortium_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consortium_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_addendums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addendum_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specification_templates ENABLE ROW LEVEL SECURITY;

-- Consortium RLS Policies
CREATE POLICY "Lead partners can manage their consortiums"
ON public.consortium_registrations FOR ALL
USING (auth.uid() = lead_partner_id);

CREATE POLICY "Buyers can view consortiums for their tenders"
ON public.consortium_registrations FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.tenders
  WHERE tenders.id = consortium_registrations.tender_id
  AND tenders.buyer_id = auth.uid()
));

CREATE POLICY "Members can view their consortiums"
ON public.consortium_members FOR SELECT
USING (auth.uid() = member_user_id);

CREATE POLICY "Lead partners can manage consortium members"
ON public.consortium_members FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.consortium_registrations
  WHERE consortium_registrations.id = consortium_members.consortium_id
  AND consortium_registrations.lead_partner_id = auth.uid()
));

-- Addendum RLS Policies
CREATE POLICY "Buyers can manage addendums for their tenders"
ON public.tender_addendums FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.tenders
  WHERE tenders.id = tender_addendums.tender_id
  AND tenders.buyer_id = auth.uid()
));

CREATE POLICY "Anyone can view published addendums"
ON public.tender_addendums FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.tenders
  WHERE tenders.id = tender_addendums.tender_id
  AND tenders.status = 'published'
));

CREATE POLICY "Suppliers can acknowledge addendums"
ON public.addendum_acknowledgments FOR INSERT
WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Users can view their acknowledgments"
ON public.addendum_acknowledgments FOR SELECT
USING (auth.uid() = supplier_id);

-- Specification RLS Policies
CREATE POLICY "Buyers can manage specifications"
ON public.tender_specifications FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.tenders
  WHERE tenders.id = tender_specifications.tender_id
  AND tenders.buyer_id = auth.uid()
));

CREATE POLICY "Anyone can view specifications for published tenders"
ON public.tender_specifications FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.tenders
  WHERE tenders.id = tender_specifications.tender_id
  AND tenders.status = 'published'
));

CREATE POLICY "Anyone can view active templates"
ON public.specification_templates FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage templates"
ON public.specification_templates FOR ALL
USING (has_role(auth.uid(), 'admin'::user_role));

-- Indexes
CREATE INDEX idx_consortium_tender ON public.consortium_registrations(tender_id);
CREATE INDEX idx_consortium_lead ON public.consortium_registrations(lead_partner_id);
CREATE INDEX idx_consortium_members_consortium ON public.consortium_members(consortium_id);
CREATE INDEX idx_consortium_members_user ON public.consortium_members(member_user_id);
CREATE INDEX idx_addendums_tender ON public.tender_addendums(tender_id);
CREATE INDEX idx_acknowledgments_addendum ON public.addendum_acknowledgments(addendum_id);
CREATE INDEX idx_specifications_tender ON public.tender_specifications(tender_id);

-- Triggers for updated_at
CREATE TRIGGER update_consortium_registrations_updated_at
BEFORE UPDATE ON public.consortium_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_rth_updated_at();

-- Insert default specification templates
INSERT INTO public.specification_templates (category, template_name, specifications, mandatory_documents, min_specifications)
VALUES 
('Construction', 'Building Construction Standard', '[
  {"key": "project_scope", "label": "Project Scope Description", "type": "text", "required": true},
  {"key": "site_location", "label": "Site Location & GPS Coordinates", "type": "text", "required": true},
  {"key": "floor_area", "label": "Total Floor Area (sqm)", "type": "number", "required": true},
  {"key": "completion_timeline", "label": "Expected Completion Timeline", "type": "text", "required": true},
  {"key": "building_standards", "label": "Building Standards/Codes", "type": "text", "required": true},
  {"key": "materials_spec", "label": "Materials Specifications", "type": "text", "required": true},
  {"key": "environmental_requirements", "label": "Environmental Requirements", "type": "text", "required": false}
]'::jsonb, ARRAY['Bill of Quantities', 'Architectural Drawings', 'Site Survey Report', 'Environmental Impact Assessment'], 5),

('IT_Services', 'IT Services Standard', '[
  {"key": "service_description", "label": "Service Description", "type": "text", "required": true},
  {"key": "technical_requirements", "label": "Technical Requirements", "type": "text", "required": true},
  {"key": "integration_requirements", "label": "Integration Requirements", "type": "text", "required": true},
  {"key": "sla_requirements", "label": "SLA Requirements", "type": "text", "required": true},
  {"key": "data_security", "label": "Data Security Standards", "type": "text", "required": true},
  {"key": "support_requirements", "label": "Support & Maintenance", "type": "text", "required": true}
]'::jsonb, ARRAY['Technical Proposal Template', 'Security Certifications', 'Sample SLA'], 4),

('Supplies', 'Goods Supply Standard', '[
  {"key": "item_description", "label": "Item Description", "type": "text", "required": true},
  {"key": "quantity", "label": "Quantity Required", "type": "number", "required": true},
  {"key": "quality_standards", "label": "Quality Standards", "type": "text", "required": true},
  {"key": "delivery_location", "label": "Delivery Location(s)", "type": "text", "required": true},
  {"key": "delivery_schedule", "label": "Delivery Schedule", "type": "text", "required": true},
  {"key": "warranty_requirements", "label": "Warranty Requirements", "type": "text", "required": true}
]'::jsonb, ARRAY['Product Specifications', 'Quality Certificates'], 4);
