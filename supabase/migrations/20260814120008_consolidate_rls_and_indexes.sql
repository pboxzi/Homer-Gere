-- ============================================================
-- PHASE 1: Performance optimizations
-- Consolidate RLS policies + add missing indexes
-- ============================================================

-- ============================================================
-- CONSOLIDATE RLS POLICIES
-- Replace multiple permissive policies with single combined policies
-- ============================================================

-- PROFILES: Single consolidated policy
DROP POLICY IF EXISTS "Allow public read access" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON profiles;
DROP POLICY IF EXISTS "Super admin can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;

CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "profiles_delete" ON profiles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND admin_role IN ('super_admin', 'admin') AND is_active = true)
  );

-- ADMINS: Single consolidated policy
DROP POLICY IF EXISTS "Allow public read" ON admins;
DROP POLICY IF EXISTS "Super admin can manage" ON admins;
DROP POLICY IF EXISTS "Anyone can read admins" ON admins;

CREATE POLICY "admins_select" ON admins FOR SELECT USING (true);
CREATE POLICY "admins_manage" ON admins FOR ALL USING (
  EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid() AND a.admin_role IN ('super_admin', 'admin') AND a.is_active = true)
);

-- REGISTRATION_APPLICATIONS: Consolidated
DROP POLICY IF EXISTS "Allow anonymous insert" ON registration_applications;
DROP POLICY IF EXISTS "Allow authenticated read" ON registration_applications;
DROP POLICY IF EXISTS "Admins can manage applications" ON registration_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON registration_applications;

CREATE POLICY "reg_app_select" ON registration_applications
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "reg_app_insert" ON registration_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "reg_app_update" ON registration_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "reg_app_delete" ON registration_applications
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND admin_role IN ('super_admin', 'admin') AND is_active = true)
  );

-- MEMBERSHIPS: Consolidated
DROP POLICY IF EXISTS "Users can view own membership" ON memberships;
DROP POLICY IF EXISTS "Admins can manage memberships" ON memberships;
DROP POLICY IF EXISTS "Allow read own membership" ON memberships;
DROP POLICY IF EXISTS "Admins full access" ON memberships;

CREATE POLICY "memberships_select" ON memberships
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "memberships_manage" ON memberships
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- MEMBERSHIP_PLANS: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read plans" ON membership_plans;
DROP POLICY IF EXISTS "Admins can manage plans" ON membership_plans;

CREATE POLICY "plans_select" ON membership_plans FOR SELECT USING (true);
CREATE POLICY "plans_manage" ON membership_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- EXPERIENCES: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read experiences" ON experiences;
DROP POLICY IF EXISTS "Admins can manage experiences" ON experiences;

CREATE POLICY "experiences_select" ON experiences FOR SELECT USING (true);
CREATE POLICY "experiences_manage" ON experiences FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- EXPERIENCE_REQUESTS: Consolidated
DROP POLICY IF EXISTS "Users can view own requests" ON experience_requests;
DROP POLICY IF EXISTS "Admins can manage requests" ON experience_requests;

CREATE POLICY "exp_req_select" ON experience_requests
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "exp_req_insert" ON experience_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "exp_req_manage" ON experience_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "exp_req_delete" ON experience_requests
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- PROJECTS: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read projects" ON projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;

CREATE POLICY "projects_select" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_manage" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- PROJECT_MEDIA, PROJECT_VIDEOS, PROJECT_RECOGNITION: Same pattern
DROP POLICY IF EXISTS "Anyone can read project media" ON project_media;
DROP POLICY IF EXISTS "Admins can manage project media" ON project_media;
CREATE POLICY "project_media_select" ON project_media FOR SELECT USING (true);
CREATE POLICY "project_media_manage" ON project_media FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

DROP POLICY IF EXISTS "Anyone can read project videos" ON project_videos;
DROP POLICY IF EXISTS "Admins can manage project videos" ON project_videos;
CREATE POLICY "project_videos_select" ON project_videos FOR SELECT USING (true);
CREATE POLICY "project_videos_manage" ON project_videos FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

DROP POLICY IF EXISTS "Anyone can read project recognition" ON project_recognition;
DROP POLICY IF EXISTS "Admins can manage project recognition" ON project_recognition;
CREATE POLICY "project_recognition_select" ON project_recognition FOR SELECT USING (true);
CREATE POLICY "project_recognition_manage" ON project_recognition FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- JOURNAL_ARTICLES: Public read for published, admin full
DROP POLICY IF EXISTS "Anyone can read published articles" ON journal_articles;
DROP POLICY IF EXISTS "Admins can manage articles" ON journal_articles;

CREATE POLICY "journal_select" ON journal_articles
  FOR SELECT USING (status = 'published' OR EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true
  ));
CREATE POLICY "journal_manage" ON journal_articles FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- FILMOGRAPHY_ENTRIES: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read filmography" ON filmography_entries;
DROP POLICY IF EXISTS "Admins can manage filmography" ON filmography_entries;
CREATE POLICY "filmography_select" ON filmography_entries FOR SELECT USING (true);
CREATE POLICY "filmography_manage" ON filmography_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- JOURNEY_ENTRIES: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read journey" ON journey_entries;
DROP POLICY IF EXISTS "Admins can manage journey" ON journey_entries;
CREATE POLICY "journey_select" ON journey_entries FOR SELECT USING (true);
CREATE POLICY "journey_manage" ON journey_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- GALLERY: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read collections" ON gallery_collections;
DROP POLICY IF EXISTS "Admins can manage collections" ON gallery_collections;
CREATE POLICY "gallery_collections_select" ON gallery_collections FOR SELECT USING (true);
CREATE POLICY "gallery_collections_manage" ON gallery_collections FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

