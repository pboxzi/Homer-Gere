-- ============================================================
-- PHASE 1: Extend notifications with priority, category, expiration
-- ============================================================

-- Priority support
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS category TEXT;

-- Action & expiration
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_link TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Precise read tracking
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- Add check constraint for priority
ALTER TABLE notifications ADD CONSTRAINT notifications_priority_check
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- Auto-set read_at when read becomes true
CREATE OR REPLACE FUNCTION set_notification_read_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read = true AND (OLD.read = false OR OLD.read IS NULL) THEN
    NEW.read_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_set_notification_read_at ON notifications;
CREATE TRIGGER trigger_set_notification_read_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION set_notification_read_at();
