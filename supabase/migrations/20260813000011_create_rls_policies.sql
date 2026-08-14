-- Migration: Enable RLS and create policies
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- HELPER FUNCTION: Check if user is super_admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- ============================================================
-- HELPER FUNCTION: Check if user is admin or super_admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- ============================================================
-- HELPER FUNCTION: Check if user is authenticated member
-- ============================================================
CREATE OR REPLACE FUNCTION is_member()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'member'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- ============================================================
-- PROFILES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guest cannot read profiles"
  ON profiles FOR SELECT
  USING (false);

CREATE POLICY "Members can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Super admin can read all profiles"
  ON profiles FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Members can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admin can update all profiles"
  ON profiles FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admin can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (is_super_admin());

-- ============================================================
-- ADMINS
-- ============================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can manage admins"
  ON admins FOR ALL
  USING (is_super_admin());

CREATE POLICY "Admins can read own admin record"
  ON admins FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================
-- REGISTRATION APPLICATIONS
-- ============================================================
ALTER TABLE registration_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert registration application"
  ON registration_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Super admin can read all applications"
  ON registration_applications FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can update applications"
  ON registration_applications FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================================
-- MEMBERSHIP PLANS (public read)
-- ============================================================
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active membership plans"
  ON membership_plans FOR SELECT
  USING (status = 'active');

CREATE POLICY "Super admin can manage membership plans"
  ON membership_plans FOR ALL
  USING (is_super_admin());

-- ============================================================
-- MEMBERSHIPS
-- ============================================================
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own memberships"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Super admin can read all memberships"
  ON memberships FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can manage memberships"
  ON memberships FOR ALL
  USING (is_super_admin());

-- ============================================================
-- JOURNEY ENTRIES (public read)
-- ============================================================
ALTER TABLE journey_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read journey entries"
  ON journey_entries FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage journey entries"
  ON journey_entries FOR ALL
  USING (is_super_admin());

-- ============================================================
-- JOURNAL ARTICLES
-- ============================================================
ALTER TABLE journal_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published journal articles"
  ON journal_articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Super admin can manage journal articles"
  ON journal_articles FOR ALL
  USING (is_super_admin());

-- ============================================================
-- FILMOGRAPHY ENTRIES (public read)
-- ============================================================
ALTER TABLE filmography_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read filmography entries"
  ON filmography_entries FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage filmography entries"
  ON filmography_entries FOR ALL
  USING (is_super_admin());

-- ============================================================
-- EXPERIENCES (public read)
-- ============================================================
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage experiences"
  ON experiences FOR ALL
  USING (is_super_admin());

-- ============================================================
-- EXPERIENCE REQUESTS
-- ============================================================
ALTER TABLE experience_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert experience requests"
  ON experience_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Members can read own experience requests"
  ON experience_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Super admin can read all experience requests"
  ON experience_requests FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can update experience requests"
  ON experience_requests FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================================
-- PROJECTS (public read)
-- ============================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage projects"
  ON projects FOR ALL
  USING (is_super_admin());

-- ============================================================
-- PROJECT MEDIA (public read)
-- ============================================================
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read project media"
  ON project_media FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage project media"
  ON project_media FOR ALL
  USING (is_super_admin());

-- ============================================================
-- PROJECT VIDEOS (public read)
-- ============================================================
ALTER TABLE project_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read project videos"
  ON project_videos FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage project videos"
  ON project_videos FOR ALL
  USING (is_super_admin());

-- ============================================================
-- PROJECT RECOGNITION (public read)
-- ============================================================
ALTER TABLE project_recognition ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read project recognition"
  ON project_recognition FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage project recognition"
  ON project_recognition FOR ALL
  USING (is_super_admin());

-- ============================================================
-- GALLERY COLLECTIONS (public read)
-- ============================================================
ALTER TABLE gallery_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery collections"
  ON gallery_collections FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage gallery collections"
  ON gallery_collections FOR ALL
  USING (is_super_admin());

-- ============================================================
-- GALLERY PHOTOS (public read)
-- ============================================================
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery photos"
  ON gallery_photos FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage gallery photos"
  ON gallery_photos FOR ALL
  USING (is_super_admin());

-- ============================================================
-- FAN CONVERSATIONS
-- ============================================================
ALTER TABLE fan_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert fan conversations"
  ON fan_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Members can read own fan conversations"
  ON fan_conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Super admin can read all fan conversations"
  ON fan_conversations FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can update fan conversations"
  ON fan_conversations FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================================
-- FAN MESSAGES
-- ============================================================
ALTER TABLE fan_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert fan messages"
  ON fan_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Members can read messages in own conversations"
  ON fan_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM fan_conversations
      WHERE fan_conversations.id = fan_messages.conversation_id
      AND fan_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admin can read all fan messages"
  ON fan_messages FOR SELECT
  USING (is_super_admin());

-- ============================================================
-- BUSINESS ENQUIRIES
-- ============================================================
ALTER TABLE business_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert business enquiries"
  ON business_enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Members can read own business enquiries"
  ON business_enquiries FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Super admin can read all business enquiries"
  ON business_enquiries FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can update business enquiries"
  ON business_enquiries FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================================
-- BUSINESS MESSAGES
-- ============================================================
ALTER TABLE business_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert business messages"
  ON business_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Members can read messages in own enquiries"
  ON business_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_enquiries
      WHERE business_enquiries.id = business_messages.enquiry_id
      AND business_enquiries.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admin can read all business messages"
  ON business_messages FOR SELECT
  USING (is_super_admin());

-- ============================================================
-- MEDIA VIDEOS (public read)
-- ============================================================
ALTER TABLE media_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read media videos"
  ON media_videos FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage media videos"
  ON media_videos FOR ALL
  USING (is_super_admin());

-- ============================================================
-- MEDIA PODCASTS (public read)
-- ============================================================
ALTER TABLE media_podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read media podcasts"
  ON media_podcasts FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage media podcasts"
  ON media_podcasts FOR ALL
  USING (is_super_admin());

-- ============================================================
-- MEDIA PRESS (public read)
-- ============================================================
ALTER TABLE media_press ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read media press"
  ON media_press FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage media press"
  ON media_press FOR ALL
  USING (is_super_admin());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Members can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Super admin can manage all notifications"
  ON notifications FOR ALL
  USING (is_super_admin());

-- ============================================================
-- SITE SETTINGS (public read, admin write)
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Super admin can manage site settings"
  ON site_settings FOR ALL
  USING (is_super_admin());

-- ============================================================
-- EMAIL TEMPLATES (admin only)
-- ============================================================
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can manage email templates"
  ON email_templates FOR ALL
  USING (is_super_admin());

-- ============================================================
-- AUDIT LOGS (admin only)
-- ============================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can read audit logs"
  ON audit_logs FOR SELECT
  USING (is_super_admin());

CREATE POLICY "Super admin can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (is_super_admin());

COMMIT;
