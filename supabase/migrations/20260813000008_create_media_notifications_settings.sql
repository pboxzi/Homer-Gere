-- Migration: Create media, notifications, site_settings
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- MEDIA VIDEOS
-- ============================================================
CREATE TABLE media_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  duration TEXT,
  date DATE,
  source TEXT,
  category TEXT,
  url TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEDIA PODCASTS
-- ============================================================
CREATE TABLE media_podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_title TEXT NOT NULL,
  show_name TEXT NOT NULL,
  description TEXT,
  cover_art TEXT,
  date DATE,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MEDIA PRESS
-- ============================================================
CREATE TABLE media_press (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  publisher TEXT NOT NULL,
  date DATE,
  summary TEXT,
  url TEXT NOT NULL,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS (key-value per category)
-- ============================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL UNIQUE, -- 'website', 'branding', 'security', 'backup', 'email', 'seo', 'integrations'
  settings JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
