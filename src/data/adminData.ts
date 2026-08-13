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
  { id: 'm7', name: 'Jessica Martinez', email: 'jessica@email.com', membership: 'Platinum', status: 'active', joinDate: '2024-08-05', lastActive: '12 hours ago' },
  { id: 'm8', name: 'William Taylor', email: 'william@email.com', membership: 'Gold', status: 'active', joinDate: '2025-04-22', lastActive: '6 hours ago' },
  { id: 'm9', name: 'Sophia Anderson', email: 'sophia@email.com', membership: 'Silver', status: 'active', joinDate: '2025-05-14', lastActive: '1 day ago' },
  { id: 'm10', name: 'Daniel Lee', email: 'daniel@email.com', membership: 'Gold', status: 'active', joinDate: '2024-12-01', lastActive: '3 hours ago' },
  { id: 'm11', name: 'Aisha Patel', email: 'aisha@email.com', membership: 'Platinum', status: 'active', joinDate: '2024-10-18', lastActive: '45 minutes ago' },
  { id: 'm12', name: 'Lucas Garcia', email: 'lucas@email.com', membership: 'Silver', status: 'pending', joinDate: '2025-08-12', lastActive: 'Just now' },
  { id: 'm13', name: 'Mia Thompson', email: 'mia@email.com', membership: 'Gold', status: 'active', joinDate: '2025-06-03', lastActive: '4 hours ago' },
  { id: 'm14', name: 'Ethan White', email: 'ethan@email.com', membership: 'Silver', status: 'suspended', joinDate: '2025-01-25', lastActive: '1 month ago' },
  { id: 'm15', name: 'Zoe Robinson', email: 'zoe@email.com', membership: 'Platinum', status: 'active', joinDate: '2024-07-11', lastActive: '2 hours ago' },
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
  { id: 'a4', name: 'Nathan Brooks', email: 'nathan@email.com', plan: 'Gold', date: 'Aug 7, 2025', status: 'pending' },
  { id: 'a5', name: 'Chloe Adams', email: 'chloe@email.com', plan: 'Silver', date: 'Aug 6, 2025', status: 'declined' },
  { id: 'a6', name: 'Marcus Hall', email: 'marcus@email.com', plan: 'Platinum', date: 'Aug 5, 2025', status: 'approved' },
  { id: 'a7', name: 'Isabella Wright', email: 'isabella@email.com', plan: 'Gold', date: 'Aug 4, 2025', status: 'pending' },
  { id: 'a8', name: 'Alexander Scott', email: 'alex@email.com', plan: 'Silver', date: 'Aug 3, 2025', status: 'approved' },
  { id: 'a9', name: 'Harper Nelson', email: 'harper@email.com', plan: 'Gold', date: 'Aug 2, 2025', status: 'pending' },
  { id: 'a10', name: 'Victoria Carter', email: 'victoria@email.com', plan: 'Platinum', date: 'Aug 1, 2025', status: 'declined' },
];

export const MOCK_ADMIN_EXPERIENCES: AdminExperience[] = [
  { id: 'e1', title: 'Meet & Greet', type: 'meet-and-greet', price: '$500', availability: 'available', requests: 45 },
  { id: 'e2', title: 'Virtual Greeting', type: 'video-greeting', price: '$150', availability: 'available', requests: 78 },
  { id: 'e3', title: 'Private Event', type: 'private-event', price: '$5,000', availability: 'limited', requests: 12 },
  { id: 'e4', title: 'Speaking Engagement', type: 'speaking-engagement', price: '$2,500', availability: 'unavailable', requests: 21 },
  { id: 'e5', title: 'Autographed memorabilia', type: 'signed-item', price: '$75', availability: 'available', requests: 134 },
  { id: 'e7', title: 'Studio Visit', type: 'studio-visit', price: '$3,000', availability: 'limited', requests: 8 },
];

