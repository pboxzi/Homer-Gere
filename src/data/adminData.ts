export type AdminSection =
  | 'overview'
  | 'homepage' | 'navigation' | 'footer' | 'menus' | 'seo'
  | 'journey' | 'projects' | 'gallery' | 'media-content' | 'journal' | 'faqs'
  | 'members' | 'plans' | 'applications' | 'experiences' | 'experience-requests'
  | 'fan-chat' | 'business-chat' | 'contact-messages' | 'admin-notifications'
  | 'images' | 'videos' | 'documents'
  | 'membership-payments' | 'transactions'
  | 'visitors' | 'membership-stats' | 'experience-stats' | 'chat-stats'
  | 'website-settings' | 'branding' | 'comm-settings' | 'email-templates' | 'security' | 'backups' | 'integrations';

export interface AdminStats {
  totalMembers: number;
  activeMemberships: number;
  pendingApplications: number;
  fanChatMessages: number;
  businessEnquiries: number;
  experienceRequests: number;
  journalArticles: number;
  galleryImages: number;
  mediaItems: number;
  websiteVisitors: number;
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  membership: string;
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
}

export interface AdminPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  members: number;
  status: 'active' | 'draft' | 'archived';
}

export interface AdminApplication {
  id: string;
  name: string;
  email: string;
  plan: string;
  date: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface AdminExperience {
  id: string;
  title: string;
  type: string;
  price: string;
  availability: 'available' | 'limited' | 'unavailable';
  requests: number;
}

export interface AdminExperienceRequest {
  id: string;
  requester: string;
  experience: string;
  date: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
}

export interface AdminConversation {
  id: string;
  type: 'fan' | 'business';
  participant: string;
  email: string;
  company?: string;
  lastMessage: string;
  status: 'open' | 'in_progress' | 'closed';
  date: string;
}

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AdminMediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  uploadedBy: string;
  date: string;
  url: string;
}

