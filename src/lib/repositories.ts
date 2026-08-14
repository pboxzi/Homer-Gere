// ============================================================
// REPOSITORY LAYER
// Homer Gere Platform - Supabase Database Operations
// ============================================================

import { supabase as supabaseClient } from './supabase';
import type {
  Profile,
  Admin,
  RegistrationApplication,
  MembershipPlan,
  Membership,
  JourneyEntry,
  JournalArticle,
  FilmographyEntry,
  Experience,
  ExperienceRequest,
  Project,
  ProjectMedia,
  ProjectVideo,
  ProjectRecognition,
  GalleryCollection,
  GalleryPhoto,
  FanConversation,
  FanMessage,
  BusinessEnquiry,
  BusinessMessage,
  MediaVideo,
  MediaPodcast,
  MediaPress,
  Notification,
  SiteSetting,
  EmailTemplate,
  AuditLog,
  ConversationStatus,
} from '../types/database';

// ============================================================
// CLIENT SINGLETON — reuses the shared Supabase client
// ============================================================

export function getSupabaseClient() {
  return supabaseClient;
}

// ============================================================
// PROFILES
// ============================================================

export const profilesRepository = {
  async getById(id: string): Promise<Profile | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByEmail(email: string): Promise<Profile | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<Profile[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateRole(id: string, role: Profile['role']): Promise<Profile> {
    return this.update(id, { role });
  },
};

// ============================================================
// ADMINS
// ============================================================

export const adminsRepository = {
  async getByUserId(userId: string): Promise<Admin | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('admins')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<Admin[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(admin: Omit<Admin, 'id' | 'created_at' | 'updated_at'>): Promise<Admin> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('admins')
      .insert(admin)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Admin>): Promise<Admin> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('admins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deactivate(id: string): Promise<Admin> {
    return this.update(id, { is_active: false });
  },
};

// ============================================================
// REGISTRATION APPLICATIONS
// ============================================================

export const registrationRepository = {
  async create(application: Omit<RegistrationApplication, 'id' | 'created_at' | 'updated_at'>): Promise<RegistrationApplication> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('registration_applications')
      .insert(application);
    if (error) throw error;
    return application as RegistrationApplication;
  },

  async getAll(): Promise<RegistrationApplication[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('registration_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getPending(): Promise<RegistrationApplication[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('registration_applications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async approve(id: string, reviewedBy: string): Promise<RegistrationApplication> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('registration_applications')
      .update({
        status: 'approved',
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async reject(id: string, reviewedBy: string, reason: string): Promise<RegistrationApplication> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('registration_applications')
      .update({
        status: 'rejected',
        reviewed_by: reviewedBy,
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getByEmail(email: string): Promise<RegistrationApplication | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('registration_applications')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// MEMBERSHIP PLANS
// ============================================================

export const membershipPlansRepository = {
  async getAll(): Promise<MembershipPlan[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_plans')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug: string): Promise<MembershipPlan | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_plans')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getActive(): Promise<MembershipPlan[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_plans')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(plan: Omit<MembershipPlan, 'id' | 'created_at' | 'updated_at'>): Promise<MembershipPlan> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_plans')
      .insert(plan)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<MembershipPlan>): Promise<MembershipPlan> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// MEMBERSHIPS
// ============================================================

export const membershipsRepository = {
  async getByUserId(userId: string): Promise<Membership | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<Membership[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('memberships')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(membership: Omit<Membership, 'id' | 'created_at' | 'updated_at'>): Promise<Membership> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('memberships')
      .insert(membership)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Membership>): Promise<Membership> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('memberships')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// JOURNEY ENTRIES
// ============================================================

export const journeyRepository = {
  async getAll(): Promise<JourneyEntry[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journey_entries')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<JourneyEntry | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journey_entries')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(entry: Omit<JourneyEntry, 'id' | 'created_at' | 'updated_at'>): Promise<JourneyEntry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journey_entries')
      .insert(entry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<JourneyEntry>): Promise<JourneyEntry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journey_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('journey_entries')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// JOURNAL ARTICLES
// ============================================================

export const journalRepository = {
  async getPublished(): Promise<JournalArticle[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug: string): Promise<JournalArticle | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getFeatured(): Promise<JournalArticle[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: string): Promise<JournalArticle[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .eq('status', 'published')
      .eq('category', category)
      .order('published_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAll(): Promise<JournalArticle[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(article: Omit<JournalArticle, 'id' | 'created_at' | 'updated_at'>): Promise<JournalArticle> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .insert(article)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<JournalArticle>): Promise<JournalArticle> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async incrementViews(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.rpc('increment_views' as never, { article_id: id } as never);
    if (error) {
      // Fallback: manual increment
      const article = await this.getById(id);
      if (article) {
        await this.update(id, { views: article.views + 1 });
      }
    }
  },

  async getById(id: string): Promise<JournalArticle | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('journal_articles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// FILMOGRAPHY
// ============================================================

export const filmographyRepository = {
  async getAll(): Promise<FilmographyEntry[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('filmography_entries')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<FilmographyEntry | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('filmography_entries')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(entry: Omit<FilmographyEntry, 'id' | 'created_at' | 'updated_at'>): Promise<FilmographyEntry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('filmography_entries')
      .insert(entry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<FilmographyEntry>): Promise<FilmographyEntry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('filmography_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('filmography_entries')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// EXPERIENCES
// ============================================================

export const experiencesRepository = {
  async getAll(): Promise<Experience[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Experience | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experiences')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByType(type: string): Promise<Experience[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experiences')
      .select('*')
      .eq('type', type)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(experience: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experiences')
      .insert(experience)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Experience>): Promise<Experience> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('experiences')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// EXPERIENCE REQUESTS
// ============================================================

export const experienceRequestsRepository = {
  async create(request: Omit<ExperienceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ExperienceRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .insert(request)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<ExperienceRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId: string): Promise<ExperienceRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: string, status: ExperienceRequest['status']): Promise<ExperienceRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// PROJECTS
// ============================================================

export const projectsRepository = {
  async getAll(): Promise<Project[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .order('year', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getBySlug(slug: string): Promise<Project | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Project | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getWithDetails(slug: string): Promise<{
    project: Project;
    media: ProjectMedia[];
    videos: ProjectVideo[];
    recognition: ProjectRecognition[];
  } | null> {
    const client = getSupabaseClient();
    const project = await this.getBySlug(slug);
    if (!project) return null;

    const [mediaResult, videosResult, recognitionResult] = await Promise.all([
      client.from('project_media').select('*').eq('project_id', project.id).order('sort_order'),
      client.from('project_videos').select('*').eq('project_id', project.id).order('sort_order'),
      client.from('project_recognition').select('*').eq('project_id', project.id),
    ]);

    return {
      project,
      media: mediaResult.data || [],
      videos: videosResult.data || [],
      recognition: recognitionResult.data || [],
    };
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// PROJECT MEDIA
// ============================================================

export const projectMediaRepository = {
  async getByProjectId(projectId: string): Promise<ProjectMedia[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('project_media')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(media: Omit<ProjectMedia, 'id' | 'created_at'>): Promise<ProjectMedia> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('project_media')
      .insert(media)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('project_media')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// GALLERY
// ============================================================

export const galleryRepository = {
  async getAllPhotos(): Promise<GalleryPhoto[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getFeaturedPhotos(): Promise<GalleryPhoto[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .select('*')
      .eq('featured', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: string): Promise<GalleryPhoto[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .select('*')
      .eq('category', category)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getCollections(): Promise<GalleryCollection[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_collections')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createPhoto(photo: Omit<GalleryPhoto, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryPhoto> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .insert(photo)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deletePhoto(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('gallery_photos')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// FAN CHAT
// ============================================================

export const fanChatRepository = {
  async createConversation(conversation: Omit<FanConversation, 'id' | 'created_at' | 'updated_at'>): Promise<FanConversation> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fan_conversations')
      .insert(conversation)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getConversations(): Promise<FanConversation[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fan_conversations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getConversationById(id: string): Promise<FanConversation | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fan_conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getMessages(conversationId: string): Promise<FanMessage[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fan_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async sendMessage(message: Omit<FanMessage, 'id' | 'created_at'>): Promise<FanMessage> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fan_messages')
      .insert(message)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateConversationStatus(id: string, status: ConversationStatus): Promise<FanConversation> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('fan_conversations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// BUSINESS ENQUIRIES
// ============================================================

export const businessEnquiriesRepository = {
  async create(enquiry: Omit<BusinessEnquiry, 'id' | 'created_at' | 'updated_at'>): Promise<BusinessEnquiry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('business_enquiries')
      .insert(enquiry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<BusinessEnquiry[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('business_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getMessages(enquiryId: string): Promise<BusinessMessage[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('business_messages')
      .select('*')
      .eq('enquiry_id', enquiryId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async sendMessage(message: Omit<BusinessMessage, 'id' | 'created_at'>): Promise<BusinessMessage> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('business_messages')
      .insert(message)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: BusinessEnquiry['status']): Promise<BusinessEnquiry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('business_enquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// MEDIA (Videos, Podcasts, Press)
// ============================================================

export const mediaRepository = {
  async getVideos(): Promise<MediaVideo[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_videos')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getFeaturedVideos(): Promise<MediaVideo[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_videos')
      .select('*')
      .eq('featured', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPodcasts(): Promise<MediaPodcast[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_podcasts')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPress(): Promise<MediaPress[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_press')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createVideo(video: Omit<MediaVideo, 'id' | 'created_at' | 'updated_at'>): Promise<MediaVideo> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_videos')
      .insert(video)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createPodcast(podcast: Omit<MediaPodcast, 'id' | 'created_at' | 'updated_at'>): Promise<MediaPodcast> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_podcasts')
      .insert(podcast)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createPress(press: Omit<MediaPress, 'id' | 'created_at' | 'updated_at'>): Promise<MediaPress> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_press')
      .insert(press)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// NOTIFICATIONS
// ============================================================

export const notificationsRepository = {
  async getAll(): Promise<Notification[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId: string): Promise<Notification[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const client = getSupabaseClient();
    const { count, error } = await client
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
    return count || 0;
  },

  async markAsRead(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
  },

  async create(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('notifications')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// SITE SETTINGS
// ============================================================

export const siteSettingsRepository = {
  async getByCategory(category: string): Promise<SiteSetting | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .eq('category', category)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<SiteSetting[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .order('category', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async upsert(category: string, settings: Record<string, unknown>): Promise<SiteSetting> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_settings')
      .upsert({ category, settings }, { onConflict: 'category' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// EMAIL TEMPLATES
// ============================================================

export const emailTemplatesRepository = {
  async getByName(name: string): Promise<EmailTemplate | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('email_templates')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<EmailTemplate[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('email_templates')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('email_templates')
      .insert(template)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('email_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ============================================================
// AUDIT LOGS
// ============================================================

export const auditLogsRepository = {
  async create(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('audit_logs')
      .insert(log)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(limit = 100): Promise<AuditLog[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async getByUser(userId: string): Promise<AuditLog[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByTable(tableName: string): Promise<AuditLog[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('audit_logs')
      .select('*')
      .eq('table_name', tableName)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
