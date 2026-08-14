-- ============================================================
-- PHASE 1: Extend audit_logs with module, browser, device
-- ============================================================

ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS module TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS device TEXT;
