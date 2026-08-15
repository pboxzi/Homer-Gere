CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'fan_messages' THEN
    UPDATE fan_conversations
    SET last_message = COALESCE(NULLIF(NEW.text, ''), CASE WHEN NEW.media_type = 'image' THEN '[Image]' WHEN NEW.media_type = 'video' THEN '[Video]' ELSE '[Attachment]' END),
        last_message_at = NEW.created_at,
        unread_count = CASE WHEN NEW.sender = 'admin' THEN unread_count + 1 ELSE unread_count END,
        updated_at = now()
    WHERE id = NEW.conversation_id;
  ELSIF TG_TABLE_NAME = 'business_messages' THEN
    UPDATE business_enquiries
    SET last_message = COALESCE(NULLIF(NEW.text, ''), CASE WHEN NEW.media_type = 'image' THEN '[Image]' WHEN NEW.media_type = 'video' THEN '[Video]' ELSE '[Attachment]' END),
        last_message_at = NEW.created_at,
        unread_count = CASE WHEN NEW.sender = 'admin' THEN unread_count + 1 ELSE unread_count END,
        updated_at = now()
    WHERE id = NEW.enquiry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_fan_message AFTER INSERT ON fan_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

CREATE TRIGGER trg_business_message AFTER INSERT ON business_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();
