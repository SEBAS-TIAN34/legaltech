-- Allow the static Vercel demo to persist and list cases and document records.
-- The current frontend uses a custom users table, so browser requests run as anon.

GRANT SELECT, INSERT, UPDATE ON TABLE public.cases TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.documents TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.invoices TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS client_email VARCHAR(255);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

DROP POLICY IF EXISTS "demo_cases_select" ON public.cases;
DROP POLICY IF EXISTS "demo_cases_insert" ON public.cases;
DROP POLICY IF EXISTS "demo_cases_update" ON public.cases;
DROP POLICY IF EXISTS "demo_documents_select" ON public.documents;
DROP POLICY IF EXISTS "demo_documents_insert" ON public.documents;
DROP POLICY IF EXISTS "demo_invoices_select" ON public.invoices;
DROP POLICY IF EXISTS "demo_invoices_insert" ON public.invoices;
DROP POLICY IF EXISTS "demo_invoices_update" ON public.invoices;

CREATE POLICY "demo_cases_select"
ON public.cases
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "demo_cases_insert"
ON public.cases
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "demo_cases_update"
ON public.cases
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "demo_documents_select"
ON public.documents
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "demo_documents_insert"
ON public.documents
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "demo_invoices_select"
ON public.invoices
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "demo_invoices_insert"
ON public.invoices
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "demo_invoices_update"
ON public.invoices
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
