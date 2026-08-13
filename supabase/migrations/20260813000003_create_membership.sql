-- Migration: Create membership_plans, memberships
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- MEMBERSHIP PLANS
-- ============================================================
CREATE TABLE membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  period TEXT NOT NULL, -- 'monthly', 'annual', 'lifetime'
  duration INTEGER, -- days, NULL for lifetime
  badge TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  features JSONB DEFAULT '[]',
  cta_text TEXT DEFAULT 'Join Now',
  availability TEXT DEFAULT 'available',
  requires_approval BOOLEAN DEFAULT FALSE,
  members_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEMBERSHIPS (user subscriptions)
-- ============================================================
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES membership_plans(id),
  status membership_status DEFAULT 'pending',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  renewal_date TIMESTAMPTZ,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
