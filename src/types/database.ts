// ============================================================
// AUTO-GENERATED DATABASE TYPES
// Homer Gere Platform - Supabase Schema
// Generated: 2026-08-13
// ============================================================

export type UserRole = 'pending' | 'member' | 'admin' | 'super_admin';
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'content_manager' | 'media_manager' | 'membership_manager' | 'support_manager';
export type MembershipStatus = 'none' | 'pending' | 'active' | 'expired' | 'cancelled';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type ExperienceStatus = 'pending' | 'under_review' | 'approved' | 'declined' | 'completed';
export type ChatType = 'fan' | 'business';
export type ConversationStatus = 'open' | 'in_progress' | 'closed';
export type MessageSender = 'user' | 'member' | 'homer' | 'system' | 'admin';
export type ContentStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type NotificationType = 'membership' | 'reply' | 'experience' | 'journal' | 'system' | 'message' | 'booking';
export type MediaType = 'image' | 'video' | 'document';
export type ProjectType = 'film' | 'series' | 'short' | 'documentary';
export type ProjectStatus = 'released' | 'in_production' | 'announced' | 'post_production';
export type GalleryCategory = 'premiere' | 'behind-the-scenes' | 'portraits' | 'events' | 'on-set' | 'press' | 'personal' | 'editorial';
export type JournalCategory = 'career-reflections' | 'industry-insights' | 'personal-stories' | 'behind-the-scenes' | 'advice' | 'announcements';
export type ExperienceCategory = 'meet-and-greet' | 'fan-event' | 'virtual-session' | 'signed-items' | 'charity-auction' | 'set-visit' | 'custom-experience' | 'business';
export type Department = 'general' | 'business' | 'membership' | 'fan-relations' | 'press' | 'technical' | 'experiences';
export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'approve' | 'reject' | 'export';

