export type DashboardSection =
  | 'home'
  | 'profile'
  | 'membership'
  | 'messages'
  | 'experiences'
  | 'bookmarks'
  | 'favorites'
  | 'downloads'
  | 'activity'
  | 'notifications'
  | 'settings'
  | 'security'
  | 'help';

export type RequestStatus = 'pending' | 'under_review' | 'approved' | 'declined' | 'completed';

export type NotificationType = 'membership' | 'reply' | 'experience' | 'journal' | 'system';

export interface MemberProfile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  avatar: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingPreferences: boolean;
  profileVisibility: 'members' | 'public';
  showOnlineStatus: boolean;
  allowMessageRequests: boolean;
  memberSince: string;
  lastLogin: string;
}

export interface MemberMembership {
  plan: string;
  status: 'active' | 'expired' | 'pending' | 'none';
  renewalDate: string;
  activationDate: string;
  membershipNumber: string;
  benefits: string[];
}

export interface DashboardRequest {
  id: string;
  type: 'experience' | 'business' | 'contact';
  title: string;
  description: string;
  status: RequestStatus;
  date: string;
  eventDate?: string;
  managementNotes?: string;
  department?: string;
}

export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface DashboardConversation {
  id: string;
  type: 'fan' | 'business';
  lastMessage: string;
  date: string;
  status: 'open' | 'replied' | 'closed';
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export const DEFAULT_MEMBER_PROFILE: MemberProfile = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  country: '',
  dateOfBirth: '',
  avatar: '',
  language: 'English',
  timezone: '',
  emailNotifications: true,
  smsNotifications: false,
  marketingPreferences: true,
  profileVisibility: 'members',
  showOnlineStatus: true,
  allowMessageRequests: true,
  memberSince: '',
  lastLogin: '',
};

export const DEFAULT_MEMBERSHIP: MemberMembership = {
  plan: '',
  status: 'none',
  renewalDate: '',
  activationDate: '',
  membershipNumber: '',
  benefits: [],
};

export const DASHBOARD_NAV_ITEMS: { id: DashboardSection; label: string; icon: string; group: 'main' | 'activity' | 'account' }[] = [
  { id: 'home', label: 'Dashboard', icon: 'LayoutDashboard', group: 'main' },
  { id: 'profile', label: 'My Profile', icon: 'User', group: 'main' },
  { id: 'membership', label: 'Membership', icon: 'Crown', group: 'main' },
  { id: 'messages', label: 'Messages', icon: 'MessageSquare', group: 'main' },
  { id: 'experiences', label: 'Experiences', icon: 'Sparkles', group: 'activity' },
  { id: 'downloads', label: 'Downloads', icon: 'Download', group: 'activity' },
  { id: 'activity', label: 'Activity Timeline', icon: 'Clock', group: 'activity' },
  { id: 'bookmarks', label: 'Journal Bookmarks', icon: 'Bookmark', group: 'activity' },
  { id: 'favorites', label: 'Gallery Favorites', icon: 'Heart', group: 'activity' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell', group: 'account' },
  { id: 'settings', label: 'Settings', icon: 'Settings', group: 'account' },
  { id: 'security', label: 'Security', icon: 'Shield', group: 'account' },
  { id: 'help', label: 'Help & Support', icon: 'HelpCircle', group: 'account' },
];