export interface AdminPayment {
  id: string;
  member: string;
  plan: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

export interface AdminPage {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'scheduled';
  lastModified: string;
  author: string;
}

export const MOCK_ADMIN_STATS: AdminStats = {
  totalMembers: 1247,
  activeMemberships: 892,
  pendingApplications: 23,
  fanChatMessages: 3456,
  businessEnquiries: 89,
  experienceRequests: 156,
  journalArticles: 24,
  galleryImages: 312,
  mediaItems: 87,
  websiteVisitors: 45230,
};

export const MOCK_ADMIN_MEMBERS: AdminMember[] = [
  { id: 'm1', name: 'Sarah Johnson', email: 'sarah@email.com', membership: 'Gold', status: 'active', joinDate: '2025-01-15', lastActive: '2 hours ago' },
  { id: 'm2', name: 'Michael Chen', email: 'michael@email.com', membership: 'Platinum', status: 'active', joinDate: '2024-11-20', lastActive: '1 day ago' },
  { id: 'm3', name: 'Emma Wilson', email: 'emma@email.com', membership: 'Silver', status: 'active', joinDate: '2025-03-08', lastActive: '3 days ago' },
  { id: 'm4', name: 'James Rodriguez', email: 'james@email.com', membership: 'Gold', status: 'suspended', joinDate: '2024-09-12', lastActive: '2 weeks ago' },
  { id: 'm5', name: 'Olivia Brown', email: 'olivia@email.com', membership: 'None', status: 'pending', joinDate: '2025-08-10', lastActive: 'Just now' },
  { id: 'm6', name: 'David Kim', email: 'david@email.com', membership: 'Silver', status: 'active', joinDate: '2025-02-28', lastActive: '5 hours ago' },
];

export const MOCK_ADMIN_PLANS: AdminPlan[] = [
  { id: 'p1', name: 'Silver', price: 99, period: 'year', members: 423, status: 'active' },
  { id: 'p2', name: 'Gold', price: 199, period: 'year', members: 312, status: 'active' },
  { id: 'p3', name: 'Platinum', price: 499, period: 'year', members: 157, status: 'active' },
];

export const MOCK_ADMIN_APPLICATIONS: AdminApplication[] = [
  { id: 'a1', name: 'Olivia Brown', email: 'olivia@email.com', plan: 'Gold', date: 'Aug 10, 2025', status: 'pending' },
  { id: 'a2', name: 'Lucas Taylor', email: 'lucas@email.com', plan: 'Silver', date: 'Aug 9, 2025', status: 'pending' },
  { id: 'a3', name: 'Sophia Davis', email: 'sophia@email.com', plan: 'Platinum', date: 'Aug 8, 2025', status: 'approved' },
];

export const MOCK_ADMIN_EXPERIENCES: AdminExperience[] = [
  { id: 'e1', title: 'Meet & Greet', type: 'meet-and-greet', price: '$500', availability: 'available', requests: 45 },
  { id: 'e2', title: 'Virtual Greeting', type: 'video-greeting', price: '$150', availability: 'available', requests: 78 },
  { id: 'e3', title: 'Private Event', type: 'private-event', price: '$5,000', availability: 'limited', requests: 12 },
  { id: 'e4', title: 'Speaking Engagement', type: 'speaking-engagement', price: '$2,500', availability: 'unavailable', requests: 21 },
];

export const MOCK_ADMIN_EXPERIENCE_REQUESTS: AdminExperienceRequest[] = [
  { id: 'er1', requester: 'Sarah Johnson', experience: 'Meet & Greet — NYC Premiere', date: 'Aug 10, 2025', status: 'pending' },
  { id: 'er2', requester: 'Michael Chen', experience: 'Virtual Greeting — Birthday', date: 'Aug 9, 2025', status: 'approved' },
  { id: 'er3', requester: 'Emma Wilson', experience: 'Private Event', date: 'Aug 7, 2025', status: 'completed' },
];

export const MOCK_ADMIN_CONVERSATIONS: AdminConversation[] = [
  { id: 'c1', type: 'fan', participant: 'Sarah Johnson', email: 'sarah@email.com', lastMessage: 'Thank you so much!', status: 'open', date: 'Aug 10, 2025' },
  { id: 'c2', type: 'business', participant: 'Michael Chen', email: 'michael@luxeco.com', company: 'Luxe Brand Co.', lastMessage: 'Partnership proposal attached.', status: 'in_progress', date: 'Aug 9, 2025' },
  { id: 'c3', type: 'fan', participant: 'Emma Wilson', email: 'emma@email.com', lastMessage: 'When is the next event?', status: 'closed', date: 'Aug 8, 2025' },
];

export const MOCK_ADMIN_CONTACT_MESSAGES: AdminContactMessage[] = [
  { id: 'cm1', name: 'Robert Taylor', email: 'robert@email.com', department: 'Media & Press', subject: 'Interview Request', message: 'Would like to schedule an interview for Variety magazine.', date: 'Aug 10, 2025', read: false },
  { id: 'cm2', name: 'Lisa Wang', email: 'lisa@brandco.com', department: 'Brand Partnerships', subject: 'Collaboration Proposal', message: 'Interested in a brand partnership for our luxury line.', date: 'Aug 9, 2025', read: true },
  { id: 'cm3', name: 'Tom Anderson', email: 'tom@email.com', department: 'General Enquiries', subject: 'Fan Letter', message: 'Just wanted to express my admiration for Homer\'s work.', date: 'Aug 8, 2025', read: true },
];

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: 'n1', title: 'New Membership Application', message: 'Olivia Brown applied for Gold membership.', date: '2 hours ago', read: false },
  { id: 'n2', title: 'Experience Request', message: 'New Meet & Greet request from Sarah Johnson.', date: '5 hours ago', read: false },
  { id: 'n3', title: 'Business Enquiry', message: 'Partnership proposal from Luxe Brand Co.', date: '1 day ago', read: true },
];

