-- ============================================================
-- Phase 8: Communication System Stabilization
-- ============================================================

-- 1. Add read/read_at to fan_messages
ALTER TABLE fan_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
ALTER TABLE fan_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- 2. Add read/read_at to business_messages
ALTER TABLE business_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
ALTER TABLE business_messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- 3. Add last_message columns to fan_conversations
ALTER TABLE fan_conversations ADD COLUMN IF NOT EXISTS last_message TEXT;
ALTER TABLE fan_conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;
ALTER TABLE fan_conversations ADD COLUMN IF NOT EXISTS unread_count INTEGER DEFAULT 0;

-- 4. Add last_message columns to business_enquiries
ALTER TABLE business_enquiries ADD COLUMN IF NOT EXISTS last_message TEXT;
ALTER TABLE business_enquiries ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;
ALTER TABLE business_enquiries ADD COLUMN IF NOT EXISTS unread_count INTEGER DEFAULT 0;

-- 5. Add soft delete to fan_conversations
ALTER TABLE fan_conversations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE fan_conversations ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- 6. Add soft delete to business_enquiries
ALTER TABLE business_enquiries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE business_enquiries ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- ============================================================
-- Fix RLS Policies
-- ============================================================

-- Drop permissive INSERT policies
DROP POLICY IF EXISTS "fan_conv_insert" ON fan_conversations;
DROP POLICY IF EXISTS "fan_msg_insert" ON fan_messages;
DROP POLICY IF EXISTS "biz_insert" ON business_enquiries;
DROP POLICY IF EXISTS "biz_msg_insert" ON business_messages;

-- fan_conversations: Require auth for INSERT
CREATE POLICY "fan_conv_insert" ON fan_conversations
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      auth.uid() = user_id OR
      EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
    )
  );

-- fan_messages: Require auth for INSERT
CREATE POLICY "fan_msg_insert" ON fan_messages
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- fan_messages: Add DELETE policy for admins
DROP POLICY IF EXISTS "fan_msg_delete" ON fan_messages;
CREATE POLICY "fan_msg_delete" ON fan_messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- business_enquiries: Require auth for INSERT
CREATE POLICY "biz_insert" ON business_enquiries
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      auth.uid() = user_id OR
      EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
    )
  );

-- business_enquiries: Add DELETE policy for admins
DROP POLICY IF EXISTS "biz_delete" ON business_enquiries;
CREATE POLICY "biz_delete" ON business_enquiries
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- business_messages: Require auth for INSERT
CREATE POLICY "biz_msg_insert" ON business_messages
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- business_messages: Add DELETE policy for admins
DROP POLICY IF EXISTS "biz_msg_delete" ON business_messages;
CREATE POLICY "biz_msg_delete" ON business_messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- ============================================================
-- Indexes for new columns
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_fan_messages_is_read ON fan_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_fan_conversations_last_message_at ON fan_conversations(last_message_at);
CREATE INDEX IF NOT EXISTS idx_business_messages_is_read ON business_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_business_enquiries_last_message_at ON business_enquiries(last_message_at);
CREATE INDEX IF NOT EXISTS idx_fan_conversations_deleted_at ON fan_conversations(deleted_at);
CREATE INDEX IF NOT EXISTS idx_business_enquiries_deleted_at ON business_enquiries(deleted_at);

-- ============================================================
-- Trigger: Update fan_conversations last_message on new message
-- ============================================================
CREATE OR REPLACE FUNCTION update_fan_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE fan_conversations
  SET last_message = NEW.text,
      last_message_at = NEW.created_at,
      unread_count = CASE
        WHEN NEW.sender IN ('member') THEN unread_count + 1
        ELSE unread_count
      END,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_fan_conversation_last_message ON fan_messages;
CREATE TRIGGER trigger_update_fan_conversation_last_message
  AFTER INSERT ON fan_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_fan_conversation_last_message();

-- ============================================================
-- Trigger: Update business_enquiries last_message on new message
-- ============================================================
CREATE OR REPLACE FUNCTION update_business_enquiry_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE business_enquiries
  SET last_message = NEW.text,
      last_message_at = NEW.created_at,
      unread_count = CASE
        WHEN NEW.sender IN ('member') THEN unread_count + 1
        ELSE unread_count
      END,
      updated_at = NOW()
  WHERE id = NEW.enquiry_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_business_enquiry_last_message ON business_messages;
CREATE TRIGGER trigger_update_business_enquiry_last_message
  AFTER INSERT ON business_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_business_enquiry_last_message();
