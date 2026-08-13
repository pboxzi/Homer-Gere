import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import {
  type AdminStats,
  type AdminMember,
  type AdminPlan,
  type AdminApplication,
  type AdminExperience,
  type AdminExperienceRequest,
  type AdminConversation,
  type AdminContactMessage,
  type AdminNotification,
  type AdminMediaItem,
  type AdminPayment,
  type AdminPage,
  MOCK_ADMIN_STATS,
  MOCK_ADMIN_MEMBERS,
  MOCK_ADMIN_PLANS,
  MOCK_ADMIN_APPLICATIONS,
  MOCK_ADMIN_EXPERIENCES,
  MOCK_ADMIN_EXPERIENCE_REQUESTS,
  MOCK_ADMIN_CONVERSATIONS,
  MOCK_ADMIN_CONTACT_MESSAGES,
  MOCK_ADMIN_NOTIFICATIONS,
  MOCK_ADMIN_MEDIA,
  MOCK_ADMIN_PAYMENTS,
  MOCK_ADMIN_PAGES,
} from '../data/adminData';

// ============================================================
// Settings types
// ============================================================

export interface WebsiteSettings {
  siteName: string;
  siteUrl: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerification: boolean;
  favicon: string;
  logo: string;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  rateLimiting: boolean;
  captchaEnabled: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  auditLogs: boolean;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: string;
  retentionDays: number;
  lastBackup: string;
  nextBackup: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromName: string;
  fromEmail: string;
  enabled: boolean;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  googleAnalyticsId: string;
  sitemapEnabled: boolean;
  robotsTxt: string;
}

export interface IntegrationSettings {
  googleAnalytics: boolean;
  googleSearchConsole: boolean;
  mailchimp: boolean;
  stripe: boolean;
  whatsapp: boolean;
  telegram: boolean;
}

// ============================================================
// Context shape
// ============================================================

interface AdminContextType {
  // State
  members: AdminMember[];
  plans: AdminPlan[];
  applications: AdminApplication[];
  experiences: AdminExperience[];
  experienceRequests: AdminExperienceRequest[];
  conversations: AdminConversation[];
  contactMessages: AdminContactMessage[];
  notifications: AdminNotification[];
  media: AdminMediaItem[];
  payments: AdminPayment[];
  pages: AdminPage[];
  stats: AdminStats;
  websiteSettings: WebsiteSettings;
  branding: BrandingSettings;
  securitySettings: SecuritySettings;
  backupSettings: BackupSettings;
  emailSettings: EmailSettings;
  seoSettings: SEOSettings;
  integrations: IntegrationSettings;

  // CRUD – members
  addMember: (member: Omit<AdminMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<AdminMember>) => void;
  deleteMember: (id: string) => void;

  // CRUD – plans
  addPlan: (plan: Omit<AdminPlan, 'id'>) => void;
  updatePlan: (id: string, updates: Partial<AdminPlan>) => void;
  deletePlan: (id: string) => void;

  // CRUD – applications
  addApplication: (app: Omit<AdminApplication, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<AdminApplication>) => void;
  deleteApplication: (id: string) => void;

  // CRUD – experiences
  addExperience: (exp: Omit<AdminExperience, 'id'>) => void;
  updateExperience: (id: string, updates: Partial<AdminExperience>) => void;
  deleteExperience: (id: string) => void;

  // CRUD – conversations
  addConversation: (conv: Omit<AdminConversation, 'id'>) => void;
  updateConversation: (id: string, updates: Partial<AdminConversation>) => void;
  deleteConversation: (id: string) => void;

  // CRUD – contact messages
  addContactMessage: (msg: Omit<AdminContactMessage, 'id'>) => void;
  updateContactMessage: (id: string, updates: Partial<AdminContactMessage>) => void;
  deleteContactMessage: (id: string) => void;

  // CRUD – notifications
  addNotification: (notif: Omit<AdminNotification, 'id'>) => void;
  updateNotification: (id: string, updates: Partial<AdminNotification>) => void;
  deleteNotification: (id: string) => void;

  // CRUD – media
  addMedia: (item: Omit<AdminMediaItem, 'id'>) => void;
  updateMedia: (id: string, updates: Partial<AdminMediaItem>) => void;
  deleteMedia: (id: string) => void;

  // CRUD – payments
  addPayment: (pay: Omit<AdminPayment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<AdminPayment>) => void;
  deletePayment: (id: string) => void;

  // CRUD – pages
  addPage: (page: Omit<AdminPage, 'id'>) => void;
  updatePage: (id: string, updates: Partial<AdminPage>) => void;
  deletePage: (id: string) => void;

  // Settings updates
  updateWebsiteSettings: (updates: Partial<WebsiteSettings>) => void;
  updateBranding: (updates: Partial<BrandingSettings>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void;
  updateBackupSettings: (updates: Partial<BackupSettings>) => void;
  updateEmailSettings: (updates: Partial<EmailSettings>) => void;
  updateSEOSettings: (updates: Partial<SEOSettings>) => void;
  updateIntegrations: (updates: Partial<IntegrationSettings>) => void;

  // Search & stats
  globalAdminSearch: (query: string) => SearchResult[];
  calculateStats: () => AdminStats;
}

// ============================================================
// Search result type
// ============================================================

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  section: string;
}

// ============================================================
// localStorage helpers
// ============================================================

