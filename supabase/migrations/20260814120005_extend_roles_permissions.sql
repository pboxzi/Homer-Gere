-- ============================================================
-- PHASE 1: Extend admin_role enum with new management roles
-- ============================================================

-- Add new enum values (safe additive)
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'media_manager';
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'membership_manager';
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'support_manager';

-- Create a permissions registry table for role-based access
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(role, permission)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Super admin and admin get all permissions automatically via function
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  is_authorized BOOLEAN := false;
BEGIN
  -- Check if user is super_admin or admin via admins table
  SELECT admin_role INTO user_role FROM admins WHERE admins.user_id = has_permission.user_id AND is_active = true;

  IF user_role IS NULL THEN
    RETURN false;
  END IF;

  -- Super admin and admin have all permissions
  IF user_role IN ('super_admin', 'admin') THEN
    RETURN true;
  END IF;

  -- Check role_permissions table for custom roles
  SELECT EXISTS(
    SELECT 1 FROM role_permissions WHERE role = user_role AND permission = permission_name
  ) INTO is_authorized;

  RETURN is_authorized;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Seed default permissions for each role
INSERT INTO role_permissions (role, permission) VALUES
  -- Content Manager
  ('content_manager', 'content.read'),
  ('content_manager', 'content.write'),
  ('content_manager', 'content.delete'),
  ('content_manager', 'journey.read'),
  ('content_manager', 'journey.write'),
  ('content_manager', 'journal.read'),
  ('content_manager', 'journal.write'),
  ('content_manager', 'journal.delete'),
  ('content_manager', 'faqs.read'),
  ('content_manager', 'faqs.write'),
  ('content_manager', 'faqs.delete'),
  ('content_manager', 'projects.read'),
  ('content_manager', 'projects.write'),
  ('content_manager', 'projects.delete'),
  -- Media Manager
  ('media_manager', 'media.read'),
  ('media_manager', 'media.upload'),
  ('media_manager', 'media.delete'),
  ('media_manager', 'media.replace'),
  ('media_manager', 'gallery.read'),
  ('media_manager', 'gallery.write'),
  ('media_manager', 'gallery.delete'),
  ('media_manager', 'images.read'),
  ('media_manager', 'images.upload'),
  ('media_manager', 'images.delete'),
  -- Membership Manager
  ('membership_manager', 'members.read'),
  ('membership_manager', 'members.write'),
  ('membership_manager', 'members.suspend'),
  ('membership_manager', 'plans.read'),
  ('membership_manager', 'plans.write'),
  ('membership_manager', 'plans.delete'),
  ('membership_manager', 'applications.read'),
  ('membership_manager', 'applications.approve'),
  ('membership_manager', 'applications.reject'),
  ('membership_manager', 'memberships.read'),
  ('membership_manager', 'memberships.write'),
  ('membership_manager', 'experience_requests.read'),
  ('membership_manager', 'experience_requests.approve'),
  ('membership_manager', 'experience_requests.decline'),
  -- Support Manager
  ('support_manager', 'chat.read'),
  ('support_manager', 'chat.reply'),
  ('support_manager', 'chat.archive'),
  ('support_manager', 'chat.delete'),
  ('support_manager', 'enquiries.read'),
  ('support_manager', 'enquiries.reply'),
  ('support_manager', 'enquiries.update_status'),
  ('support_manager', 'notifications.read'),
  ('support_manager', 'notifications.create'),
  ('support_manager', 'notifications.delete'),
  -- Moderator (backward compatible)
  ('moderator', 'content.read'),
  ('moderator', 'chat.read'),
  ('moderator', 'chat.reply'),
  ('moderator', 'members.read'),
  ('moderator', 'notifications.read')
ON CONFLICT (role, permission) DO NOTHING;

-- RLS for role_permissions
CREATE POLICY "Admins can read role permissions" ON role_permissions
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage role permissions" ON role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.admin_role = 'super_admin'
      AND admins.is_active = true
    )
  );
