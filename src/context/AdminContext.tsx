import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import {
  profilesRepository,
  membershipPlansRepository,
  membershipsRepository,
  registrationRepository,
  experiencesRepository,
  experienceRequestsRepository,
  fanChatRepository,
  businessEnquiriesRepository,
  journalRepository,
  journeyRepository,
  projectsRepository,
  galleryRepository,
  mediaRepository,
  notificationsRepository,
  siteSettingsRepository,
  auditLogsRepository,
} from '../lib/repositories';
import { supabase } from '../lib/supabase';
import { emailService } from '../lib/email';
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
  loading: boolean;

  addMember: (member: Omit<AdminMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<AdminMember>) => void;
  deleteMember: (id: string) => void;
  addPlan: (plan: Omit<AdminPlan, 'id'>) => void;
  updatePlan: (id: string, updates: Partial<AdminPlan>) => void;
  deletePlan: (id: string) => void;
  addApplication: (app: Omit<AdminApplication, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<AdminApplication>) => void;
  deleteApplication: (id: string) => void;
  addExperience: (exp: Omit<AdminExperience, 'id'>) => void;
  updateExperience: (id: string, updates: Partial<AdminExperience>) => void;
  deleteExperience: (id: string) => void;
  addConversation: (conv: Omit<AdminConversation, 'id'>) => void;
  updateConversation: (id: string, updates: Partial<AdminConversation>) => void;
  deleteConversation: (id: string) => void;
  sendConversationMessage: (conversationId: string, sender: string, text: string) => void;
  addContactMessage: (msg: Omit<AdminContactMessage, 'id'>) => void;
  updateContactMessage: (id: string, updates: Partial<AdminContactMessage>) => void;
  deleteContactMessage: (id: string) => void;
  addNotification: (notif: Omit<AdminNotification, 'id'>) => void;
  updateNotification: (id: string, updates: Partial<AdminNotification>) => void;
  deleteNotification: (id: string) => void;
  addMedia: (item: Omit<AdminMediaItem, 'id'>) => void;
  updateMedia: (id: string, updates: Partial<AdminMediaItem>) => void;
  deleteMedia: (id: string) => void;
  addPayment: (pay: Omit<AdminPayment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<AdminPayment>) => void;
  deletePayment: (id: string) => void;
  addPage: (page: Omit<AdminPage, 'id'>) => void;
  updatePage: (id: string, updates: Partial<AdminPage>) => void;
  deletePage: (id: string) => void;
  updateWebsiteSettings: (updates: Partial<WebsiteSettings>) => void;
  updateBranding: (updates: Partial<BrandingSettings>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void;
  updateBackupSettings: (updates: Partial<BackupSettings>) => void;
  updateEmailSettings: (updates: Partial<EmailSettings>) => void;
  updateSEOSettings: (updates: Partial<SEOSettings>) => void;
  updateIntegrations: (updates: Partial<IntegrationSettings>) => void;
  globalAdminSearch: (query: string) => SearchResult[];
  refreshData: () => Promise<void>;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  section: string;
}

// ============================================================
// Helpers
// ============================================================

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ============================================================
// Default settings
// ============================================================

const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'Homer Gere', siteUrl: 'https://homergere.com',
  maintenanceMode: false, registrationEnabled: true, emailVerification: true,
  favicon: '/favicon.ico', logo: '/logo.svg',
};

const DEFAULT_BRANDING: BrandingSettings = {
  primaryColor: '#C8956C', secondaryColor: '#1A1A2E', accentColor: '#D4AF37',
  fontHeading: 'Playfair Display', fontBody: 'Inter', logoUrl: '/logo.svg', faviconUrl: '/favicon.ico',
};

const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorAuth: false, rateLimiting: true, captchaEnabled: true,
  sessionTimeout: 30, maxLoginAttempts: 5, auditLogs: true,
};

const DEFAULT_BACKUP: BackupSettings = {
  autoBackup: true, backupFrequency: 'daily', retentionDays: 30,
  lastBackup: '', nextBackup: '',
};

const DEFAULT_EMAIL: EmailSettings = {
  smtpHost: 'smtp.gmail.com', smtpPort: 587, smtpUser: 'admin@homergere.com',
  smtpPassword: '', fromName: 'Homer Gere Admin', fromEmail: 'admin@homergere.com', enabled: true,
};

const DEFAULT_SEO: SEOSettings = {
  metaTitle: 'Homer Gere – Official Website & Member Community',
  metaDescription: 'Welcome to the official Homer Gere website.',
  ogImage: '/og-image.jpg', googleAnalyticsId: '', sitemapEnabled: true,
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/',
};

