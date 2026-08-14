-- ============================================================
-- PHASE 1: Extend profiles with enterprise fields
-- All columns are nullable/optional for backward compatibility
-- ============================================================

-- Profile identity & bio
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS biography TEXT;

-- Location
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Media references (FK added after site_media table check)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_media_id UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_media_id UUID;

-- Profile management
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_completion INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Soft delete support
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- Add check constraint for account_status
ALTER TABLE profiles ADD CONSTRAINT profiles_account_status_check
  CHECK (account_status IN ('active', 'suspended', 'deactivated', 'pending'));
