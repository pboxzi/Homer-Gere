export type AdminSection =
  | 'overview'
  | 'homepage' | 'navigation' | 'footer' | 'menus' | 'seo'
  | 'journey' | 'projects' | 'gallery' | 'media-content' | 'journal' | 'faqs'
  | 'members' | 'plans' | 'applications' | 'experiences' | 'experience-requests'
  | 'fan-chat' | 'business-chat' | 'contact-messages' | 'admin-notifications'
  | 'images' | 'videos' | 'documents'
  | 'membership-payments' | 'transactions'
  | 'visitors' | 'membership-stats' | 'experience-stats' | 'chat-stats'
  | 'website-settings' | 'branding' | 'comm-settings' | 'email-templates' | 'security' | 'backups' | 'integrations'
  | 'membership-requests' | 'payment-methods' | 'payment-requests' | 'payment-submissions' | 'membership-cards';

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

export interface AdminConversationMessage {
  sender: string;
  text: string;
  time: string;
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
  messages?: AdminConversationMessage[];
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

export interface ContentItem {
  id: string;
  title: string;
  section: 'journey' | 'projects' | 'gallery' | 'media' | 'journal' | 'faqs';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  author: string;
  lastModified: string;
  tags: string[];
  category: string;
  excerpt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

export interface JournalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  publishedDate: string;
  lastModified: string;
  readTime: string;
  views: number;
}

export const EMPTY_ADMIN_STATS: AdminStats = {
  totalMembers: 0,
  activeMemberships: 0,
  pendingApplications: 0,
  fanChatMessages: 0,
  businessEnquiries: 0,
  experienceRequests: 0,
  journalArticles: 0,
  galleryImages: 0,
  mediaItems: 0,
  websiteVisitors: 0,
};

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
    { id: 'membership-requests', label: 'Membership Requests' },
    { id: 'experience-requests', label: 'Experience Requests' },
    { id: 'payment-methods', label: 'Payment Methods' },
    { id: 'payment-requests', label: 'Payment Requests' },
    { id: 'payment-submissions', label: 'Payment Submissions' },
    { id: 'membership-cards', label: 'Membership Cards' },
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