const STORAGE_KEY = 'homer_admin';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return key in parsed ? parsed[key] : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key: string, value: unknown) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch { /* ignore */ }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayFormatted(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================================
// Default settings
// ============================================================

const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'Homer Gere',
  siteUrl: 'https://homergere.com',
  maintenanceMode: false,
  registrationEnabled: true,
  emailVerification: true,
  favicon: '/favicon.ico',
  logo: '/logo.svg',
};

const DEFAULT_BRANDING: BrandingSettings = {
  primaryColor: '#C8956C',
  secondaryColor: '#1A1A2E',
  accentColor: '#D4AF37',
  fontHeading: 'Playfair Display',
  fontBody: 'Inter',
  logoUrl: '/logo.svg',
  faviconUrl: '/favicon.ico',
};

const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorAuth: false,
  rateLimiting: true,
  captchaEnabled: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  auditLogs: true,
};

const DEFAULT_BACKUP: BackupSettings = {
  autoBackup: true,
  backupFrequency: 'daily',
  retentionDays: 30,
  lastBackup: 'Aug 10, 2025, 03:00 AM',
  nextBackup: 'Aug 11, 2025, 03:00 AM',
};

const DEFAULT_EMAIL: EmailSettings = {
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: 'admin@homergere.com',
  smtpPassword: '',
  fromName: 'Homer Gere Admin',
  fromEmail: 'admin@homergere.com',
  enabled: true,
};

const DEFAULT_SEO: SEOSettings = {
  metaTitle: 'Homer Gere – Official Website & Member Community',
  metaDescription: 'Welcome to the official Homer Gere website. Explore exclusive content, membership plans, experiences, and more.',
  ogImage: '/og-image.jpg',
  googleAnalyticsId: 'G-XXXXXXXXXX',
  sitemapEnabled: true,
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://homergere.com/sitemap.xml',
};

const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  googleAnalytics: true,
  googleSearchConsole: false,
  mailchimp: false,
  stripe: true,
  whatsapp: false,
  telegram: false,
};

// ============================================================
// Extended mock data (minimums: 10 members, 8 conversations,
// 10 contact messages, 15 media items, 20 payments)
// ============================================================

const INITIAL_MEMBERS: AdminMember[] = [
  { id: 'm1', name: 'Sarah Johnson', email: 'sarah@email.com', membership: 'Gold', status: 'active', joinDate: 'Jan 15, 2025', lastActive: '2 hours ago' },
  { id: 'm2', name: 'Michael Chen', email: 'michael@email.com', membership: 'Platinum', status: 'active', joinDate: 'Nov 20, 2024', lastActive: '1 day ago' },
  { id: 'm3', name: 'Emma Wilson', email: 'emma@email.com', membership: 'Silver', status: 'active', joinDate: 'Mar 8, 2025', lastActive: '3 days ago' },
  { id: 'm4', name: 'James Rodriguez', email: 'james@email.com', membership: 'Gold', status: 'suspended', joinDate: 'Sep 12, 2024', lastActive: '2 weeks ago' },
  { id: 'm5', name: 'Olivia Brown', email: 'olivia@email.com', membership: 'None', status: 'pending', joinDate: 'Aug 10, 2025', lastActive: 'Just now' },
  { id: 'm6', name: 'David Kim', email: 'david@email.com', membership: 'Silver', status: 'active', joinDate: 'Feb 28, 2025', lastActive: '5 hours ago' },
  { id: 'm7', name: 'Isabella Martinez', email: 'isabella@email.com', membership: 'Gold', status: 'active', joinDate: 'Apr 3, 2025', lastActive: '12 hours ago' },
  { id: 'm8', name: 'Ethan Thompson', email: 'ethan@email.com', membership: 'Platinum', status: 'active', joinDate: 'Dec 1, 2024', lastActive: '6 hours ago' },
  { id: 'm9', name: 'Sophia Davis', email: 'sophia@email.com', membership: 'Silver', status: 'active', joinDate: 'Jun 15, 2025', lastActive: '1 day ago' },
  { id: 'm10', name: 'Alexander Patel', email: 'alex@email.com', membership: 'Gold', status: 'active', joinDate: 'May 22, 2025', lastActive: '4 hours ago' },
  { id: 'm11', name: 'Mia Anderson', email: 'mia@email.com', membership: 'Platinum', status: 'active', joinDate: 'Jul 8, 2025', lastActive: '30 minutes ago' },
  { id: 'm12', name: 'Benjamin Lee', email: 'ben@email.com', membership: 'Silver', status: 'suspended', joinDate: 'Oct 5, 2024', lastActive: '1 month ago' },
  { id: 'm13', name: 'Charlotte White', email: 'charlotte@email.com', membership: 'Gold', status: 'active', joinDate: 'Aug 1, 2025', lastActive: '2 days ago' },
  { id: 'm14', name: 'Daniel Garcia', email: 'daniel@email.com', membership: 'None', status: 'pending', joinDate: 'Aug 9, 2025', lastActive: 'Just now' },
  { id: 'm15', name: 'Amelia Robinson', email: 'amelia@email.com', membership: 'Silver', status: 'active', joinDate: 'Mar 18, 2025', lastActive: '8 hours ago' },
];

