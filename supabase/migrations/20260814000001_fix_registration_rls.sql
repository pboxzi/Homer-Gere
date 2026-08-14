-- Fix: Registration applications RLS INSERT policy
-- The original policy from migration 011 is not working for anon inserts

BEGIN;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Anyone can insert registration application" ON registration_applications;
DROP POLICY IF EXISTS "Super admin can read all applications" ON registration_applications;
DROP POLICY IF EXISTS "Super admin can update applications" ON registration_applications;

-- Allow anonymous (and authenticated) users to insert registration applications
CREATE POLICY "registration_insert_anon"
  ON registration_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow super admin to read all applications
CREATE POLICY "registration_select_admin"
  ON registration_applications FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Allow super admin to update applications
CREATE POLICY "registration_update_admin"
  ON registration_applications FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

COMMIT;
