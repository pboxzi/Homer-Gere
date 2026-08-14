-- ============================================================
-- PHASE 2: Homepage CMS - Section ordering & visibility
-- ============================================================

CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

-- Public can read published sections
CREATE POLICY "hp_sections_public_read" ON homepage_sections
  FOR SELECT USING (published = true);

-- Admins can manage
CREATE POLICY "hp_sections_admin_manage" ON homepage_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_homepage_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_homepage_sections ON homepage_sections;
CREATE TRIGGER trigger_update_homepage_sections
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_sections_updated_at();

-- Seed default sections
INSERT INTO homepage_sections (section_key, title, display_order, enabled, published) VALUES
  ('hero', 'Hero', 1, true, true),
  ('featured_project', 'Featured Project', 2, true, true),
  ('journey', 'Journey', 3, true, true),
  ('journal', 'Journal', 4, true, true),
  ('experiences', 'Experiences', 5, true, true),
  ('membership', 'Membership', 6, true, true),
  ('gallery', 'Gallery', 7, true, true),
  ('newsletter', 'Newsletter', 8, true, true)
ON CONFLICT (section_key) DO NOTHING;
