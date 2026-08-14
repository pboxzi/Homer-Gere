-- ============================================================
-- PHASE 4: Payment System Tables
-- payment_methods, payment_requests, payment_submissions
-- ============================================================

BEGIN;

-- ============================================================
-- SEQUENCE GENERATORS
-- ============================================================
CREATE OR REPLACE FUNCTION generate_payment_request_number()
RETURNS TEXT AS $$
DECLARE
  next_seq INTEGER;
  result TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(request_number FROM 12 FOR 4) AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM payment_requests
  WHERE request_number LIKE 'PR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%';

  result := 'PR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(next_seq::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_submission_number()
RETURNS TEXT AS $$
DECLARE
  next_seq INTEGER;
  result TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(submission_number FROM 12 FOR 4) AS INTEGER)
  ), 0) + 1
  INTO next_seq
  FROM payment_submissions
  WHERE submission_number LIKE 'PS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%';

  result := 'PS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(next_seq::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PAYMENT METHODS
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank_transfer', 'mobile_money', 'cash_deposit', 'manual_transfer', 'online_gateway')),
  country TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  account_name TEXT,
  account_number TEXT,
  bank_name TEXT,
  swift_code TEXT,
  routing_code TEXT,
  mobile_number TEXT,
  qr_code_url TEXT,
  instructions TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_active ON payment_methods(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_methods_country ON payment_methods(country);

-- RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active payment methods" ON payment_methods;
CREATE POLICY "Anyone can view active payment methods" ON payment_methods
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage all payment methods" ON payment_methods;
CREATE POLICY "Admins can manage all payment methods" ON payment_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER trigger_update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_methods_updated_at();

-- ============================================================
-- PAYMENT REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT NOT NULL UNIQUE DEFAULT generate_payment_request_number(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('membership', 'experience')),
  related_record_id UUID NOT NULL,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'instructions_sent', 'submitted', 'under_review',
    'approved', 'rejected', 'expired'
  )),
  due_date TIMESTAMPTZ,
  admin_notes TEXT,
  payment_instructions TEXT,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_payment_type ON payment_requests(payment_type);
CREATE INDEX IF NOT EXISTS idx_payment_requests_related_record_id ON payment_requests(related_record_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_request_number ON payment_requests(request_number);

-- RLS
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payment requests" ON payment_requests;
CREATE POLICY "Users can view own payment requests" ON payment_requests
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all payment requests" ON payment_requests;
CREATE POLICY "Admins can manage all payment requests" ON payment_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_payment_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_payment_requests_updated_at ON payment_requests;
CREATE TRIGGER trigger_update_payment_requests_updated_at
  BEFORE UPDATE ON payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_requests_updated_at();

-- ============================================================
-- PAYMENT SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_number TEXT NOT NULL UNIQUE DEFAULT generate_submission_number(),
  payment_request_id UUID REFERENCES payment_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  transaction_reference TEXT NOT NULL,
  amount_paid NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_date DATE NOT NULL,
  proof_media_id UUID REFERENCES site_media(id) ON DELETE SET NULL,
  proof_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'needs_info')),
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_submissions_payment_request_id ON payment_submissions(payment_request_id);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_user_id ON payment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_status ON payment_submissions(status);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_submission_number ON payment_submissions(submission_number);

-- RLS
ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payment submissions" ON payment_submissions;
CREATE POLICY "Users can view own payment submissions" ON payment_submissions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create payment submissions" ON payment_submissions;
CREATE POLICY "Authenticated users can create payment submissions" ON payment_submissions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all payment submissions" ON payment_submissions;
CREATE POLICY "Admins can manage all payment submissions" ON payment_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_payment_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_payment_submissions_updated_at ON payment_submissions;
CREATE TRIGGER trigger_update_payment_submissions_updated_at
  BEFORE UPDATE ON payment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_submissions_updated_at();

COMMIT;
