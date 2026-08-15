-- Nuke and rebuild communication system

-- Tables
CREATE TABLE IF NOT EXISTS fan_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  participant text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS fan_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES fan_conversations(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL CHECK (sender IN ('member', 'admin')),
  text text NOT NULL DEFAULT '',
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS business_enquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  enquiry_type text,
  subject text,
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS business_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_id uuid REFERENCES business_enquiries(id) ON DELETE CASCADE NOT NULL,
  sender text NOT NULL CHECK (sender IN ('member', 'admin')),
  text text NOT NULL DEFAULT '',
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fan_conv_user ON fan_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_fan_conv_status ON fan_conversations(status);
CREATE INDEX IF NOT EXISTS idx_fan_msg_conv ON fan_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_fan_msg_sender ON fan_messages(sender);
CREATE INDEX IF NOT EXISTS idx_biz_enq_user ON business_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_biz_enq_status ON business_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_biz_msg_enq ON business_messages(enquiry_id);

-- RLS
ALTER TABLE fan_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_messages ENABLE ROW LEVEL SECURITY;

-- fan_conversations policies
CREATE POLICY "Members read own conversations" ON fan_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins read all conversations" ON fan_conversations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Members create own conversations" ON fan_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins create conversations" ON fan_conversations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Members update own conversations" ON fan_conversations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins update all conversations" ON fan_conversations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins delete conversations" ON fan_conversations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- fan_messages policies
CREATE POLICY "Members read own messages" ON fan_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fan_conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins read all messages" ON fan_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Authenticated insert messages" ON fan_messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins update messages" ON fan_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Members mark own messages read" ON fan_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM fan_conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins delete messages" ON fan_messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- business_enquiries policies
CREATE POLICY "Anyone can create enquiries" ON business_enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins read all enquiries" ON business_enquiries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Members read own enquiries" ON business_enquiries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins update enquiries" ON business_enquiries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Admins delete enquiries" ON business_enquiries
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- business_messages policies
CREATE POLICY "Anyone can insert business messages" ON business_messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins read all business messages" ON business_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Members read own business messages" ON business_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM business_enquiries
      WHERE id = enquiry_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins update business messages" ON business_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid() AND is_active = true)
  );

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fan_conversations_updated_at
  BEFORE UPDATE ON fan_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_enquiries_updated_at
  BEFORE UPDATE ON business_enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
