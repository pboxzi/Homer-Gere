-- Migration: Create database functions and triggers
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- FUNCTION: Auto-create profile on auth user creation
-- Only creates profile if one doesn't already exist (avoids
-- conflict with handle_registration_approval which creates both)
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if not already created by registration approval
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
    INSERT INTO profiles (id, first_name, last_name, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NEW.email,
      COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'pending')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- TRIGGER: When auth user is created, create profile
-- ============================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- FUNCTION: Auto-create profile from registration approval
-- When approved: creates auth user + profile + membership
-- ============================================================
CREATE OR REPLACE FUNCTION handle_registration_approval()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_password TEXT;
BEGIN
  -- When application is approved, create auth user + profile
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Generate a random password (user will reset it)
    v_password := crypt(gen_random_uuid()::text, gen_salt('bf'));

    -- Create auth user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      NEW.email,
      v_password,
      NOW(),
      jsonb_build_object(
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'role', 'member'
      ),
      NOW(),
      NOW()
    ) RETURNING id INTO v_user_id;

    -- Create profile directly (bypass handle_new_user by checking existence)
    INSERT INTO profiles (id, first_name, last_name, email, role)
    VALUES (
      v_user_id,
      NEW.first_name,
      NEW.last_name,
      NEW.email,
      'member'
    );

    -- Link application to user
    NEW.user_id := v_user_id;

    -- Create membership if tier specified
    IF NEW.membership_tier IS NOT NULL THEN
      INSERT INTO memberships (user_id, plan_id, status, start_date)
      SELECT
        v_user_id,
        mp.id,
        'active',
        NOW()
      FROM membership_plans mp
      WHERE mp.slug = NEW.membership_tier
      LIMIT 1;
    END IF;
  END IF;

  -- When rejected, add rejection reason
  IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    NEW.rejection_reason := COALESCE(NEW.rejection_reason, 'Application rejected by admin');
  END IF;

  NEW.reviewed_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- TRIGGER: Handle registration approval/rejection
-- ============================================================
CREATE TRIGGER on_registration_status_change
  BEFORE UPDATE ON registration_applications
  FOR EACH ROW EXECUTE FUNCTION handle_registration_approval();

-- ============================================================
-- NOTE: Public sign-up is disabled via Supabase Dashboard
-- Auth > Settings > Disable "Enable email sign-ups"
-- Do NOT use a trigger as it blocks the registration approval flow
-- ============================================================

-- ============================================================
-- FUNCTION: Create audit log entry
-- ============================================================
CREATE OR REPLACE FUNCTION create_audit_log(
  p_action audit_action,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (auth.uid(), p_action, p_table_name, p_record_id, p_old_data, p_new_data)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- Apply updated_at triggers to all tables with updated_at
-- ============================================================
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON registration_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON membership_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON journey_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON journal_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON filmography_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON experience_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON gallery_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON gallery_photos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON fan_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON business_enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON media_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON media_podcasts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON media_press FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- REVOKE execute on trigger/helper functions from anon role
-- These functions should only be called by triggers, not via RPC
-- ============================================================
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION handle_registration_approval() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION create_audit_log(audit_action, text, uuid, jsonb, jsonb) FROM anon, authenticated;

COMMIT;