export const MOCK_ADMIN_EXPERIENCE_REQUESTS: AdminExperienceRequest[] = [
  { id: 'er1', requester: 'Sarah Johnson', experience: 'Meet & Greet — NYC Premiere', date: 'Aug 10, 2025', status: 'pending' },
  { id: 'er2', requester: 'Michael Chen', experience: 'Virtual Greeting — Birthday', date: 'Aug 9, 2025', status: 'approved' },
  { id: 'er3', requester: 'Emma Wilson', experience: 'Private Event', date: 'Aug 7, 2025', status: 'completed' },
  { id: 'er4', requester: 'David Kim', experience: 'Speaking Engagement — Tech Conference', date: 'Aug 6, 2025', status: 'pending' },
  { id: 'er5', requester: 'Jessica Martinez', experience: 'Meet & Greet — LA Screening', date: 'Aug 5, 2025', status: 'approved' },
  { id: 'er6', requester: 'William Taylor', experience: 'Virtual Greeting — Anniversary', date: 'Aug 4, 2025', status: 'completed' },
  { id: 'er7', requester: 'Sophia Anderson', experience: 'Private Event — Corporate Gala', date: 'Aug 3, 2025', status: 'declined' },
  { id: 'er8', requester: 'Daniel Lee', experience: 'Studio Visit — Behind the Scenes', date: 'Aug 2, 2025', status: 'pending' },
  { id: 'er9', requester: 'Aisha Patel', experience: 'Meet & Greet — Film Festival', date: 'Aug 1, 2025', status: 'approved' },
  { id: 'er10', requester: 'Mia Thompson', experience: 'Virtual Greeting — Fan Appreciation', date: 'Jul 31, 2025', status: 'completed' },
];

export const MOCK_ADMIN_CONVERSATIONS: AdminConversation[] = [
  { id: 'c1', type: 'fan', participant: 'Sarah Johnson', email: 'sarah@email.com', lastMessage: 'Thank you so much!', status: 'open', date: 'Aug 10, 2025' },
  { id: 'c2', type: 'business', participant: 'Michael Chen', email: 'michael@luxeco.com', company: 'Luxe Brand Co.', lastMessage: 'Partnership proposal attached.', status: 'in_progress', date: 'Aug 9, 2025' },
  { id: 'c3', type: 'fan', participant: 'Emma Wilson', email: 'emma@email.com', lastMessage: 'When is the next event?', status: 'closed', date: 'Aug 8, 2025' },
  { id: 'c4', type: 'fan', participant: 'David Kim', email: 'david@email.com', lastMessage: 'Could you sign my poster?', status: 'open', date: 'Aug 8, 2025' },
  { id: 'c5', type: 'fan', participant: 'Sophia Anderson', email: 'sophia@email.com', lastMessage: 'Loved the latest project!', status: 'in_progress', date: 'Aug 7, 2025' },
  { id: 'c6', type: 'fan', participant: 'Mia Thompson', email: 'mia@email.com', lastMessage: 'Will there be a sequel?', status: 'closed', date: 'Aug 6, 2025' },
  { id: 'c7', type: 'business', participant: 'Lisa Wang', email: 'lisa@brandco.com', company: 'BrandCo International', lastMessage: 'Contract ready for review.', status: 'open', date: 'Aug 7, 2025' },
  { id: 'c8', type: 'business', participant: 'Robert Taylor', email: 'robert@variety.com', company: 'Variety Media', lastMessage: 'Interview slot confirmed for Friday.', status: 'closed', date: 'Aug 6, 2025' },
  { id: 'c9', type: 'business', participant: 'James Wright', email: 'james@streaming.io', company: 'StreamFlix', lastMessage: 'Exclusive content proposal enclosed.', status: 'in_progress', date: 'Aug 5, 2025' },
  { id: 'c10', type: 'fan', participant: 'Ethan White', email: 'ethan@email.com', lastMessage: 'Signed copy request.', status: 'open', date: 'Aug 5, 2025' },
  { id: 'c11', type: 'fan', participant: 'Zoe Robinson', email: 'zoe@email.com', lastMessage: 'Can I get a birthday shoutout?', status: 'closed', date: 'Aug 4, 2025' },
  { id: 'c12', type: 'business', participant: 'Anna Lee', email: 'anna@prfirm.com', company: 'PR Global', lastMessage: 'Media tour proposal for Q4.', status: 'open', date: 'Aug 3, 2025' },
];

