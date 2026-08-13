-- Migration: Seed initial data
-- Created: 2026-08-13

BEGIN;

-- ============================================================
-- MEMBERSHIP PLANS
-- ============================================================
INSERT INTO membership_plans (name, slug, description, price, currency, period, duration, badge, is_popular, features, cta_text, availability, requires_approval, members_count, status, sort_order) VALUES
('Supporter', 'supporter', 'Show your appreciation and get exclusive updates', 4.99, 'USD', 'monthly', 30, NULL, false,
 '["Exclusive behind-the-scenes content","Priority replies to messages","Supporter badge on profile","Early access to announcements"]',
 'Become a Supporter', 'available', false, 0, 'active', 1),

('Inner Circle', 'inner-circle', 'Get closer with exclusive access and direct communication', 9.99, 'USD', 'monthly', 30, 'INNER CIRCLE', true,
 '["Everything in Supporter","Direct chat access","Monthly exclusive content","Exclusive merchandise offers","Birthday special message","Private Q&A sessions","Inner Circle badge"]',
 'Join Inner Circle', 'waitlist', false, 0, 'active', 2),

('VIP Access', 'vip-access', 'The ultimate Homer Gere experience with premium perks', 24.99, 'USD', 'monthly', 30, 'VIP', false,
 '["Everything in Inner Circle","Personalized video messages","Priority meet & greet access","Annual signed merchandise","VIP event invitations","Direct phone line access","VIP badge & certificate"]',
 'Get VIP Access', 'waitlist', true, 0, 'active', 3);

-- ============================================================
-- SITE SETTINGS (default values)
-- ============================================================
INSERT INTO site_settings (category, settings) VALUES
('website', '{"siteName": "Homer Gere", "siteDescription": "Official website of Homer Gere - Actor, Producer, Advocate", "siteUrl": "https://homergere.com", "maintenanceMode": false}'),
('branding', '{"primaryColor": "#C8A96E", "secondaryColor": "#1A1A1A", "accentColor": "#D4AF37", "logo": null}'),
('security', '{"twoFactorEnabled": false, "sessionTimeout": 30, "maxLoginAttempts": 5}'),
('backup', '{"autoBackupEnabled": true, "backupFrequency": "daily", "retentionDays": 30}'),
('email', '{"provider": "resend", "fromName": "Homer Gere", "fromEmail": "noreply@homergere.com", "replyTo": "contact@homergere.com"}'),
('seo', '{"metaTitle": "Homer Gere - Official Website", "metaDescription": "The official website of Homer Gere. Explore his filmography, journal, and exclusive member experiences.", "ogImage": null, "googleAnalyticsId": null}'),
('integrations', '{"resendApiKey": null, "supabaseProjectId": "jqtpheututmeyitqlxxx"}');

-- ============================================================
-- EMAIL TEMPLATES
-- ============================================================
INSERT INTO email_templates (name, subject, html_body, text_body, variables, is_active) VALUES
('registration-approved', 'Your Registration Has Been Approved!',
 '<h1>Welcome to Homer Gere, {{first_name}}!</h1><p>Your registration has been approved. You can now log in to access your account.</p><p><a href="{{login_url}}">Log In Now</a></p>',
 'Welcome to Homer Gere, {{first_name}}! Your registration has been approved. Log in at: {{login_url}}',
 '["first_name", "login_url"]',
 true),

('registration-rejected', 'Registration Update',
 '<h1>Hi {{first_name}}</h1><p>Thank you for your interest. Unfortunately, your registration could not be approved at this time.</p><p>If you believe this is an error, please contact us.</p>',
 'Hi {{first_name}}, Unfortunately, your registration could not be approved at this time.',
 '["first_name", "reason"]',
 true),

('welcome-member', 'Welcome to the Inner Circle!',
 '<h1>Welcome, {{first_name}}!</h1><p>You are now a member of Homer Gere''s Inner Circle.</p><p>Your membership tier: <strong>{{membership_tier}}</strong></p>',
 'Welcome, {{first_name}}! You are now a member. Membership tier: {{membership_tier}}',
 '["first_name", "membership_tier"]',
 true),

('password-reset', 'Reset Your Password',
 '<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href="{{reset_url}}">Reset Password</a></p><p>This link expires in 1 hour.</p>',
 'Reset your password: {{reset_url}}',
 '["reset_url"]',
 true);

