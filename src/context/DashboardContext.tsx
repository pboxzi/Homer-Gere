import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  profilesRepository,
  membershipsRepository,
  membershipRequestsRepository,
  membershipPlansRepository,
  paymentRequestsRepository,
  paymentSubmissionsRepository,
  paymentMethodsRepository,
  experienceRequestsRepository,
  fanChatRepository,
  businessEnquiriesRepository,
  notificationsRepository,
  activityLogsRepository,
  auditLogsRepository,
} from '../lib/repositories';
import type {
  Profile, Membership, MembershipRequest, MembershipPlan,
  PaymentRequest, PaymentSubmission, PaymentMethod,
  ExperienceRequest, Notification, ActivityLog,
  FanConversation, FanMessage,
} from '../types/database';
import {
  DEFAULT_MEMBER_PROFILE, DEFAULT_MEMBERSHIP, DASHBOARD_NAV_ITEMS,
} from '../data/dashboardData';
import type { DashboardSection, DashboardNotification } from '../data/dashboardData';

// ============================================================
// Extended types
// ============================================================

export interface BookmarkedArticle {
  id: string;
  articleId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  bookmarkedAt: string;
}

export interface FavoritePhoto {
  id: string;
  photoId: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  date: string;
  favoritedAt: string;
}

export interface HelpTicket {
  id: string;
  subject: string;
  message: string;
  category: 'account' | 'membership' | 'billing' | 'technical' | 'other';
  status: 'open' | 'replied' | 'closed';
  date: string;
  replies: HelpReply[];
}

export interface HelpReply {
  id: string;
  sender: 'member' | 'support';
  text: string;
  date: string;
}

// ============================================================
// Context shape
// ============================================================

interface DashboardContextType {
  profile: Profile | null;
  profileLoading: boolean;
  membership: Membership | null;
  membershipPlan: MembershipPlan | null;
  membershipRequests: MembershipRequest[];
  paymentRequests: PaymentRequest[];
  paymentSubmissions: PaymentSubmission[];
  paymentMethods: PaymentMethod[];
  experienceRequests: ExperienceRequest[];
  notifications: DashboardNotification[];
  activityLogs: ActivityLog[];
  conversations: FanConversation[];
  fanMessages: FanMessage[];
  bookmarks: BookmarkedArticle[];
  favorites: FavoritePhoto[];
  helpTickets: HelpTicket[];
  loading: boolean;

  refreshData: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshPayments: () => Promise<void>;
  refreshExperiences: () => Promise<void>;
  refreshActivity: () => Promise<void>;

  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  changePassword: (currentPw: string, newPw: string) => Promise<{ success: boolean; error?: string }>;
  logActivity: (action: string, module: string, description: string, metadata?: Record<string, unknown>) => Promise<void>;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  addHelpTicket: (ticket: Omit<HelpTicket, 'id' | 'date' | 'status' | 'replies'>) => void;
  replyHelpTicket: (ticketId: string, text: string) => void;
  closeHelpTicket: (ticketId: string) => void;

  toggleBookmark: (article: Omit<BookmarkedArticle, 'id' | 'bookmarkedAt'>) => void;
  isBookmarked: (articleId: string) => boolean;
  toggleFavorite: (photo: Omit<FavoritePhoto, 'id' | 'favoritedAt'>) => void;
  isFavorited: (photoId: string) => boolean;

  unreadCount: number;
  pendingCount: number;
  completedCount: number;
}

// ============================================================
// Helpers
// ============================================================

