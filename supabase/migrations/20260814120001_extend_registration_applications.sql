-- ============================================================
-- PHASE 1: Extend registration_applications with enterprise fields
-- All columns are nullable for backward compatibility
-- ============================================================

-- Application tracking
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS application_number TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS membership_plan_requested TEXT;

-- User motivation
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS reason_for_joining TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Device & browser info (captured at submission)
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS operating_system TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS city_detected TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS country_detected TEXT;

-- Review metadata
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS review_notes TEXT;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS status_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS assigned_admin UUID;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE registration_applications ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Auto-generate application numbers via trigger
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := 'APP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(
      (SELECT COUNT(*) + 1 FROM registration_applications WHERE DATE(created_at) = DATE(NOW()))::TEXT,
      4, '0'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_generate_application_number ON registration_applications;
CREATE TRIGGER trigger_generate_application_number
  BEFORE INSERT ON registration_applications
  FOR EACH ROW
  EXECUTE FUNCTION generate_application_number();

-- Auto-record status transitions
CREATE OR REPLACE FUNCTION record_application_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_history := COALESCE(NEW.status_history, '[]'::jsonb) ||
      jsonb_build_object(
        'from', OLD.status,
        'to', NEW.status,
        'at', NOW(),
        'by', NEW.reviewed_by
      );
  END IF;
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.approved_at := NOW();
  END IF;
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    NEW.rejected_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_record_application_status_history ON registration_applications;
CREATE TRIGGER trigger_record_application_status_history
  BEFORE UPDATE ON registration_applications
  FOR EACH ROW
  EXECUTE FUNCTION record_application_status_history();
