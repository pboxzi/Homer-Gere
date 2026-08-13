-- Migration: Create all enum types
-- Created: 2026-08-13

BEGIN;

-- User roles
CREATE TYPE user_role AS ENUM ('pending', 'member', 'admin', 'super_admin');

-- Admin roles
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Membership
CREATE TYPE membership_status AS ENUM ('none', 'pending', 'active', 'expired', 'cancelled');

-- Registration / Application
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Experience
CREATE TYPE experience_status AS ENUM ('pending', 'under_review', 'approved', 'declined', 'completed');

-- Chat
CREATE TYPE chat_type AS ENUM ('fan', 'business');
CREATE TYPE conversation_status AS ENUM ('open', 'in_progress', 'closed');
CREATE TYPE message_sender AS ENUM ('user', 'member', 'homer', 'system', 'admin');

-- Content
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'scheduled');

-- Payment
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Notifications
CREATE TYPE notification_type AS ENUM ('membership', 'reply', 'experience', 'journal', 'system', 'message', 'booking');

-- Media
CREATE TYPE media_type AS ENUM ('image', 'video', 'document');

-- Projects
CREATE TYPE project_type AS ENUM ('film', 'series', 'short', 'documentary');
CREATE TYPE project_status AS ENUM ('released', 'in_production', 'announced', 'post_production');

-- Gallery
CREATE TYPE gallery_category AS ENUM ('premiere', 'behind-the-scenes', 'portraits', 'events', 'on-set', 'press', 'personal', 'editorial');

-- Journal
CREATE TYPE journal_category AS ENUM ('career-reflections', 'industry-insights', 'personal-stories', 'behind-the-scenes', 'advice', 'announcements');

-- Experience categories
CREATE TYPE experience_category AS ENUM ('meet-and-greet', 'fan-event', 'virtual-session', 'signed-items', 'charity-auction', 'set-visit', 'custom-experience', 'business');

-- Contact
CREATE TYPE department AS ENUM ('general', 'business', 'membership', 'fan-relations', 'press', 'technical', 'experiences');

-- Audit
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'approve', 'reject', 'export');

COMMIT;
