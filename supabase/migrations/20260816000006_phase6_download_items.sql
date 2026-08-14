-- ============================================================
-- PHASE 6: Download Items Table
-- Homer Gere Platform - Member Download Center
-- ============================================================

CREATE TABLE IF NOT EXISTS download_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'document',
  file_size BIGINT DEFAULT 0,
  thumbnail_url TEXT,
  required_tier TEXT DEFAULT 'member',
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID
);

-- Member downloads tracking
CREATE TABLE IF NOT EXISTS member_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  download_item_id UUID NOT NULL REFERENCES download_items(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, download_item_id)
);

-- Activity logs for member timeline
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience documents for download
CREATE TABLE IF NOT EXISTS experience_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_request_id UUID REFERENCES experience_requests(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'document',
  document_type TEXT NOT NULL DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_download_items_category ON download_items(category);
CREATE INDEX IF NOT EXISTS idx_download_items_active ON download_items(is_active);
CREATE INDEX IF NOT EXISTS idx_member_downloads_user ON member_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experience_documents_user ON experience_documents(user_id);

-- RLS Policies
ALTER TABLE download_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_documents ENABLE ROW LEVEL SECURITY;

-- download_items: public read, admin write
CREATE POLICY "Public can view active downloads" ON download_items
  FOR SELECT USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "Admins manage downloads" ON download_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- member_downloads: users manage own
CREATE POLICY "Users view own downloads" ON member_downloads
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users insert own downloads" ON member_downloads
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- activity_logs: users view own, admin view all
CREATE POLICY "Users view own activity" ON activity_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System inserts activity" ON activity_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view all activity" ON activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- experience_documents: users view own
CREATE POLICY "Users view own experience docs" ON experience_documents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins manage experience docs" ON experience_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );
