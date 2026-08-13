import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MemberProfile, MemberMembership, DashboardRequest, DashboardNotification,
  DashboardConversation, SecuritySession, MOCK_MEMBER, MOCK_MEMBERSHIP,
  MOCK_REQUESTS, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS, MOCK_SESSIONS,
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
  changePassword: (currentPw: string, newPw: string) => { success: boolean; error?: string };
  enable2FA: () => void;
  disable2FA: () => void;
  twoFactorEnabled: boolean;
}

// ============================================================
// localStorage helpers
// ============================================================

const STORAGE_KEY = 'homer_dashboard';

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

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayStr() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================================
// Initial data
// ============================================================

const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: 'm1', subject: 'Welcome to Homer Gere', lastMessage: 'Welcome to the community! I\'m glad you\'re here.',
    lastDate: 'Jan 15, 2025', lastSender: 'homer', read: true,
    messages: [
      { id: 'msg1', sender: 'system', text: 'Your account has been created. Welcome to the Homer Gere community!', date: 'Jan 15, 2025', read: true },
      { id: 'msg2', sender: 'homer', text: 'Welcome to the community! I\'m glad you\'re here. Feel free to explore and reach out anytime.', date: 'Jan 15, 2025', read: true },
    ],
  },
];

const INITIAL_HELP_TICKETS: HelpTicket[] = [];

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

  const getDefaultProfile = (): MemberProfile => {
    if (user) {
      return {
        ...MOCK_MEMBER,
        firstName: user.firstName || MOCK_MEMBER.firstName,
        lastName: user.lastName || MOCK_MEMBER.lastName,
        email: user.email || MOCK_MEMBER.email,
      };
    }
    return MOCK_MEMBER;
  };

  const [profile, setProfile] = useState<MemberProfile>(() => loadState('profile', getDefaultProfile()));
  const [membership, setMembership] = useState<MemberMembership>(() => loadState('membership', MOCK_MEMBERSHIP));
  const [requests, setRequests] = useState<DashboardRequest[]>(() => loadState('requests', MOCK_REQUESTS));
  const [notifications, setNotifications] = useState<DashboardNotification[]>(() => loadState('notifications', MOCK_NOTIFICATIONS));
  const [conversations, setConversations] = useState<DashboardConversation[]>(() => loadState('conversations', MOCK_CONVERSATIONS));
  const [sessions, setSessions] = useState<SecuritySession[]>(() => loadState('sessions', MOCK_SESSIONS));
  const [messages, setMessages] = useState<MessageThread[]>(() => loadState('messages', INITIAL_MESSAGES));
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>(() => loadState('bookmarks', []));
  const [favorites, setFavorites] = useState<FavoritePhoto[]>(() => loadState('favorites', []));
  const [helpTickets, setHelpTickets] = useState<HelpTicket[]>(() => loadState('helpTickets', INITIAL_HELP_TICKETS));
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => loadState('twoFactorEnabled', false));
  const [storedPassword] = useState(() => loadState('storedPassword', 'Password123!'));

  // Persist to localStorage on every change
  useEffect(() => { saveState('profile', profile); }, [profile]);
  useEffect(() => { saveState('membership', membership); }, [membership]);
  useEffect(() => { saveState('requests', requests); }, [requests]);
  useEffect(() => { saveState('notifications', notifications); }, [notifications]);
  useEffect(() => { saveState('conversations', conversations); }, [conversations]);
  useEffect(() => { saveState('sessions', sessions); }, [sessions]);
  useEffect(() => { saveState('messages', messages); }, [messages]);
  useEffect(() => { saveState('bookmarks', bookmarks); }, [bookmarks]);
  useEffect(() => { saveState('favorites', favorites); }, [favorites]);
  useEffect(() => { saveState('helpTickets', helpTickets); }, [helpTickets]);
  useEffect(() => { saveState('twoFactorEnabled', twoFactorEnabled); }, [twoFactorEnabled]);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user?.id]);

  // Profile
  const updateProfile = useCallback((updates: Partial<MemberProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

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
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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

  // Security
  const changePassword = useCallback((currentPw: string, newPw: string) => {
    if (!currentPw || !newPw) return { success: false, error: 'Please fill in all fields.' };
    if (currentPw !== storedPassword) return { success: false, error: 'Current password is incorrect.' };
    if (newPw.length < 8) return { success: false, error: 'New password must be at least 8 characters.' };
    if (!/[A-Z]/.test(newPw)) return { success: false, error: 'New password must contain an uppercase letter.' };
    if (!/[0-9]/.test(newPw)) return { success: false, error: 'New password must contain a number.' };
    if (!/[!@#$%^&*]/.test(newPw)) return { success: false, error: 'New password must contain a special character.' };
    return { success: true };
  }, [storedPassword]);

  const enable2FA = useCallback(() => { setTwoFactorEnabled(true); }, []);
  const disable2FA = useCallback(() => { setTwoFactorEnabled(false); }, []);

  return (
    <DashboardContext.Provider value={{
      profile, membership, requests, notifications, conversations, sessions,
      messages, bookmarks, favorites, helpTickets,
      updateProfile, updateMembership, addRequest, updateRequestStatus, withdrawRequest,
      markNotificationRead, markAllNotificationsRead, deleteNotification,
      addConversation, closeConversation, deleteConversation, revokeSession, revokeAllSessions,
      addMessageThread, addMessage, deleteMessageThread, markThreadRead,
      toggleBookmark, isBookmarked, toggleFavorite, isFavorited,
      addHelpTicket, replyHelpTicket, closeHelpTicket,
      changePassword, enable2FA, disable2FA, twoFactorEnabled,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
