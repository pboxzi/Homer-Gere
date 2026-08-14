-- ============================================================
-- PHASE 2: Homepage CMS - Quotes
-- ============================================================

CREATE TABLE IF NOT EXISTS homepage_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  position TEXT,
  portrait_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

ALTER TABLE homepage_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hp_quotes_public_read" ON homepage_quotes
  FOR SELECT USING (published = true);

CREATE POLICY "hp_quotes_admin_manage" ON homepage_quotes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE OR REPLACE FUNCTION update_homepage_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_homepage_quotes ON homepage_quotes;
CREATE TRIGGER trigger_update_homepage_quotes
  BEFORE UPDATE ON homepage_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_quotes_updated_at();
