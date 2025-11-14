-- Remove public access to demo_accounts passwords
-- Only Edge Functions with service role can access this table now
DROP POLICY IF EXISTS "Authenticated users can view demo accounts" ON public.demo_accounts;

-- Create a more restrictive policy that prevents client access
-- This table should only be accessed by Edge Functions with service role
CREATE POLICY "Service role only access to demo accounts"
  ON public.demo_accounts
  FOR SELECT
  TO service_role
  USING (true);

-- Update comment to reflect new security model
COMMENT ON TABLE public.demo_accounts IS 'Demo account credentials. CRITICAL: Only accessible via Edge Functions with service role. Passwords must never be exposed to client.';