// ============================================================
// TABLE TYPES
// ============================================================

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  avatar_url: string | null;
  role: UserRole;
  membership_tier: string | null;
  email_verified: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  // Phase 1 enterprise fields
  display_name: string | null;
  biography: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  timezone: string | null;
  preferred_language: string | null;
  avatar_media_id: string | null;
  cover_media_id: string | null;
  profile_completion: number;
  account_status: string;
  onboarding_completed: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface Admin {
  id: string;
  user_id: string;
  admin_role: AdminRole;
  permissions: string[];
  notes: string | null;
  is_active: boolean;
  last_active: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegistrationApplication {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  date_of_birth: string | null;
  membership_tier: string | null;
  status: ApplicationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Phase 1 enterprise fields
  application_number: string | null;
  membership_plan_requested: string | null;
  reason_for_joining: string | null;
  referral_source: string | null;
  device_type: string | null;
  browser: string | null;
  operating_system: string | null;
  preferred_language: string | null;
  user_agent: string | null;
  ip_address: string | null;
  city_detected: string | null;
  country_detected: string | null;
  review_notes: string | null;
  status_history: Record<string, unknown>[];
  assigned_admin: string | null;
  approved_at: string | null;
  rejected_at: string | null;
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  period: string;
  duration: number | null;
  badge: string | null;
  is_popular: boolean;
  features: string[];
  cta_text: string;
  availability: string;
  requires_approval: boolean;
  members_count: number;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  plan_id: string;
  status: MembershipStatus;
  start_date: string | null;
  end_date: string | null;
  renewal_date: string | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface JourneyEntry {
  id: string;
  year: number;
  title: string;
  description: string;
  details: string | null;
  highlight: boolean;
  icon_name: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  status: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  version: number;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: JournalCategory;
  author: string;
  tags: string[];
  status: ContentStatus;
  published_date: string | null;
  read_time: string | null;
  views: number;
  seo_title: string | null;
  seo_description: string | null;
  cover_image: string | null;
  og_image: string | null;
  author_image: string | null;
  related_slugs: string[];
  featured: boolean;
  trending: boolean;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_keywords: string | null;
  canonical_url: string | null;
  version: number;
  scheduled_at: string | null;
}

export interface FilmographyEntry {
  id: string;
  title: string;
  role: string;
  year: number;
  status: string | null;
  description: string | null;
  type: string | null;
  image: string | null;
  slug: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  version: number;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  details: string | null;
  price: string | null;
  icon_name: string | null;
  type: ExperienceCategory;
  image: string | null;
  availability: string | null;
  whats_included: string[];
  eligibility: string | null;
  duration: string | null;
  location: string | null;
  important_notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  status: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  version: number;
}

export interface ExperienceRequest {
  id: string;
  user_id: string | null;
  experience_type: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  organization: string | null;
  event_date: string | null;
  event_location: string | null;
  budget: string | null;
  purpose: string | null;
  additional_details: string | null;
  status: ExperienceStatus;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  year: number;
  type: ProjectType;
  status: ProjectStatus;
  tagline: string | null;
  synopsis: string | null;
  expanded_synopsis: string | null;
  genre: string | null;
  runtime: string | null;
  director: string | null;
  homer_role_title: string | null;
  homer_role_description: string | null;
  image: string | null;
  hero_image: string | null;
  poster_image: string | null;
  logo_image: string | null;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  version: number;
  is_featured: boolean;
  display_order: number;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  src: string;
  alt: string;
  caption: string | null;
  type: MediaType;
  sort_order: number;
  created_at: string;
  // Phase 3 CMS fields
  deleted_at: string | null;
  created_by: string | null;
}

export interface ProjectVideo {
  id: string;
  project_id: string;
  title: string;
  url: string;
  type: string | null;
  thumbnail: string | null;
  duration: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  // Phase 3 CMS fields
  deleted_at: string | null;
  created_by: string | null;
}

export interface ProjectRecognition {
  id: string;
  project_id: string;
  award: string;
  category: string | null;
  result: string | null;
  ceremony: string | null;
  year: number | null;
  url: string | null;
  created_at: string;
  // Phase 3 CMS fields
  deleted_at: string | null;
  created_by: string | null;
}

export interface GalleryCollection {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  date: string | null;
  photo_count: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  status: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  sort_order: number;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  date: string | null;
  category: GalleryCategory;
  event: string | null;
  photographer: string | null;
  featured: boolean;
  collection_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  status: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  version: number;
}

export interface FanConversation {
  id: string;
  participant: string;
  email: string;
  phone: string | null;
  membership_tier: string | null;
  status: ConversationStatus;
  method: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FanMessage {
  id: string;
  conversation_id: string;
  sender: MessageSender;
  text: string;
  media_type: MediaType | null;
  media_url: string | null;
  created_at: string;
}

export interface BusinessEnquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  enquiry_type: string | null;
  subject: string | null;
  message: string;
  status: ConversationStatus;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessMessage {
  id: string;
  enquiry_id: string;
  sender: MessageSender;
  text: string;
  media_type: MediaType | null;
  media_url: string | null;
  created_at: string;
}

export interface MediaVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  duration: string | null;
  date: string | null;
  source: string | null;
  category: string | null;
  url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  status: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  version: number;
}

export interface MediaPodcast {
  id: string;
  episode_title: string;
  show_name: string;
  description: string | null;
  cover_art: string | null;
  date: string | null;
  url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  status: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  version: number;
}

export interface MediaPress {
  id: string;
  headline: string;
  publisher: string;
  date: string | null;
  summary: string | null;
  url: string;
  image: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  status: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image: string | null;
  canonical_url: string | null;
  version: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  created_at: string;
  // Phase 1 enterprise fields
  priority: string;
  category: string | null;
  action_link: string | null;
  expires_at: string | null;
  read_at: string | null;
}

export interface SiteSetting {
  id: string;
  category: string;
  settings: Record<string, unknown>;
  updated_by: string | null;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_body: string;
  text_body: string | null;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  // Phase 3 CMS fields
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  version: number;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: AuditAction;
  table_name: string;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Phase 1 enterprise fields
  module: string | null;
  browser: string | null;
  device: string | null;
}

export interface SiteMedia {
  id: string;
  filename: string;
  original_filename: string | null;
  storage_bucket: string;
  storage_path: string;
  public_url: string;
  file_type: string;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  section: string | null;
  usage_context: string | null;
  status: string;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  // Phase 1 enterprise fields
  alt_text: string | null;
  caption: string | null;
  folder: string;
  tags: string[];
  checksum: string | null;
  usage_count: number;
}

// ============================================================
// PHASE 1: NEW TABLE TYPES
// ============================================================

export interface Payment {
  id: string;
  member_name: string;
  member_email: string;
  member_id: string | null;
  plan: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string | null;
  transaction_id: string | null;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RolePermission {
  id: string;
  role: string;
  permission: string;
  created_at: string;
}

// ============================================================
// PHASE 2: HOMEPAGE CMS TYPES
// ============================================================

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  enabled: boolean;
  display_order: number;
  published: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface HomepageHeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  secondary_button_text: string | null;
  secondary_button_link: string | null;
  display_order: number;
  active: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface HomepageStatistic {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface HomepageQuote {
  id: string;
  quote: string;
  author: string;
  position: string | null;
  portrait_url: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface HomepageFeatured {
  id: string;
  section_key: string;
  reference_id: string;
  reference_type: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface HomepageCta {
  id: string;
  title: string;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  background_image_url: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// ============================================================
// DATABASE TYPE (Supabase generated format)
// ============================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      admins: {
        Row: Admin;
        Insert: Omit<Admin, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Admin, 'id' | 'created_at' | 'updated_at'>>;
      };
      registration_applications: {
        Row: RegistrationApplication;
        Insert: Omit<RegistrationApplication, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RegistrationApplication, 'id' | 'created_at' | 'updated_at'>>;
      };
      membership_plans: {
        Row: MembershipPlan;
        Insert: Omit<MembershipPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MembershipPlan, 'id' | 'created_at' | 'updated_at'>>;
      };
      memberships: {
        Row: Membership;
        Insert: Omit<Membership, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Membership, 'id' | 'created_at' | 'updated_at'>>;
      };
      journey_entries: {
        Row: JourneyEntry;
        Insert: Omit<JourneyEntry, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description' | 'seo_keywords' | 'og_image' | 'canonical_url'>;
        Update: Partial<Omit<JourneyEntry, 'id' | 'created_at' | 'updated_at'>>;
      };
      journal_articles: {
        Row: JournalArticle;
        Insert: Omit<JournalArticle, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_keywords' | 'canonical_url' | 'scheduled_at'>;
        Update: Partial<Omit<JournalArticle, 'id' | 'created_at' | 'updated_at'>>;
      };
      filmography_entries: {
        Row: FilmographyEntry;
        Insert: Omit<FilmographyEntry, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description' | 'seo_keywords' | 'og_image' | 'canonical_url'>;
        Update: Partial<Omit<FilmographyEntry, 'id' | 'created_at' | 'updated_at'>>;
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description'>;
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>;
      };
      experience_requests: {
        Row: ExperienceRequest;
        Insert: Omit<ExperienceRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ExperienceRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description' | 'seo_keywords' | 'og_image' | 'canonical_url'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      project_media: {
        Row: ProjectMedia;
        Insert: Omit<ProjectMedia, 'id' | 'created_at' | 'deleted_at' | 'created_by'>;
        Update: Partial<Omit<ProjectMedia, 'id' | 'created_at'>>;
      };
      project_videos: {
        Row: ProjectVideo;
        Insert: Omit<ProjectVideo, 'id' | 'created_at' | 'deleted_at' | 'created_by'>;
        Update: Partial<Omit<ProjectVideo, 'id' | 'created_at'>>;
      };
      project_recognition: {
        Row: ProjectRecognition;
        Insert: Omit<ProjectRecognition, 'id' | 'created_at' | 'deleted_at' | 'created_by'>;
        Update: Partial<Omit<ProjectRecognition, 'id' | 'created_at'>>;
      };
      gallery_collections: {
        Row: GalleryCollection;
        Insert: Omit<GalleryCollection, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'deleted_by' | 'created_by'>;
        Update: Partial<Omit<GalleryCollection, 'id' | 'created_at' | 'updated_at'>>;
      };
      gallery_photos: {
        Row: GalleryPhoto;
        Insert: Omit<GalleryPhoto, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description'>;
        Update: Partial<Omit<GalleryPhoto, 'id' | 'created_at' | 'updated_at'>>;
      };
      fan_conversations: {
        Row: FanConversation;
        Insert: Omit<FanConversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<FanConversation, 'id' | 'created_at' | 'updated_at'>>;
      };
      fan_messages: {
        Row: FanMessage;
        Insert: Omit<FanMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<FanMessage, 'id' | 'created_at'>>;
      };
      business_enquiries: {
        Row: BusinessEnquiry;
        Insert: Omit<BusinessEnquiry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BusinessEnquiry, 'id' | 'created_at' | 'updated_at'>>;
      };
      business_messages: {
        Row: BusinessMessage;
        Insert: Omit<BusinessMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<BusinessMessage, 'id' | 'created_at'>>;
      };
      media_videos: {
        Row: MediaVideo;
        Insert: Omit<MediaVideo, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description' | 'seo_keywords' | 'og_image' | 'canonical_url'>;
        Update: Partial<Omit<MediaVideo, 'id' | 'created_at' | 'updated_at'>>;
      };
      media_podcasts: {
        Row: MediaPodcast;
        Insert: Omit<MediaPodcast, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description' | 'seo_keywords' | 'og_image' | 'canonical_url'>;
        Update: Partial<Omit<MediaPodcast, 'id' | 'created_at' | 'updated_at'>>;
      };
      media_press: {
        Row: MediaPress;
        Insert: Omit<MediaPress, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by' | 'seo_title' | 'seo_description' | 'seo_keywords' | 'og_image' | 'canonical_url'>;
        Update: Partial<Omit<MediaPress, 'id' | 'created_at' | 'updated_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, 'id' | 'updated_at'>;
        Update: Partial<Omit<SiteSetting, 'id' | 'updated_at'>>;
      };
      email_templates: {
        Row: EmailTemplate;
        Insert: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>>;
      };
      faqs: {
        Row: Faq;
        Insert: Omit<Faq, 'id' | 'created_at' | 'updated_at' | 'version' | 'deleted_at' | 'deleted_by' | 'created_by'>;
        Update: Partial<Omit<Faq, 'id' | 'created_at' | 'updated_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };
      site_media: {
        Row: SiteMedia;
        Insert: Omit<SiteMedia, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteMedia, 'id' | 'created_at' | 'updated_at'>>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>;
      };
      role_permissions: {
        Row: RolePermission;
        Insert: Omit<RolePermission, 'id' | 'created_at'>;
        Update: Partial<Omit<RolePermission, 'id' | 'created_at'>>;
      };
      homepage_sections: {
        Row: HomepageSection;
        Insert: Omit<HomepageSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomepageSection, 'id' | 'created_at' | 'updated_at'>>;
      };
      homepage_hero_slides: {
        Row: HomepageHeroSlide;
        Insert: Omit<HomepageHeroSlide, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomepageHeroSlide, 'id' | 'created_at' | 'updated_at'>>;
      };
      homepage_statistics: {
        Row: HomepageStatistic;
        Insert: Omit<HomepageStatistic, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomepageStatistic, 'id' | 'created_at' | 'updated_at'>>;
      };
      homepage_quotes: {
        Row: HomepageQuote;
        Insert: Omit<HomepageQuote, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomepageQuote, 'id' | 'created_at' | 'updated_at'>>;
      };
      homepage_featured: {
        Row: HomepageFeatured;
        Insert: Omit<HomepageFeatured, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomepageFeatured, 'id' | 'created_at' | 'updated_at'>>;
      };
      homepage_cta: {
        Row: HomepageCta;
        Insert: Omit<HomepageCta, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HomepageCta, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Enums: {
      user_role: UserRole;
      admin_role: AdminRole;
      membership_status: MembershipStatus;
      application_status: ApplicationStatus;
      experience_status: ExperienceStatus;
      chat_type: ChatType;
      conversation_status: ConversationStatus;
      message_sender: MessageSender;
      content_status: ContentStatus;
      payment_status: PaymentStatus;
      notification_type: NotificationType;
      media_type: MediaType;
      project_type: ProjectType;
      project_status: ProjectStatus;
      gallery_category: GalleryCategory;
      journal_category: JournalCategory;
      experience_category: ExperienceCategory;
      department: Department;
      audit_action: AuditAction;
    };
  };
}