const INITIAL_PLANS: AdminPlan[] = [
  { id: 'p1', name: 'Silver', price: 99, period: 'year', members: 423, status: 'active' },
  { id: 'p2', name: 'Gold', price: 199, period: 'year', members: 312, status: 'active' },
  { id: 'p3', name: 'Platinum', price: 499, period: 'year', members: 157, status: 'active' },
  { id: 'p4', name: 'Bronze', price: 49, period: 'year', members: 0, status: 'draft' },
  { id: 'p5', name: 'VIP Lifetime', price: 4999, period: 'lifetime', members: 23, status: 'active' },
];

const INITIAL_APPLICATIONS: AdminApplication[] = [
  { id: 'a1', name: 'Olivia Brown', email: 'olivia@email.com', plan: 'Gold', date: 'Aug 10, 2025', status: 'pending' },
  { id: 'a2', name: 'Lucas Taylor', email: 'lucas@email.com', plan: 'Silver', date: 'Aug 9, 2025', status: 'pending' },
  { id: 'a3', name: 'Sophia Davis', email: 'sophia@email.com', plan: 'Platinum', date: 'Aug 8, 2025', status: 'approved' },
  { id: 'a4', name: 'Daniel Garcia', email: 'daniel@email.com', plan: 'Gold', date: 'Aug 7, 2025', status: 'pending' },
  { id: 'a5', name: 'Mia Thompson', email: 'mia.t@email.com', plan: 'Silver', date: 'Aug 6, 2025', status: 'declined' },
  { id: 'a6', name: 'Noah Harris', email: 'noah@email.com', plan: 'Platinum', date: 'Aug 5, 2025', status: 'approved' },
  { id: 'a7', name: 'Ava Clark', email: 'ava@email.com', plan: 'Gold', date: 'Aug 4, 2025', status: 'pending' },
  { id: 'a8', name: 'Liam Lewis', email: 'liam@email.com', plan: 'Silver', date: 'Aug 3, 2025', status: 'approved' },
];

const INITIAL_EXPERIENCES: AdminExperience[] = [
  { id: 'e1', title: 'Meet & Greet', type: 'meet-and-greet', price: '$500', availability: 'available', requests: 45 },
  { id: 'e2', title: 'Virtual Greeting', type: 'video-greeting', price: '$150', availability: 'available', requests: 78 },
  { id: 'e3', title: 'Private Event', type: 'private-event', price: '$5,000', availability: 'limited', requests: 12 },
  { id: 'e4', title: 'Speaking Engagement', type: 'speaking-engagement', price: '$2,500', availability: 'unavailable', requests: 21 },
  { id: 'e5', title: 'Signed Memorabilia', type: 'signed-item', price: '$250', availability: 'available', requests: 63 },
  { id: 'e6', title: 'Birthday Shoutout', type: 'video-greeting', price: '$75', availability: 'available', requests: 112 },
];

const INITIAL_EXPERIENCE_REQUESTS: AdminExperienceRequest[] = [
  { id: 'er1', requester: 'Sarah Johnson', experience: 'Meet & Greet — NYC Premiere', date: 'Aug 10, 2025', status: 'pending' },
  { id: 'er2', requester: 'Michael Chen', experience: 'Virtual Greeting — Birthday', date: 'Aug 9, 2025', status: 'approved' },
  { id: 'er3', requester: 'Emma Wilson', experience: 'Private Event', date: 'Aug 7, 2025', status: 'completed' },
  { id: 'er4', requester: 'David Kim', experience: 'Signed Memorabilia', date: 'Aug 6, 2025', status: 'approved' },
  { id: 'er5', requester: 'Isabella Martinez', experience: 'Meet & Greet — LA Screening', date: 'Aug 5, 2025', status: 'pending' },
  { id: 'er6', requester: 'Ethan Thompson', experience: 'Speaking Engagement', date: 'Aug 4, 2025', status: 'declined' },
  { id: 'er7', requester: 'Mia Anderson', experience: 'Birthday Shoutout', date: 'Aug 3, 2025', status: 'completed' },
  { id: 'er8', requester: 'Alexander Patel', experience: 'Virtual Greeting — Anniversary', date: 'Aug 2, 2025', status: 'approved' },
];

const INITIAL_CONVERSATIONS: AdminConversation[] = [
  { id: 'c1', type: 'fan', participant: 'Sarah Johnson', email: 'sarah@email.com', lastMessage: 'Thank you so much!', status: 'open', date: 'Aug 10, 2025' },
  { id: 'c2', type: 'business', participant: 'Michael Chen', email: 'michael@luxeco.com', company: 'Luxe Brand Co.', lastMessage: 'Partnership proposal attached.', status: 'in_progress', date: 'Aug 9, 2025' },
  { id: 'c3', type: 'fan', participant: 'Emma Wilson', email: 'emma@email.com', lastMessage: 'When is the next event?', status: 'closed', date: 'Aug 8, 2025' },
  { id: 'c4', type: 'fan', participant: 'David Kim', email: 'david@email.com', lastMessage: 'I loved the latest project!', status: 'open', date: 'Aug 7, 2025' },
  { id: 'c5', type: 'business', participant: 'Rachel Green', email: 'rachel@mediapro.com', company: 'MediaPro Studios', lastMessage: 'Could we schedule a call this week?', status: 'open', date: 'Aug 6, 2025' },
  { id: 'c6', type: 'fan', participant: 'Isabella Martinez', email: 'isabella@email.com', lastMessage: 'Will there be a signing event in Miami?', status: 'in_progress', date: 'Aug 5, 2025' },
  { id: 'c7', type: 'business', participant: 'Tom Bradley', email: 'tom@eventful.com', company: 'Eventful Inc.', lastMessage: 'Budget and venue details confirmed.', status: 'in_progress', date: 'Aug 4, 2025' },
  { id: 'c8', type: 'fan', participant: 'Ethan Thompson', email: 'ethan@email.com', lastMessage: 'Just wanted to say you\'re an inspiration.', status: 'open', date: 'Aug 3, 2025' },
  { id: 'c9', type: 'fan', participant: 'Sophia Davis', email: 'sophia@email.com', lastMessage: 'Can I get a photo at the next premiere?', status: 'closed', date: 'Aug 2, 2025' },
  { id: 'c10', type: 'business', participant: 'Karen Wu', email: 'karen@brandalliance.com', company: 'Brand Alliance Group', lastMessage: 'We have a sponsorship offer for review.', status: 'open', date: 'Aug 1, 2025' },
];

