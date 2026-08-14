-- ============================================================
-- PHASE 4: Email Templates & Seed Data
-- Templates for membership, payment, and experience workflows
-- ============================================================

BEGIN;

-- Membership Request Received
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'membership_request_received',
  'Your Membership Request Has Been Received — Homer Gere Club',
  '<h2>Hello {{full_name}},</h2><p>Thank you for your interest in joining the Homer Gere Club!</p><p>We have received your membership request for the <strong>{{plan_name}}</strong> plan.</p><p><strong>Request Number:</strong> {{request_number}}</p><p>Our team will review your application and get back to you shortly.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","plan_name","request_number"]'::jsonb,
  true
);

-- Membership Request Approved
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'membership_request_approved',
  'Membership Request Approved — Payment Instructions',
  '<h2>Hello {{full_name}},</h2><p>Great news! Your membership request for <strong>{{plan_name}}</strong> has been approved.</p><p>To activate your membership, please complete the payment:</p><div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;"><p><strong>Amount:</strong> {{amount}} {{currency}}</p><p><strong>Payment Method:</strong> {{payment_method}}</p><p><strong>Instructions:</strong> {{payment_instructions}}</p><p><strong>Due Date:</strong> {{due_date}}</p></div><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","plan_name","amount","currency","payment_method","payment_instructions","due_date"]'::jsonb,
  true
);

-- Membership Request Rejected
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'membership_request_rejected',
  'Membership Request Update — Homer Gere Club',
  '<h2>Hello {{full_name}},</h2><p>Thank you for your interest in the Homer Gere Club.</p><p>After careful review, we are unable to approve your membership request at this time.</p><p><strong>Reason:</strong> {{rejection_reason}}</p><p>If you believe this was an error, please contact our support team.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","rejection_reason"]'::jsonb,
  true
);

-- Payment Instructions Ready
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'payment_instructions_ready',
  'Payment Instructions for Your Membership — Homer Gere Club',
  '<h2>Hello {{full_name}},</h2><p>Your payment request is ready. Please find the payment instructions below:</p><div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;"><p><strong>Amount:</strong> {{amount}} {{currency}}</p><p><strong>Instructions:</strong> {{payment_instructions}}</p><p><strong>Due Date:</strong> {{due_date}}</p></div><p>After making the payment, please submit your proof of payment through the dashboard.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","amount","currency","payment_instructions","due_date"]'::jsonb,
  true
);

-- Payment Submitted
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'payment_submitted',
  'Payment Submission Received — Homer Gere Club',
  '<h2>Hello {{full_name}},</h2><p>We have received your payment submission.</p><div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;"><p><strong>Amount:</strong> {{amount}} {{currency}}</p><p><strong>Transaction Reference:</strong> {{transaction_reference}}</p></div><p>Our team will verify your payment shortly.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","amount","currency","transaction_reference"]'::jsonb,
  true
);

-- Payment Approved
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'payment_approved',
  'Payment Approved — Membership Activated!',
  '<h2>Hello {{full_name}},</h2><p>Your payment has been verified and approved!</p><p>Your <strong>{{plan_name}}</strong> membership is now <strong>active</strong>.</p><div style="background:#f0f9ff;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #A6852F;"><p><strong>Card Number:</strong> {{card_number}}</p><p><strong>Valid Until:</strong> {{expiry_date}}</p></div><p>Welcome to the Homer Gere Club!</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","plan_name","card_number","expiry_date"]'::jsonb,
  true
);

-- Membership Activated
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'membership_activated',
  'Welcome to Homer Gere Club!',
  '<h2>Welcome, {{full_name}}!</h2><p>Your <strong>{{plan_name}}</strong> membership has been activated.</p><div style="background:#f0f9ff;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #A6852F;"><p><strong>Card Number:</strong> {{card_number}}</p><p><strong>Valid Until:</strong> {{expiry_date}}</p></div><p>As a member, you now have access to exclusive content and priority booking.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","plan_name","card_number","expiry_date"]'::jsonb,
  true
);

-- Membership Expiring
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'membership_expiring',
  'Your Membership is Expiring Soon — Homer Gere Club',
  '<h2>Hello {{full_name}},</h2><p>Your <strong>{{plan_name}}</strong> membership will expire on <strong>{{expiry_date}}</strong>.</p><p>You have <strong>{{days_remaining}} days</strong> remaining.</p><p>Please renew your membership before the expiry date.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","plan_name","expiry_date","days_remaining"]'::jsonb,
  true
);

-- Experience Approved
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'experience_approved',
  'Your Experience Request Has Been Approved!',
  '<h2>Hello {{full_name}},</h2><p>Great news! Your request for <strong>{{experience_type}}</strong> has been approved.</p><div style="background:#f0f9ff;padding:20px;border-radius:8px;margin:20px 0;"><p><strong>Experience:</strong> {{experience_type}}</p><p><strong>Preferred Date:</strong> {{event_date}}</p></div><p>A payment request will be sent to you shortly.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","experience_type","event_date"]'::jsonb,
  true
);

-- Experience Confirmed
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'experience_confirmed',
  'Experience Confirmed — You are All Set!',
  '<h2>Hello {{full_name}},</h2><p>Your <strong>{{experience_type}}</strong> experience has been confirmed!</p><div style="background:#f0f9ff;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #A6852F;"><p><strong>Experience:</strong> {{experience_type}}</p><p><strong>Date:</strong> {{event_date}}</p><p><strong>Location:</strong> {{event_location}}</p></div><p>Please arrive 15 minutes early.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","experience_type","event_date","event_location"]'::jsonb,
  true
);

-- Experience Payment Required
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'experience_payment_required',
  'Payment Required for Your Experience — Homer Gere Club',
  '<h2>Hello {{full_name}},</h2><p>To confirm your <strong>{{experience_type}}</strong> booking, please complete the payment.</p><div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;"><p><strong>Amount:</strong> {{amount}} {{currency}}</p><p><strong>Instructions:</strong> {{payment_instructions}}</p></div><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","experience_type","amount","currency","payment_instructions"]'::jsonb,
  true
);

-- System Announcement
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'system_announcement',
  'Homer Gere Platform Announcement',
  '<h2>Hello {{full_name}},</h2><div style="background:#fffbeb;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #A6852F;"><h3>{{title}}</h3><p>{{message}}</p></div><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","title","message"]'::jsonb,
  true
);

-- Security Alert
INSERT INTO email_templates (name, subject, html_body, variables, is_active)
VALUES (
  'security_alert',
  'Security Alert — Homer Gere Platform',
  '<h2>Hello {{full_name}},</h2><div style="background:#fef2f2;padding:20px;border-radius:8px;margin:20px 0;border-left:4px solid #dc2626;"><h3>Security Alert</h3><p>{{message}}</p></div><p>If you did not perform this action, please secure your account immediately.</p><p>Best regards,<br/>The Homer Gere Team</p>',
  '["full_name","message"]'::jsonb,
  true
);

COMMIT;
