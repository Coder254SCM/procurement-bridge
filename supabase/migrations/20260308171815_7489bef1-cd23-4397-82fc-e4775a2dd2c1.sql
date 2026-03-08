
-- Create tender-documents storage bucket for tender form uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('tender-documents', 'tender-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create bid-documents storage bucket for bid submissions
INSERT INTO storage.buckets (id, name, public) VALUES ('bid-documents', 'bid-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for tender-documents: buyers can upload, authenticated can read
CREATE POLICY "Authenticated users can upload tender documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tender-documents');

CREATE POLICY "Authenticated users can read tender documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'tender-documents');

-- RLS for bid-documents: suppliers can upload their own, buyers can read bids on their tenders
CREATE POLICY "Authenticated users can upload bid documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'bid-documents');

CREATE POLICY "Authenticated users can read bid documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'bid-documents');
