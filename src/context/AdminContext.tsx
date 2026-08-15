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
  filmographyRepository,
  mediaRepository,
  notificationsRepository,
  siteSettingsRepository,
  emailTemplatesRepository,
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
  type AdminNotification,
  type AdminMediaItem,
  type AdminPage,
  EMPTY_ADMIN_STATS,
} from '../data/adminData';
import type { EmailTemplate } from '../types/database';

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
  businessEnquiries: AdminConversation[];
  notifications: AdminNotification[];
  media: AdminMediaItem[];
  pages: AdminPage[];
  emailTemplates: EmailTemplate[];
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
  deleteExperienceRequest: (id: string) => void;
  updateExperienceRequest: (id: string, status: 'approved' | 'declined' | 'completed') => void;
  addConversation: (conv: Omit<AdminConversation, 'id'>) => void;
  initiateConversationForMember: (userId: string, participant: string, email: string, membershipTier: string | null, firstMessage: string, sender: 'member' | 'admin') => Promise<void>;
  updateConversation: (id: string, updates: Partial<AdminConversation>) => void;
  deleteConversation: (id: string, type?: 'fan' | 'business') => void;
  sendConversationMessage: (conversationId: string, sender: string, text: string, type?: 'fan' | 'business') => void;
  addNotification: (notif: Omit<AdminNotification, 'id'>, userId?: string | null) => void;
  updateNotification: (id: string, updates: Partial<AdminNotification>) => void;
  deleteNotification: (id: string) => void;
  addMedia: (item: Omit<AdminMediaItem, 'id'>) => void;
  updateMedia: (id: string, updates: Partial<AdminMediaItem>) => void;
  deleteMedia: (id: string) => void;
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
  const [businessEnquiries, setBusinessEnquiries] = useState<AdminConversation[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [media, setMedia] = useState<AdminMediaItem[]>([]);
  const [pages, setPages] = useState<AdminPage[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
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
      const [profilesRes, plansRes, appsRes, expsRes, reqsRes, fanChatRes, bizChatRes, notifRes, settingsRes, mediaVidsRes, mediaPodsRes, mediaPressRes, journalRes, emailTemplatesRes, galleryRes] = await Promise.allSettled([
        profilesRepository.getAll(),
        membershipPlansRepository.getAll(),
        registrationRepository.getAll(),
        experiencesRepository.getAll(),
        experienceRequestsRepository.getAll(),
        fanChatRepository.getConversations(),
        businessEnquiriesRepository.getAll(),
        notificationsRepository.getAll(),
        siteSettingsRepository.getAll(),
        mediaRepository.getVideos(),
        mediaRepository.getPodcasts(),
        mediaRepository.getPress(),
        journalRepository.getAll(),
        emailTemplatesRepository.getAll(),
        galleryRepository.getAllPhotos(),
      ]);

      if (profilesRes.status === 'fulfilled') {
        setMembers(profilesRes.value.map((p) => ({
          id: p.id,
          name: `${p.first_name} ${p.last_name}`,
          email: p.email,
          membership: p.membership_tier || 'None',
          status: p.role === 'pending' ? 'pending' as const : 'active' as const,
          joinDate: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
          plan: a.membership_tier || 'N/A', date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: a.status as AdminApplication['status'],
          country: a.country,
          country_detected: a.country_detected,
          city_detected: a.city_detected,
          device_type: a.device_type,
          browser: a.browser,
          operating_system: a.operating_system,
          referral_source: a.referral_source,
          timezone: a.preferred_language,
          screen_resolution: null,
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
          date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), status: r.status as AdminExperienceRequest['status'],
        })));
      }

      if (fanChatRes.status === 'fulfilled') {
        setConversations(fanChatRes.value.map((c) => ({
          id: c.id, type: 'fan' as const,
          participant: c.participant || 'Member', email: c.email || '',
          lastMessage: c.last_message || '', unreadCount: c.unread_count || 0,
          status: c.status as AdminConversation['status'],
          date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        })));
      }

      if (bizChatRes.status === 'fulfilled') {
        setBusinessEnquiries(bizChatRes.value.map((b) => ({
          id: b.id, type: 'business' as const,
          participant: b.full_name, email: b.email, company: b.company,
          lastMessage: b.last_message || '', unreadCount: b.unread_count || 0,
          status: b.status, date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        })));
      }

      if (notifRes.status === 'fulfilled') {
        setNotifications(notifRes.value.map((n) => ({
          id: n.id, title: n.title, message: n.message,
          date: new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), read: n.read,
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
          date: m.created_at ? new Date(m.created_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '', url: (m.url as string) || '',
        })));
      }

      if (journalRes.status === 'fulfilled') {
        setJournalArticleCount(journalRes.value.length);
      }

      if (fanChatRes.status === 'fulfilled') {
        setFanMessageCount(fanChatRes.value.length);
      }

      if (emailTemplatesRes.status === 'fulfilled') {
        setEmailTemplates(emailTemplatesRes.value);
      }

      if (galleryRes.status === 'fulfilled') {
        setGalleryCount(galleryRes.value.length);
      }
    } catch {
      // Use empty defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Store counts for stats
  const [fanMessageCount, setFanMessageCount] = useState(0);
  const [journalArticleCount, setJournalArticleCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);

  // ----- CRUD: Members -----
  const addMember = useCallback((member: Omit<AdminMember, 'id'>) => {
    setMembers((prev) => [{ ...member, id: generateId() }, ...prev]);
    Promise.resolve(
      supabase.from('profiles').insert({
        id: generateId(),
        email: member.email,
        first_name: member.name.split(' ')[0],
        last_name: member.name.split(' ').slice(1).join(' ') || '',
        role: 'member',
        membership_tier: member.membership || null,
        email_verified: false,
      })
    ).then(() => {
      profilesRepository.getAll().then((fresh) => {
        setMembers(fresh.map(m => ({
          id: m.id, name: `${m.first_name} ${m.last_name}`.trim(),
          email: m.email, status: 'active',
          membership: m.membership_tier || 'None', joinDate: new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), lastActive: m.updated_at,
        })));
      });
    }).catch(() => {});
  }, []);
  const updateMember = useCallback((id: string, updates: Partial<AdminMember>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    // Persist relevant fields to Supabase
    const dbUpdates: Record<string, unknown> = {};
    if (updates.membership !== undefined) dbUpdates.membership_tier = updates.membership === 'None' ? null : updates.membership;
    if (updates.status !== undefined) dbUpdates.account_status = updates.status;
    if (Object.keys(dbUpdates).length > 0) {
      profilesRepository.update(id, dbUpdates as any).catch(() => {});
    }
    if (updates.name !== undefined || updates.email !== undefined) {
      const nameParts = (updates.name || '').split(' ');
      const nameEmailUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) {
        nameEmailUpdates.first_name = nameParts[0] || '';
        nameEmailUpdates.last_name = nameParts.slice(1).join(' ') || '';
      }
      if (updates.email !== undefined) nameEmailUpdates.email = updates.email;
      profilesRepository.update(id, nameEmailUpdates as any).catch(() => {});
    }
  }, []);
  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    Promise.resolve(
      supabase.from('profiles').delete().eq('id', id)
    ).catch(() => {});
  }, []);

  // ----- CRUD: Plans -----
  const addPlan = useCallback((plan: Omit<AdminPlan, 'id'>) => {
    const slug = plan.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    membershipPlansRepository.create({
      name: plan.name,
      slug,
      description: null,
      price: plan.price,
      currency: 'USD',
      period: plan.period,
      duration: null,
      badge: null,
      is_popular: false,
      features: [],
      cta_text: 'Join Now',
      availability: 'available',
      requires_approval: false,
      members_count: plan.members,
      status: plan.status,
      sort_order: 0,
    }).then(() => {
      membershipPlansRepository.getAll().then((fresh) => {
        setPlans(fresh.map((p) => ({
          id: p.id, name: p.name, price: p.price, period: p.period,
          members: p.members_count, status: p.status as AdminPlan['status'],
        })));
      });
    }).catch(() => {
      setPlans((prev) => [{ ...plan, id: generateId() }, ...prev]);
    });
  }, []);
  const updatePlan = useCallback((id: string, updates: Partial<AdminPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.period !== undefined) dbUpdates.period = updates.period;
    if (updates.members !== undefined) dbUpdates.members_count = updates.members;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    membershipPlansRepository.update(id, dbUpdates as any).then(() => {
      membershipPlansRepository.getAll().then((fresh) => {
        setPlans(fresh.map((p) => ({
          id: p.id, name: p.name, price: p.price, period: p.period,
          members: p.members_count, status: p.status as AdminPlan['status'],
        })));
      });
    }).catch(() => {});
  }, []);
  const deletePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    Promise.resolve(
      supabase.from('membership_plans').delete().eq('id', id)
    ).then(() => {
      return membershipPlansRepository.getAll().then((fresh) => {
        setPlans(fresh.map((p) => ({
          id: p.id, name: p.name, price: p.price, period: p.period,
          members: p.members_count, status: p.status as AdminPlan['status'],
        })));
      });
    }).catch(() => {});
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
          // Fetch the registration record directly from DB (avoids stale closure)
          const { data: regRecord } = await supabase
            .from('registration_applications')
            .select('user_id, first_name, last_name, email, country, membership_tier')
            .eq('id', id)
            .single();

          if (!regRecord) return;

          // Get current admin user for reviewed_by
          const { data: { user: adminUser } } = await supabase.auth.getUser();

          const now = new Date().toISOString();

          // Update registration_application status
          const updateData: Record<string, unknown> = {
            status: updates.status,
            reviewed_by: adminUser?.id || null,
            reviewed_at: now,
          };
          if (updates.status === 'approved') {
            updateData.approved_at = now;
          }
          if (updates.status === 'declined') {
            updateData.rejection_reason = (updates as any).rejectionReason || 'Application rejected by admin';
            updateData.rejected_at = now;
          }

          const { error: statusError } = await supabase
            .from('registration_applications')
            .update(updateData)
            .eq('id', id);

          if (statusError) {
            console.error('Failed to update application status:', statusError);
            setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'pending' } : a)));
            return;
          }

          // On approval: update the user's profile role to member
          if (updates.status === 'approved' && regRecord.user_id) {
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ role: 'member' })
              .eq('id', regRecord.user_id);
            if (profileError) {
              console.error('Failed to update profile role:', profileError);
            }
          }

          // Create in-app notification (type is required by DB schema)
          const { error: notifError } = await supabase.from('notifications').insert({
            user_id: regRecord.user_id || null,
            type: 'system',
            title: updates.status === 'approved' ? 'Member Approved' : 'Member Rejected',
            message: updates.status === 'approved'
              ? `${regRecord.first_name} ${regRecord.last_name} (${regRecord.email}) has been approved.`
              : `${regRecord.first_name} ${regRecord.last_name} (${regRecord.email}) has been rejected.`,
            read: false,
          });
          if (notifError) {
            console.error('Failed to create notification:', notifError);
          }

          // Create audit log
          const { error: auditError } = await supabase.from('audit_logs').insert({
            user_id: adminUser?.id || null,
            action: updates.status === 'approved' ? 'registration_approved' : 'registration_rejected',
            table_name: 'registration_applications',
            record_id: id,
            old_data: { status: 'pending' },
            new_data: { status: updates.status, reviewed_by: adminUser?.id },
          });
          if (auditError) {
            console.error('Failed to create audit log:', auditError);
          }

          // Send emails (fire and forget)
          if (updates.status === 'approved') {
            emailService.registrationApproved(regRecord.email, regRecord.first_name).catch(() => {});
          }
          if (updates.status === 'declined') {
            emailService.registrationRejected(regRecord.email, regRecord.first_name, (updates as any).rejectionReason).catch(() => {});
          }
        } catch (err) {
          console.error('Application update failed:', err);
          setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'pending' } : a)));
        }
      })();
    }
  }, []);
  const deleteApplication = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    Promise.resolve(
      supabase.from('registration_applications').delete().eq('id', id)
    ).catch(() => {});
  }, []);

  // ----- CRUD: Experiences -----
  const addExperience = useCallback((exp: Omit<AdminExperience, 'id'>) => {
    experiencesRepository.create({
      title: exp.title,
      type: exp.type,
      price: exp.price === 'N/A' ? null : parseFloat(exp.price) || null,
      availability: exp.availability,
      sort_order: 0,
    } as any).then(() => {
      experiencesRepository.getAll().then((fresh) => {
        setExperiences(fresh.map((e) => ({
          id: e.id, title: e.title, type: e.type, price: e.price || 'N/A',
          availability: (e.availability as AdminExperience['availability']) || 'available', requests: 0,
        })));
      });
    }).catch(() => {
      setExperiences((prev) => [{ ...exp, id: generateId() }, ...prev]);
    });
  }, []);
  const updateExperience = useCallback((id: string, updates: Partial<AdminExperience>) => {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.price !== undefined) dbUpdates.price = updates.price === 'N/A' ? null : parseFloat(updates.price) || null;
    if (updates.availability !== undefined) dbUpdates.availability = updates.availability;
    experiencesRepository.update(id, dbUpdates as any).catch(() => {});
  }, []);
  const deleteExperience = useCallback((id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    experiencesRepository.delete(id).catch(() => {});
  }, []);

  // ----- CRUD: Experience Requests -----
  const deleteExperienceRequest = useCallback((id: string) => {
    setExperienceRequests((prev) => prev.filter((r) => r.id !== id));
    experienceRequestsRepository.delete(id).catch(() => {});
  }, []);
  const updateExperienceRequest = useCallback((id: string, status: 'approved' | 'declined' | 'completed') => {
    setExperienceRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    experienceRequestsRepository.updateStatus(id, status).catch(() => {});
  }, []);

  // ----- CRUD: Conversations -----
  const addConversation = useCallback((conv: Omit<AdminConversation, 'id'>) => {
    setConversations((prev) => [{ ...conv, id: generateId() }, ...prev]);
    Promise.resolve(
      fanChatRepository.createConversation({
        participant: conv.participant || '',
        email: conv.email || '',
        status: conv.status || 'open',
        user_id: null,
        phone: null,
        membership_tier: null,
        method: null,
      })
    ).then(() => {
      fanChatRepository.getConversations().then((fresh) => {
        setConversations(fresh.map(c => ({
          id: c.id, type: 'fan' as const, participant: c.participant, email: c.email,
          lastMessage: '', status: c.status as any, date: c.updated_at,
          unreadCount: 0, messages: [],
        })));
      });
    }).catch(() => {});
  }, []);
  const initiateConversationForMember = useCallback(async (userId: string, participant: string, email: string, membershipTier: string | null, firstMessage: string, sender: 'member' | 'admin') => {
    try {
      const conv = await fanChatRepository.createConversation({
        participant,
        email,
        user_id: userId,
        status: 'open',
        phone: null,
        membership_tier: membershipTier,
        method: 'website',
      });
      setConversations((prev) => [{
        id: conv.id, type: 'fan' as const, participant, email,
        lastMessage: firstMessage, status: 'open', date: new Date(conv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        unreadCount: 0, messages: [],
      }, ...prev]);
      await fanChatRepository.sendMessage({
        conversation_id: conv.id,
        sender,
        text: firstMessage,
        media_type: null,
        media_url: null,
      });
    } catch { /* silent */ }
  }, []);
  const updateConversation = useCallback((id: string, updates: Partial<AdminConversation>) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (updates.status !== undefined) {
      fanChatRepository.updateConversationStatus(id, updates.status || 'open').catch(() => {});
    }
  }, []);
  const deleteConversation = useCallback((id: string, type: 'fan' | 'business' = 'fan') => {
    if (type === 'business') {
      setBusinessEnquiries((prev) => prev.filter((c) => c.id !== id));
      businessEnquiriesRepository.delete(id).catch(() => {});
    } else {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      fanChatRepository.deleteConversation(id).catch(() => {});
    }
  }, []);
  const sendConversationMessage = useCallback(async (conversationId: string, sender: string, text: string, type: 'fan' | 'business' = 'fan') => {
    const validSender: 'member' | 'admin' = sender === 'Admin' || sender === 'admin' ? 'admin' : 'member';

    if (type === 'business') {
      try {
        await businessEnquiriesRepository.sendMessage({
          enquiry_id: conversationId,
          sender: validSender,
          text,
          media_type: null,
          media_url: null,
        });
        // Update local state
        setBusinessEnquiries((prev) => prev.map((c) => c.id === conversationId ? { ...c, lastMessage: text } : c));
        // Send email notification
        const enquiry = businessEnquiries.find((c) => c.id === conversationId);
        if (enquiry) {
          emailService.businessEnquiryReply(enquiry.email, enquiry.participant).catch(() => {});
        }
      } catch { /* silent */ }
    } else {
      try {
        await fanChatRepository.sendMessage({
          conversation_id: conversationId,
          sender: validSender,
          text,
          media_type: null,
          media_url: null,
        });
        // Update local state
        setConversations((prev) => prev.map((c) => c.id === conversationId ? { ...c, lastMessage: text } : c));
        // Send email notification
        const conv = conversations.find((c) => c.id === conversationId);
        if (conv) {
          emailService.chatReplyFromHomer(conv.email, conv.participant).catch(() => {});
        }
      } catch { /* silent */ }
    }
  }, [conversations, businessEnquiries]);

  // ----- CRUD: Notifications -----
  const addNotification = useCallback(async (notif: Omit<AdminNotification, 'id'>, userId?: string | null) => {
    const id = generateId();
    setNotifications((prev) => [{ ...notif, id }, ...prev]);
    // Get current admin user for the notification
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    supabase.from('notifications').insert({
      user_id: userId || adminUser?.id || null,
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
    const newMedia = { ...item, id: generateId() };
    setMedia((prev) => [newMedia, ...prev]);
    Promise.resolve(
      mediaRepository.createVideo({
        title: item.name, url: item.url || '', description: null,
        thumbnail: null, source: null, category: null,
        duration: null, date: item.date || null, featured: false, sort_order: 0,
      })
    ).catch(() => {});
  }, []);
  const updateMedia = useCallback((id: string, updates: Partial<AdminMediaItem>) => {
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    Promise.resolve(
      mediaRepository.updateVideo(id, { title: updates.name } as any)
    ).catch(() => {});
  }, []);
  const deleteMedia = useCallback((id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    mediaRepository.deleteVideo(id).catch(() => {});
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
    siteSettingsRepository.upsert('website', updates as Record<string, unknown>).catch(() => {});
  }, []);
  const updateBranding = useCallback((updates: Partial<BrandingSettings>) => {
    setBranding((prev) => ({ ...prev, ...updates }));
    siteSettingsRepository.upsert('branding', updates as Record<string, unknown>).catch(() => {});
  }, []);
  const updateSecuritySettings = useCallback((updates: Partial<SecuritySettings>) => {
    setSecuritySettings((prev) => ({ ...prev, ...updates }));
    siteSettingsRepository.upsert('security', updates as Record<string, unknown>).catch(() => {});
  }, []);
  const updateBackupSettings = useCallback((updates: Partial<BackupSettings>) => {
    setBackupSettings((prev) => ({ ...prev, ...updates }));
  }, []);
  const updateEmailSettings = useCallback((updates: Partial<EmailSettings>) => {
    setEmailSettings((prev) => ({ ...prev, ...updates }));
    siteSettingsRepository.upsert('email', updates as Record<string, unknown>).catch(() => {});
  }, []);
  const updateSEOSettings = useCallback((updates: Partial<SEOSettings>) => {
    setSeoSettings((prev) => ({ ...prev, ...updates }));
    siteSettingsRepository.upsert('seo', updates as Record<string, unknown>).catch(() => {});
  }, []);
  const updateIntegrations = useCallback((updates: Partial<IntegrationSettings>) => {
    setIntegrations((prev) => ({ ...prev, ...updates }));
    siteSettingsRepository.upsert('integrations', updates as Record<string, unknown>).catch(() => {});
  }, []);

  // ----- Stats -----
  const stats: AdminStats = useMemo(() => ({
    totalMembers: members.length,
    activeMemberships: members.filter((m) => m.status === 'active').length,
    pendingApplications: applications.filter((a) => a.status === 'pending').length,
    fanChatMessages: fanMessageCount,
    businessEnquiries: businessEnquiries.length,
    experienceRequests: experienceRequests.length,
    journalArticles: journalArticleCount,
    galleryImages: galleryCount,
    mediaItems: media.length,
    websiteVisitors: 45230,
  }), [members, applications, experienceRequests, businessEnquiries, media, fanMessageCount, journalArticleCount, galleryCount]);

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
    experiences.forEach((e) => {
      if (e.title.toLowerCase().includes(q) || e.type.toLowerCase().includes(q)) {
        results.push({ id: e.id, type: 'experience', title: e.title, description: `${e.type} — ${e.price}`, section: 'Experiences' });
      }
    });
    experienceRequests.forEach((r) => {
      if (r.requester?.toLowerCase().includes(q) || r.experience?.toLowerCase().includes(q)) {
        results.push({ id: r.id, type: 'experienceRequest', title: r.experience, description: `${r.requester} — ${r.status}`, section: 'Experience Requests' });
      }
    });
    conversations.forEach((c) => {
      if (c.participant?.toLowerCase().includes(q)) {
        results.push({ id: c.id, type: 'conversation', title: c.participant, description: `${c.type} chat — ${c.status}`, section: 'Fan Chat' });
      }
    });
    businessEnquiries.forEach((be) => {
      if (be.participant?.toLowerCase().includes(q) || be.email?.toLowerCase().includes(q)) {
        results.push({ id: be.id, type: 'businessEnquiry', title: be.participant, description: `${be.company || ''} — ${be.status}`, section: 'Business Enquiries' });
      }
    });
    notifications.forEach((n) => {
      if (n.title?.toLowerCase().includes(q) || n.message?.toLowerCase().includes(q)) {
        results.push({ id: n.id, type: 'notification', title: n.title, description: n.message, section: 'Notifications' });
      }
    });
    media.forEach((m) => {
      if (m.name?.toLowerCase().includes(q)) {
        results.push({ id: m.id || String(Math.random()), type: 'media', title: m.name, description: m.type || 'Media', section: 'Media' });
      }
    });
    return results.slice(0, 20);
  }, [members, plans, applications, experiences, experienceRequests, conversations, businessEnquiries, notifications, media]);

  const value: AdminContextType = useMemo(() => ({
    members, plans, applications, experiences, experienceRequests,
    conversations, businessEnquiries, notifications, media, pages,
    emailTemplates,
    stats, websiteSettings, branding, securitySettings, backupSettings,
    emailSettings, seoSettings, integrations, loading,
    addMember, updateMember, deleteMember,
    addPlan, updatePlan, deletePlan,
    addApplication, updateApplication, deleteApplication,
    addExperience, updateExperience, deleteExperience, deleteExperienceRequest, updateExperienceRequest,
    addConversation, initiateConversationForMember, updateConversation, deleteConversation, sendConversationMessage,
    addNotification, updateNotification, deleteNotification,
    addMedia, updateMedia, deleteMedia,
    addPage, updatePage, deletePage,
    updateWebsiteSettings, updateBranding, updateSecuritySettings,
    updateBackupSettings, updateEmailSettings, updateSEOSettings, updateIntegrations,
    globalAdminSearch, refreshData: loadData,
  }), [
    members, plans, applications, experiences, experienceRequests,
    conversations, businessEnquiries, notifications, media, pages,
    emailTemplates,
    stats, websiteSettings, branding, securitySettings, backupSettings,
    emailSettings, seoSettings, integrations, loading,
    addMember, updateMember, deleteMember,
    addPlan, updatePlan, deletePlan,
    addApplication, updateApplication, deleteApplication,
    addExperience, updateExperience, deleteExperience, deleteExperienceRequest, updateExperienceRequest,
    addConversation, initiateConversationForMember, updateConversation, deleteConversation, sendConversationMessage,
    addNotification, updateNotification, deleteNotification,
    addMedia, updateMedia, deleteMedia,
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
