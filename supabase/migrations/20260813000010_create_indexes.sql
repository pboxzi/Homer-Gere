-- Migration: Create performance indexes
-- Created: 2026-08-13

BEGIN;

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Admins
CREATE INDEX idx_admins_user_id ON admins(user_id);
CREATE INDEX idx_admins_admin_role ON admins(admin_role);

-- Registration applications
CREATE INDEX idx_registration_applications_status ON registration_applications(status);
CREATE INDEX idx_registration_applications_email ON registration_applications(email);

-- Memberships
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_plan_id ON memberships(plan_id);

-- Membership plans
CREATE INDEX idx_membership_plans_slug ON membership_plans(slug);
CREATE INDEX idx_membership_plans_status ON membership_plans(status);

-- Journey entries
CREATE INDEX idx_journey_entries_year ON journey_entries(year);

-- Journal articles
CREATE INDEX idx_journal_articles_slug ON journal_articles(slug);
CREATE INDEX idx_journal_articles_category ON journal_articles(category);
CREATE INDEX idx_journal_articles_status ON journal_articles(status);
CREATE INDEX idx_journal_articles_published_date ON journal_articles(published_date DESC);

-- Filmography
CREATE INDEX idx_filmography_entries_year ON filmography_entries(year);

-- Experiences
CREATE INDEX idx_experiences_type ON experiences(type);

-- Experience requests
CREATE INDEX idx_experience_requests_user_id ON experience_requests(user_id);
CREATE INDEX idx_experience_requests_status ON experience_requests(status);

-- Projects
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_year ON projects(year);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);

-- Project media
CREATE INDEX idx_project_media_project_id ON project_media(project_id);

-- Project videos
CREATE INDEX idx_project_videos_project_id ON project_videos(project_id);

-- Project recognition
CREATE INDEX idx_project_recognition_project_id ON project_recognition(project_id);

-- Gallery photos
CREATE INDEX idx_gallery_photos_category ON gallery_photos(category);
CREATE INDEX idx_gallery_photos_collection_id ON gallery_photos(collection_id);
CREATE INDEX idx_gallery_photos_featured ON gallery_photos(featured);

-- Fan conversations
CREATE INDEX idx_fan_conversations_user_id ON fan_conversations(user_id);
CREATE INDEX idx_fan_conversations_status ON fan_conversations(status);

-- Fan messages
CREATE INDEX idx_fan_messages_conversation_id ON fan_messages(conversation_id);

-- Business enquiries
CREATE INDEX idx_business_enquiries_user_id ON business_enquiries(user_id);
CREATE INDEX idx_business_enquiries_status ON business_enquiries(status);

-- Business messages
CREATE INDEX idx_business_messages_enquiry_id ON business_messages(enquiry_id);

-- Media
CREATE INDEX idx_media_videos_featured ON media_videos(featured);
CREATE INDEX idx_media_videos_date ON media_videos(date DESC);
CREATE INDEX idx_media_press_date ON media_press(date DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Site settings
CREATE INDEX idx_site_settings_category ON site_settings(category);

-- Email templates
CREATE INDEX idx_email_templates_name ON email_templates(name);
CREATE INDEX idx_email_templates_is_active ON email_templates(is_active);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

COMMIT;
