-- Migration 016: Centralize media management
-- Adds image_url to journey_entries, creates site_media tracking table,
-- adds homepage/site-level image fields to site_settings

-- 1. Add image_url to journey_entries (missing from original schema)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journey_entries' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE journey_entries ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- 2. Add image columns to projects if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'logo_image'
  ) THEN
    ALTER TABLE projects ADD COLUMN logo_image TEXT;
  END IF;
END $$;

-- 3. Add author_image to journal_articles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'journal_articles' AND column_name = 'author_image'
  ) THEN
    ALTER TABLE journal_articles ADD COLUMN author_image TEXT;
  END IF;
END $$;

-- 4. Add avatar_image to profiles (alias for avatar_url, more consistent naming)
-- avatar_url already exists, just ensure it's there
-- No migration needed.

-- 5. Create site_media table: central registry of all media assets
CREATE TABLE IF NOT EXISTS site_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT,
  storage_bucket TEXT NOT NULL DEFAULT 'media',
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'image', -- image, video, document
  file_size BIGINT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  section TEXT, -- homepage, journey, projects, gallery, journal, media, experiences, membership, profile, admin
  usage_context TEXT, -- e.g. 'journal_articles:cover_image:abc123' to track where used
  status TEXT DEFAULT 'active', -- active, broken, placeholder
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for site_media
CREATE INDEX IF NOT EXISTS idx_site_media_section ON site_media(section);
CREATE INDEX IF NOT EXISTS idx_site_media_status ON site_media(status);
CREATE INDEX IF NOT EXISTS idx_site_media_file_type ON site_media(file_type);

-- 6. Add updated_at trigger for site_media
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_site_media_updated_at'
  ) THEN
    CREATE TRIGGER update_site_media_updated_at
      BEFORE UPDATE ON site_media
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- 7. RLS policies for site_media
ALTER TABLE site_media ENABLE ROW LEVEL SECURITY;

-- Public can read active media
DROP POLICY IF EXISTS "Public can view active site_media" ON site_media;
CREATE POLICY "Public can view active site_media"
  ON site_media FOR SELECT
  USING (status = 'active');

-- Only super admins can manage site_media
DROP POLICY IF EXISTS "Super admins can manage site_media" ON site_media;
CREATE POLICY "Super admins can manage site_media"
  ON site_media FOR ALL
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- 8. Ensure all content tables have their image columns documented
-- Already present from previous migrations:
-- journal_articles: cover_image, og_image
-- gallery_photos: src
-- gallery_collections: cover_image
-- filmography_entries: image
-- experiences: image
-- media_videos: thumbnail
-- media_podcasts: cover_art
-- media_press: image
-- projects: image, hero_image, poster_image
-- profiles: avatar_url
-- Added by this migration:
-- journey_entries: image_url
-- projects: logo_image
-- journal_articles: author_image

-- 9. Add 'broken' status to track images that need replacement
-- The site_media.status column handles this:
-- 'active' = image is valid
-- 'broken' = image URL is invalid/missing, needs manual upload
-- 'placeholder' = using a placeholder, should be replaced