export const MOCK_ADMIN_CONTACT_MESSAGES: AdminContactMessage[] = [
  { id: 'cm1', name: 'Robert Taylor', email: 'robert@email.com', department: 'Media & Press', subject: 'Interview Request', message: 'Would like to schedule an interview for Variety magazine.', date: 'Aug 10, 2025', read: false },
  { id: 'cm2', name: 'Lisa Wang', email: 'lisa@brandco.com', department: 'Brand Partnerships', subject: 'Collaboration Proposal', message: 'Interested in a brand partnership for our luxury line.', date: 'Aug 9, 2025', read: true },
  { id: 'cm3', name: 'Tom Anderson', email: 'tom@email.com', department: 'General Enquiries', subject: 'Fan Letter', message: 'Just wanted to express my admiration for Homer\'s work.', date: 'Aug 8, 2025', read: true },
  { id: 'cm4', name: 'Nina Patel', email: 'nina@studio.com', department: 'Booking & Events', subject: 'Event Appearance Request', message: 'We would love to have Homer as a guest speaker at our annual gala in October.', date: 'Aug 7, 2025', read: false },
  { id: 'cm5', name: 'Carlos Mendes', email: 'carlos@filmfest.org', department: 'Media & Press', subject: 'Festival Jury Invitation', message: 'Inviting Homer to serve on the jury panel for the International Film Festival.', date: 'Aug 6, 2025', read: true },
  { id: 'cm6', name: 'Hannah Kim', email: 'hannah@charity.org', department: 'General Enquiries', subject: 'Charity Partnership', message: 'Would Homer be interested in partnering with our children\'s literacy charity?', date: 'Aug 5, 2025', read: false },
  { id: 'cm7', name: 'Peter Collins', email: 'peter@adagency.com', department: 'Brand Partnerships', subject: 'Commercial Opportunity', message: 'Seeking talent for a major international advertising campaign launching in Q1.', date: 'Aug 4, 2025', read: true },
  { id: 'cm8', name: 'Diana Ross', email: 'diana@venue.com', department: 'Booking & Events', subject: 'Venue Availability', message: 'Checking availability for a private screening event at our downtown theater.', date: 'Aug 3, 2025', read: false },
  { id: 'cm9', name: 'Kevin O\'Brien', email: 'kevin@publishing.com', department: 'General Enquiries', subject: 'Book Deal Inquiry', message: 'Interested in discussing a memoir or coffee table book collaboration.', date: 'Aug 2, 2025', read: true },
  { id: 'cm10', name: 'Priya Sharma', email: 'priya@techcorp.com', department: 'Brand Partnerships', subject: 'Tech Sponsorship', message: 'We would like to sponsor upcoming fan events with our latest audio equipment.', date: 'Aug 1, 2025', read: false },
];

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: 'n1', title: 'New Membership Application', message: 'Olivia Brown applied for Gold membership.', date: '2 hours ago', read: false },
  { id: 'n2', title: 'Experience Request', message: 'New Meet & Greet request from Sarah Johnson.', date: '5 hours ago', read: false },
  { id: 'n3', title: 'Business Enquiry', message: 'Partnership proposal from Luxe Brand Co.', date: '1 day ago', read: true },
  { id: 'n4', title: 'New Member Registration', message: 'Lucas Garcia has registered for a Silver membership.', date: '3 hours ago', read: false },
  { id: 'n5', title: 'Payment Received', message: 'Michael Chen renewed Platinum plan — $499.', date: '6 hours ago', read: false },
  { id: 'n6', title: 'Content Scheduled', message: 'Journal article "Behind the Scenes of Shards" scheduled for Aug 15.', date: '1 day ago', read: true },
  { id: 'n7', title: 'Media Upload', message: 'New gallery images uploaded by Admin — 12 files.', date: '1 day ago', read: true },
  { id: 'n8', title: 'Application Approved', message: 'Sophia Davis application has been approved.', date: '2 days ago', read: true },
  { id: 'n9', title: 'Membership Suspended', message: 'Ethan White membership suspended due to inactivity.', date: '3 days ago', read: true },
  { id: 'n10', title: 'New FAQ Submitted', message: 'Community submitted a new FAQ suggestion.', date: '3 days ago', read: false },
  { id: 'n11', title: 'Contact Message', message: 'New message from Nina Patel regarding event appearance.', date: '4 days ago', read: true },
  { id: 'n12', title: 'Payment Refund', message: 'Refund processed for Chloe Adams — $99.', date: '5 days ago', read: true },
  { id: 'n13', title: 'Experience Completed', message: 'Meet & Greet with Emma Wilson has been completed.', date: '5 days ago', read: true },
  { id: 'n14', title: 'New Business Chat', message: 'James Wright from StreamFlix started a new conversation.', date: '6 days ago', read: false },
  { id: 'n15', title: 'System Backup', message: 'Weekly system backup completed successfully.', date: '7 days ago', read: true },
  { id: 'n16', title: 'Security Alert', message: '3 failed login attempts detected from new IP address.', date: '1 week ago', read: false },
];

