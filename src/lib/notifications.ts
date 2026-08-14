// ============================================================
// NOTIFICATION SERVICE
// Homer Gere Platform - Automated Notifications + Email
// ============================================================

import { notificationsRepository, auditLogsRepository } from './repositories';
import { emailService } from './email';
import type { NotificationType } from '../types/database';

interface NotifyParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  priority?: string;
  category?: string;
  emailTo?: string;
  emailTemplate?: string;
  emailVariables?: Record<string, string>;
  auditModule?: string;
  auditAction?: string;
  auditUserId?: string | null;
  auditRecordId?: string | null;
}

/**
 * Create an in-app notification and optionally send an email + audit log.
 */
export async function notify(params: NotifyParams): Promise<void> {
  const {
    userId,
    type,
    title,
    message,
    link,
    priority = 'normal',
    category,
    emailTo,
    emailTemplate,
    emailVariables,
    auditModule,
    auditAction,
    auditUserId,
    auditRecordId,
  } = params;

  // 1. Create in-app notification
  try {
    await notificationsRepository.create({
      user_id: userId,
      type,
      title,
      message,
      link: link || null,
      read: false,
      read_at: null,
      priority,
      category: category || null,
      action_link: link || null,
      expires_at: null,
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }

  // 2. Send email if template provided
  if (emailTo && emailTemplate) {
    try {
      await emailService.send(emailTo, emailTemplate, emailVariables || {});
    } catch (err) {
      console.error('Failed to send notification email:', err);
    }
  }

  // 3. Create audit log if module provided
  if (auditModule && auditAction) {
    try {
      await auditLogsRepository.create({
        user_id: auditUserId || userId,
        action: auditAction as 'create' | 'update' | 'delete' | 'approve' | 'reject',
        table_name: auditModule,
        record_id: auditRecordId || null,
        old_data: null,
        new_data: { notification_title: title, notification_message: message },
        module: auditModule,
      });
    } catch (err) {
      console.error('Failed to create audit log:', err);
    }
  }
}

/**
 * Batch notify multiple users.
 */
export async function notifyBatch(userIds: string[], params: Omit<NotifyParams, 'userId'>): Promise<void> {
  await Promise.all(userIds.map(userId => notify({ ...params, userId })));
}

// ============================================================
// PRESET NOTIFICATION TEMPLATES
// ============================================================

export const notifyService = {
  // --- Membership Workflow ---
  async membershipRequestReceived(userId: string, requestData: { fullName: string; email: string; planName: string; requestNumber: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'New Membership Request',
      message: `${requestData.fullName} has requested a ${requestData.planName} membership (${requestData.requestNumber}).`,
      link: '/admin',
      priority: 'high',
      category: 'membership',
      emailTo: requestData.email,
      emailTemplate: 'membership_request_received',
      emailVariables: { full_name: requestData.fullName, plan_name: requestData.planName, request_number: requestData.requestNumber },
      auditModule: 'membership_requests',
      auditAction: 'create',
      auditRecordId: userId,
    });
  },

  async membershipRequestApproved(userId: string, data: { fullName: string; email: string; planName: string; amount: string; currency: string; paymentMethod: string; paymentInstructions: string; dueDate: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Membership Request Approved',
      message: `Your membership request for ${data.planName} has been approved. Please complete the payment.`,
      link: '/dashboard/payments',
      priority: 'high',
      category: 'membership',
      emailTo: data.email,
      emailTemplate: 'membership_request_approved',
      emailVariables: { full_name: data.fullName, plan_name: data.planName, amount: data.amount, currency: data.currency, payment_method: data.paymentMethod, payment_instructions: data.paymentInstructions, due_date: data.dueDate },
      auditModule: 'membership_requests',
      auditAction: 'approve',
      auditRecordId: userId,
    });
  },

  async membershipRequestRejected(userId: string, data: { fullName: string; email: string; rejectionReason: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Membership Request Update',
      message: `Your membership request has been reviewed. Please check your email for details.`,
      link: '/dashboard',
      category: 'membership',
      emailTo: data.email,
      emailTemplate: 'membership_request_rejected',
      emailVariables: { full_name: data.fullName, rejection_reason: data.rejectionReason },
      auditModule: 'membership_requests',
      auditAction: 'reject',
      auditRecordId: userId,
    });
  },

  // --- Payment Workflow ---
  async paymentRequestCreated(userId: string, data: { email: string; fullName: string; amount: string; currency: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Payment Request',
      message: `A payment request for ${data.amount} ${data.currency} has been created.`,
      link: '/dashboard/payments',
      priority: 'high',
      category: 'payment',
      emailTo: data.email,
      emailTemplate: 'payment_instructions_ready',
      emailVariables: { full_name: data.fullName, amount: data.amount, currency: data.currency, payment_instructions: '', due_date: '' },
    });
  },

  async paymentInstructionsSent(userId: string, data: { email: string; fullName: string; amount: string; currency: string; paymentInstructions: string; dueDate: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Payment Instructions Available',
      message: `Payment instructions for ${data.amount} ${data.currency} are now available.`,
      link: '/dashboard/payments',
      priority: 'high',
      category: 'payment',
      emailTo: data.email,
      emailTemplate: 'payment_instructions_ready',
      emailVariables: { full_name: data.fullName, amount: data.amount, currency: data.currency, payment_instructions: data.paymentInstructions, due_date: data.dueDate },
    });
  },

  async paymentSubmitted(userId: string, data: { email: string; fullName: string; amount: string; currency: string; transactionReference: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Payment Submitted',
      message: `Your payment of ${data.amount} ${data.currency} has been submitted for review.`,
      link: '/dashboard/payments',
      category: 'payment',
      emailTo: data.email,
      emailTemplate: 'payment_submitted',
      emailVariables: { full_name: data.fullName, amount: data.amount, currency: data.currency, transaction_reference: data.transactionReference },
    });
  },

  async paymentApproved(userId: string, data: { email: string; fullName: string; planName: string; cardNumber: string; expiryDate: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Payment Approved',
      message: `Your payment has been approved. Your ${data.planName} membership is now active!`,
      link: '/dashboard/membership',
      priority: 'high',
      category: 'payment',
      emailTo: data.email,
      emailTemplate: 'payment_approved',
      emailVariables: { full_name: data.fullName, plan_name: data.planName, card_number: data.cardNumber, expiry_date: data.expiryDate },
      auditModule: 'payments',
      auditAction: 'approve',
      auditRecordId: userId,
    });
  },

  async paymentRejected(userId: string, data: { email: string; fullName: string; reason: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Payment Rejected',
      message: `Your payment has been rejected. Please check your email for details.`,
      link: '/dashboard/payments',
      category: 'payment',
      emailTo: data.email,
      emailTemplate: 'membership_request_rejected',
      emailVariables: { full_name: data.fullName, rejection_reason: data.reason },
      auditModule: 'payments',
      auditAction: 'reject',
      auditRecordId: userId,
    });
  },

  // --- Membership Activation ---
  async membershipActivated(userId: string, data: { email: string; fullName: string; planName: string; cardNumber: string; expiryDate: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Membership Activated!',
      message: `Welcome! Your ${data.planName} membership is now active. Card: ${data.cardNumber}`,
      link: '/dashboard/membership',
      priority: 'high',
      category: 'membership',
      emailTo: data.email,
      emailTemplate: 'membership_activated',
      emailVariables: { full_name: data.fullName, plan_name: data.planName, card_number: data.cardNumber, expiry_date: data.expiryDate },
      auditModule: 'memberships',
      auditAction: 'update',
      auditRecordId: userId,
    });
  },

  async membershipExpiring(userId: string, data: { email: string; fullName: string; planName: string; expiryDate: string; daysRemaining: number }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Membership Expiring Soon',
      message: `Your ${data.planName} membership expires in ${data.daysRemaining} days. Please renew.`,
      link: '/dashboard/membership',
      priority: 'high',
      category: 'membership',
      emailTo: data.email,
      emailTemplate: 'membership_expiring',
      emailVariables: { full_name: data.fullName, plan_name: data.planName, expiry_date: data.expiryDate, days_remaining: String(data.daysRemaining) },
    });
  },

  // --- Experience Workflow ---
  async experienceRequestSubmitted(userId: string, data: { email: string; fullName: string; experienceType: string; preferredDate: string }) {
    return notify({
      userId,
      type: 'experience',
      title: 'Experience Request Submitted',
      message: `Your ${data.experienceType} request for ${data.preferredDate} has been submitted for review.`,
      link: '/dashboard/experiences',
      category: 'experience',
      emailTo: data.email,
      emailTemplate: 'experience_request_submitted',
      emailVariables: { full_name: data.fullName, experience_type: data.experienceType, preferred_date: data.preferredDate },
      auditModule: 'experience_requests',
      auditAction: 'create',
      auditRecordId: userId,
    });
  },

  async experienceApproved(userId: string, data: { email: string; fullName: string; experienceType: string; eventDate: string }) {
    return notify({
      userId,
      type: 'experience',
      title: 'Experience Approved',
      message: `Your ${data.experienceType} request has been approved!`,
      link: '/dashboard/experiences',
      priority: 'high',
      category: 'experience',
      emailTo: data.email,
      emailTemplate: 'experience_approved',
      emailVariables: { full_name: data.fullName, experience_type: data.experienceType, event_date: data.eventDate },
      auditModule: 'experience_requests',
      auditAction: 'approve',
      auditRecordId: userId,
    });
  },

  async experienceConfirmed(userId: string, data: { email: string; fullName: string; experienceType: string; eventDate: string; eventLocation: string }) {
    return notify({
      userId,
      type: 'experience',
      title: 'Experience Confirmed!',
      message: `Your ${data.experienceType} on ${data.eventDate} is confirmed!`,
      link: '/dashboard/experiences',
      priority: 'high',
      category: 'experience',
      emailTo: data.email,
      emailTemplate: 'experience_confirmed',
      emailVariables: { full_name: data.fullName, experience_type: data.experienceType, event_date: data.eventDate, event_location: data.eventLocation },
      auditModule: 'experience_requests',
      auditAction: 'update',
      auditRecordId: userId,
    });
  },

  async experiencePaymentRequired(userId: string, data: { email: string; fullName: string; experienceType: string; amount: string; currency: string; paymentInstructions: string }) {
    return notify({
      userId,
      type: 'experience',
      title: 'Payment Required for Experience',
      message: `To confirm your ${data.experienceType}, please complete the payment of ${data.amount} ${data.currency}.`,
      link: '/dashboard/payments',
      priority: 'high',
      category: 'experience',
      emailTo: data.email,
      emailTemplate: 'experience_payment_required',
      emailVariables: { full_name: data.fullName, experience_type: data.experienceType, amount: data.amount, currency: data.currency, payment_instructions: data.paymentInstructions },
    });
  },

  async experienceRejected(userId: string, data: { email: string; fullName: string; experienceType: string; rejectionReason: string }) {
    return notify({
      userId,
      type: 'experience',
      title: 'Experience Request Update',
      message: `Your ${data.experienceType} request has been reviewed. Please check your email for details.`,
      link: '/dashboard/experiences',
      category: 'experience',
      emailTo: data.email,
      emailTemplate: 'experience_rejected',
      emailVariables: { full_name: data.fullName, experience_type: data.experienceType, rejection_reason: data.rejectionReason },
      auditModule: 'experience_requests',
      auditAction: 'reject',
      auditRecordId: userId,
    });
  },

  // --- Payment Needs Info ---
  async paymentNeedsInfo(userId: string, data: { email: string; fullName: string; paymentType: string; amount: string; currency: string; reason: string }) {
    return notify({
      userId,
      type: 'membership',
      title: 'Payment Information Needed',
      message: `Additional information is required for your ${data.paymentType} payment of ${data.amount} ${data.currency}.`,
      link: '/dashboard/payments',
      priority: 'high',
      category: 'payment',
      emailTo: data.email,
      emailTemplate: 'payment_needs_info',
      emailVariables: { full_name: data.fullName, payment_type: data.paymentType, amount: data.amount, currency: data.currency, reason: data.reason },
      auditModule: 'payments',
      auditAction: 'update',
      auditRecordId: userId,
    });
  },

  // --- Membership Card Actions ---
  async membershipCardUpdated(userId: string, data: { email: string; fullName: string; cardNumber: string; action: string; reason: string }) {
    return notify({
      userId,
      type: 'membership',
      title: `Membership Card ${data.action}`,
      message: `Your membership card ${data.cardNumber} has been ${data.action.toLowerCase()}. ${data.reason}`,
      link: '/dashboard/membership-card',
      priority: 'high',
      category: 'membership',
      emailTo: data.email,
      emailTemplate: 'membership_card_updated',
      emailVariables: { full_name: data.fullName, card_number: data.cardNumber, action: data.action, reason: data.reason },
      auditModule: 'membership_cards',
      auditAction: 'update',
      auditRecordId: userId,
    });
  },

  // --- System ---
  async systemAnnouncement(userId: string, data: { email: string; fullName: string; title: string; message: string }) {
    return notify({
      userId,
      type: 'system',
      title: data.title,
      message: data.message,
      link: '/dashboard',
      priority: 'normal',
      category: 'system',
      emailTo: data.email,
      emailTemplate: 'system_announcement',
      emailVariables: { full_name: data.fullName, title: data.title, message: data.message },
      auditModule: 'system',
      auditAction: 'update',
    });
  },
};
