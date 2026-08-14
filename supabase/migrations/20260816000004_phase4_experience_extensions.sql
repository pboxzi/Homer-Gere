-- ============================================================
-- PHASE 4: Experience Requests Extensions
-- Add workflow columns to experience_requests table
-- ============================================================

BEGIN;

-- Sequence generator for experience request numbers
CREATE OR REPLACE FUNCTION generate_experience_request_number()
RETURNS TEXT AS $$
DECLARE
  next_seq INTEGER;
  result TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(request_number FROM 12 FOR 4) AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM experience_requests
  WHERE request_number LIKE 'ER-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%';

  result := 'ER-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(next_seq::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Extend experience_requests with new columns
-- ============================================================
DO $$ BEGIN
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS preferred_date DATE;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS num_guests INTEGER DEFAULT 1;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS special_requirements TEXT;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS timeline TEXT;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS payment_request_id UUID REFERENCES payment_requests(id) ON DELETE SET NULL;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS slot_reserved BOOLEAN DEFAULT false;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS reservation_expires_at TIMESTAMPTZ;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS request_number TEXT UNIQUE;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS deleted_by UUID;
  ALTER TABLE experience_requests ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- Generate request numbers for existing rows
UPDATE experience_requests
SET request_number = generate_experience_request_number()
WHERE request_number IS NULL;

-- Make request_number NOT NULL after backfill
DO $$ BEGIN
  ALTER TABLE experience_requests ALTER COLUMN request_number SET NOT NULL;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_experience_requests_request_number ON experience_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_experience_requests_deleted_at ON experience_requests(deleted_at);
CREATE INDEX IF NOT EXISTS idx_experience_requests_payment_request_id ON experience_requests(payment_request_id);

COMMIT;