export const MOCK_ADMIN_MEDIA: AdminMediaItem[] = [
  { id: 'mi1', name: 'hero-portrait.jpg', type: 'image', size: '2.4 MB', uploadedBy: 'Admin', date: 'Aug 10, 2025', url: '#' },
  { id: 'mi2', name: 'shards-premiere.jpg', type: 'image', size: '3.1 MB', uploadedBy: 'Admin', date: 'Aug 9, 2025', url: '#' },
  { id: 'mi3', name: 'interview-clip.mp4', type: 'video', size: '45.2 MB', uploadedBy: 'Admin', date: 'Aug 8, 2025', url: '#' },
  { id: 'mi4', name: 'press-kit.pdf', type: 'document', size: '1.8 MB', uploadedBy: 'Admin', date: 'Aug 7, 2025', url: '#' },
  { id: 'mi5', name: 'gallery-set-01.jpg', type: 'image', size: '4.7 MB', uploadedBy: 'Admin', date: 'Aug 7, 2025', url: '#' },
  { id: 'mi6', name: 'gallery-set-02.jpg', type: 'image', size: '3.9 MB', uploadedBy: 'Admin', date: 'Aug 6, 2025', url: '#' },
  { id: 'mi7', name: 'behind-the-scenes.mp4', type: 'video', size: '128.5 MB', uploadedBy: 'Admin', date: 'Aug 6, 2025', url: '#' },
  { id: 'mi8', name: 'biography.pdf', type: 'document', size: '2.1 MB', uploadedBy: 'Admin', date: 'Aug 5, 2025', url: '#' },
  { id: 'mi9', name: 'red-carpet.jpg', type: 'image', size: '5.2 MB', uploadedBy: 'Admin', date: 'Aug 5, 2025', url: '#' },
  { id: 'mi10', name: 'portrait-studio.jpg', type: 'image', size: '2.8 MB', uploadedBy: 'Admin', date: 'Aug 4, 2025', url: '#' },
  { id: 'mi11', name: 'fan-meetup.jpg', type: 'image', size: '3.5 MB', uploadedBy: 'Admin', date: 'Aug 4, 2025', url: '#' },
  { id: 'mi12', name: 'award-ceremony.jpg', type: 'image', size: '4.1 MB', uploadedBy: 'Admin', date: 'Aug 3, 2025', url: '#' },
  { id: 'mi13', name: 'documentary-trailer.mp4', type: 'video', size: '87.3 MB', uploadedBy: 'Admin', date: 'Aug 3, 2025', url: '#' },
  { id: 'mi14', name: 'travel-journal.pdf', type: 'document', size: '3.6 MB', uploadedBy: 'Admin', date: 'Aug 2, 2025', url: '#' },
  { id: 'mi15', name: 'on-set-photo.jpg', type: 'image', size: '3.3 MB', uploadedBy: 'Admin', date: 'Aug 2, 2025', url: '#' },
  { id: 'mi16', name: 'city-skyline.jpg', type: 'image', size: '2.9 MB', uploadedBy: 'Admin', date: 'Aug 1, 2025', url: '#' },
  { id: 'mi17', name: 'press-conference.mp4', type: 'video', size: '62.7 MB', uploadedBy: 'Admin', date: 'Aug 1, 2025', url: '#' },
  { id: 'mi18', name: 'brand-guidelines.pdf', type: 'document', size: '5.4 MB', uploadedBy: 'Admin', date: 'Jul 31, 2025', url: '#' },
  { id: 'mi19', name: 'event-poster.jpg', type: 'image', size: '1.7 MB', uploadedBy: 'Admin', date: 'Jul 30, 2025', url: '#' },
  { id: 'mi20', name: 'portrait-candid.jpg', type: 'image', size: '2.6 MB', uploadedBy: 'Admin', date: 'Jul 29, 2025', url: '#' },
];

