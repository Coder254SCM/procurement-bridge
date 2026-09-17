CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_role public.user_role;
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;

  BEGIN
    v_role := COALESCE(NULLIF(new.raw_user_meta_data->>'role', ''), 'supplier')::public.user_role;
  EXCEPTION WHEN others THEN
    v_role := 'supplier';
  END;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, v_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN new;
END;
$function$;

DROP POLICY IF EXISTS "Authenticated users can upload tender documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload bid documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read bid documents" ON storage.objects;

CREATE POLICY "Users upload tender documents to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tender-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users manage own tender documents update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'tender-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users manage own tender documents delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tender-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload bid documents to own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'bid-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Suppliers and tender owners can read bid documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'bid-documents'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.tenders t
      JOIN public.bids b ON b.tender_id = t.id
      WHERE t.buyer_id = auth.uid()
        AND b.supplier_id::text = (storage.foldername(name))[1]
    )
    OR public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Users delete own bid documents"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'bid-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);
