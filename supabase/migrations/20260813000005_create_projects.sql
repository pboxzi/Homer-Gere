-- Migration: Create projects and sub-tables
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  type project_type NOT NULL,
  status project_status DEFAULT 'announced',
  tagline TEXT,
  synopsis TEXT,
  expanded_synopsis TEXT,
  genre TEXT,
  runtime TEXT,
  director TEXT,
  homer_role_title TEXT,
  homer_role_description TEXT,
  image TEXT,
  hero_image TEXT,
  poster_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECT MEDIA (photos, stills, BTS)
-- ============================================================
CREATE TABLE project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  type media_type DEFAULT 'image',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECT VIDEOS
-- ============================================================
CREATE TABLE project_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT,
  thumbnail TEXT,
  duration TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECT RECOGNITION (awards, nominations)
-- ============================================================
CREATE TABLE project_recognition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  award TEXT NOT NULL,
  category TEXT,
  result TEXT, -- 'winner', 'nominated'
  ceremony TEXT,
  year INTEGER,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