export const MOCK_ADMIN_MEDIA: AdminMediaItem[] = [
  { id: 'mi1', name: 'hero-portrait.jpg', type: 'image', size: '2.4 MB', uploadedBy: 'Admin', date: 'Aug 10, 2025', url: '#' },
  { id: 'mi2', name: 'shards-premiere.jpg', type: 'image', size: '3.1 MB', uploadedBy: 'Admin', date: 'Aug 9, 2025', url: '#' },
  { id: 'mi3', name: 'interview-clip.mp4', type: 'video', size: '45.2 MB', uploadedBy: 'Admin', date: 'Aug 8, 2025', url: '#' },
  { id: 'mi4', name: 'press-kit.pdf', type: 'document', size: '1.8 MB', uploadedBy: 'Admin', date: 'Aug 7, 2025', url: '#' },
];

export const MOCK_ADMIN_PAYMENTS: AdminPayment[] = [
  { id: 'pay1', member: 'Sarah Johnson', plan: 'Gold', amount: 199, date: 'Aug 10, 2025', status: 'completed' },
  { id: 'pay2', member: 'Michael Chen', plan: 'Platinum', amount: 499, date: 'Aug 9, 2025', status: 'completed' },
  { id: 'pay3', member: 'Emma Wilson', plan: 'Silver', amount: 99, date: 'Aug 8, 2025', status: 'pending' },
];

export const MOCK_ADMIN_PAGES: AdminPage[] = [
  { id: 'home', title: 'Homepage', status: 'published', lastModified: 'Aug 10, 2025', author: 'Admin' },
  { id: 'journey', title: 'Journey', status: 'published', lastModified: 'Aug 9, 2025', author: 'Admin' },
  { id: 'projects', title: 'Projects', status: 'published', lastModified: 'Aug 8, 2025', author: 'Admin' },
  { id: 'gallery', title: 'Gallery', status: 'draft', lastModified: 'Aug 7, 2025', author: 'Admin' },
  { id: 'journal', title: 'Journal', status: 'published', lastModified: 'Aug 6, 2025', author: 'Admin' },
  { id: 'media', title: 'Media', status: 'published', lastModified: 'Aug 5, 2025', author: 'Admin' },
];

export const ADMIN_SIDEBAR_GROUPS: { label: string; items: { id: AdminSection; label: string }[] }[] = [
  { label: '', items: [{ id: 'overview', label: 'Dashboard' }] },
  { label: 'Website', items: [
    { id: 'homepage', label: 'Homepage' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'footer', label: 'Footer' },
    { id: 'menus', label: 'Menus' },
    { id: 'seo', label: 'SEO Settings' },
  ]},
  { label: 'Content', items: [
    { id: 'journey', label: 'Journey' },
    { id: 'projects', label: 'Projects' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'media-content', label: 'Media' },
    { id: 'journal', label: 'Journal' },
    { id: 'faqs', label: 'FAQs' },
  ]},
  { label: 'Community', items: [
    { id: 'members', label: 'Members' },
    { id: 'plans', label: 'Membership Plans' },
    { id: 'applications', label: 'Applications' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'experience-requests', label: 'Experience Requests' },
  ]},
  { label: 'Communications', items: [
    { id: 'fan-chat', label: 'Fan Chat' },
    { id: 'business-chat', label: 'Business Chat' },
    { id: 'contact-messages', label: 'Contact Messages' },
    { id: 'admin-notifications', label: 'Notifications' },
  ]},
  { label: 'Media Library', items: [
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
    { id: 'documents', label: 'Documents' },
  ]},
  { label: 'Payments', items: [
    { id: 'membership-payments', label: 'Membership Payments' },
    { id: 'transactions', label: 'Transactions' },
  ]},
  { label: 'Analytics', items: [
    { id: 'visitors', label: 'Visitors' },
    { id: 'membership-stats', label: 'Membership Statistics' },
    { id: 'experience-stats', label: 'Experience Requests' },
    { id: 'chat-stats', label: 'Chat Statistics' },
  ]},
  { label: 'System', items: [
    { id: 'website-settings', label: 'Website Settings' },
    { id: 'branding', label: 'Branding' },
    { id: 'comm-settings', label: 'Communication Settings' },
    { id: 'email-templates', label: 'Email Templates' },
    { id: 'security', label: 'Security' },
    { id: 'backups', label: 'Backup & Restore' },
    { id: 'integrations', label: 'Integrations' },
  ]},
];
