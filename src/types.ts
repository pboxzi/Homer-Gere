export interface JournalArticle {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  readTime: string;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  details: string;
  highlight?: string;
  iconName: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  details: string;
  price: string;
  iconName: string;
  type: ExperienceCategory;
  image?: string;
  availability?: 'available' | 'limited' | 'unavailable';
  whatsIncluded?: string[];
  eligibility?: string[];
  duration?: string;
  location?: string;
  importantNotes?: string[];
}

export type ExperienceCategory =
  | 'meet-and-greet'
  | 'fan-event'
  | 'charity-appearance'
  | 'speaking-engagement'
  | 'brand-collaboration'
  | 'private-event'
  | 'virtual-appearance'
  | 'video-greeting';

export interface ExperienceRequest {
  experienceType: ExperienceCategory | '';
  fullName: string;
  email: string;
  phone: string;
  country: string;
  organization: string;
  eventDate: string;
  eventLocation: string;
  budget: string;
  purpose: string;
  additionalDetails: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  duration: string;
  badge?: string;
  isPopular?: boolean;
  features: MembershipBenefit[];
  ctaText: string;
  availability: 'available' | 'waitlist' | 'disabled';
  requiresApproval: boolean;
}

export interface MembershipBenefit {
  label: string;
  included: boolean;
}

export interface MembershipFAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface MembershipStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'homer';
  text: string;
  timestamp: string;
  media?: ChatMedia;
}

export interface ChatMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  name?: string;
}

export interface FilmographyEntry {
  id: string;
  title: string;
  role: string;
  year: string;
  status: 'Released' | 'Post-Production' | 'In Production' | 'Announced';
  description: string;
  type: 'film' | 'television';
  image?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type MediaCategory =
  | 'all'
  | 'interviews'
  | 'trailers'
  | 'behind-the-scenes'
  | 'press'
  | 'podcasts'
  | 'promotional'
  | 'event-coverage';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  date: string;
  source: string;
  category: MediaCategory;
  url: string;
  featured?: boolean;
}

export interface PodcastItem {
  id: string;
  episodeTitle: string;
  showName: string;
  description: string;
  coverArt: string;
  date: string;
  url: string;
}

export interface PressItem {
  id: string;
  headline: string;
  publisher: string;
  date: string;
  summary: string;
  url: string;
  image?: string;
}

export type ModalType =
  | null
  | { type: 'chat'; mode?: 'fan' | 'business' }
  | { type: 'article'; article: JournalArticle }
  | { type: 'milestone'; milestone: TimelineMilestone }
  | { type: 'experience'; experience: Experience }
  | { type: 'membership'; tier: MembershipTier }
  | { type: 'gallery'; item: GalleryItem }
  | { type: 'signin' }
  | { type: 'project'; projectId: string };

export type ChatType = 'fan' | 'business';

export type CommunicationMethod = 'whatsapp' | 'email' | 'telegram' | 'website';

export type ConversationStatus = 'open' | 'in_progress' | 'closed';

export interface ChatConversation {
  id: string;
  chatType: ChatType;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  company?: string;
  enquiryType?: string;
  membershipTier?: string;
  messages: ChatMessage[];
  status: ConversationStatus;
  method?: CommunicationMethod;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSettings {
  fanChat: {
    enabled: boolean;
    whatsappEnabled: boolean;
    whatsappNumber: string;
    requiredTierForWhatsApp: string;
    autoReply: string;
  };
  businessChat: {
    whatsappEnabled: boolean;
    emailEnabled: boolean;
    telegramEnabled: boolean;
    websiteFormEnabled: boolean;
    managementEmail: string;
    managementWhatsApp: string;
    telegramAccount: string;
  };
}
