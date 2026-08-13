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
  EMPTY_ADMIN_STATS,
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
  sendConversationMessage: (conversationId: string, sender: string, text: string) => void;

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
// Empty defaults — populated by Supabase when connected
// ============================================================

const INITIAL_MEMBERS: AdminMember[] = [];
const INITIAL_PLANS: AdminPlan[] = [];
const INITIAL_APPLICATIONS: AdminApplication[] = [];
const INITIAL_EXPERIENCES: AdminExperience[] = [];
const INITIAL_EXPERIENCE_REQUESTS: AdminExperienceRequest[] = [];
const INITIAL_CONVERSATIONS: AdminConversation[] = [];
const INITIAL_CONTACT_MESSAGES: AdminContactMessage[] = [];
const INITIAL_NOTIFICATIONS: AdminNotification[] = [];
const INITIAL_MEDIA: AdminMediaItem[] = [];
const INITIAL_PAYMENTS: AdminPayment[] = [];
const INITIAL_PAGES: AdminPage[] = [];

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

  const sendConversationMessage = useCallback((conversationId: string, sender: string, text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setConversations((prev) => prev.map((c) => {
      if (c.id !== conversationId) return c;
      const existingMessages = c.messages || [];
      return {
        ...c,
        lastMessage: text,
        messages: [...existingMessages, { sender, text, time }],
      };
    }));
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
    addConversation, updateConversation, deleteConversation, sendConversationMessage,
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
    addConversation, updateConversation, deleteConversation, sendConversationMessage,
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
