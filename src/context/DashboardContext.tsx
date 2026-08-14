import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  MemberProfile, MemberMembership, DashboardRequest, DashboardNotification,
  DashboardConversation, SecuritySession, DEFAULT_MEMBER_PROFILE, DEFAULT_MEMBERSHIP,
} from '../data/dashboardData';

// ============================================================
// Extended types for new dashboard sections
// ============================================================

export interface MessageThread {
  id: string;
  subject: string;
  lastMessage: string;
  lastDate: string;
  lastSender: 'member' | 'homer' | 'system';
  read: boolean;
  messages: Message[];
}

export interface Message {
  id: string;
  sender: 'member' | 'homer' | 'system';
  text: string;
  date: string;
  read: boolean;
}

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
  profile: MemberProfile;
  membership: MemberMembership;
  requests: DashboardRequest[];
  notifications: DashboardNotification[];
  conversations: DashboardConversation[];
  sessions: SecuritySession[];
  messages: MessageThread[];
  bookmarks: BookmarkedArticle[];
  favorites: FavoritePhoto[];
  helpTickets: HelpTicket[];
  loading: boolean;

  updateProfile: (updates: Partial<MemberProfile>) => void;
  updateMembership: (updates: Partial<MemberMembership>) => void;
  addRequest: (request: Omit<DashboardRequest, 'id' | 'date' | 'status'>) => void;
  updateRequestStatus: (id: string, status: DashboardRequest['status']) => void;
  withdrawRequest: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addConversation: (conversation: Omit<DashboardConversation, 'id' | 'date'>) => void;
  closeConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  revokeSession: (id: string) => void;
  revokeAllSessions: () => void;
  addMessageThread: (subject: string, text: string) => string;
  addMessage: (threadId: string, text: string) => void;
  deleteMessageThread: (threadId: string) => void;
  markThreadRead: (threadId: string) => void;
  toggleBookmark: (article: Omit<BookmarkedArticle, 'id' | 'bookmarkedAt'>) => void;
  isBookmarked: (articleId: string) => boolean;
  toggleFavorite: (photo: Omit<FavoritePhoto, 'id' | 'favoritedAt'>) => void;
  isFavorited: (photoId: string) => boolean;
  addHelpTicket: (ticket: Omit<HelpTicket, 'id' | 'date' | 'status' | 'replies'>) => void;
  replyHelpTicket: (ticketId: string, text: string) => void;
  closeHelpTicket: (ticketId: string) => void;
  changePassword: (currentPw: string, newPw: string) => Promise<{ success: boolean; error?: string }>;
  enable2FA: () => void;
  disable2FA: () => void;
  twoFactorEnabled: boolean;
  refreshData: () => Promise<void>;
}

// ============================================================
// Helpers
// ============================================================

