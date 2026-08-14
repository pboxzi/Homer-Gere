-- Newsletter subscribers table for Phase 7
-- Stores email subscriptions from the homepage newsletter section

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'homepage' NOT NULL
);

-- Index for quick email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active);

-- RLS: only service role can write, anonymous can read own subscription
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Allow anonymous insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read their own subscriptions
CREATE POLICY "Users read own subscriptions" ON newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role full access
CREATE POLICY "Service role full access" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');
