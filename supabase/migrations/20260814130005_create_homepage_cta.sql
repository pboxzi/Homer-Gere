-- ============================================================
-- PHASE 2: Homepage CMS - CTA Sections
-- ============================================================

CREATE TABLE IF NOT EXISTS homepage_cta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  background_image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

ALTER TABLE homepage_cta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hp_cta_public_read" ON homepage_cta
  FOR SELECT USING (published = true);

CREATE POLICY "hp_cta_admin_manage" ON homepage_cta
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE OR REPLACE FUNCTION update_homepage_cta_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_homepage_cta ON homepage_cta;
CREATE TRIGGER trigger_update_homepage_cta
  BEFORE UPDATE ON homepage_cta
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_cta_updated_at();
