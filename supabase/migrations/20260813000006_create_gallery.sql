-- Migration: Create gallery tables
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- GALLERY COLLECTIONS
-- ============================================================
CREATE TABLE gallery_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  date DATE,
  photo_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GALLERY PHOTOS
-- ============================================================
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  date DATE,
  category gallery_category NOT NULL,
  event TEXT,
  photographer TEXT,
  featured BOOLEAN DEFAULT FALSE,
  collection_id UUID REFERENCES gallery_collections(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMIT;
