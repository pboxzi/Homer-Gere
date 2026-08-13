import { supabase } from './supabase';

// ============================================================
// Email Service — calls the send-email Edge Function
// ============================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

interface SendEmailParams {
  to: string;
  templateName: string;
  variables?: Record<string, string>;
  subject?: string;
  html?: string;
  text?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send an email via the send-email Edge Function.
 * The Resend API key is stored server-side — never exposed to the client.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return { success: false, error: 'Not authenticated' };
    }

    const response = await fetch(`${FUNCTIONS_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Email send failed: ${data.error}`, data.details);
      return { success: false, error: data.error || 'Failed to send email' };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.error('Email service error:', err);
    return { success: false, error: 'Network error sending email' };
  }
}

// ============================================================
// Convenience functions for each email type
// ============================================================

export const emailService = {
  // --- Registration ---
  async registrationReceived(to: string, firstName: string) {
    return sendEmail({
      to,
      templateName: 'registration-received',
      variables: { first_name: firstName },
    });
  },

  async registrationApproved(to: string, firstName: string) {
    return sendEmail({
      to,
      templateName: 'registration-approved',
      variables: {
        first_name: firstName,
        login_url: `${window.location.origin}/login`,
      },
    });
  },

  async registrationRejected(to: string, firstName: string, reason?: string) {
    return sendEmail({
      to,
      templateName: 'registration-rejected',
      variables: {
        first_name: firstName,
        reason: reason || 'Your application did not meet the current requirements.',
      },
    });
  },

  // --- Authentication ---
  async passwordReset(to: string, resetUrl: string) {
    return sendEmail({
      to,
      templateName: 'password-reset',
      variables: { reset_url: resetUrl },
    });
  },

  async passwordChanged(to: string, firstName: string) {
    return sendEmail({
      to,
      templateName: 'password-changed',
      variables: { first_name: firstName },
    });
  },

  // --- Membership ---
  async membershipApproved(to: string, firstName: string, tier: string) {
    return sendEmail({
      to,
      templateName: 'membership-approved',
      variables: {
        first_name: firstName,
        membership_tier: tier,
        dashboard_url: `${window.location.origin}/dashboard`,
      },
    });
  },

  async membershipUpgraded(to: string, firstName: string, oldTier: string, newTier: string) {
    return sendEmail({
      to,
      templateName: 'membership-upgraded',
      variables: {
        first_name: firstName,
        old_tier: oldTier,
        new_tier: newTier,
        dashboard_url: `${window.location.origin}/dashboard`,
      },
    });
  },

  async membershipRenewed(to: string, firstName: string, tier: string) {
    return sendEmail({
      to,
      templateName: 'membership-renewed',
      variables: {
        first_name: firstName,
        membership_tier: tier,
      },
    });
  },

  async membershipExpiring(to: string, firstName: string, tier: string, daysLeft: number) {
    return sendEmail({
      to,
      templateName: 'membership-expiring',
      variables: {
        first_name: firstName,
        membership_tier: tier,
        days_left: String(daysLeft),
        renew_url: `${window.location.origin}/membership`,
      },
    });
  },

  async membershipExpired(to: string, firstName: string, tier: string) {
    return sendEmail({
      to,
      templateName: 'membership-expired',
      variables: {
        first_name: firstName,
        membership_tier: tier,
        renew_url: `${window.location.origin}/membership`,
      },
    });
  },

  // --- Experiences ---
  async experienceRequestReceived(to: string, firstName: string, experienceTitle: string) {
    return sendEmail({
      to,
      templateName: 'experience-request-received',
      variables: {
        first_name: firstName,
        experience_title: experienceTitle,
      },
    });
  },

  async experienceRequestApproved(to: string, firstName: string, experienceTitle: string, details: string) {
    return sendEmail({
      to,
      templateName: 'experience-request-approved',
      variables: {
        first_name: firstName,
        experience_title: experienceTitle,
        details,
      },
    });
  },

  async experienceRequestDeclined(to: string, firstName: string, experienceTitle: string, reason?: string) {
    return sendEmail({
      to,
      templateName: 'experience-request-declined',
      variables: {
        first_name: firstName,
        experience_title: experienceTitle,
        reason: reason || 'The experience is currently unavailable.',
      },
    });
  },

  async experienceEventReminder(to: string, firstName: string, experienceTitle: string, date: string, location: string) {
    return sendEmail({
      to,
      templateName: 'experience-event-reminder',
      variables: {
        first_name: firstName,
        experience_title: experienceTitle,
        event_date: date,
        event_location: location,
      },
    });
  },

  // --- Chat ---
  async chatReplyFromHomer(to: string, firstName: string, messagePreview: string) {
    return sendEmail({
      to,
      templateName: 'chat-reply-homer',
      variables: {
        first_name: firstName,
        message_preview: messagePreview,
        chat_url: `${window.location.origin}/dashboard/chat`,
      },
    });
  },

  async chatReplyFromManagement(to: string, firstName: string, messagePreview: string) {
    return sendEmail({
      to,
      templateName: 'chat-reply-management',
      variables: {
        first_name: firstName,
        message_preview: messagePreview,
        chat_url: `${window.location.origin}/dashboard/chat`,
      },
    });
  },

  // --- Contact ---
  async contactAcknowledgement(to: string, name: string, subject: string) {
    return sendEmail({
      to,
      templateName: 'contact-acknowledgement',
      variables: {
        name,
        subject,
      },
    });
  },

  async businessEnquiryAcknowledgement(to: string, name: string, enquiryType: string) {
    return sendEmail({
      to,
      templateName: 'business-enquiry-acknowledgement',
      variables: {
        name,
        enquiry_type: enquiryType,
      },
    });
  },

  // --- Newsletter (future-ready) ---
  async newsletter(to: string, firstName: string, content: string) {
    return sendEmail({
      to,
      templateName: 'newsletter',
      variables: {
        first_name: firstName,
        content,
      },
    });
  },

  // --- Generic send ---
  async send(to: string, templateName: string, variables?: Record<string, string>) {
    return sendEmail({ to, templateName, variables });
  },
};
