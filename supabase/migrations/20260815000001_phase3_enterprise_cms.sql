-- Migration: Phase 3 - Enterprise CMS
-- Adds soft delete, SEO, status, audit, and version fields to ALL content tables
-- Created: 2026-08-15

BEGIN;

-- ============================================================
-- JOURNEY ENTRIES - Add CMS fields
-- ============================================================
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================================
-- FILMOGRAPHY ENTRIES - Add CMS fields
-- ============================================================
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE filmography_entries ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================
-- GALLERY COLLECTIONS - Add CMS fields
-- ============================================================
ALTER TABLE gallery_collections ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE gallery_collections ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE gallery_collections ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE gallery_collections ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE gallery_collections ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- ============================================================
-- GALLERY PHOTOS - Add CMS fields
-- ============================================================
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================
-- MEDIA VIDEOS - Add CMS fields
-- ============================================================
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE media_videos ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================
-- MEDIA PODCASTS - Add CMS fields
-- ============================================================
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE media_podcasts ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================
-- MEDIA PRESS - Add CMS fields
-- ============================================================
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE media_press ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================
-- FAQS - Add CMS fields
-- ============================================================
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE faqs ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================
-- PROJECTS - Add CMS fields
-- ============================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- ============================================================
-- PROJECT MEDIA - Add CMS fields
-- ============================================================
ALTER TABLE project_media ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE project_media ADD COLUMN IF NOT EXISTS created_by UUID;

-- ============================================================
-- PROJECT VIDEOS - Add CMS fields
-- ============================================================
ALTER TABLE project_videos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE project_videos ADD COLUMN IF NOT EXISTS created_by UUID;

-- ============================================================
-- PROJECT RECOGNITION - Add CMS fields
-- ============================================================
ALTER TABLE project_recognition ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE project_recognition ADD COLUMN IF NOT EXISTS created_by UUID;

-- ============================================================
-- JOURNAL ARTICLES - Add missing CMS fields
-- ============================================================
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS seo_keywords TEXT;
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE journal_articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- ============================================================
-- EXPERIENCES - Add CMS fields
-- ============================================================
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS deleted_by UUID;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================
-- UPDATED_AT TRIGGERS for tables missing them
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_journey_entries_updated_at') THEN
    CREATE TRIGGER update_journey_entries_updated_at
      BEFORE UPDATE ON journey_entries
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_filmography_entries_updated_at') THEN
    CREATE TRIGGER update_filmography_entries_updated_at
      BEFORE UPDATE ON filmography_entries
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_gallery_collections_updated_at') THEN
    CREATE TRIGGER update_gallery_collections_updated_at
      BEFORE UPDATE ON gallery_collections
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_gallery_photos_updated_at') THEN
    CREATE TRIGGER update_gallery_photos_updated_at
      BEFORE UPDATE ON gallery_photos
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_media_videos_updated_at') THEN
    CREATE TRIGGER update_media_videos_updated_at
      BEFORE UPDATE ON media_videos
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_media_podcasts_updated_at') THEN
    CREATE TRIGGER update_media_podcasts_updated_at
      BEFORE UPDATE ON media_podcasts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_media_press_updated_at') THEN
    CREATE TRIGGER update_media_press_updated_at
      BEFORE UPDATE ON media_press
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_faqs_updated_at') THEN
    CREATE TRIGGER update_faqs_updated_at
      BEFORE UPDATE ON faqs
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_experiences_updated_at') THEN
    CREATE TRIGGER update_experiences_updated_at
      BEFORE UPDATE ON experiences
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_journey_entries_status ON journey_entries(status);
CREATE INDEX IF NOT EXISTS idx_journey_entries_deleted_at ON journey_entries(deleted_at);
CREATE INDEX IF NOT EXISTS idx_filmography_entries_status ON filmography_entries(status);
CREATE INDEX IF NOT EXISTS idx_filmography_entries_deleted_at ON filmography_entries(deleted_at);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_status ON gallery_photos(status);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_deleted_at ON gallery_photos(deleted_at);
CREATE INDEX IF NOT EXISTS idx_media_videos_status ON media_videos(status);
CREATE INDEX IF NOT EXISTS idx_media_videos_deleted_at ON media_videos(deleted_at);
CREATE INDEX IF NOT EXISTS idx_media_podcasts_status ON media_podcasts(status);
CREATE INDEX IF NOT EXISTS idx_media_podcasts_deleted_at ON media_podcasts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_media_press_status ON media_press(status);
CREATE INDEX IF NOT EXISTS idx_media_press_deleted_at ON media_press(deleted_at);
CREATE INDEX IF NOT EXISTS idx_faqs_deleted_at ON faqs(deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_journal_articles_deleted_at ON journal_articles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_journal_articles_scheduled_at ON journal_articles(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_experiences_status ON experiences(status);
CREATE INDEX IF NOT EXISTS idx_experiences_deleted_at ON experiences(deleted_at);

-- ============================================================
-- RLS POLICIES for soft delete (admin-only view of trashed items)
-- ============================================================
ALTER TABLE journey_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE filmography_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_press ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_recognition ENABLE ROW LEVEL SECURITY;

COMMIT;