export const MOCK_ADMIN_PAYMENTS: AdminPayment[] = [
  { id: 'pay1', member: 'Sarah Johnson', plan: 'Gold', amount: 199, date: 'Aug 10, 2025', status: 'completed' },
  { id: 'pay2', member: 'Michael Chen', plan: 'Platinum', amount: 499, date: 'Aug 9, 2025', status: 'completed' },
  { id: 'pay3', member: 'Emma Wilson', plan: 'Silver', amount: 99, date: 'Aug 8, 2025', status: 'pending' },
  { id: 'pay4', member: 'David Kim', plan: 'Silver', amount: 99, date: 'Aug 7, 2025', status: 'completed' },
  { id: 'pay5', member: 'Jessica Martinez', plan: 'Platinum', amount: 499, date: 'Aug 6, 2025', status: 'completed' },
  { id: 'pay6', member: 'William Taylor', plan: 'Gold', amount: 199, date: 'Aug 5, 2025', status: 'completed' },
  { id: 'pay7', member: 'Sophia Anderson', plan: 'Silver', amount: 99, date: 'Aug 4, 2025', status: 'pending' },
  { id: 'pay8', member: 'Daniel Lee', plan: 'Gold', amount: 199, date: 'Aug 3, 2025', status: 'completed' },
  { id: 'pay9', member: 'Aisha Patel', plan: 'Platinum', amount: 499, date: 'Aug 2, 2025', status: 'completed' },
  { id: 'pay10', member: 'Mia Thompson', plan: 'Gold', amount: 199, date: 'Aug 1, 2025', status: 'completed' },
  { id: 'pay11', member: 'Zoe Robinson', plan: 'Platinum', amount: 499, date: 'Jul 31, 2025', status: 'completed' },
  { id: 'pay12', member: 'James Rodriguez', plan: 'Gold', amount: 199, date: 'Jul 30, 2025', status: 'refunded' },
  { id: 'pay13', member: 'Ethan White', plan: 'Silver', amount: 99, date: 'Jul 29, 2025', status: 'refunded' },
  { id: 'pay14', member: 'Sarah Johnson', plan: 'Gold', amount: 199, date: 'Jul 28, 2025', status: 'completed' },
  { id: 'pay15', member: 'Michael Chen', plan: 'Platinum', amount: 499, date: 'Jul 27, 2025', status: 'completed' },
  { id: 'pay16', member: 'Lucas Garcia', plan: 'Silver', amount: 99, date: 'Jul 26, 2025', status: 'pending' },
  { id: 'pay17', member: 'Olivia Brown', plan: 'Gold', amount: 199, date: 'Jul 25, 2025', status: 'pending' },
  { id: 'pay18', member: 'David Kim', plan: 'Silver', amount: 99, date: 'Jul 24, 2025', status: 'completed' },
  { id: 'pay19', member: 'Jessica Martinez', plan: 'Platinum', amount: 499, date: 'Jul 23, 2025', status: 'completed' },
  { id: 'pay20', member: 'William Taylor', plan: 'Gold', amount: 199, date: 'Jul 22, 2025', status: 'completed' },
  { id: 'pay21', member: 'Sophia Anderson', plan: 'Silver', amount: 99, date: 'Jul 21, 2025', status: 'completed' },
  { id: 'pay22', member: 'Daniel Lee', plan: 'Gold', amount: 199, date: 'Jul 20, 2025', status: 'completed' },
  { id: 'pay23', member: 'Aisha Patel', plan: 'Platinum', amount: 499, date: 'Jul 19, 2025', status: 'completed' },
  { id: 'pay24', member: 'Mia Thompson', plan: 'Gold', amount: 199, date: 'Jul 18, 2025', status: 'refunded' },
  { id: 'pay25', member: 'Zoe Robinson', plan: 'Platinum', amount: 499, date: 'Jul 17, 2025', status: 'completed' },
];

export const MOCK_ADMIN_PAGES: AdminPage[] = [
  { id: 'home', title: 'Homepage', status: 'published', lastModified: 'Aug 10, 2025', author: 'Admin' },
  { id: 'journey', title: 'Journey', status: 'published', lastModified: 'Aug 9, 2025', author: 'Admin' },
  { id: 'projects', title: 'Projects', status: 'published', lastModified: 'Aug 8, 2025', author: 'Admin' },
  { id: 'gallery', title: 'Gallery', status: 'draft', lastModified: 'Aug 7, 2025', author: 'Admin' },
  { id: 'journal', title: 'Journal', status: 'published', lastModified: 'Aug 6, 2025', author: 'Admin' },
  { id: 'media', title: 'Media', status: 'published', lastModified: 'Aug 5, 2025', author: 'Admin' },
  { id: 'contact', title: 'Contact', status: 'published', lastModified: 'Aug 4, 2025', author: 'Admin' },
  { id: 'faq', title: 'FAQ', status: 'published', lastModified: 'Aug 3, 2025', author: 'Admin' },
  { id: 'about', title: 'About', status: 'published', lastModified: 'Aug 2, 2025', author: 'Admin' },
  { id: 'membership', title: 'Membership', status: 'scheduled', lastModified: 'Aug 1, 2025', author: 'Admin' },
  { id: 'terms', title: 'Terms & Conditions', status: 'published', lastModified: 'Jul 30, 2025', author: 'Admin' },
  { id: 'privacy', title: 'Privacy Policy', status: 'published', lastModified: 'Jul 28, 2025', author: 'Admin' },
];