const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  googleAnalytics: true, googleSearchConsole: false, mailchimp: false,
  stripe: true, whatsapp: false, telegram: false,
};

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
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [experienceRequests, setExperienceRequests] = useState<AdminExperienceRequest[]>([]);
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [contactMessages, setContactMessages] = useState<AdminContactMessage[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [media, setMedia] = useState<AdminMediaItem[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [pages, setPages] = useState<AdminPage[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(DEFAULT_SECURITY);
  const [backupSettings, setBackupSettings] = useState<BackupSettings>(DEFAULT_BACKUP);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(DEFAULT_EMAIL);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(DEFAULT_SEO);
  const [integrations, setIntegrations] = useState<IntegrationSettings>(DEFAULT_INTEGRATIONS);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesRes, plansRes, appsRes, expsRes, reqsRes, fanChatRes, bizChatRes, notifRes, settingsRes, mediaVidsRes, mediaPodsRes, mediaPressRes] = await Promise.allSettled([
        profilesRepository.getAll(),
        membershipPlansRepository.getAll(),
        registrationRepository.getAll(),
        experiencesRepository.getAll(),
        experienceRequestsRepository.getAll(),
        fanChatRepository.getConversations(),
        businessEnquiriesRepository.getAll(),
        notificationsRepository.getByUserId('admin'),
        siteSettingsRepository.getAll(),
        mediaRepository.getVideos(),
        mediaRepository.getPodcasts(),
        mediaRepository.getPress(),
      ]);

      if (profilesRes.status === 'fulfilled') {
        setMembers(profilesRes.value.map((p) => ({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          email: p.email,
          membership: p.membership_tier || 'None',
          status: p.role === 'pending' ? 'pending' as const : 'active' as const,
          joinDate: p.created_at,
          lastActive: p.last_login || p.updated_at,
        })));
      }

      if (plansRes.status === 'fulfilled') {
        setPlans(plansRes.value.map((p) => ({
          id: p.id, name: p.name, price: p.price, period: p.period,
          members: p.members_count, status: p.status as AdminPlan['status'],
        })));
      }

      if (appsRes.status === 'fulfilled') {
        setApplications(appsRes.value.map((a) => ({
          id: a.id, name: `${a.first_name} ${a.last_name}`, email: a.email,
          plan: a.membership_tier || 'N/A', date: a.created_at, status: a.status as AdminApplication['status'],
        })));
      }

      if (expsRes.status === 'fulfilled') {
        setExperiences(expsRes.value.map((e) => ({
          id: e.id, title: e.title, type: e.type, price: e.price || 'N/A',
          availability: (e.availability as AdminExperience['availability']) || 'available', requests: 0,
        })));
      }

      if (reqsRes.status === 'fulfilled') {
        setExperienceRequests(reqsRes.value.map((r) => ({
          id: r.id, requester: r.full_name, experience: r.experience_type || 'General',
          date: r.created_at, status: r.status as AdminExperienceRequest['status'],
        })));
      }

      if (fanChatRes.status === 'fulfilled') {
        setConversations(fanChatRes.value.map((c) => ({
          id: c.id, type: 'fan' as const,
          participant: c.participant || 'Member', email: c.email || '',
          lastMessage: '', status: c.status as AdminConversation['status'],
          date: c.created_at,
        })));
      }

      if (bizChatRes.status === 'fulfilled') {
        setContactMessages(bizChatRes.value.map((b) => ({
          id: b.id, name: b.full_name, email: b.email,
          department: (b as any).department || 'general', subject: b.subject || '',
          message: b.message || '', date: b.created_at, read: false,
        })));
      }

      if (notifRes.status === 'fulfilled') {
        setNotifications(notifRes.value.map((n) => ({
          id: n.id, title: n.title, message: n.message,
          date: n.created_at, read: n.read,
        })));
      }

      if (settingsRes.status === 'fulfilled') {
        for (const s of settingsRes.value) {
          const data = s.settings as Record<string, unknown>;
          if (s.category === 'website') setWebsiteSettings((prev) => ({ ...prev, ...data } as WebsiteSettings));
          if (s.category === 'branding') setBranding((prev) => ({ ...prev, ...data } as BrandingSettings));
          if (s.category === 'security') setSecuritySettings((prev) => ({ ...prev, ...data } as SecuritySettings));
          if (s.category === 'email') setEmailSettings((prev) => ({ ...prev, ...data } as EmailSettings));
          if (s.category === 'seo') setSeoSettings((prev) => ({ ...prev, ...data } as SEOSettings));
          if (s.category === 'integrations') setIntegrations((prev) => ({ ...prev, ...data } as IntegrationSettings));
        }
      }

      const totalMedia = [
        ...(mediaVidsRes.status === 'fulfilled' ? mediaVidsRes.value : []),
        ...(mediaPodsRes.status === 'fulfilled' ? mediaPodsRes.value : []),
        ...(mediaPressRes.status === 'fulfilled' ? mediaPressRes.value : []),
      ];
      if (totalMedia.length > 0) {
        setMedia((totalMedia as any[]).map((m) => ({
          id: m.id as string, name: (m.title as string) || 'Untitled',
          type: 'video' as const, size: '', uploadedBy: 'Admin',
          date: (m.created_at as string) || '', url: (m.url as string) || '',
        })));
      }
    } catch {
      // Use empty defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

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
    // Optimistic local update
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));

    // Persist to Supabase
    if (updates.status === 'approved' || updates.status === 'declined') {
      (async () => {
        try {
          const app = applications.find((a) => a.id === id);
          if (!app) return;

          // Update registration_application status
          await supabase
            .from('registration_applications')
            .update({ status: updates.status, reviewed_at: new Date().toISOString() })
            .eq('email', app.email);

          if (updates.status === 'approved') {
            // Create Supabase Auth user
            const tempPassword = crypto.randomUUID().slice(0, 12) + 'A1!';
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
              email: app.email,
              password: tempPassword,
              email_confirm: true,
              user_metadata: { first_name: app.name.split(' ')[0], last_name: app.name.split(' ').slice(1).join(' ') },
            });

            if (!authError && authData?.user) {
              // Create profile
              await supabase.from('profiles').insert({
                id: authData.user.id,
                email: app.email,
                first_name: app.name.split(' ')[0],
                last_name: app.name.split(' ').slice(1).join(' ') || '',
                role: 'member',
                membership_tier: app.plan || 'silver',
                email_verified: true,
              });

              // Create membership
              const { data: plan } = await supabase
                .from('membership_plans')
                .select('id')
                .eq('slug', app.plan || 'silver')
                .maybeSingle();
              if (plan) {
                await supabase.from('memberships').insert({
                  user_id: authData.user.id,
                  plan_id: plan.id,
                  status: 'active',
                });
              }
            }

            // Notify
            await supabase.from('notifications').insert({
              title: 'Member Approved',
              message: `${app.name} (${app.email}) has been approved as ${app.plan || 'silver'} member.`,
              read: false,
            });

            // Send approval email
            emailService.registrationApproved(app.email, app.name.split(' ')[0]).catch(() => {});
            emailService.membershipApproved(app.email, app.name.split(' ')[0], app.plan || 'silver').catch(() => {});
          }

          if (updates.status === 'declined') {
            // Send rejection email
            emailService.registrationRejected(app.email, app.name.split(' ')[0], (updates as any).rejectionReason).catch(() => {});
          }
        } catch {
          // Silent — optimistic update already shown
        }
      })();
    }
  }, [applications]);
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
      return { ...c, lastMessage: text, messages: [...(c.messages || []), { sender, text, time }] };
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
    const id = generateId();
    setNotifications((prev) => [{ ...notif, id }, ...prev]);
    supabase.from('notifications').insert({
      user_id: 'admin',
      type: 'system',
      title: notif.title,
      message: notif.message,
      read: notif.read,
    }).then(() => {});
  }, []);
  const updateNotification = useCallback((id: string, updates: Partial<AdminNotification>) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    if (updates.read !== undefined) {
      supabase.from('notifications').update({ read: updates.read }).eq('id', id).then(() => {});
    }
  }, []);
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    supabase.from('notifications').delete().eq('id', id).then(() => {});
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

  // ----- Stats -----
  const stats: AdminStats = useMemo(() => ({
    totalMembers: members.length,
    activeMemberships: members.filter((m) => m.status === 'active').length,
    pendingApplications: applications.filter((a) => a.status === 'pending').length,
    fanChatMessages: conversations.filter((c) => c.type === 'fan').length * 12,
    businessEnquiries: conversations.filter((c) => c.type === 'business').length,
    experienceRequests: experienceRequests.length,
    journalArticles: pages.filter((p) => p.title.toLowerCase().includes('journal')).length * 4 || 0,
    galleryImages: media.filter((m) => m.type === 'image').length,
    mediaItems: media.length,
    websiteVisitors: 45230 + payments.length * 12,
  }), [members, applications, conversations, experienceRequests, pages, media, payments]);

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
        results.push({ id: p.id, type: 'plan', title: p.name, description: `$${p.price}/${p.period}`, section: 'Plans' });
      }
    });
    applications.forEach((a) => {
      if (a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)) {
        results.push({ id: a.id, type: 'application', title: a.name, description: `${a.status}`, section: 'Applications' });
      }
    });
    return results;
  }, [members, plans, applications]);

  const value: AdminContextType = useMemo(() => ({
    members, plans, applications, experiences, experienceRequests,
    conversations, contactMessages, notifications, media, payments, pages,
    stats, websiteSettings, branding, securitySettings, backupSettings,
    emailSettings, seoSettings, integrations, loading,
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
    globalAdminSearch, refreshData: loadData,
  }), [
    members, plans, applications, experiences, experienceRequests,
    conversations, contactMessages, notifications, media, payments, pages,
    stats, websiteSettings, branding, securitySettings, backupSettings,
    emailSettings, seoSettings, integrations, loading,
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
    globalAdminSearch, loadData,
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
