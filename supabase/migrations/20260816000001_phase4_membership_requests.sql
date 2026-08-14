-- ============================================================
-- PHASE 4: Membership Requests Table
-- Manual approval workflow for memberships
-- ============================================================

BEGIN;

-- Sequence generator for request numbers
CREATE OR REPLACE FUNCTION generate_membership_request_number()
RETURNS TEXT AS $$
DECLARE
  next_seq INTEGER;
  result TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(request_number FROM 12 FOR 4) AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM membership_requests
  WHERE request_number LIKE 'MR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%';

  result := 'MR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(next_seq::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- MEMBERSHIP REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS membership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT NOT NULL UNIQUE DEFAULT generate_membership_request_number(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  membership_plan_id UUID REFERENCES membership_plans(id) ON DELETE SET NULL,
  membership_plan_name TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT 'monthly' CHECK (duration IN ('monthly', 'quarterly', 'annual')),
  preferred_payment_method TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved_for_payment', 'payment_submitted',
    'payment_under_review', 'payment_approved', 'membership_active', 'rejected'
  )),
  admin_notes TEXT,
  rejection_reason TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_membership_requests_user_id ON membership_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_requests_status ON membership_requests(status);
CREATE INDEX IF NOT EXISTS idx_membership_requests_request_number ON membership_requests(request_number);

-- RLS
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own membership requests" ON membership_requests;
CREATE POLICY "Users can view own membership requests" ON membership_requests
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create membership requests" ON membership_requests;
CREATE POLICY "Authenticated users can create membership requests" ON membership_requests
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage membership requests" ON membership_requests;
CREATE POLICY "Admins can manage membership requests" ON membership_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Super admins can delete membership requests" ON membership_requests;
CREATE POLICY "Super admins can delete membership requests" ON membership_requests
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.admin_role = 'super_admin'
      AND admins.is_active = true
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_membership_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_membership_requests_updated_at ON membership_requests;
CREATE TRIGGER trigger_update_membership_requests_updated_at
  BEFORE UPDATE ON membership_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_membership_requests_updated_at();

COMMIT;
