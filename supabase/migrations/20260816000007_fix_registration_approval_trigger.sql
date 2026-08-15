-- Fix: Registration approval workflow
-- 1. Trigger: Only update profile role, no auth user creation, no membership
-- 2. RLS: Allow users to read their own registration application

BEGIN;

-- ============================================================
-- 1. Fix trigger: Only update profile role on approval
-- ============================================================
CREATE OR REPLACE FUNCTION handle_registration_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- When application is approved, update the user's profile role
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Update the existing profile's role from pending to member
    -- The auth user and profile already exist from registration
    UPDATE profiles SET role = 'member' WHERE id = NEW.user_id;
    -- Record approval details
    NEW.approved_at = NOW();
  END IF;

  -- When rejected, add rejection reason
  IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    NEW.rejection_reason := COALESCE(NEW.rejection_reason, 'Application rejected by admin');
    NEW.rejected_at = NOW();
  END IF;

  NEW.reviewed_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 2. RLS: Allow users to read their own registration application
-- ============================================================
CREATE POLICY "Users can read own registration application"
  ON registration_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

COMMIT;
