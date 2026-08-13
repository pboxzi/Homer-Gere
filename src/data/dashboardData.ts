export type DashboardSection =
  | 'home'
  | 'profile'
  | 'membership'
  | 'chat'
  | 'messages'
  | 'experiences'
  | 'requests'
  | 'bookmarks'
  | 'favorites'
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
  memberSince: string;
}

export interface MemberMembership {
  plan: string;
  status: 'active' | 'expired' | 'pending' | 'none';
  renewalDate: string;
  benefits: string[];
}

export interface DashboardRequest {
  id: string;
  type: 'experience' | 'business' | 'contact';
  title: string;
  description: string;
  status: RequestStatus;
  date: string;
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

export const MOCK_MEMBER: MemberProfile = {
  firstName: 'Alex',
  lastName: 'Morgan',
  username: 'alexmorgan',
  email: 'alex.morgan@email.com',
  phone: '+1 (555) 123-4567',
  country: 'United States',
  dateOfBirth: '1995-06-15',
  avatar: '',
  language: 'English',
  timezone: 'Pacific Time (PT)',
  emailNotifications: true,
  smsNotifications: false,
  marketingPreferences: true,
  memberSince: 'January 2025',
};

export const MOCK_MEMBERSHIP: MemberMembership = {
  plan: 'Gold',
  status: 'active',
  renewalDate: 'January 15, 2026',
  benefits: [
    'Priority chat responses',
    'Exclusive content access',
    'Early event registration',
    'Monthly Q&A sessions',
    'Behind-the-scenes updates',
  ],
};

export const MOCK_REQUESTS: DashboardRequest[] = [
  { id: 'r1', type: 'experience', title: 'Meet & Greet — NYC Premiere', description: 'Requested attendance at The Shards NYC premiere meet and greet.', status: 'approved', date: 'Dec 10, 2025' },
  { id: 'r2', type: 'business', title: 'Podcast Interview Request', description: 'Interview request for The Deep Cut podcast.', status: 'under_review', date: 'Dec 8, 2025' },
  { id: 'r3', type: 'experience', title: 'Virtual Greeting — Birthday', description: 'Personalized video greeting for fan birthday.', status: 'pending', date: 'Dec 5, 2025' },
  { id: 'r4', type: 'contact', title: 'Charity Collaboration', description: 'Partnership request for environmental nonprofit.', status: 'completed', date: 'Nov 28, 2025' },
];

export const MOCK_NOTIFICATIONS: DashboardNotification[] = [
  { id: 'n1', type: 'membership', title: 'Membership Renewal', message: 'Your Gold membership will renew on January 15, 2026.', date: '2 hours ago', read: false },
  { id: 'n2', type: 'experience', title: 'Experience Approved', message: 'Your Meet & Greet request for the NYC premiere has been approved.', date: '1 day ago', read: false },
  { id: 'n3', type: 'journal', title: 'New Journal Entry', message: 'Homer published a new journal entry: "Behind the Scenes of The Shards".', date: '2 days ago', read: true },
  { id: 'n4', type: 'reply', title: 'Management Reply', message: 'Your podcast interview request is being reviewed by the team.', date: '3 days ago', read: true },
  { id: 'n5', type: 'system', title: 'Platform Update', message: 'New features have been added to the member dashboard.', date: '5 days ago', read: true },
];

export const MOCK_CONVERSATIONS: DashboardConversation[] = [
  { id: 'c1', type: 'fan', lastMessage: 'Thanks for the kind words! — Homer', date: 'Yesterday', status: 'replied' },
  { id: 'c2', type: 'fan', lastMessage: 'Would love to hear about your favorite scene!', date: '3 days ago', status: 'open' },
  { id: 'c3', type: 'business', lastMessage: 'Your enquiry has been forwarded to the team.', date: '1 week ago', status: 'closed' },
];

export const MOCK_SESSIONS: SecuritySession[] = [
  { id: 's1', device: 'MacBook Pro', browser: 'Chrome 120', location: 'Los Angeles, CA', lastActive: 'Now', current: true },
  { id: 's2', device: 'iPhone 15', browser: 'Safari', location: 'Los Angeles, CA', lastActive: '2 hours ago', current: false },
  { id: 's3', device: 'iPad Air', browser: 'Safari', location: 'New York, NY', lastActive: '3 days ago', current: false },
];

export const DASHBOARD_NAV_ITEMS: { id: DashboardSection; label: string; icon: string; group: 'main' | 'activity' | 'account' }[] = [
  { id: 'home', label: 'Dashboard', icon: 'LayoutDashboard', group: 'main' },
  { id: 'profile', label: 'My Profile', icon: 'User', group: 'main' },
  { id: 'membership', label: 'Membership', icon: 'Crown', group: 'main' },
  { id: 'chat', label: 'Chat with Homer', icon: 'MessageSquare', group: 'main' },
  { id: 'messages', label: 'My Messages', icon: 'Inbox', group: 'main' },
  { id: 'experiences', label: 'Experiences', icon: 'Sparkles', group: 'activity' },
  { id: 'requests', label: 'My Requests', icon: 'FileText', group: 'activity' },
  { id: 'bookmarks', label: 'Journal Bookmarks', icon: 'Bookmark', group: 'activity' },
  { id: 'favorites', label: 'Gallery Favorites', icon: 'Heart', group: 'activity' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell', group: 'account' },
  { id: 'settings', label: 'Settings', icon: 'Settings', group: 'account' },
  { id: 'security', label: 'Security', icon: 'Shield', group: 'account' },
  { id: 'help', label: 'Help & Support', icon: 'HelpCircle', group: 'account' },
];