const INITIAL_CONTACT_MESSAGES: AdminContactMessage[] = [
  { id: 'cm1', name: 'Robert Taylor', email: 'robert@email.com', department: 'Media & Press', subject: 'Interview Request', message: 'Would like to schedule an interview for Variety magazine.', date: 'Aug 10, 2025', read: false },
  { id: 'cm2', name: 'Lisa Wang', email: 'lisa@brandco.com', department: 'Brand Partnerships', subject: 'Collaboration Proposal', message: 'Interested in a brand partnership for our luxury line.', date: 'Aug 9, 2025', read: true },
  { id: 'cm3', name: 'Tom Anderson', email: 'tom@email.com', department: 'General Enquiries', subject: 'Fan Letter', message: 'Just wanted to express my admiration for Homer\'s work.', date: 'Aug 8, 2025', read: true },
  { id: 'cm4', name: 'Nina Patel', email: 'nina@email.com', department: 'Technical Support', subject: 'Login Issue', message: 'Unable to log into my account after the latest update.', date: 'Aug 7, 2025', read: false },
  { id: 'cm5', name: 'Marcus Brown', email: 'marcus@studio.com', department: 'Media & Press', subject: 'Photography Request', message: 'Requesting permission to use official photos for a feature article.', date: 'Aug 6, 2025', read: true },
  { id: 'cm6', name: 'Elena Rodriguez', email: 'elena@email.com', department: 'General Enquiries', subject: 'Membership Question', message: 'What are the benefits of upgrading from Silver to Gold?', date: 'Aug 5, 2025', read: false },
  { id: 'cm7', name: 'Chris Nguyen', email: 'chris@digital.com', department: 'Technical Support', subject: 'Payment Failed', message: 'My annual renewal payment was declined, please help.', date: 'Aug 4, 2025', read: true },
  { id: 'cm8', name: 'Amanda Foster', email: 'amanda@email.com', department: 'Brand Partnerships', subject: 'Event Sponsorship', message: 'We would like to sponsor the upcoming fan meetup event.', date: 'Aug 3, 2025', read: false },
  { id: 'cm9', name: 'Jake Morrison', email: 'jake@email.com', department: 'General Enquiries', subject: 'Merch Availability', message: 'Will there be signed merchandise available soon?', date: 'Aug 2, 2025', read: true },
  { id: 'cm10', name: 'Priya Sharma', email: 'priya@media.com', department: 'Media & Press', subject: 'Documentary Feature', message: 'We are producing a documentary and would love to include an interview.', date: 'Aug 1, 2025', read: false },
  { id: 'cm11', name: 'Victor Cruz', email: 'victor@email.com', department: 'Technical Support', subject: 'App Crash', message: 'The mobile app keeps crashing when I try to access the gallery.', date: 'Jul 31, 2025', read: true },
  { id: 'cm12', name: 'Hannah Lee', email: 'hannah@agency.com', department: 'Brand Partnerships', subject: 'Talent Agency Inquiry', message: 'We represent several actors and would like to discuss collaboration.', date: 'Jul 30, 2025', read: false },
];

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  { id: 'n1', title: 'New Membership Application', message: 'Olivia Brown applied for Gold membership.', date: '2 hours ago', read: false },
  { id: 'n2', title: 'Experience Request', message: 'New Meet & Greet request from Sarah Johnson.', date: '5 hours ago', read: false },
  { id: 'n3', title: 'Business Enquiry', message: 'Partnership proposal from Luxe Brand Co.', date: '1 day ago', read: true },
  { id: 'n4', title: 'Contact Form Submission', message: 'New interview request from Robert Taylor (Variety).', date: '1 day ago', read: false },
  { id: 'n5', title: 'Payment Received', message: 'Gold membership renewal from Sarah Johnson — $199.', date: '2 days ago', read: true },
  { id: 'n6', title: 'Application Approved', message: 'Sophia Davis Platinum application approved.', date: '3 days ago', read: true },
  { id: 'n7', title: 'System Alert', message: 'Backup completed successfully at 3:00 AM.', date: '3 days ago', read: true },
  { id: 'n8', title: 'New Fan Chat', message: 'Ethan Thompson started a new conversation.', date: '4 days ago', read: false },
  { id: 'n9', title: 'Content Update', message: 'New journal article published by Admin.', date: '5 days ago', read: true },
  { id: 'n10', title: 'Security Alert', message: '3 failed login attempts detected from IP 192.168.1.105.', date: '5 days ago', read: false },
];

