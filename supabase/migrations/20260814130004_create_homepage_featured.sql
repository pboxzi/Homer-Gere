-- ============================================================
-- PHASE 2: Homepage CMS - Featured Content References
-- ============================================================

CREATE TABLE IF NOT EXISTS homepage_featured (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  reference_type TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

ALTER TABLE homepage_featured ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hp_featured_public_read" ON homepage_featured
  FOR SELECT USING (published = true);

CREATE POLICY "hp_featured_admin_manage" ON homepage_featured
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE OR REPLACE FUNCTION update_homepage_featured_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_homepage_featured ON homepage_featured;
CREATE TRIGGER trigger_update_homepage_featured
  BEFORE UPDATE ON homepage_featured
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_featured_updated_at();