export const MOCK_CONTENT_ITEMS: ContentItem[] = [
  { id: 'ci1', title: 'Early Life & Childhood', section: 'journey', status: 'published', author: 'Admin', lastModified: 'Aug 8, 2025', tags: ['biography', 'early-years', 'family'], category: 'Origins', excerpt: 'A look at the formative years that shaped a creative vision.' },
  { id: 'ci2', title: 'Career Beginnings', section: 'journey', status: 'published', author: 'Admin', lastModified: 'Aug 6, 2025', tags: ['career', 'early-work', 'hustle'], category: 'Origins', excerpt: 'The first steps into the world of entertainment and storytelling.' },
  { id: 'ci3', title: 'The Breakthrough Moment', section: 'journey', status: 'published', author: 'Admin', lastModified: 'Aug 4, 2025', tags: ['breakthrough', 'success', 'milestone'], category: 'Career', excerpt: 'How one role changed everything and opened new doors.' },
  { id: 'ci4', title: 'Shards of Tomorrow (2024)', section: 'projects', status: 'published', author: 'Admin', lastModified: 'Aug 9, 2025', tags: ['film', 'drama', 'lead-role'], category: 'Film', excerpt: 'A gripping drama about resilience and hope in a fractured world.' },
  { id: 'ci5', title: 'The Last Horizon (2023)', section: 'projects', status: 'published', author: 'Admin', lastModified: 'Aug 7, 2025', tags: ['film', 'adventure', 'critically-acclaimed'], category: 'Film', excerpt: 'An epic adventure across uncharted territories searching for truth.' },
  { id: 'ci6', title: 'City of Echoes — TV Series', section: 'projects', status: 'published', author: 'Admin', lastModified: 'Aug 5, 2025', tags: ['television', 'drama', 'series-lead'], category: 'Television', excerpt: 'A multi-season drama exploring interconnected lives in a sprawling metropolis.' },
  { id: 'ci7', title: 'Unfiltered — Documentary', section: 'projects', status: 'draft', author: 'Admin', lastModified: 'Aug 3, 2025', tags: ['documentary', 'personal', 'behind-the-scenes'], category: 'Documentary', excerpt: 'An intimate documentary following the journey from obscurity to stardom.' },
  { id: 'ci8', title: 'Red Carpet Gallery 2025', section: 'gallery', status: 'published', author: 'Admin', lastModified: 'Aug 10, 2025', tags: ['red-carpet', 'events', '2025'], category: 'Events', excerpt: 'Highlights from the 2025 awards season red carpets.' },
  { id: 'ci9', title: 'Studio Sessions Collection', section: 'gallery', status: 'published', author: 'Admin', lastModified: 'Aug 8, 2025', tags: ['studio', 'behind-the-scenes', 'photography'], category: 'Behind the Scenes', excerpt: 'Candid shots from studio recording and production sessions.' },
  { id: 'ci10', title: 'Travel Diaries Photo Set', section: 'gallery', status: 'draft', author: 'Admin', lastModified: 'Aug 5, 2025', tags: ['travel', 'personal', 'landscapes'], category: 'Personal', excerpt: 'Personal travel photography from destinations around the world.' },
  { id: 'ci11', title: 'Exclusive Interview with Variety', section: 'media', status: 'published', author: 'Admin', lastModified: 'Aug 7, 2025', tags: ['interview', 'press', 'variety'], category: 'Press', excerpt: 'In-depth conversation about upcoming projects and career evolution.' },
  { id: 'ci12', title: 'Late Night Talk Show Appearance', section: 'media', status: 'published', author: 'Admin', lastModified: 'Aug 4, 2025', tags: ['tv-appearance', 'talk-show', 'promotion'], category: 'Television', excerpt: 'Fun and insightful segment on the late night circuit.' },
  { id: 'ci13', title: 'Podcast Feature — The Creative Mind', section: 'media', status: 'published', author: 'Admin', lastModified: 'Aug 2, 2025', tags: ['podcast', 'creative', 'deep-dive'], category: 'Audio', excerpt: 'A deep dive into the creative process and artistic philosophy.' },
  { id: 'ci14', title: 'Behind the Scenes of Shards', section: 'journal', status: 'published', author: 'Admin', lastModified: 'Aug 9, 2025', tags: ['behind-the-scenes', 'film', 'production'], category: 'Production', excerpt: 'An inside look at the making of the most ambitious project to date.' },
  { id: 'ci15', title: 'Lessons from a Decade in Hollywood', section: 'journal', status: 'scheduled', author: 'Admin', lastModified: 'Aug 6, 2025', tags: ['reflection', 'career', 'advice'], category: 'Reflection', excerpt: 'Key takeaways from ten years navigating the entertainment industry.' },
  { id: 'ci16', title: 'The Art of Preparation', section: 'journal', status: 'draft', author: 'Admin', lastModified: 'Aug 3, 2025', tags: ['craft', 'method', 'acting'], category: 'Craft', excerpt: 'How rigorous preparation transforms a performance from good to unforgettable.' },
  { id: 'ci17', title: 'Fan Appreciation Day Recap', section: 'journal', status: 'published', author: 'Admin', lastModified: 'Jul 30, 2025', tags: ['fans', 'event', 'community'], category: 'Events', excerpt: 'Recapping an incredible day spent with the most dedicated fans.' },
  { id: 'ci18', title: 'What is the best way to contact Homer?', section: 'faqs', status: 'published', author: 'Admin', lastModified: 'Aug 10, 2025', tags: ['contact', 'communication'], category: 'General', excerpt: 'The recommended channels for reaching out for business and personal enquiries.' },
  { id: 'ci19', title: 'How do I become a member?', section: 'faqs', status: 'published', author: 'Admin', lastModified: 'Aug 8, 2025', tags: ['membership', 'sign-up', 'plans'], category: 'Membership', excerpt: 'Step-by-step guide to joining the official membership community.' },
  { id: 'ci20', title: 'Are meet and greets available?', section: 'faqs', status: 'published', author: 'Admin', lastModified: 'Aug 5, 2025', tags: ['meet-and-greet', 'events', 'availability'], category: 'Experiences', excerpt: 'Information on how to request a meet and greet experience.' },
  { id: 'ci21', title: 'The Evolution of Shards Sequel', section: 'projects', status: 'scheduled', author: 'Admin', lastModified: 'Aug 1, 2025', tags: ['film', 'sequel', 'upcoming'], category: 'Film', excerpt: 'Details on the highly anticipated follow-up to the box office hit.' },
  { id: 'ci22', title: 'Golden Hour Portrait Session', section: 'gallery', status: 'published', author: 'Admin', lastModified: 'Jul 29, 2025', tags: ['portrait', 'photography', 'golden-hour'], category: 'Photoshoots', excerpt: 'Beautiful golden hour portraits from the latest editorial shoot.' },
];