DROP POLICY IF EXISTS "Anyone can read photos" ON gallery_photos;
DROP POLICY IF EXISTS "Admins can manage photos" ON gallery_photos;
CREATE POLICY "gallery_photos_select" ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "gallery_photos_manage" ON gallery_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- FAN CHAT: Consolidated
DROP POLICY IF EXISTS "Users can view own conversations" ON fan_conversations;
DROP POLICY IF EXISTS "Admins can manage conversations" ON fan_conversations;
DROP POLICY IF EXISTS "Anyone can create conversations" ON fan_conversations;

CREATE POLICY "fan_conv_select" ON fan_conversations
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );
CREATE POLICY "fan_conv_insert" ON fan_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "fan_conv_manage" ON fan_conversations FOR UPDATE USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "fan_conv_delete" ON fan_conversations FOR DELETE USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- FAN_MESSAGES: Same pattern
DROP POLICY IF EXISTS "Users can view own messages" ON fan_messages;
DROP POLICY IF EXISTS "Admins can manage messages" ON fan_messages;
DROP POLICY IF EXISTS "Anyone can send messages" ON fan_messages;

CREATE POLICY "fan_msg_select" ON fan_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fan_conversations
      WHERE fan_conversations.id = fan_messages.conversation_id
      AND (fan_conversations.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true))
    )
  );
CREATE POLICY "fan_msg_insert" ON fan_messages FOR INSERT WITH CHECK (true);

-- BUSINESS ENQUIRIES: Consolidated
DROP POLICY IF EXISTS "Users can view own enquiries" ON business_enquiries;
DROP POLICY IF EXISTS "Admins can manage enquiries" ON business_enquiries;

CREATE POLICY "biz_select" ON business_enquiries
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );
CREATE POLICY "biz_insert" ON business_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "biz_manage" ON business_enquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- BUSINESS_MESSAGES
DROP POLICY IF EXISTS "Users can view business messages" ON business_messages;
DROP POLICY IF EXISTS "Admins can manage business messages" ON business_messages;

CREATE POLICY "biz_msg_select" ON business_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM business_enquiries
      WHERE business_enquiries.id = business_messages.enquiry_id
      AND (business_enquiries.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true))
    )
  );
CREATE POLICY "biz_msg_insert" ON business_messages FOR INSERT WITH CHECK (true);

-- NOTIFICATIONS: Consolidated
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can manage notifications" ON notifications;

CREATE POLICY "notif_select" ON notifications
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );
CREATE POLICY "notif_insert" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "notif_update" ON notifications FOR UPDATE USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "notif_delete" ON notifications FOR DELETE USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- SITE_SETTINGS: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON site_settings;
CREATE POLICY "settings_select" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_manage" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- SITE_MEDIA: Consolidated
DROP POLICY IF EXISTS "Anyone can read media" ON site_media;
DROP POLICY IF EXISTS "Admins can manage media" ON site_media;
CREATE POLICY "site_media_select" ON site_media FOR SELECT USING (true);
CREATE POLICY "site_media_manage" ON site_media FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- MEDIA TABLES: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read videos" ON media_videos;
DROP POLICY IF EXISTS "Admins can manage videos" ON media_videos;
CREATE POLICY "media_videos_select" ON media_videos FOR SELECT USING (true);
CREATE POLICY "media_videos_manage" ON media_videos FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

DROP POLICY IF EXISTS "Anyone can read podcasts" ON media_podcasts;
DROP POLICY IF EXISTS "Admins can manage podcasts" ON media_podcasts;
CREATE POLICY "media_podcasts_select" ON media_podcasts FOR SELECT USING (true);
CREATE POLICY "media_podcasts_manage" ON media_podcasts FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

DROP POLICY IF EXISTS "Anyone can read press" ON media_press;
DROP POLICY IF EXISTS "Admins can manage press" ON media_press;
CREATE POLICY "media_press_select" ON media_press FOR SELECT USING (true);
CREATE POLICY "media_press_manage" ON media_press FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- EMAIL_TEMPLATES: Admin only
DROP POLICY IF EXISTS "Admins can manage templates" ON email_templates;
CREATE POLICY "templates_manage" ON email_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- AUDIT_LOGS: Admin read, system write
DROP POLICY IF EXISTS "Admins can read audit logs" ON audit_logs;
CREATE POLICY "audit_select" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT WITH CHECK (true);

-- FAQS: Public read, admin write
DROP POLICY IF EXISTS "Anyone can read faqs" ON faqs;
DROP POLICY IF EXISTS "Admins can manage faqs" ON faqs;
CREATE POLICY "faqs_select" ON faqs FOR SELECT USING (true);
CREATE POLICY "faqs_manage" ON faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
);

-- ROLE_PERMISSIONS: Read for all, manage for super_admin
-- (Already created in roles_permissions migration)

-- ============================================================
-- ADD MISSING INDEXES for foreign keys
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_registration_applications_reviewed_by
  ON registration_applications(reviewed_by) WHERE reviewed_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_registration_applications_user_id
  ON registration_applications(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_site_media_uploaded_by
  ON site_media(uploaded_by) WHERE uploaded_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_member_id
  ON payments(member_id) WHERE member_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id
  ON audit_logs(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_logs_module
  ON audit_logs(module) WHERE module IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read
  ON notifications(user_id, read);

CREATE INDEX IF NOT EXISTS idx_notifications_category
  ON notifications(category) WHERE category IS NOT NULL;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_email_role
  ON profiles(email, role);

CREATE INDEX IF NOT EXISTS idx_profiles_account_status
  ON profiles(account_status) WHERE deleted_at IS NULL;