-- ============================================================
-- JOURNEY ENTRIES (from content.ts timeline)
-- ============================================================
INSERT INTO journey_entries (year, title, description, details, highlight, icon_name, sort_order) VALUES
(1992, 'Beginnings', 'Born in New York City', 'Born in New York City, Homer showed an early interest in storytelling and performance.', false, 'baby', 1),
(2004, 'First Steps', 'School theater productions', 'Homer discovered his passion for acting through school theater, taking on lead roles in numerous productions.', false, 'theater', 2),
(2008, 'Training', 'Formal acting education', 'Studied at prestigious performing arts conservatories, honing his craft in classical and contemporary techniques.', false, 'graduation', 3),
(2010, 'Debut', 'First professional role', 'Landed his first professional role in an independent film, marking the beginning of his career.', true, 'clapperboard', 4),
(2013, 'Breakthrough', 'First major film role', 'A supporting role in a critically acclaimed drama brought significant attention to his talent.', true, 'star', 5),
(2015, 'Recognition', 'First award nomination', 'Received his first major award nomination, establishing himself as a serious contender in the industry.', false, 'trophy', 6),
(2017, 'Leading Man', 'First leading role', 'Took on his first leading role in a feature film, proving his ability to carry a project.', true, 'crown', 7),
(2019, 'Producer', 'Production company launch', 'Founded his own production company, taking control of his creative vision.', false, 'building', 8),
(2020, 'Advocacy', 'Humanitarian work begins', 'Launched major humanitarian initiatives, using his platform for social good.', true, 'globe', 9),
(2022, 'Global', 'International recognition', 'Achieved international fame with a globally released film and multiple award wins.', true, 'rocket', 10),
(2024, 'Legacy', 'Industry icon', 'Recognized as one of the most influential figures in modern cinema.', true, 'crown', 11);

-- ============================================================
-- FILMOGRAPHY ENTRIES (from content.ts filmography)
-- ============================================================
INSERT INTO filmography_entries (title, role, year, status, description, type, sort_order) VALUES
('Neon Horizons', 'Jake Morrison', 2024, 'Released', 'A cyberpunk thriller exploring identity in a digitally connected world.', 'film', 1),
('Whispers in the Dark', 'Detective Miles Corbin', 2023, 'Released', 'A gripping psychological thriller about obsession and truth.', 'film', 2),
('The Last Frontier', 'Captain Ethan Hayes', 2022, 'Released', 'An epic survival drama set in the untamed wilderness.', 'film', 3),
('Echoes of Tomorrow', 'Dr. Adrian Cross', 2021, 'Released', 'A sci-fi drama about a scientist racing against time.', 'film', 4),
('Crimson Tide: Reckoning', 'Commander Marcus Stone', 2020, 'Released', 'A naval action sequel with intense combat sequences.', 'film', 5),
('Silent Witness', 'Attorney Daniel Park', 2019, 'Released', 'A courtroom drama about a high-profile murder trial.', 'film', 6),
('The Art of Redemption', 'Michael Torres', 2018, 'Released', 'A character-driven drama about second chances.', 'film', 7),
('Beyond the Stars', 'Colonel James Wright', 2017, 'Released', 'A space opera adventure across distant galaxies.', 'film', 8),
('Shadow Protocol', 'Agent Rex Morgan', 2016, 'Released', 'An action-packed espionage thriller.', 'film', 9),
('The Final Countdown', 'Sergeant Ryan Blake', 2015, 'Released', 'A war drama about the final days of conflict.', 'film', 10),
('The Gere Identity', 'Homer Gere', 2024, 'In Production', 'A biographical drama exploring the life and career of Homer Gere.', 'documentary', 11);

-- ============================================================
-- EXPERIENCE CATEGORIES (from content.ts experiences)
-- ============================================================
INSERT INTO experiences (title, description, details, price, icon_name, type, image, availability, whats_included, eligibility, duration, location, important_notes, sort_order) VALUES
('Meet & Greet', 'Personal one-on-one meeting with Homer Gere', 'An intimate opportunity to meet Homer Gere in person. Share a conversation, take photos, and create a lasting memory.', '$500', 'users', 'meet-and-greet', NULL, 'Limited Availability',
 '["Personal conversation with Homer","Professional photo opportunity","Autographed memorabilia","Exclusive gift bag"]',
 'Active Inner Circle or VIP members only', '30 minutes', 'Premium venues in major cities', 'Subject to availability. All meetings follow safety protocols.', 1),

('Fan Event', 'Exclusive fan events and gatherings', 'Join Homer Gere at exclusive fan events featuring Q&A sessions, screenings, and interactive experiences.', '$150', 'calendar', 'fan-event', NULL, 'Available',
 '["Interactive Q&A session","Group photo opportunity","Exclusive merchandise","Refreshments included"]',
 'All membership tiers welcome', '2-3 hours', 'Premium event venues', 'Advance registration required. Limited capacity.', 2),

('Virtual Session', 'Online video call with Homer Gere', 'Connect with Homer Gere from anywhere in the world through a private video call session.', '$200', 'video', 'virtual-session', NULL, 'Available',
 '["Private video call","Personalized conversation","Digital photo opportunity","Recorded session (optional)"]',
 'All membership tiers welcome', '20 minutes', 'Online (Zoom)', 'Stable internet connection required. Session recorded with permission.', 3),

('Signed Items', 'Personalized autographed memorabilia', 'Receive personally autographed items from Homer Gere, customized with your name or special message.', '$75', 'pen', 'signed-items', NULL, 'Available',
 '["Personalized autograph","Premium quality item","Certificate of authenticity","Protective packaging"]',
 'All membership tiers welcome', '1-2 weeks delivery', 'Shipped worldwide', 'Custom inscriptions limited to 30 words.', 4),

