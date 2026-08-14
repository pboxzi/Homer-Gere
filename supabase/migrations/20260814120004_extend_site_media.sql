-- ============================================================
-- PHASE 1: Extend site_media with metadata fields
-- ============================================================

ALTER TABLE site_media ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE site_media ADD COLUMN IF NOT EXISTS caption TEXT;
ALTER TABLE site_media ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT '/';
ALTER TABLE site_media ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE site_media ADD COLUMN IF NOT EXISTS checksum TEXT;
ALTER TABLE site_media ADD COLUMN IF NOT EXISTS usage_count INT DEFAULT 0;

-- Index for folder-based browsing
CREATE INDEX IF NOT EXISTS idx_site_media_folder ON site_media(folder);
CREATE INDEX IF NOT EXISTS idx_site_media_tags ON site_media USING GIN(tags);
