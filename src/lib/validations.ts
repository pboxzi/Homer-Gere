// ============================================================
// VALIDATION SCHEMAS
// Homer Gere Platform - Zod Schemas for Form Validation
// ============================================================

import { z } from 'zod';

// ============================================================
// REGISTRATION
// ============================================================

export const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),
  membershipTier: z.enum(['supporter', 'inner-circle', 'vip-access']).optional(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// ============================================================
// LOGIN
// ============================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// PROFILE UPDATE
// ============================================================

export const profileUpdateSchema = z.object({
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  avatar_url: z.string().url().optional().nullable(),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// ============================================================
// EXPERIENCE REQUEST
// ============================================================

export const experienceRequestSchema = z.object({
  experienceType: z.string().min(1, 'Experience type is required'),
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  country: z.string().optional(),
  organization: z.string().optional(),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  budget: z.string().optional(),
  purpose: z.string().optional(),
  additionalDetails: z.string().optional(),
});

export type ExperienceRequestFormData = z.infer<typeof experienceRequestSchema>;

// ============================================================
// BUSINESS ENQUIRY
// ============================================================

export const businessEnquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  enquiryType: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type BusinessEnquiryFormData = z.infer<typeof businessEnquirySchema>;

// ============================================================
// CONTACT MESSAGE
// ============================================================

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  department: z.enum(['general', 'business', 'membership', 'fan-relations', 'press', 'technical', 'experiences']),
  subject: z.string().min(3, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactMessageFormData = z.infer<typeof contactMessageSchema>;

// ============================================================
// FAN CHAT
// ============================================================

export const fanChatInitSchema = z.object({
  participant: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  membershipTier: z.string().optional(),
});

export type FanChatInitData = z.infer<typeof fanChatInitSchema>;

// ============================================================
// NEWSLETTER
// ============================================================

export const newsletterSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  consent: z.literal(true, 'You must consent to receive emails'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// ============================================================
// MEMBERSHIP APPLICATION
// ============================================================

export const membershipApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  organization: z.string().optional(),
  date: z.string().optional(),
  planId: z.string().uuid('Invalid plan ID'),
  notes: z.string().optional(),
});

export type MembershipApplicationFormData = z.infer<typeof membershipApplicationSchema>;

// ============================================================
// HELP TICKET
// ============================================================

export const helpTicketSchema = z.object({
  subject: z.string().min(3, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  category: z.string().optional(),
});

export type HelpTicketFormData = z.infer<typeof helpTicketSchema>;

// ============================================================
// ADMIN: MEMBERSHIP PLAN
// ============================================================

export const membershipPlanSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('USD'),
  period: z.enum(['monthly', 'annual', 'lifetime']),
  duration: z.number().int().positive().optional().nullable(),
  badge: z.string().optional().nullable(),
  is_popular: z.boolean().default(false),
  features: z.array(z.string()).default([]),
  cta_text: z.string().default('Join Now'),
  availability: z.enum(['available', 'waitlist', 'coming-soon']).default('available'),
  requires_approval: z.boolean().default(false),
  status: z.enum(['active', 'inactive']).default('active'),
  sort_order: z.number().int().default(0),
});

export type MembershipPlanFormData = z.infer<typeof membershipPlanSchema>;

// ============================================================
// ADMIN: JOURNAL ARTICLE
// ============================================================

export const journalArticleSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['career-reflections', 'industry-insights', 'personal-stories', 'behind-the-scenes', 'advice', 'announcements']),
  author: z.string().default('Homer Gere'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']).default('draft'),
  published_date: z.string().optional().nullable(),
  read_time: z.string().optional().nullable(),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(500).optional().nullable(),
  og_image: z.string().url().optional().nullable(),
  related_slugs: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
});

export type JournalArticleFormData = z.infer<typeof journalArticleSchema>;

// ============================================================
// ADMIN: PROJECT
// ============================================================

export const projectSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  year: z.number().int().min(1900).max(2100),
  type: z.enum(['film', 'series', 'short', 'documentary']),
  status: z.enum(['released', 'in_production', 'announced', 'post_production']).default('announced'),
  tagline: z.string().max(500).optional().nullable(),
  synopsis: z.string().optional().nullable(),
  expanded_synopsis: z.string().optional().nullable(),
  genre: z.string().max(100).optional().nullable(),
  runtime: z.string().max(50).optional().nullable(),
  director: z.string().max(200).optional().nullable(),
  homer_role_title: z.string().max(200).optional().nullable(),
  homer_role_description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  hero_image: z.string().url().optional().nullable(),
  poster_image: z.string().url().optional().nullable(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ============================================================
// ADMIN: SITE SETTINGS
// ============================================================

export const siteSettingsSchema = z.object({
  website: z.object({
    siteName: z.string().optional(),
    siteDescription: z.string().optional(),
    siteUrl: z.string().url().optional(),
    maintenanceMode: z.boolean().optional(),
  }).optional(),
  branding: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    logo: z.string().url().optional().nullable(),
  }).optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().url().optional().nullable(),
    googleAnalyticsId: z.string().optional().nullable(),
  }).optional(),
  email: z.object({
    provider: z.string().optional(),
    fromName: z.string().optional(),
    fromEmail: z.string().email().optional(),
    replyTo: z.string().email().optional(),
  }).optional(),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

// ============================================================
// PHASE 4: MEMBERSHIP REQUEST
// ============================================================

export const membershipRequestSchema = z.object({
  membershipPlanId: z.string().uuid('Invalid plan ID').optional().nullable(),
  membershipPlanName: z.string().min(1, 'Plan name is required'),
  duration: z.enum(['monthly', 'quarterly', 'annual']),
  preferredPaymentMethod: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  currency: z.string().default('USD'),
  notes: z.string().optional().nullable(),
});

export type MembershipRequestFormData = z.infer<typeof membershipRequestSchema>;

// ============================================================
// PHASE 4: PAYMENT METHOD
// ============================================================

export const paymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['bank_transfer', 'mobile_money', 'cash_deposit', 'manual_transfer', 'online_gateway']),
  country: z.string().optional().nullable(),
  currency: z.string().default('USD'),
  accountName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  swiftCode: z.string().optional().nullable(),
  routingCode: z.string().optional().nullable(),
  mobileNumber: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

// ============================================================
// PHASE 4: PAYMENT SUBMISSION
// ============================================================

export const paymentSubmissionSchema = z.object({
  paymentRequestId: z.string().uuid('Invalid payment request ID'),
  transactionReference: z.string().min(1, 'Transaction reference is required').max(200),
  amountPaid: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  proofUrl: z.string().url('Invalid URL').optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type PaymentSubmissionFormData = z.infer<typeof paymentSubmissionSchema>;

// ============================================================
// PHASE 4: PAYMENT REQUEST (Admin)
// ============================================================

export const paymentRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  paymentType: z.enum(['membership', 'experience']),
  relatedRecordId: z.string().uuid('Invalid record ID'),
  paymentMethodId: z.string().uuid('Invalid payment method ID').optional().nullable(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  dueDate: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
  paymentInstructions: z.string().optional().nullable(),
});

export type PaymentRequestFormData = z.infer<typeof paymentRequestSchema>;

// ============================================================
// PHASE 4: EXPERIENCE REQUEST UPDATE (Admin)
// ============================================================

export const experienceRequestUpdateSchema = z.object({
  preferredDate: z.string().optional().nullable(),
  numGuests: z.number().int().min(1).max(20).optional(),
  specialRequirements: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
});

export type ExperienceRequestUpdateFormData = z.infer<typeof experienceRequestUpdateSchema>;
