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
  Faq,
  Notification,
  SiteSetting,
  EmailTemplate,
  AuditLog,
  ConversationStatus,
  Payment,
  RolePermission,
  HomepageSection,
  HomepageHeroSlide,
  HomepageStatistic,
  HomepageQuote,
  HomepageFeatured,
  HomepageCta,
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

  async softDelete(id: string, deletedBy: string): Promise<Profile> {
    return this.update(id, {
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy,
      account_status: 'deactivated',
    });
  },

  async restore(id: string): Promise<Profile> {
    return this.update(id, {
      deleted_at: null,
      deleted_by: null,
      account_status: 'active',
    });
  },

  async getActive(): Promise<Profile[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateCompletion(id: string, completion: number): Promise<Profile> {
    return this.update(id, { profile_completion: Math.min(100, Math.max(0, completion)) });
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
    const now = new Date().toISOString();
    const { data, error } = await client
      .from('registration_applications')
      .update({
        status: 'approved',
        reviewed_by: reviewedBy,
        reviewed_at: now,
        approved_at: now,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async reject(id: string, reviewedBy: string, reason: string): Promise<RegistrationApplication> {
    const client = getSupabaseClient();
    const now = new Date().toISOString();
    const { data, error } = await client
      .from('registration_applications')
      .update({
        status: 'rejected',
        reviewed_by: reviewedBy,
        rejection_reason: reason,
        reviewed_at: now,
        rejected_at: now,
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

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('experience_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
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

  async updatePhoto(id: string, updates: Partial<GalleryPhoto>): Promise<GalleryPhoto> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .update(updates)
      .eq('id', id)
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

  async updateVideo(id: string, updates: Partial<MediaVideo>): Promise<MediaVideo> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteVideo(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_videos')
      .delete()
      .eq('id', id);
    if (error) throw error;
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

  async updatePodcast(id: string, updates: Partial<MediaPodcast>): Promise<MediaPodcast> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_podcasts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deletePodcast(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_podcasts')
      .delete()
      .eq('id', id);
    if (error) throw error;
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

  async updatePress(id: string, updates: Partial<MediaPress>): Promise<MediaPress> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_press')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deletePress(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_press')
      .delete()
      .eq('id', id);
    if (error) throw error;
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
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
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

  async getByCategory(category: string): Promise<Notification[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notifications')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getUnreadByPriority(userId: string, priority: string): Promise<Notification[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .eq('priority', priority)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('notifications')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async deleteExpired(): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('notifications')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null);
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
// FAQS
// ============================================================

export const faqRepository = {
  async getAll(): Promise<Faq[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(faq: Omit<Faq, 'id' | 'created_at' | 'updated_at'>): Promise<Faq> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('faqs')
      .insert(faq)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Faq>): Promise<Faq> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('faqs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('faqs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async reorder(items: { id: string; sort_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, sort_order }) =>
      client
        .from('faqs')
        .update({ sort_order, updated_at: new Date().toISOString() })
        .eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
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

  async getByModule(moduleName: string): Promise<AuditLog[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('audit_logs')
      .select('*')
      .eq('module', moduleName)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

// ============================================================
// PAYMENTS
// ============================================================

export const paymentsRepository = {
  async getAll(): Promise<Payment[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Payment | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payments')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByMemberId(memberId: string): Promise<Payment[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payments')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payments')
      .insert(payment)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Payment>): Promise<Payment> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payments')
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
      .from('payments')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// ROLE PERMISSIONS
// ============================================================

export const rolePermissionsRepository = {
  async getAll(): Promise<RolePermission[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('role_permissions')
      .select('*')
      .order('role');
    if (error) throw error;
    return data || [];
  },

  async getByRole(role: string): Promise<RolePermission[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('role_permissions')
      .select('*')
      .eq('role', role);
    if (error) throw error;
    return data || [];
  },

  async create(permission: Omit<RolePermission, 'id' | 'created_at'>): Promise<RolePermission> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('role_permissions')
      .insert(permission)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('role_permissions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async deleteByRole(role: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('role_permissions')
      .delete()
      .eq('role', role);
    if (error) throw error;
  },

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .rpc('has_permission', { user_id: userId, permission_name: permission });
    if (error) throw error;
    return data || false;
  },
};

// ============================================================
// SITE MEDIA (Extended)
// ============================================================

export const siteMediaRepository = {
  async getAll(): Promise<import('../types/database').SiteMedia[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_media')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<import('../types/database').SiteMedia | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_media')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByFolder(folder: string): Promise<import('../types/database').SiteMedia[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_media')
      .select('*')
      .eq('folder', folder)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByType(fileType: string): Promise<import('../types/database').SiteMedia[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_media')
      .select('*')
      .eq('file_type', fileType)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(media: Omit<import('../types/database').SiteMedia, 'id' | 'created_at' | 'updated_at'>): Promise<import('../types/database').SiteMedia> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_media')
      .insert(media)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<import('../types/database').SiteMedia>): Promise<import('../types/database').SiteMedia> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('site_media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async incrementUsage(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client.rpc('increment_usage_count' as never, { media_id: id } as never);
    if (error) {
      // Fallback: manual increment
      const media = await this.getById(id);
      if (media) {
        await this.update(id, { usage_count: (media.usage_count || 0) + 1 });
      }
    }
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('site_media')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// HOMEPAGE CMS
// ============================================================

export const homepageCmsRepository = {
  // ----- Sections -----
  async getSections(): Promise<HomepageSection[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_sections')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPublishedSections(): Promise<HomepageSection[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_sections')
      .select('*')
      .eq('published', true)
      .eq('enabled', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async updateSection(id: string, updates: Partial<HomepageSection>): Promise<HomepageSection> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSectionByKey(sectionKey: string, updates: Partial<HomepageSection>): Promise<HomepageSection> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_sections')
      .update(updates)
      .eq('section_key', sectionKey)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async reorderSections(sections: { id: string; display_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = sections.map(({ id, display_order }) =>
      client.from('homepage_sections').update({ display_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
  },

  // ----- Hero Slides -----
  async getHeroSlides(): Promise<HomepageHeroSlide[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_hero_slides')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getActiveHeroSlides(): Promise<HomepageHeroSlide[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_hero_slides')
      .select('*')
      .eq('active', true)
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createHeroSlide(slide: Omit<HomepageHeroSlide, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageHeroSlide> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_hero_slides')
      .insert(slide)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateHeroSlide(id: string, updates: Partial<HomepageHeroSlide>): Promise<HomepageHeroSlide> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_hero_slides')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteHeroSlide(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('homepage_hero_slides')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async reorderHeroSlides(slides: { id: string; display_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = slides.map(({ id, display_order }) =>
      client.from('homepage_hero_slides').update({ display_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
  },

  // ----- Statistics -----
  async getStatistics(): Promise<HomepageStatistic[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_statistics')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPublishedStatistics(): Promise<HomepageStatistic[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_statistics')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createStatistic(stat: Omit<HomepageStatistic, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageStatistic> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_statistics')
      .insert(stat)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatistic(id: string, updates: Partial<HomepageStatistic>): Promise<HomepageStatistic> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_statistics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStatistic(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('homepage_statistics')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async reorderStatistics(stats: { id: string; display_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = stats.map(({ id, display_order }) =>
      client.from('homepage_statistics').update({ display_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
  },

  // ----- Quotes -----
  async getQuotes(): Promise<HomepageQuote[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_quotes')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPublishedQuotes(): Promise<HomepageQuote[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_quotes')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createQuote(quote: Omit<HomepageQuote, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageQuote> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_quotes')
      .insert(quote)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateQuote(id: string, updates: Partial<HomepageQuote>): Promise<HomepageQuote> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteQuote(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('homepage_quotes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async reorderQuotes(quotes: { id: string; display_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = quotes.map(({ id, display_order }) =>
      client.from('homepage_quotes').update({ display_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
  },

  // ----- Featured -----
  async getFeatured(): Promise<HomepageFeatured[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_featured')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPublishedFeatured(): Promise<HomepageFeatured[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_featured')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createFeatured(featured: Omit<HomepageFeatured, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageFeatured> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_featured')
      .insert(featured)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateFeatured(id: string, updates: Partial<HomepageFeatured>): Promise<HomepageFeatured> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_featured')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteFeatured(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('homepage_featured')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // ----- CTA -----
  async getCtaSections(): Promise<HomepageCta[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_cta')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPublishedCtaSections(): Promise<HomepageCta[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_cta')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createCta(cta: Omit<HomepageCta, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageCta> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_cta')
      .insert(cta)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCta(id: string, updates: Partial<HomepageCta>): Promise<HomepageCta> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('homepage_cta')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCta(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('homepage_cta')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async reorderCta(ctas: { id: string; display_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = ctas.map(({ id, display_order }) =>
      client.from('homepage_cta').update({ display_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
  },
};