function generateId() {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ============================================================
// Context
// ============================================================

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Core state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [membershipPlan, setMembershipPlan] = useState<MembershipPlan | null>(null);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [paymentSubmissions, setPaymentSubmissions] = useState<PaymentSubmission[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [experienceRequests, setExperienceRequests] = useState<ExperienceRequest[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [conversations, setConversations] = useState<FanConversation[]>([]);
  const [fanMessages, setFanMessages] = useState<FanMessage[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [favorites, setFavorites] = useState<FavoritePhoto[]>([]);
  const [helpTickets, setHelpTickets] = useState<HelpTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // Load profile from Supabase
  // ============================================================
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    setProfileLoading(true);
    try {
      const data = await profilesRepository.getById(user.id);
      if (data) setProfile(data);
    } catch { /* silent */ }
    setProfileLoading(false);
  }, [user?.id]);

  // ============================================================
  // Load membership from Supabase
  // ============================================================
  const loadMembership = useCallback(async () => {
    if (!user?.id) return;
    try {
      const active = await membershipsRepository.getByUserId(user.id);
      setMembership(active);
      if (active?.plan_id) {
        const plans = await membershipPlansRepository.getAll();
        const plan = plans.find((p) => p.id === active.plan_id) || null;
        setMembershipPlan(plan);
      }
    } catch { /* silent */ }
  }, [user?.id]);

  // ============================================================
  // Load membership requests
  // ============================================================
  const loadMembershipRequests = useCallback(async () => {
    if (!user?.id) return;
    try {
      const requests = await membershipRequestsRepository.getByUserId(user.id);
      setMembershipRequests(requests);
    } catch { /* silent */ }
  }, [user?.id]);

  // ============================================================
  // Load payments
  // ============================================================
  const refreshPayments = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [reqs, subs, meths] = await Promise.all([
        paymentRequestsRepository.getByUserId(user.id),
        paymentSubmissionsRepository.getByUserId(user.id),
        paymentMethodsRepository.getActive(),
      ]);
      setPaymentRequests(reqs);
      setPaymentSubmissions(subs);
      setPaymentMethods(meths);
    } catch { /* silent */ }
  }, [user?.id]);

  // ============================================================
  // Load experience requests
  // ============================================================
  const refreshExperiences = useCallback(async () => {
    if (!user?.id) return;
    try {
      const reqs = await experienceRequestsRepository.getByUserId(user.id);
      setExperienceRequests(reqs);
    } catch { /* silent */ }
  }, [user?.id]);

  // ============================================================
  // Load notifications
  // ============================================================
  const refreshNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await notificationsRepository.getByUserId(user.id);
      setNotifications(data.map((n) => ({
        id: n.id,
        type: (n.type as DashboardNotification['type']) || 'system',
        title: n.title,
        message: n.message,
        date: n.created_at,
        read: n.read,
      })));
    } catch { /* silent */ }
  }, [user?.id]);

  // ============================================================
  // Load activity logs
  // ============================================================
  const refreshActivity = useCallback(async () => {
    if (!user?.id) return;
    try {
      const logs = await activityLogsRepository.getByUserId(user.id, 50);
      setActivityLogs(logs);
    } catch { /* silent */ }
  }, [user?.id]);

  // ============================================================
  // Load conversations
  // ============================================================
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      const allConvs = await fanChatRepository.getConversations();
      const convs = allConvs.filter((c) => c.user_id === user.id);
      setConversations(convs);
      // Load messages for each conversation
      const allMessages: FanMessage[] = [];
      for (const conv of convs.slice(0, 5)) {
        try {
          const msgs = await fanChatRepository.getMessages(conv.id);
          allMessages.push(...msgs);
        } catch { /* skip */ }
      }
      setFanMessages(allMessages);
    } catch { /* silent */ }
  }, [user?.id]);

  // ============================================================
  // Load all data
  // ============================================================
  const refreshData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await Promise.allSettled([
        refreshProfile(),
        loadMembership(),
        loadMembershipRequests(),
        refreshPayments(),
        refreshExperiences(),
        refreshNotifications(),
        refreshActivity(),
        loadConversations(),
      ]);
    } catch { /* silent */ }
    setLoading(false);
  }, [user?.id, refreshProfile, loadMembership, loadMembershipRequests, refreshPayments, refreshExperiences, refreshNotifications, refreshActivity, loadConversations]);

  // Initial load
  useEffect(() => {
    if (user?.id) refreshData();
  }, [user?.id, refreshData]);

  // ============================================================
  // Profile update - persist to Supabase
  // ============================================================
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user?.id) return;
    try {
      await profilesRepository.update(user.id, updates);
      setProfile((prev) => prev ? { ...prev, ...updates } : prev);
      // Log activity
      await activityLogsRepository.create({
        user_id: user.id,
        action: 'update',
        module: 'profile',
        description: 'Profile updated',
        metadata: { fields: Object.keys(updates) },
        ip_address: null,
        user_agent: navigator.userAgent,
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  }, [user?.id]);

  // ============================================================
  // Password change
  // ============================================================
  const changePassword = useCallback(async (currentPw: string, newPw: string) => {
    if (!currentPw || !newPw) return { success: false, error: 'Please fill in all fields.' };
    if (newPw.length < 8) return { success: false, error: 'New password must be at least 8 characters.' };
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) return { success: false, error: error.message };
      if (user?.id) {
        await activityLogsRepository.create({
          user_id: user.id,
          action: 'update',
          module: 'security',
          description: 'Password changed',
          metadata: {},
          ip_address: null,
          user_agent: navigator.userAgent,
        });
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update password.' };
    }
  }, [user?.id]);

  // ============================================================
  // Activity logging helper
  // ============================================================
  const logActivity = useCallback(async (action: string, module: string, description: string, metadata: Record<string, unknown> = {}) => {
    if (!user?.id) return;
    try {
      await activityLogsRepository.create({
        user_id: user.id,
        action,
        module,
        description,
        metadata,
        ip_address: null,
        user_agent: navigator.userAgent,
      });
      // Refresh activity logs in background
      refreshActivity();
    } catch { /* silent */ }
  }, [user?.id, refreshActivity]);

  // ============================================================
  // Notifications
  // ============================================================
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    notificationsRepository.markAsRead(id).catch(() => {});
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (user?.id) {
      notificationsRepository.markAllAsRead(user.id).catch(() => {});
    }
  }, [user?.id]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    notificationsRepository.delete(id).catch(() => {});
  }, []);

  // ============================================================
  // Bookmarks (local state, persisted to localStorage)
  // ============================================================
  const toggleBookmark = useCallback((article: Omit<BookmarkedArticle, 'id' | 'bookmarkedAt'>) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.articleId === article.articleId);
      const next = exists
        ? prev.filter((b) => b.articleId !== article.articleId)
        : [{ ...article, id: generateId(), bookmarkedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem('hg_bookmarks', JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarks.some((b) => b.articleId === articleId);
  }, [bookmarks]);

  // ============================================================
  // Favorites (local state, persisted to localStorage)
  // ============================================================
  const toggleFavorite = useCallback((photo: Omit<FavoritePhoto, 'id' | 'favoritedAt'>) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.photoId === photo.photoId);
      const next = exists
        ? prev.filter((f) => f.photoId !== photo.photoId)
        : [{ ...photo, id: generateId(), favoritedAt: new Date().toISOString() }, ...prev];
      localStorage.setItem('hg_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorited = useCallback((photoId: string) => {
    return favorites.some((f) => f.photoId === photoId);
  }, [favorites]);

  // ============================================================
  // Help tickets (local state)
  // ============================================================
  const addHelpTicket = useCallback((ticket: Omit<HelpTicket, 'id' | 'date' | 'status' | 'replies'>) => {
    setHelpTickets((prev) => [{
      ...ticket,
      id: generateId(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'open',
      replies: [],
    }, ...prev]);
  }, []);

  const replyHelpTicket = useCallback((ticketId: string, text: string) => {
    const reply: HelpReply = {
      id: generateId(),
      sender: 'member',
      text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setHelpTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, replies: [...t.replies, reply] } : t));
  }, []);

  const closeHelpTicket = useCallback((ticketId: string) => {
    setHelpTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: 'closed' } : t));
  }, []);

  // Load bookmarks/favorites from localStorage
  useEffect(() => {
    try {
      const bm = localStorage.getItem('hg_bookmarks');
      if (bm) setBookmarks(JSON.parse(bm));
      const fv = localStorage.getItem('hg_favorites');
      if (fv) setFavorites(JSON.parse(fv));
    } catch { /* silent */ }
  }, []);

  // ============================================================
  // Computed values
  // ============================================================
  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingCount = experienceRequests.filter((r) => r.status === 'pending').length +
    membershipRequests.filter((r) => !['rejected', 'membership_active'].includes(r.status)).length;
  const completedCount = experienceRequests.filter((r) => r.status === 'completed').length +
    membershipRequests.filter((r) => r.status === 'membership_active').length;

  return (
    <DashboardContext.Provider value={{
      profile, profileLoading, membership, membershipPlan, membershipRequests,
      paymentRequests, paymentSubmissions, paymentMethods,
      experienceRequests, notifications, activityLogs,
      conversations, fanMessages, bookmarks, favorites, helpTickets, loading,
      refreshData, refreshProfile, refreshNotifications, refreshPayments,
      refreshExperiences, refreshActivity,
      updateProfile, changePassword, logActivity,
      markNotificationRead, markAllNotificationsRead, deleteNotification,
      addHelpTicket, replyHelpTicket, closeHelpTicket,
      toggleBookmark, isBookmarked, toggleFavorite, isFavorited,
      unreadCount, pendingCount, completedCount,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
