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
  type: 'meet' | 'video' | 'virtual' | 'memorabilia' | 'vip' | 'custom';
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  period: string;
  badge?: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
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
