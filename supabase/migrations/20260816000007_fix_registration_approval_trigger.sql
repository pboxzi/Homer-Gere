-- Fix: handle_registration_approval trigger
-- Approved users get member role but NO membership — they must purchase a plan

CREATE OR REPLACE FUNCTION handle_registration_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- When application is approved
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Upsert profile with member role, no membership tier
    -- User must purchase a membership plan separately
    INSERT INTO profiles (id, first_name, last_name, email, role, membership_tier, email_verified)
    VALUES (
      NEW.user_id,
      NEW.first_name,
      NEW.last_name,
      NEW.email,
      'member',
      'none',
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'member',
      membership_tier = 'none',
      email_verified = true;
  END IF;

  -- When rejected, add rejection reason
  IF NEW.status = 'rejected' AND OLD.status = 'pending' THEN
    NEW.rejection_reason := COALESCE(NEW.rejection_reason, 'Application rejected by admin');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
