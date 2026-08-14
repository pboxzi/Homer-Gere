-- ============================================================
-- PHASE 2: Homepage CMS - Hero Slides
-- ============================================================

CREATE TABLE IF NOT EXISTS homepage_hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

ALTER TABLE homepage_hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hp_hero_public_read" ON homepage_hero_slides
  FOR SELECT USING (published = true AND active = true);

CREATE POLICY "hp_hero_admin_manage" ON homepage_hero_slides
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE OR REPLACE FUNCTION update_homepage_hero_slides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_homepage_hero_slides ON homepage_hero_slides;
CREATE TRIGGER trigger_update_homepage_hero_slides
  BEFORE UPDATE ON homepage_hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_hero_slides_updated_at();
