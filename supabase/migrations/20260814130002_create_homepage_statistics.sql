-- ============================================================
-- PHASE 2: Homepage CMS - Statistics
-- ============================================================

CREATE TABLE IF NOT EXISTS homepage_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

ALTER TABLE homepage_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hp_stats_public_read" ON homepage_statistics
  FOR SELECT USING (published = true);

CREATE POLICY "hp_stats_admin_manage" ON homepage_statistics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE OR REPLACE FUNCTION update_homepage_statistics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_homepage_statistics ON homepage_statistics;
CREATE TRIGGER trigger_update_homepage_statistics
  BEFORE UPDATE ON homepage_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_statistics_updated_at();