const INITIAL_MEDIA: AdminMediaItem[] = [
  { id: 'mi1', name: 'hero-portrait.jpg', type: 'image', size: '2.4 MB', uploadedBy: 'Admin', date: 'Aug 10, 2025', url: '#' },
  { id: 'mi2', name: 'shards-premiere.jpg', type: 'image', size: '3.1 MB', uploadedBy: 'Admin', date: 'Aug 9, 2025', url: '#' },
  { id: 'mi3', name: 'interview-clip.mp4', type: 'video', size: '45.2 MB', uploadedBy: 'Admin', date: 'Aug 8, 2025', url: '#' },
  { id: 'mi4', name: 'press-kit.pdf', type: 'document', size: '1.8 MB', uploadedBy: 'Admin', date: 'Aug 7, 2025', url: '#' },
  { id: 'mi5', name: 'backstage-photo.jpg', type: 'image', size: '4.2 MB', uploadedBy: 'Admin', date: 'Aug 6, 2025', url: '#' },
  { id: 'mi6', name: 'red-carpet.jpg', type: 'image', size: '3.8 MB', uploadedBy: 'Admin', date: 'Aug 5, 2025', url: '#' },
  { id: 'mi7', name: 'behind-scenes.mp4', type: 'video', size: '128.5 MB', uploadedBy: 'Admin', date: 'Aug 4, 2025', url: '#' },
  { id: 'mi8', name: 'biography.docx', type: 'document', size: '245 KB', uploadedBy: 'Admin', date: 'Aug 3, 2025', url: '#' },
  { id: 'mi9', name: 'gallery-portrait-1.jpg', type: 'image', size: '5.1 MB', uploadedBy: 'Admin', date: 'Aug 2, 2025', url: '#' },
  { id: 'mi10', name: 'fan-event-recap.mp4', type: 'video', size: '89.3 MB', uploadedBy: 'Admin', date: 'Aug 1, 2025', url: '#' },
  { id: 'mi11', name: 'branding-kit.zip', type: 'document', size: '12.4 MB', uploadedBy: 'Admin', date: 'Jul 31, 2025', url: '#' },
  { id: 'mi12', name: 'movie-poster.jpg', type: 'image', size: '1.9 MB', uploadedBy: 'Admin', date: 'Jul 30, 2025', url: '#' },
  { id: 'mi13', name: 'podcast-episode-1.mp3', type: 'video', size: '34.7 MB', uploadedBy: 'Admin', date: 'Jul 29, 2025', url: '#' },
  { id: 'mi14', name: 'event-flyer.png', type: 'image', size: '890 KB', uploadedBy: 'Admin', date: 'Jul 28, 2025', url: '#' },
  { id: 'mi15', name: 'annual-report-2024.pdf', type: 'document', size: '3.6 MB', uploadedBy: 'Admin', date: 'Jul 27, 2025', url: '#' },
  { id: 'mi16', name: 'candid-shoot.jpg', type: 'image', size: '2.7 MB', uploadedBy: 'Admin', date: 'Jul 26, 2025', url: '#' },
  { id: 'mi17', name: 'teaser-trailer.mp4', type: 'video', size: '56.8 MB', uploadedBy: 'Admin', date: 'Jul 25, 2025', url: '#' },
];

const INITIAL_PAYMENTS: AdminPayment[] = [
  { id: 'pay1', member: 'Sarah Johnson', plan: 'Gold', amount: 199, date: 'Aug 10, 2025', status: 'completed' },
  { id: 'pay2', member: 'Michael Chen', plan: 'Platinum', amount: 499, date: 'Aug 9, 2025', status: 'completed' },
  { id: 'pay3', member: 'Emma Wilson', plan: 'Silver', amount: 99, date: 'Aug 8, 2025', status: 'pending' },
  { id: 'pay4', member: 'David Kim', plan: 'Silver', amount: 99, date: 'Aug 7, 2025', status: 'completed' },
  { id: 'pay5', member: 'Isabella Martinez', plan: 'Gold', amount: 199, date: 'Aug 6, 2025', status: 'completed' },
  { id: 'pay6', member: 'Ethan Thompson', plan: 'Platinum', amount: 499, date: 'Aug 5, 2025', status: 'completed' },
  { id: 'pay7', member: 'Sophia Davis', plan: 'Silver', amount: 99, date: 'Aug 4, 2025', status: 'refunded' },
  { id: 'pay8', member: 'Alexander Patel', plan: 'Gold', amount: 199, date: 'Aug 3, 2025', status: 'completed' },
  { id: 'pay9', member: 'Mia Anderson', plan: 'Platinum', amount: 499, date: 'Aug 2, 2025', status: 'completed' },
  { id: 'pay10', member: 'James Rodriguez', plan: 'Gold', amount: 199, date: 'Aug 1, 2025', status: 'refunded' },
  { id: 'pay11', member: 'Charlotte White', plan: 'Gold', amount: 199, date: 'Jul 31, 2025', status: 'completed' },
  { id: 'pay12', member: 'Amelia Robinson', plan: 'Silver', amount: 99, date: 'Jul 30, 2025', status: 'completed' },
  { id: 'pay13', member: 'Benjamin Lee', plan: 'Silver', amount: 99, date: 'Jul 29, 2025', status: 'pending' },
  { id: 'pay14', member: 'Sarah Johnson', plan: 'Gold', amount: 199, date: 'Jul 28, 2025', status: 'completed' },
  { id: 'pay15', member: 'Michael Chen', plan: 'Platinum', amount: 499, date: 'Jul 27, 2025', status: 'completed' },
  { id: 'pay16', member: 'David Kim', plan: 'Silver', amount: 99, date: 'Jul 26, 2025', status: 'completed' },
  { id: 'pay17', member: 'Isabella Martinez', plan: 'Gold', amount: 199, date: 'Jul 25, 2025', status: 'completed' },
  { id: 'pay18', member: 'Ethan Thompson', plan: 'Platinum', amount: 499, date: 'Jul 24, 2025', status: 'completed' },
  { id: 'pay19', member: 'Emma Wilson', plan: 'Silver', amount: 99, date: 'Jul 23, 2025', status: 'completed' },
  { id: 'pay20', member: 'Alexander Patel', plan: 'Gold', amount: 199, date: 'Jul 22, 2025', status: 'pending' },
  { id: 'pay21', member: 'Mia Anderson', plan: 'Platinum', amount: 499, date: 'Jul 21, 2025', status: 'completed' },
  { id: 'pay22', member: 'Charlotte White', plan: 'Gold', amount: 199, date: 'Jul 20, 2025', status: 'completed' },
  { id: 'pay23', member: 'Sophia Davis', plan: 'Silver', amount: 99, date: 'Jul 19, 2025', status: 'refunded' },
  { id: 'pay24', member: 'Amelia Robinson', plan: 'Silver', amount: 99, date: 'Jul 18, 2025', status: 'completed' },
];

