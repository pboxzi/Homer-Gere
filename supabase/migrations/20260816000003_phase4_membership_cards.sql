-- ============================================================
-- PHASE 4: Membership Cards Table
-- Digital membership card generation and management
-- ============================================================

BEGIN;

-- ============================================================
-- MEMBERSHIP CARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS membership_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,
  membership_request_id UUID REFERENCES membership_requests(id) ON DELETE SET NULL,
  qr_code_data TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'deactivated', 'replaced')),
  card_design TEXT NOT NULL DEFAULT 'standard',
  download_url TEXT,
  replaced_by UUID REFERENCES membership_cards(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_membership_cards_user_id ON membership_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_cards_membership_id ON membership_cards(membership_id);
CREATE INDEX IF NOT EXISTS idx_membership_cards_card_number ON membership_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_membership_cards_status ON membership_cards(status);

-- RLS
ALTER TABLE membership_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own membership cards" ON membership_cards;
CREATE POLICY "Users can view own membership cards" ON membership_cards
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all membership cards" ON membership_cards;
CREATE POLICY "Admins can manage all membership cards" ON membership_cards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_membership_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_membership_cards_updated_at ON membership_cards;
CREATE TRIGGER trigger_update_membership_cards_updated_at
  BEFORE UPDATE ON membership_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_membership_cards_updated_at();

-- ============================================================
-- Extend memberships table with new columns
-- ============================================================
DO $$ BEGIN
  ALTER TABLE memberships ADD COLUMN IF NOT EXISTS membership_request_id UUID REFERENCES membership_requests(id) ON DELETE SET NULL;
  ALTER TABLE memberships ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES membership_cards(id) ON DELETE SET NULL;
  ALTER TABLE memberships ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT false;
  ALTER TABLE memberships ADD COLUMN IF NOT EXISTS last_payment_id UUID;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

COMMIT;
