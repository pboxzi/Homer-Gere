-- Migration: Create chat tables (fan + business)
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- FAN CONVERSATIONS
-- ============================================================
CREATE TABLE fan_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  membership_tier TEXT,
  status conversation_status DEFAULT 'open',
  method TEXT, -- 'whatsapp', 'email', 'telegram', 'website'
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAN MESSAGES
-- ============================================================
CREATE TABLE fan_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES fan_conversations(id) ON DELETE CASCADE,
  sender message_sender NOT NULL,
  text TEXT NOT NULL,
  media_type media_type,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUSINESS ENQUIRIES
-- ============================================================
CREATE TABLE business_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  enquiry_type TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status conversation_status DEFAULT 'open',
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUSINESS MESSAGES
-- ============================================================
CREATE TABLE business_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES business_enquiries(id) ON DELETE CASCADE,
  sender message_sender NOT NULL,
  text TEXT NOT NULL,
  media_type media_type,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