('Charity Auction', 'Bid on exclusive Homer Gere experiences', 'Participate in exclusive charity auctions featuring unique experiences and memorabilia.', NULL, 'heart', 'charity-auction', NULL, 'Periodic',
 '["Unique exclusive items","Money goes to charity","Certificate of authenticity","Special recognition"]',
 'All membership tiers welcome', 'Auction period varies', 'Online auction platform', 'All proceeds go to charitable causes.', 5),

('Set Visit', 'Visit the set of Homer Gere current project', 'Get an exclusive behind-the-scenes look at an active film production.', '$1000', 'film', 'set-visit', NULL, 'Very Limited',
 '["Behind-the-scenes tour","Meet crew members","Watch filming in progress","Complimentary lunch","Signed script pages"]',
 'VIP members only. Background check required.', 'Full day', 'Active film set', 'Strict NDA required. No photography allowed in certain areas.', 6),

('Custom Experience', 'Create your own unique experience', 'Work with our team to design a completely personalized experience with Homer Gere.', 'Contact for pricing', 'star', 'custom-experience', NULL, 'By Request',
 '["Fully customized itinerary","Personal concierge","Flexible scheduling","Premium accommodations"]',
 'VIP members and above', 'Customizable', 'Various locations', 'Planning requires 30-day advance notice.', 7),

('Business Consulting', 'Professional consultation for business collaborations', 'Discuss potential business ventures, endorsements, and professional collaborations.', '$2000', 'briefcase', 'business', NULL, 'By Appointment',
 '["One-on-one business meeting","Project proposal review","Strategic guidance","Follow-up consultation"]',
 'Business professionals and organizations only', '60 minutes', 'Premium office locations', 'NDA may be required for sensitive discussions.', 8);

-- ============================================================
-- MEDIA VIDEOS (from content.ts featuredVideos)
-- ============================================================
INSERT INTO media_videos (title, description, thumbnail, duration, date, source, category, url, featured, sort_order) VALUES
('Homer Gere - Exclusive Behind the Scenes', 'Go behind the scenes of Homer latest film production', NULL, '12:45', '2024-03-15', 'YouTube', 'Behind the Scenes', 'https://youtube.com/watch?v=example1', true, 1),
('The Art of Method Acting - Homer Gere Masterclass', 'Homer shares his techniques for preparing for roles', NULL, '25:30', '2024-02-20', 'YouTube', 'Interview', 'https://youtube.com/watch?v=example2', true, 2),
('Homer Gere - Career Retrospective', 'A look back at Homer most iconic roles', NULL, '18:20', '2024-01-10', 'YouTube', 'Documentary', 'https://youtube.com/watch?v=example3', true, 3),
('On Set with Homer Gere - Director Commentary', 'Homer discusses working with acclaimed directors', NULL, '15:45', '2023-12-05', 'YouTube', 'Behind the Scenes', 'https://youtube.com/watch?v=example4', false, 4),
('Homer Gere - Red Carpet Interview', 'Exclusive red carpet interview from the latest premiere', NULL, '8:30', '2023-11-20', 'Instagram', 'Interview', 'https://instagram.com/tv/example5', false, 5);

-- ============================================================
-- MEDIA PODCASTS (from content.ts featuredPodcasts)
-- ============================================================
INSERT INTO media_podcasts (episode_title, show_name, description, cover_art, date, url, sort_order) VALUES
('The Future of Independent Film', 'Homer Gere Podcast', 'Homer discusses the evolving landscape of independent cinema', NULL, '2024-03-10', 'https://podcasts.apple.com/example1', 1),
('From Stage to Screen: A Journey', 'Conversations with Homer', 'Homer shares his transition from theater to film', NULL, '2024-02-05', 'https://podcasts.apple.com/example2', 2),
('Advocacy Through Art', 'The Homer Gere Podcast', 'How Homer uses his platform for social change', NULL, '2024-01-15', 'https://podcasts.apple.com/example3', 3),
('Behind the Scenes Stories', 'Homer Gere Exclusive', 'Rare stories from behind the camera', NULL, '2023-12-20', 'https://podcasts.apple.com/example4', 4);

-- ============================================================
-- MEDIA PRESS (from content.ts featuredArticles)
-- ============================================================
INSERT INTO media_press (headline, publisher, date, summary, url, image, sort_order) VALUES
('Homer Gere: The Rise of a New Hollywood Icon', 'Vanity Fair', '2024-03-15', 'An in-depth look at Homer Gere''s journey to becoming one of Hollywood''s most respected actors.', 'https://vanityfair.com/example1', NULL, 1),
('The Transformation of Homer Gere', 'Rolling Stone', '2024-02-28', 'How Homer Gere reinvented himself for his latest role.', 'https://rollingstone.com/example2', NULL, 2),
('Homer Gere on Activism and Art', 'The New York Times', '2024-01-20', 'A candid conversation about using fame for good.', 'https://nytimes.com/example3', NULL, 3),
('Behind the-scenes with Homer Gere', 'Entertainment Weekly', '2023-12-10', 'Exclusive access to Homer Gere on set.', 'https://ew.com/example4', NULL, 4);

COMMIT;
