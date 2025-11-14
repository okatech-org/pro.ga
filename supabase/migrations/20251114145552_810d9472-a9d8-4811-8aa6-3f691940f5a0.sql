-- Fix PUBLIC_DATA_EXPOSURE: Remove public access to demo_accounts
-- Drop the insecure public policy
DROP POLICY IF EXISTS "Anyone can view demo accounts" ON public.demo_accounts;

-- Create a secure policy: only authenticated users can view demo accounts
-- This prevents unauthenticated public access to plaintext passwords
CREATE POLICY "Authenticated users can view demo accounts"
  ON public.demo_accounts
  FOR SELECT
  TO authenticated
  USING (true);

-- Add a comment explaining the security concern
COMMENT ON TABLE public.demo_accounts IS 'Demo accounts for testing. Access restricted to authenticated users only. Passwords should ideally be hashed or moved to server-side validation.';