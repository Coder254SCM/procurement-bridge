
-- Extended tender data tables for the 10-step wizard

-- 1. Procuring Entity details per tender
CREATE TABLE public.tender_procuring_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  organisation_name TEXT,
  physical_address TEXT,
  town TEXT,
  po_box TEXT,
  telephone TEXT,
  procurement_email TEXT,
  website TEXT,
  contact_person_name TEXT,
  contact_person_designation TEXT,
  contact_person_email TEXT,
  submission_method TEXT DEFAULT 'electronic',
  physical_submission_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tender_id)
);

-- 2. Tender Data Sheet overrides
CREATE TABLE public.tender_data_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  foreign_currency_allowed TEXT DEFAULT 'not_allowed',
  alternative_tenders TEXT DEFAULT 'not_allowed',
  number_of_lots TEXT DEFAULT 'one',
  lot_count INTEGER,
  award_criteria TEXT DEFAULT 'lowest_evaluated',
  bid_security_required TEXT DEFAULT 'no',
  bid_security_amount NUMERIC,
  bid_security_validity INTEGER,
  special_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tender_id)
);

-- 3. Schedule of Requirements line items
CREATE TABLE public.tender_schedule_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  item_number INTEGER NOT NULL DEFAULT 1,
  unspsc_code TEXT,
  description TEXT NOT NULL,
  unit_of_issue TEXT DEFAULT 'Each (EA)',
  quantity NUMERIC NOT NULL DEFAULT 1,
  delivery_location TEXT,
  delivery_timeline TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Technical specifications
CREATE TABLE public.tender_technical_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  spec_number INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  required_standard TEXT,
  compliance_type TEXT DEFAULT 'mandatory',
  evaluation_method TEXT DEFAULT 'pass_fail',
  max_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Price schedule items
CREATE TABLE public.tender_price_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  item_number INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  unit TEXT DEFAULT 'Each',
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  vat_applicable TEXT DEFAULT 'yes_16',
  line_total NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tender declarations (statutory)
CREATE TABLE public.tender_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  declaration_id TEXT NOT NULL,
  declaration_text TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT false,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Conflict of interest disclosures
CREATE TABLE public.tender_conflict_disclosures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  statement TEXT NOT NULL,
  response TEXT DEFAULT 'no',
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Procurement method settings (stores dynamic per-method config)
CREATE TABLE public.tender_method_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID REFERENCES public.tenders(id) ON DELETE CASCADE NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tender_id, setting_key)
);

-- Add extra columns to tenders table
ALTER TABLE public.tenders
  ADD COLUMN IF NOT EXISTS tender_number TEXT,
  ADD COLUMN IF NOT EXISTS financial_year TEXT,
  ADD COLUMN IF NOT EXISTS procurement_category TEXT,
  ADD COLUMN IF NOT EXISTS agpo_reservation TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS issue_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS opening_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS earliest_delivery_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS latest_delivery_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS validity_period INTEGER DEFAULT 91;

-- Enable RLS on all new tables
ALTER TABLE public.tender_procuring_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_data_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_technical_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_price_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_conflict_disclosures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_method_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies: tender owner can manage, authenticated can read published
CREATE POLICY "Tender owner can manage procuring entities"
  ON public.tender_procuring_entities FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tender owner can manage data sheets"
  ON public.tender_data_sheets FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tender owner can manage schedule items"
  ON public.tender_schedule_items FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tender owner can manage technical specs"
  ON public.tender_technical_specs FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tender owner can manage price items"
  ON public.tender_price_items FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tender owner can manage declarations"
  ON public.tender_declarations FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tender owner can manage conflict disclosures"
  ON public.tender_conflict_disclosures FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

CREATE POLICY "Tender owner can manage method settings"
  ON public.tender_method_settings FOR ALL TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()))
  WITH CHECK (tender_id IN (SELECT id FROM public.tenders WHERE buyer_id = auth.uid()));

-- Read policies for published tenders (suppliers can view)
CREATE POLICY "Anyone can read published tender procuring entities"
  ON public.tender_procuring_entities FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

CREATE POLICY "Anyone can read published tender data sheets"
  ON public.tender_data_sheets FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

CREATE POLICY "Anyone can read published tender schedule items"
  ON public.tender_schedule_items FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

CREATE POLICY "Anyone can read published tender technical specs"
  ON public.tender_technical_specs FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

CREATE POLICY "Anyone can read published tender price items"
  ON public.tender_price_items FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

CREATE POLICY "Anyone can read published tender declarations"
  ON public.tender_declarations FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

CREATE POLICY "Anyone can read published tender conflict disclosures"
  ON public.tender_conflict_disclosures FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

CREATE POLICY "Anyone can read published tender method settings"
  ON public.tender_method_settings FOR SELECT TO authenticated
  USING (tender_id IN (SELECT id FROM public.tenders WHERE status = 'published'));

-- Update triggers
CREATE TRIGGER update_tender_procuring_entities_updated_at
  BEFORE UPDATE ON public.tender_procuring_entities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tender_data_sheets_updated_at
  BEFORE UPDATE ON public.tender_data_sheets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