const INITIAL_PAGES: AdminPage[] = [
  { id: 'home', title: 'Homepage', status: 'published', lastModified: 'Aug 10, 2025', author: 'Admin' },
  { id: 'journey', title: 'Journey', status: 'published', lastModified: 'Aug 9, 2025', author: 'Admin' },
  { id: 'projects', title: 'Projects', status: 'published', lastModified: 'Aug 8, 2025', author: 'Admin' },
  { id: 'gallery', title: 'Gallery', status: 'draft', lastModified: 'Aug 7, 2025', author: 'Admin' },
  { id: 'journal', title: 'Journal', status: 'published', lastModified: 'Aug 6, 2025', author: 'Admin' },
  { id: 'media', title: 'Media', status: 'published', lastModified: 'Aug 5, 2025', author: 'Admin' },
  { id: 'membership', title: 'Membership', status: 'published', lastModified: 'Aug 4, 2025', author: 'Admin' },
  { id: 'experiences', title: 'Experiences', status: 'published', lastModified: 'Aug 3, 2025', author: 'Admin' },
  { id: 'contact', title: 'Contact', status: 'published', lastModified: 'Aug 2, 2025', author: 'Admin' },
  { id: 'faq', title: 'FAQ', status: 'draft', lastModified: 'Aug 1, 2025', author: 'Admin' },
  { id: 'terms', title: 'Terms & Conditions', status: 'published', lastModified: 'Jul 30, 2025', author: 'Admin' },
  { id: 'privacy', title: 'Privacy Policy', status: 'published', lastModified: 'Jul 29, 2025', author: 'Admin' },
];