export const MOCK_FAQS: FAQItem[] = [
  { id: 'faq1', question: 'What is the best way to contact Homer?', answer: 'The best way to reach us is through the contact form on the website or via the official membership portal. For business enquiries, please use the Brand Partnerships department.', category: 'General', order: 1, published: true },
  { id: 'faq2', question: 'How do I become a member?', answer: 'Visit the Membership page and choose a plan that suits you. Complete the application form and our team will review it within 48 hours. You will receive a confirmation email once approved.', category: 'Membership', order: 2, published: true },
  { id: 'faq3', question: 'Are meet and greets available?', answer: 'Yes, meet and greet experiences are available for Gold and Platinum members. Availability varies by event location. Submit a request through the Experiences section of your dashboard.', category: 'Experiences', order: 3, published: true },
  { id: 'faq4', question: 'What membership plans are offered?', answer: 'We offer three plans: Silver ($99/year), Gold ($199/year), and Platinum ($499/year). Each tier unlocks increasingly exclusive content, early access, and direct engagement opportunities.', category: 'Membership', order: 4, published: true },
  { id: 'faq5', question: 'Can I request a personalized video greeting?', answer: 'Personalized video greetings are available to all members. Platinum members receive priority processing. Submit your request with details through the Virtual Greeting experience page.', category: 'Experiences', order: 5, published: true },
  { id: 'faq6', question: 'How often is new content added?', answer: 'New journal articles, gallery photos, and media content are added weekly. Platinum members often receive early access to new content before it goes live for other tiers.', category: 'Content', order: 6, published: true },
  { id: 'faq7', question: 'Is there a refund policy?', answer: 'Refund requests can be submitted within 14 days of purchase. Contact our support team through the membership portal with your order details and reason for the refund request.', category: 'Payments', order: 7, published: true },
  { id: 'faq8', question: 'How do I update my profile information?', answer: 'Navigate to Account Settings from your dashboard. You can update your name, email, profile photo, and communication preferences at any time.', category: 'Account', order: 8, published: true },
  { id: 'faq9', question: 'Can I upgrade my membership plan?', answer: 'Yes, you can upgrade at any time from your dashboard. The upgrade takes effect immediately and you will only pay the prorated difference for the remaining period.', category: 'Membership', order: 9, published: true },
  { id: 'faq10', question: 'Are private events available for corporate bookings?', answer: 'Private events and speaking engagements can be arranged for corporate clients. Please submit a business enquiry through the contact form with your event details and our team will follow up.', category: 'Experiences', order: 10, published: true },
];

