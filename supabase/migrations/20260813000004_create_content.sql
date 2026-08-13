-- Migration: Create content tables (journey, journal, filmography, experiences)
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- JOURNEY ENTRIES (timeline milestones)
-- ============================================================
CREATE TABLE journey_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  highlight BOOLEAN DEFAULT FALSE,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- JOURNAL ARTICLES
-- ============================================================
CREATE TABLE journal_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category journal_category NOT NULL,
  author TEXT DEFAULT 'Homer Gere',
  tags JSONB DEFAULT '[]',
  status content_status DEFAULT 'draft',
  published_date TIMESTAMPTZ,
  read_time TEXT,
  views INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  related_slugs JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FILMOGRAPHY ENTRIES
-- ============================================================
CREATE TABLE filmography_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT,
  description TEXT,
  type TEXT, -- 'film', 'series', 'short'
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPERIENCES
-- ============================================================
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  price TEXT,
  icon_name TEXT,
  type experience_category NOT NULL,
  image TEXT,
  availability TEXT,
  whats_included JSONB DEFAULT '[]',
  eligibility TEXT,
  duration TEXT,
  location TEXT,
  important_notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPERIENCE REQUESTS
-- ============================================================
CREATE TABLE experience_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  experience_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  organization TEXT,
  event_date DATE,
  event_location TEXT,
  budget TEXT,
  purpose TEXT,
  additional_details TEXT,
  status experience_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