// ============================================================
// Context
// ============================================================

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = (): AdminContextType => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ----- State -----
  const [members, setMembers] = useState<AdminMember[]>(() => loadState('members', INITIAL_MEMBERS));
  const [plans, setPlans] = useState<AdminPlan[]>(() => loadState('plans', INITIAL_PLANS));
  const [applications, setApplications] = useState<AdminApplication[]>(() => loadState('applications', INITIAL_APPLICATIONS));
  const [experiences, setExperiences] = useState<AdminExperience[]>(() => loadState('experiences', INITIAL_EXPERIENCES));
  const [experienceRequests, setExperienceRequests] = useState<AdminExperienceRequest[]>(() => loadState('experienceRequests', INITIAL_EXPERIENCE_REQUESTS));
  const [conversations, setConversations] = useState<AdminConversation[]>(() => loadState('conversations', INITIAL_CONVERSATIONS));
  const [contactMessages, setContactMessages] = useState<AdminContactMessage[]>(() => loadState('contactMessages', INITIAL_CONTACT_MESSAGES));
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [media, setMedia] = useState<AdminMediaItem[]>(() => loadState('media', INITIAL_MEDIA));
  const [payments, setPayments] = useState<AdminPayment[]>(() => loadState('payments', INITIAL_PAYMENTS));
  const [pages, setPages] = useState<AdminPage[]>(() => loadState('pages', INITIAL_PAGES));
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => loadState('websiteSettings', DEFAULT_WEBSITE_SETTINGS));
  const [branding, setBranding] = useState<BrandingSettings>(() => loadState('branding', DEFAULT_BRANDING));
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => loadState('securitySettings', DEFAULT_SECURITY));
  const [backupSettings, setBackupSettings] = useState<BackupSettings>(() => loadState('backupSettings', DEFAULT_BACKUP));
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(() => loadState('emailSettings', DEFAULT_EMAIL));
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(() => loadState('seoSettings', DEFAULT_SEO));
  const [integrations, setIntegrations] = useState<IntegrationSettings>(() => loadState('integrations', DEFAULT_INTEGRATIONS));

  // ----- Persist to localStorage -----
  useEffect(() => { saveState('members', members); }, [members]);
  useEffect(() => { saveState('plans', plans); }, [plans]);
  useEffect(() => { saveState('applications', applications); }, [applications]);
  useEffect(() => { saveState('experiences', experiences); }, [experiences]);
  useEffect(() => { saveState('experienceRequests', experienceRequests); }, [experienceRequests]);
  useEffect(() => { saveState('conversations', conversations); }, [conversations]);
  useEffect(() => { saveState('contactMessages', contactMessages); }, [contactMessages]);
  useEffect(() => { saveState('notifications', notifications); }, [notifications]);
  useEffect(() => { saveState('media', media); }, [media]);
  useEffect(() => { saveState('payments', payments); }, [payments]);
  useEffect(() => { saveState('pages', pages); }, [pages]);
  useEffect(() => { saveState('websiteSettings', websiteSettings); }, [websiteSettings]);
  useEffect(() => { saveState('branding', branding); }, [branding]);
  useEffect(() => { saveState('securitySettings', securitySettings); }, [securitySettings]);
  useEffect(() => { saveState('backupSettings', backupSettings); }, [backupSettings]);
  useEffect(() => { saveState('emailSettings', emailSettings); }, [emailSettings]);
  useEffect(() => { saveState('seoSettings', seoSettings); }, [seoSettings]);
  useEffect(() => { saveState('integrations', integrations); }, [integrations]);

  // ----- CRUD: Members -----
  const addMember = useCallback((member: Omit<AdminMember, 'id'>) => {
    setMembers((prev) => [{ ...member, id: generateId() }, ...prev]);
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<AdminMember>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ----- CRUD: Plans -----
  const addPlan = useCallback((plan: Omit<AdminPlan, 'id'>) => {
    setPlans((prev) => [{ ...plan, id: generateId() }, ...prev]);
  }, []);

  const updatePlan = useCallback((id: string, updates: Partial<AdminPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ----- CRUD: Applications -----
  const addApplication = useCallback((app: Omit<AdminApplication, 'id'>) => {
    setApplications((prev) => [{ ...app, id: generateId() }, ...prev]);
  }, []);

  const updateApplication = useCallback((id: string, updates: Partial<AdminApplication>) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, []);

  const deleteApplication = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // ----- CRUD: Experiences -----
  const addExperience = useCallback((exp: Omit<AdminExperience, 'id'>) => {
    setExperiences((prev) => [{ ...exp, id: generateId() }, ...prev]);
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<AdminExperience>) => {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const deleteExperience = useCallback((id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ----- CRUD: Conversations -----
  const addConversation = useCallback((conv: Omit<AdminConversation, 'id'>) => {
    setConversations((prev) => [{ ...conv, id: generateId() }, ...prev]);
  }, []);

  const updateConversation = useCallback((id: string, updates: Partial<AdminConversation>) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ----- CRUD: Contact Messages -----
  const addContactMessage = useCallback((msg: Omit<AdminContactMessage, 'id'>) => {
    setContactMessages((prev) => [{ ...msg, id: generateId() }, ...prev]);
  }, []);

  const updateContactMessage = useCallback((id: string, updates: Partial<AdminContactMessage>) => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteContactMessage = useCallback((id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ----- CRUD: Notifications -----
  const addNotification = useCallback((notif: Omit<AdminNotification, 'id'>) => {
    setNotifications((prev) => [{ ...notif, id: generateId() }, ...prev]);
  }, []);

  const updateNotification = useCallback((id: string, updates: Partial<AdminNotification>) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ----- CRUD: Media -----
  const addMedia = useCallback((item: Omit<AdminMediaItem, 'id'>) => {
    setMedia((prev) => [{ ...item, id: generateId() }, ...prev]);
  }, []);

  const updateMedia = useCallback((id: string, updates: Partial<AdminMediaItem>) => {
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMedia = useCallback((id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ----- CRUD: Payments -----
  const addPayment = useCallback((pay: Omit<AdminPayment, 'id'>) => {
    setPayments((prev) => [{ ...pay, id: generateId() }, ...prev]);
  }, []);

  const updatePayment = useCallback((id: string, updates: Partial<AdminPayment>) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePayment = useCallback((id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ----- CRUD: Pages -----
  const addPage = useCallback((page: Omit<AdminPage, 'id'>) => {
    setPages((prev) => [{ ...page, id: generateId() }, ...prev]);
  }, []);

  const updatePage = useCallback((id: string, updates: Partial<AdminPage>) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePage = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ----- Settings updates -----
  const updateWebsiteSettings = useCallback((updates: Partial<WebsiteSettings>) => {
    setWebsiteSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateBranding = useCallback((updates: Partial<BrandingSettings>) => {
    setBranding((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateSecuritySettings = useCallback((updates: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateBackupSettings = useCallback((updates: Partial<BackupSettings>) => {
    setBackupSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateEmailSettings = useCallback((updates: Partial<EmailSettings>) => {
    setEmailSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateSEOSettings = useCallback((updates: Partial<SEOSettings>) => {
    setSeoSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateIntegrations = useCallback((updates: Partial<IntegrationSettings>) => {
    setIntegrations((prev) => ({ ...prev, ...updates }));
  }, []);

  // ----- Calculate live stats -----
  const calculateStats = useCallback((): AdminStats => {
    return {
      totalMembers: members.length,
      activeMemberships: members.filter((m) => m.status === 'active').length,
      pendingApplications: applications.filter((a) => a.status === 'pending').length,
      fanChatMessages: conversations.filter((c) => c.type === 'fan').length * 12,
      businessEnquiries: conversations.filter((c) => c.type === 'business').length,
      experienceRequests: experienceRequests.length,
      journalArticles: pages.filter((p) => p.title.toLowerCase().includes('journal')).length * 4,
      galleryImages: media.filter((m) => m.type === 'image').length,
      mediaItems: media.length,
      websiteVisitors: 45230 + payments.length * 12,
    };
  }, [members, applications, conversations, experienceRequests, pages, media, payments]);

  const stats = useMemo(() => calculateStats(), [calculateStats]);

  // ----- Global admin search -----
  const globalAdminSearch = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    members.forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) {
        results.push({ id: m.id, type: 'member', title: m.name, description: `${m.membership} — ${m.status}`, section: 'Members' });
      }
    });

    plans.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) {
        results.push({ id: p.id, type: 'plan', title: p.name, description: `$${p.price}/${p.period} — ${p.members} members`, section: 'Plans' });
      }
    });

    applications.forEach((a) => {
      if (a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.plan.toLowerCase().includes(q)) {
        results.push({ id: a.id, type: 'application', title: a.name, description: `${a.plan} — ${a.status}`, section: 'Applications' });
      }
    });

    experiences.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)) {
        results.push({ id: e.id, type: 'experience', title: e.title, description: `${e.price} — ${e.availability}`, section: 'Experiences' });
      }
    });

    experienceRequests.forEach((er) => {
      if (er.requester.toLowerCase().includes(q) || er.experience.toLowerCase().includes(q)) {
        results.push({ id: er.id, type: 'experienceRequest', title: er.experience, description: `${er.requester} — ${er.status}`, section: 'Experience Requests' });
      }
    });

    conversations.forEach((c) => {
      if (c.participant.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)) {
        results.push({ id: c.id, type: 'conversation', title: c.participant, description: c.lastMessage, section: 'Conversations' });
      }
    });

    contactMessages.forEach((cm) => {
      if (cm.name.toLowerCase().includes(q) || cm.email.toLowerCase().includes(q) || cm.subject.toLowerCase().includes(q) || cm.message.toLowerCase().includes(q)) {
        results.push({ id: cm.id, type: 'contactMessage', title: cm.subject, description: `From ${cm.name}`, section: 'Contact Messages' });
      }
    });

    notifications.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)) {
        results.push({ id: n.id, type: 'notification', title: n.title, description: n.message, section: 'Notifications' });
      }
    });

    media.forEach((m) => {
      if (m.name.toLowerCase().includes(q)) {
        results.push({ id: m.id, type: 'media', title: m.name, description: `${m.type} — ${m.size}`, section: 'Media' });
      }
    });

    payments.forEach((p) => {
      if (p.member.toLowerCase().includes(q) || p.plan.toLowerCase().includes(q)) {
        results.push({ id: p.id, type: 'payment', title: `${p.member} — ${p.plan}`, description: `$${p.amount} — ${p.status}`, section: 'Payments' });
      }
    });

    pages.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)) {
        results.push({ id: p.id, type: 'page', title: p.title, description: `${p.status} — Modified ${p.lastModified}`, section: 'Pages' });
      }
    });

    return results;
  }, [members, plans, applications, experiences, experienceRequests, conversations, contactMessages, notifications, media, payments, pages]);

  // ----- Provider value -----
  const value: AdminContextType = useMemo(() => ({
    members, plans, applications, experiences, experienceRequests,
    conversations, contactMessages, notifications, media, payments, pages,
    stats, websiteSettings, branding, securitySettings, backupSettings,
    emailSettings, seoSettings, integrations,

    addMember, updateMember, deleteMember,
    addPlan, updatePlan, deletePlan,
    addApplication, updateApplication, deleteApplication,
    addExperience, updateExperience, deleteExperience,
    addConversation, updateConversation, deleteConversation,
    addContactMessage, updateContactMessage, deleteContactMessage,
    addNotification, updateNotification, deleteNotification,
    addMedia, updateMedia, deleteMedia,
    addPayment, updatePayment, deletePayment,
    addPage, updatePage, deletePage,

    updateWebsiteSettings, updateBranding, updateSecuritySettings,
    updateBackupSettings, updateEmailSettings, updateSEOSettings, updateIntegrations,

    globalAdminSearch, calculateStats,
  }), [
    members, plans, applications, experiences, experienceRequests,
    conversations, contactMessages, notifications, media, payments, pages,
    stats, websiteSettings, branding, securitySettings, backupSettings,
    emailSettings, seoSettings, integrations,
    addMember, updateMember, deleteMember,
    addPlan, updatePlan, deletePlan,
    addApplication, updateApplication, deleteApplication,
    addExperience, updateExperience, deleteExperience,
    addConversation, updateConversation, deleteConversation,
    addContactMessage, updateContactMessage, deleteContactMessage,
    addNotification, updateNotification, deleteNotification,
    addMedia, updateMedia, deleteMedia,
    addPayment, updatePayment, deletePayment,
    addPage, updatePage, deletePage,
    updateWebsiteSettings, updateBranding, updateSecuritySettings,
    updateBackupSettings, updateEmailSettings, updateSEOSettings, updateIntegrations,
    globalAdminSearch, calculateStats,
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