export const MOCK_JOURNAL_ARTICLES: JournalArticle[] = [
  { id: 'ja1', title: 'Behind the Scenes of Shards of Tomorrow', excerpt: 'An inside look at the making of the most ambitious project to date.', content: 'The making of Shards of Tomorrow was a journey in itself. From the initial table reads in a small rehearsal room to the sprawling set constructions that brought the fictional world to life, every step was a masterclass in collaboration and creative problem-solving...', author: 'Admin', category: 'Production', tags: ['behind-the-scenes', 'film', 'production'], status: 'published', publishedDate: 'Aug 9, 2025', lastModified: 'Aug 9, 2025', readTime: '8 min', views: 2341 },
  { id: 'ja2', title: 'Lessons from a Decade in Hollywood', excerpt: 'Key takeaways from ten years navigating the entertainment industry.', content: 'Looking back over the past decade, the lessons are both humbling and empowering. The industry has changed dramatically — streaming has reshaped distribution, social media has transformed marketing, and audiences are more engaged than ever...', author: 'Admin', category: 'Reflection', tags: ['reflection', 'career', 'advice'], status: 'published', publishedDate: 'Aug 6, 2025', lastModified: 'Aug 6, 2025', readTime: '12 min', views: 3892 },
  { id: 'ja3', title: 'The Art of Character Preparation', excerpt: 'How rigorous preparation transforms a performance from good to unforgettable.', content: 'Great performances do not happen by accident. They are built through weeks and months of research, physical training, dialect work, and emotional mapping. The goal is to disappear so completely into the character that the audience forgets they are watching an actor...', author: 'Admin', category: 'Craft', tags: ['craft', 'method', 'acting'], status: 'draft', publishedDate: '', lastModified: 'Aug 3, 2025', readTime: '10 min', views: 0 },
  { id: 'ja4', title: 'Fan Appreciation Day: A Recap', excerpt: 'Recapping an incredible day spent with the most dedicated fans.', content: 'There is nothing quite like meeting the people who make this career possible. Fan Appreciation Day was a celebration of community, gratitude, and the shared love of storytelling that connects us all...', author: 'Admin', category: 'Events', tags: ['fans', 'event', 'community'], status: 'published', publishedDate: 'Jul 30, 2025', lastModified: 'Jul 30, 2025', readTime: '6 min', views: 1756 },
  { id: 'ja5', title: 'Traveling the World for Inspiration', excerpt: 'How travel fuels creativity and informs artistic choices.', content: 'Every journey offers something unexpected. The markets of Marrakech, the fjords of Norway, the bustling streets of Tokyo — each place leaves an imprint that eventually finds its way into the work...', author: 'Admin', category: 'Personal', tags: ['travel', 'inspiration', 'personal'], status: 'published', publishedDate: 'Jul 25, 2025', lastModified: 'Jul 25, 2025', readTime: '9 min', views: 2104 },
  { id: 'ja6', title: 'Preparing for City of Echoes Season 2', excerpt: 'The creative process behind returning to a beloved character.', content: 'Returning to a character after a break is like reuniting with an old friend — familiar yet changed. The writers and I spent months developing the arc for season two, ensuring the character growth felt earned and authentic...', author: 'Admin', category: 'Production', tags: ['television', 'series', 'production'], status: 'scheduled', publishedDate: 'Aug 20, 2025', lastModified: 'Aug 8, 2025', readTime: '7 min', views: 0 },
  { id: 'ja7', title: 'The Role of Music in My Creative Process', excerpt: 'How soundtracks and playlists shape the emotional landscape of every project.', content: 'Music is the invisible thread that runs through every project. Before stepping on set, there is always a playlist — carefully curated to evoke the right emotional state for the scene ahead...', author: 'Admin', category: 'Craft', tags: ['music', 'creative-process', 'acting'], status: 'published', publishedDate: 'Jul 20, 2025', lastModified: 'Jul 20, 2025', readTime: '5 min', views: 1432 },
  { id: 'ja8', title: 'What I Wish I Knew at the Start of My Career', excerpt: 'Honest advice for aspiring actors and storytellers.', content: 'The early days were filled with uncertainty, rejection, and self-doubt. If I could go back and tell my younger self one thing, it would be this: the journey is the point. The auditions, the small roles, the near-misses — they are all part of the story...', author: 'Admin', category: 'Reflection', tags: ['advice', 'career', 'beginnings'], status: 'published', publishedDate: 'Jul 15, 2025', lastModified: 'Jul 15, 2025', readTime: '11 min', views: 4217 },
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