function generateId() {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayStr() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const [profile, setProfile] = useState<MemberProfile>(() => {
    if (user) {
      return {
        ...DEFAULT_MEMBER_PROFILE,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      };
    }
    return DEFAULT_MEMBER_PROFILE;
  });
  const [membership, setMembership] = useState<MemberMembership>(DEFAULT_MEMBERSHIP);
  const [requests, setRequests] = useState<DashboardRequest[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [conversations, setConversations] = useState<DashboardConversation[]>([]);
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [messages, setMessages] = useState<MessageThread[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [favorites, setFavorites] = useState<FavoritePhoto[]>([]);
  const [helpTickets, setHelpTickets] = useState<HelpTicket[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load profile from Supabase
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (mounted && profileData) {
          setProfile((prev) => ({
            ...prev,
            firstName: profileData.first_name || user.firstName || prev.firstName,
            lastName: profileData.last_name || user.lastName || prev.lastName,
            email: profileData.email || user.email || prev.email,
            phone: profileData.phone || prev.phone,
            memberSince: profileData.created_at || prev.memberSince,
            lastLogin: profileData.last_login || prev.lastLogin,
          }));
        }
      } catch {
        // Use defaults from auth user
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  // Load membership from Supabase
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const { data: membershipData } = await supabase
          .from('memberships')
          .select('*, membership_plans(*)')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (mounted && membershipData) {
          const plan = (membershipData as any).membership_plans;
          setMembership({
            plan: plan?.name || 'Member',
            status: 'active',
            renewalDate: membershipData.current_period_end || '',
            activationDate: membershipData.created_at,
            membershipNumber: membershipData.id || '',
            benefits: plan?.features || [],
          });
        }
      } catch {
        // Use defaults
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  // Load notifications from Supabase
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        if (mounted && data && data.length > 0) {
          setNotifications(data.map((n) => ({
            id: n.id,
            type: (n.type as DashboardNotification['type']) || 'system',
            title: n.title,
            message: n.message,
            date: n.created_at,
            read: n.read,
          })));
        }
      } catch {
        // Use empty defaults
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  // Profile — persist to Supabase
  const updateProfile = useCallback((updates: Partial<MemberProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (user) {
      const supabaseUpdates: Record<string, unknown> = {};
      if (updates.firstName !== undefined) supabaseUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) supabaseUpdates.last_name = updates.lastName;
      if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone;
      if (Object.keys(supabaseUpdates).length > 0) {
        supabase.from('profiles').update(supabaseUpdates).eq('id', user.id).then(() => {});
      }
    }
  }, [user]);

  // Membership
  const updateMembership = useCallback((updates: Partial<MemberMembership>) => {
    setMembership((prev) => ({ ...prev, ...updates }));
  }, []);

  // Requests
  const addRequest = useCallback((req: Omit<DashboardRequest, 'id' | 'date' | 'status'>) => {
    setRequests((prev) => [{ ...req, id: generateId(), date: todayStr(), status: 'pending' }, ...prev]);
  }, []);

  const updateRequestStatus = useCallback((id: string, status: DashboardRequest['status']) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  }, []);

  const withdrawRequest = useCallback((id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id && r.status === 'pending' ? { ...r, status: 'declined' as const } : r));
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    supabase.from('notifications').update({ read: true }).eq('id', id).then(() => {});
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (user) {
      supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false).then(() => {});
    }
  }, [user]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    supabase.from('notifications').delete().eq('id', id).then(() => {});
  }, []);

  // Conversations
  const addConversation = useCallback((conv: Omit<DashboardConversation, 'id' | 'date'>) => {
    setConversations((prev) => [{ ...conv, id: generateId(), date: 'Just now' }, ...prev]);
  }, []);

  const closeConversation = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, status: 'closed' } : c));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Sessions
  const revokeSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const revokeAllSessions = useCallback(() => {
    setSessions((prev) => prev.filter((s) => s.current));
  }, []);

  // Messages
  const addMessageThread = useCallback((subject: string, text: string) => {
    const threadId = generateId();
    const now = todayStr();
    const newMsg: Message = { id: generateId(), sender: 'member', text, date: now, read: true };
    const thread: MessageThread = {
      id: threadId,
      subject,
      lastMessage: text,
      lastDate: now,
      lastSender: 'member',
      read: true,
      messages: [newMsg],
    };
    setMessages((prev) => [thread, ...prev]);
    return threadId;
  }, []);

  const addMessage = useCallback((threadId: string, text: string) => {
    const now = todayStr();
    const newMsg: Message = { id: generateId(), sender: 'member', text, date: now, read: true };
    setMessages((prev) => prev.map((t) => {
      if (t.id !== threadId) return t;
      return { ...t, messages: [...t.messages, newMsg], lastMessage: text, lastDate: now, lastSender: 'member' as const };
    }));
  }, []);

  const deleteMessageThread = useCallback((threadId: string) => {
    setMessages((prev) => prev.filter((t) => t.id !== threadId));
  }, []);

  const markThreadRead = useCallback((threadId: string) => {
    setMessages((prev) => prev.map((t) => {
      if (t.id !== threadId) return t;
      return { ...t, read: true, messages: t.messages.map((m) => ({ ...m, read: true })) };
    }));
  }, []);

  // Bookmarks
  const toggleBookmark = useCallback((article: Omit<BookmarkedArticle, 'id' | 'bookmarkedAt'>) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.articleId === article.articleId);
      if (exists) return prev.filter((b) => b.articleId !== article.articleId);
      return [{ ...article, id: generateId(), bookmarkedAt: todayStr() }, ...prev];
    });
  }, []);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarks.some((b) => b.articleId === articleId);
  }, [bookmarks]);

  // Favorites
  const toggleFavorite = useCallback((photo: Omit<FavoritePhoto, 'id' | 'favoritedAt'>) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.photoId === photo.photoId);
      if (exists) return prev.filter((f) => f.photoId !== photo.photoId);
      return [{ ...photo, id: generateId(), favoritedAt: todayStr() }, ...prev];
    });
  }, []);

  const isFavorited = useCallback((photoId: string) => {
    return favorites.some((f) => f.photoId === photoId);
  }, [favorites]);

  // Help
  const addHelpTicket = useCallback((ticket: Omit<HelpTicket, 'id' | 'date' | 'status' | 'replies'>) => {
    setHelpTickets((prev) => [{ ...ticket, id: generateId(), date: todayStr(), status: 'open', replies: [] }, ...prev]);
  }, []);

  const replyHelpTicket = useCallback((ticketId: string, text: string) => {
    const reply: HelpReply = { id: generateId(), sender: 'member', text, date: todayStr() };
    setHelpTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, replies: [...t.replies, reply] } : t));
  }, []);

  const closeHelpTicket = useCallback((ticketId: string) => {
    setHelpTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: 'closed' } : t));
  }, []);

  // Security — uses Supabase Auth
  const changePassword = useCallback(async (currentPw: string, newPw: string) => {
    if (!currentPw || !newPw) return { success: false, error: 'Please fill in all fields.' };
    if (newPw.length < 8) return { success: false, error: 'New password must be at least 8 characters.' };
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update password.' };
    }
  }, []);

  const enable2FA = useCallback(() => { setTwoFactorEnabled(true); }, []);
  const disable2FA = useCallback(() => { setTwoFactorEnabled(false); }, []);

  const refreshData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRes, membershipRes, notifRes] = await Promise.allSettled([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('memberships').select('*, membership_plans(*)').eq('user_id', user.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.data) {
        const p = profileRes.value.data;
        setProfile((prev) => ({
          ...prev,
          firstName: p.first_name || prev.firstName,
          lastName: p.last_name || prev.lastName,
          email: p.email || prev.email,
          phone: p.phone || prev.phone,
          memberSince: p.created_at || prev.memberSince,
          lastLogin: p.last_login || prev.lastLogin,
        }));
      }

      if (membershipRes.status === 'fulfilled' && membershipRes.value.data) {
        const m = membershipRes.value.data as any;
        const plan = m.membership_plans;
        setMembership({
          plan: plan?.name || 'Member',
          status: 'active',
          renewalDate: m.current_period_end || '',
          activationDate: m.created_at,
          membershipNumber: m.id || '',
          benefits: plan?.features || [],
        });
      }

      if (notifRes.status === 'fulfilled' && notifRes.value.data) {
        setNotifications(notifRes.value.data.map((n) => ({
          id: n.id,
          type: (n.type as DashboardNotification['type']) || 'system',
          title: n.title,
          message: n.message,
          date: n.created_at,
          read: n.read,
        })));
      }
    } catch {
      // Silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <DashboardContext.Provider value={{
      profile, membership, requests, notifications, conversations, sessions,
      messages, bookmarks, favorites, helpTickets, loading,
      updateProfile, updateMembership, addRequest, updateRequestStatus, withdrawRequest,
      markNotificationRead, markAllNotificationsRead, deleteNotification,
      addConversation, closeConversation, deleteConversation, revokeSession, revokeAllSessions,
      addMessageThread, addMessage, deleteMessageThread, markThreadRead,
      toggleBookmark, isBookmarked, toggleFavorite, isFavorited,
      addHelpTicket, replyHelpTicket, closeHelpTicket,
      changePassword, enable2FA, disable2FA, twoFactorEnabled, refreshData,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
