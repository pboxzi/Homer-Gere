-- ============================================================
-- PHASE 1: Ensure payments table has TypeScript-aligned columns
-- Table was created in migration 27, verify and extend
-- ============================================================

-- Ensure payments table exists (idempotent)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name TEXT NOT NULL DEFAULT '',
  member_email TEXT NOT NULL DEFAULT '',
  member_id UUID,
  plan TEXT NOT NULL DEFAULT '',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'refunded', 'failed')),
  payment_method TEXT,
  transaction_id TEXT,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add columns only if table already existed without them
DO $$ BEGIN
  ALTER TABLE payments ADD COLUMN IF NOT EXISTS member_id UUID;
  ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_method TEXT;
  ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_id TEXT;
  ALTER TABLE payments ADD COLUMN IF NOT EXISTS description TEXT;
  ALTER TABLE payments ADD COLUMN IF NOT EXISTS notes TEXT;
  ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
CREATE POLICY "Admins can manage payments" ON payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Members can view own payments" ON payments;
CREATE POLICY "Members can view own payments" ON payments
  FOR SELECT USING (
    member_id = auth.uid()
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_payments_updated_at ON payments;
CREATE TRIGGER trigger_update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();
