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
  MembershipRequest,
  PaymentMethod,
  PaymentRequest,
  PaymentSubmission,
  MembershipCard,
  DownloadItem,
  MemberDownload,
  ActivityLog,
  ExperienceDocument,
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
      .is('deleted_at', null)
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

  async create(entry: { title: string; description: string; year: number; sort_order?: number; highlight?: boolean; details?: string | null; icon_name?: string | null; image_url?: string | null; status?: string; slug?: string }): Promise<JourneyEntry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journey_entries')
      .insert({ ...entry, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<JourneyEntry>): Promise<JourneyEntry> {
    const client = getSupabaseClient();
    const current = await this.getById(id);
    const newVersion = (current?.version || 1) + 1;
    const { data, error } = await client
      .from('journey_entries')
      .update({ ...updates, version: newVersion })
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

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('journey_entries')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restore(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('journey_entries')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeleted(): Promise<JourneyEntry[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journey_entries')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async search(query: string): Promise<JourneyEntry[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journey_entries')
      .select('*')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async reorder(items: { id: string; sort_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, sort_order }) =>
      client.from('journey_entries').update({ sort_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
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
      .is('deleted_at', null)
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
      .is('deleted_at', null)
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
      .is('deleted_at', null)
      .order('published_date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAll(): Promise<JournalArticle[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(article: { title: string; slug: string; excerpt?: string | null; content: string; author?: string; category: string; tags?: string[]; status?: string; published_date?: string | null; read_time?: string | null; views?: number; featured?: boolean; trending?: boolean; cover_image?: string | null; og_image?: string | null; seo_title?: string | null; seo_description?: string | null; author_image?: string | null; related_slugs?: string[] }): Promise<JournalArticle> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .insert({ ...article, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<JournalArticle>): Promise<JournalArticle> {
    const client = getSupabaseClient();
    const current = await this.getById(id);
    const newVersion = (current?.version || 1) + 1;
    const { data, error } = await client
      .from('journal_articles')
      .update({ ...updates, version: newVersion })
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

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('journal_articles')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restore(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('journal_articles')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeleted(): Promise<JournalArticle[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async search(query: string): Promise<JournalArticle[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('journal_articles')
      .select('*')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
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
      .is('deleted_at', null)
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

  async create(entry: { title: string; role: string; year: number; type?: string | null; description?: string | null; status?: string | null; image?: string | null; slug?: string | null; sort_order?: number }): Promise<FilmographyEntry> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('filmography_entries')
      .insert({ ...entry, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<FilmographyEntry>): Promise<FilmographyEntry> {
    const client = getSupabaseClient();
    const current = await this.getById(id);
    const newVersion = (current?.version || 1) + 1;
    const { data, error } = await client
      .from('filmography_entries')
      .update({ ...updates, version: newVersion })
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

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('filmography_entries')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restore(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('filmography_entries')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeleted(): Promise<FilmographyEntry[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('filmography_entries')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async search(query: string): Promise<FilmographyEntry[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('filmography_entries')
      .select('*')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,role.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async reorder(items: { id: string; sort_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, sort_order }) =>
      client.from('filmography_entries').update({ sort_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
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
  async create(request: { user_id?: string | null; experience_type: string; full_name: string; email: string; phone?: string | null; country?: string | null; organization?: string | null; event_date?: string | null; event_location?: string | null; budget?: string | null; purpose?: string | null; additional_details?: string | null; status?: string; preferred_date?: string | null; num_guests?: number; special_requirements?: string | null; timeline?: string | null }): Promise<ExperienceRequest> {
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
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<ExperienceRequest | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string): Promise<ExperienceRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
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

  async update(id: string, updates: Partial<ExperienceRequest>): Promise<ExperienceRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async search(query: string): Promise<ExperienceRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .select('*')
      .is('deleted_at', null)
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,request_number.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getStats(): Promise<Record<string, number>> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .select('status')
      .is('deleted_at', null);
    if (error) throw error;
    const stats: Record<string, number> = { total: 0, pending: 0, under_review: 0, approved: 0, declined: 0, completed: 0 };
    for (const row of data || []) {
      stats.total++;
      stats[row.status] = (stats[row.status] || 0) + 1;
    }
    return stats;
  },

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('experience_requests')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy })
      .eq('id', id);
    if (error) throw error;
  },

  async restore(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('experience_requests')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeleted(): Promise<ExperienceRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async reserveSlot(id: string): Promise<ExperienceRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .update({ slot_reserved: true, reservation_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async confirmExperience(id: string): Promise<ExperienceRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_requests')
      .update({ confirmed_at: new Date().toISOString(), status: 'completed' })
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
      .is('deleted_at', null)
      .order('display_order', { ascending: true });
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
      client.from('project_media').select('*').eq('project_id', project.id).is('deleted_at', null).order('sort_order'),
      client.from('project_videos').select('*').eq('project_id', project.id).is('deleted_at', null).order('sort_order'),
      client.from('project_recognition').select('*').eq('project_id', project.id).is('deleted_at', null),
    ]);

    return {
      project,
      media: mediaResult.data || [],
      videos: videosResult.data || [],
      recognition: recognitionResult.data || [],
    };
  },

  async create(project: { slug: string; title: string; year: number; type: string; status?: string; tagline?: string | null; synopsis?: string | null; expanded_synopsis?: string | null; genre?: string | null; runtime?: string | null; director?: string | null; homer_role_title?: string | null; homer_role_description?: string | null; image?: string | null; hero_image?: string | null; poster_image?: string | null; logo_image?: string | null; is_featured?: boolean; display_order?: number }): Promise<Project> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .insert({ ...project, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: { slug?: string; title?: string; year?: number; type?: string; status?: string; tagline?: string | null; synopsis?: string | null; expanded_synopsis?: string | null; genre?: string | null; runtime?: string | null; director?: string | null; homer_role_title?: string | null; homer_role_description?: string | null; image?: string | null; hero_image?: string | null; poster_image?: string | null; logo_image?: string | null; is_featured?: boolean; display_order?: number }): Promise<Project> {
    const client = getSupabaseClient();
    const current = await this.getById(id);
    const newVersion = (current?.version || 1) + 1;
    const { data, error } = await client
      .from('projects')
      .update({ ...updates, version: newVersion })
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

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('projects')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restore(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('projects')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeleted(): Promise<Project[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async search(query: string): Promise<Project[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('projects')
      .select('*')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%,director.ilike.%${query}%`)
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async reorder(items: { id: string; display_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, display_order }) =>
      client.from('projects').update({ display_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
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
      .is('deleted_at', null)
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
      .is('deleted_at', null)
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
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getCollections(): Promise<GalleryCollection[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_collections')
      .select('*')
      .is('deleted_at', null)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createCollection(collection: Omit<GalleryCollection, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryCollection> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_collections')
      .insert(collection)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCollection(id: string, updates: Partial<GalleryCollection>): Promise<GalleryCollection> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCollection(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('gallery_collections')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async createPhoto(photo: { src: string; alt: string; category: string; caption?: string | null; date?: string | null; event?: string | null; photographer?: string | null; featured?: boolean; collection_id?: string | null; sort_order?: number; status?: string }): Promise<GalleryPhoto> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .insert({ ...photo, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePhoto(id: string, updates: Partial<GalleryPhoto>): Promise<GalleryPhoto> {
    const client = getSupabaseClient();
    const current = await client.from('gallery_photos').select('version').eq('id', id).maybeSingle();
    const newVersion = ((current.data?.version as number) || 1) + 1;
    const { data, error } = await client
      .from('gallery_photos')
      .update({ ...updates, version: newVersion })
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

  async softDeletePhoto(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('gallery_photos')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restorePhoto(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('gallery_photos')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeletedPhotos(): Promise<GalleryPhoto[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async searchPhotos(query: string): Promise<GalleryPhoto[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('gallery_photos')
      .select('*')
      .is('deleted_at', null)
      .or(`alt.ilike.%${query}%,caption.ilike.%${query}%,event.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async reorderPhotos(items: { id: string; sort_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, sort_order }) =>
      client.from('gallery_photos').update({ sort_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
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
// NEWSLETTER SUBSCRIBERS
// ============================================================

export const newsletterRepository = {
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    const trimmed = email.trim().toLowerCase();

    const { data: existing } = await client
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', trimmed)
      .single();

    if (existing && existing.is_active) {
      return { success: true, message: 'You are already subscribed.' };
    }

    if (existing && !existing.is_active) {
      const { error } = await client
        .from('newsletter_subscribers')
        .update({ is_active: true, subscribed_at: new Date().toISOString(), unsubscribed_at: null })
        .eq('id', existing.id);
      if (error) throw error;
      return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
    }

    const { error } = await client
      .from('newsletter_subscribers')
      .insert({ email: trimmed, source: 'homepage' });
    if (error) throw error;
    return { success: true, message: "You're subscribed. Welcome to the journey." };
  },

  async unsubscribe(email: string): Promise<{ success: boolean }> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('newsletter_subscribers')
      .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
      .eq('email', email.trim().toLowerCase());
    if (error) throw error;
    return { success: true };
  },

  async isActive(email: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { data } = await client
      .from('newsletter_subscribers')
      .select('is_active')
      .eq('email', email.trim().toLowerCase())
      .single();
    return data?.is_active ?? false;
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
      .is('deleted_at', null)
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
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPodcasts(): Promise<MediaPodcast[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_podcasts')
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getPress(): Promise<MediaPress[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_press')
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async createVideo(video: { title: string; url: string; description?: string | null; thumbnail?: string | null; source?: string | null; category?: string | null; duration?: string | null; date?: string | null; featured?: boolean; sort_order?: number; status?: string }): Promise<MediaVideo> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_videos')
      .insert({ ...video, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateVideo(id: string, updates: Partial<MediaVideo>): Promise<MediaVideo> {
    const client = getSupabaseClient();
    const current = await client.from('media_videos').select('version').eq('id', id).maybeSingle();
    const newVersion = ((current.data?.version as number) || 1) + 1;
    const { data, error } = await client
      .from('media_videos')
      .update({ ...updates, version: newVersion })
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

  async softDeleteVideo(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_videos')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restoreVideo(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_videos')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeletedVideos(): Promise<MediaVideo[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_videos')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async searchVideos(query: string): Promise<MediaVideo[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_videos')
      .select('*')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async reorderVideos(items: { id: string; sort_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, sort_order }) =>
      client.from('media_videos').update({ sort_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
  },

  async createPodcast(podcast: { episode_title: string; show_name: string; description?: string | null; cover_art?: string | null; date?: string | null; url: string; sort_order?: number; status?: string }): Promise<MediaPodcast> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_podcasts')
      .insert({ ...podcast, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePodcast(id: string, updates: Partial<MediaPodcast>): Promise<MediaPodcast> {
    const client = getSupabaseClient();
    const current = await client.from('media_podcasts').select('version').eq('id', id).maybeSingle();
    const newVersion = ((current.data?.version as number) || 1) + 1;
    const { data, error } = await client
      .from('media_podcasts')
      .update({ ...updates, version: newVersion })
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

  async softDeletePodcast(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_podcasts')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restorePodcast(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_podcasts')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeletedPodcasts(): Promise<MediaPodcast[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_podcasts')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async searchPodcasts(query: string): Promise<MediaPodcast[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_podcasts')
      .select('*')
      .is('deleted_at', null)
      .or(`episode_title.ilike.%${query}%,show_name.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async reorderPodcasts(items: { id: string; sort_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, sort_order }) =>
      client.from('media_podcasts').update({ sort_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
  },

  async createPress(press: { headline: string; publisher: string; date?: string | null; summary?: string | null; url: string; image?: string | null; sort_order?: number; status?: string }): Promise<MediaPress> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_press')
      .insert({ ...press, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePress(id: string, updates: Partial<MediaPress>): Promise<MediaPress> {
    const client = getSupabaseClient();
    const current = await client.from('media_press').select('version').eq('id', id).maybeSingle();
    const newVersion = ((current.data?.version as number) || 1) + 1;
    const { data, error } = await client
      .from('media_press')
      .update({ ...updates, version: newVersion })
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

  async softDeletePress(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_press')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restorePress(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('media_press')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeletedPress(): Promise<MediaPress[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_press')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async searchPress(query: string): Promise<MediaPress[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('media_press')
      .select('*')
      .is('deleted_at', null)
      .or(`headline.ilike.%${query}%,publisher.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async reorderPress(items: { id: string; sort_order: number }[]): Promise<void> {
    const client = getSupabaseClient();
    const updates = items.map(({ id, sort_order }) =>
      client.from('media_press').update({ sort_order }).eq('id', id)
    );
    const results = await Promise.all(updates);
    for (const { error } of results) {
      if (error) throw error;
    }
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
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(faq: { question: string; answer: string; category: string; sort_order?: number; published?: boolean }): Promise<Faq> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('faqs')
      .insert({ ...faq, version: 1 })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Faq>): Promise<Faq> {
    const client = getSupabaseClient();
    const current = await client.from('faqs').select('version').eq('id', id).maybeSingle();
    const newVersion = ((current.data?.version as number) || 1) + 1;
    const { data, error } = await client
      .from('faqs')
      .update({ ...updates, version: newVersion, updated_at: new Date().toISOString() })
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

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('faqs')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy || null })
      .eq('id', id);
    if (error) throw error;
  },

  async restore(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('faqs')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);
    if (error) throw error;
  },

  async getDeleted(): Promise<Faq[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('faqs')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async search(query: string): Promise<Faq[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('faqs')
      .select('*')
      .is('deleted_at', null)
      .or(`question.ilike.%${query}%,answer.ilike.%${query}%,category.ilike.%${query}%`)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
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
  async create(log: { user_id?: string | null; action: string; table_name: string; record_id?: string | null; old_data?: Record<string, unknown> | null; new_data?: Record<string, unknown> | null; module?: string; browser?: string; device?: string; ip_address?: string; user_agent?: string }): Promise<AuditLog> {
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

// ============================================================
// PHASE 4: MEMBERSHIP REQUESTS
// ============================================================

export const membershipRequestsRepository = {
  async create(request: { user_id?: string | null; full_name: string; email: string; phone?: string | null; country?: string | null; membership_plan_id?: string | null; membership_plan_name: string; duration: string; preferred_payment_method?: string | null; currency?: string; notes?: string | null }): Promise<MembershipRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_requests')
      .insert(request)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<MembershipRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_requests')
      .select('*')
      .order('requested_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<MembershipRequest | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string): Promise<MembershipRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_requests')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByStatus(status: string): Promise<MembershipRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_requests')
      .select('*')
      .eq('status', status)
      .order('requested_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async updateStatus(id: string, status: string, adminNotes?: string, approvedBy?: string): Promise<MembershipRequest> {
    const client = getSupabaseClient();
    const updates: Record<string, unknown> = { status };
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;
    if (status === 'approved_for_payment') {
      updates.approved_at = new Date().toISOString();
      updates.approved_by = approvedBy;
    }
    if (status === 'rejected') {
      updates.rejection_reason = adminNotes;
    }
    const { data, error } = await client
      .from('membership_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async approve(id: string, approvedBy: string): Promise<MembershipRequest> {
    return this.updateStatus(id, 'approved_for_payment', undefined, approvedBy);
  },

  async reject(id: string, rejectionReason: string): Promise<MembershipRequest> {
    return this.updateStatus(id, 'rejected', rejectionReason);
  },

  async search(query: string): Promise<MembershipRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_requests')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,request_number.ilike.%${query}%`)
      .order('requested_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getStats(): Promise<Record<string, number>> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_requests')
      .select('status');
    if (error) throw error;
    const stats: Record<string, number> = { total: 0 };
    for (const row of data || []) {
      stats.total++;
      stats[row.status] = (stats[row.status] || 0) + 1;
    }
    return stats;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('membership_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// PHASE 4: PAYMENT METHODS
// ============================================================

export const paymentMethodsRepository = {
  async getAll(): Promise<PaymentMethod[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_methods')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getActive(): Promise<PaymentMethod[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<PaymentMethod | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByType(type: string): Promise<PaymentMethod[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_methods')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(method: { name: string; type: string; country?: string | null; currency?: string; account_name?: string | null; account_number?: string | null; bank_name?: string | null; swift_code?: string | null; routing_code?: string | null; mobile_number?: string | null; instructions?: string | null; is_active?: boolean; sort_order?: number }): Promise<PaymentMethod> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_methods')
      .insert(method)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_methods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleActive(id: string): Promise<PaymentMethod> {
    const client = getSupabaseClient();
    const { data: current } = await client.from('payment_methods').select('is_active').eq('id', id).single();
    const { data, error } = await client
      .from('payment_methods')
      .update({ is_active: !current?.is_active })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('payment_methods')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// PHASE 4: PAYMENT REQUESTS
// ============================================================

export const paymentRequestsRepository = {
  async create(request: { user_id: string; payment_type: string; related_record_id: string; payment_method_id?: string | null; amount: number; currency?: string; due_date?: string | null; admin_notes?: string | null; payment_instructions?: string | null }): Promise<PaymentRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .insert(request)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<PaymentRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<PaymentRequest | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string): Promise<PaymentRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByRelatedRecord(recordId: string, type: string): Promise<PaymentRequest | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .select('*')
      .eq('related_record_id', recordId)
      .eq('payment_type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, approvedBy?: string): Promise<PaymentRequest> {
    const client = getSupabaseClient();
    const updates: Record<string, unknown> = { status };
    if (status === 'approved') {
      updates.approved_at = new Date().toISOString();
      updates.approved_by = approvedBy;
    }
    const { data, error } = await client
      .from('payment_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async sendInstructions(id: string, instructions: string, methodId: string): Promise<PaymentRequest> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .update({ payment_instructions: instructions, payment_method_id: methodId, status: 'instructions_sent' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async search(query: string): Promise<PaymentRequest[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .select('*')
      .or(`request_number.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getStats(): Promise<Record<string, number>> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_requests')
      .select('status');
    if (error) throw error;
    const stats: Record<string, number> = { total: 0 };
    for (const row of data || []) {
      stats.total++;
      stats[row.status] = (stats[row.status] || 0) + 1;
    }
    return stats;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('payment_requests')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// PHASE 4: PAYMENT SUBMISSIONS
// ============================================================

export const paymentSubmissionsRepository = {
  async create(submission: { payment_request_id: string; user_id: string; transaction_reference: string; amount_paid: number; currency?: string; payment_date: string; proof_url?: string | null; notes?: string | null }): Promise<PaymentSubmission> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .insert(submission)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<PaymentSubmission[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<PaymentSubmission | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByPaymentRequestId(requestId: string): Promise<PaymentSubmission[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .select('*')
      .eq('payment_request_id', requestId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId: string): Promise<PaymentSubmission[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async verify(id: string, verifiedBy: string): Promise<PaymentSubmission> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .update({ status: 'verified', verified_at: new Date().toISOString(), verified_by: verifiedBy })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async reject(id: string, adminNotes: string): Promise<PaymentSubmission> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .update({ status: 'rejected', admin_notes: adminNotes })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async requestMoreInfo(id: string, adminNotes: string): Promise<PaymentSubmission> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .update({ status: 'needs_info', admin_notes: adminNotes })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async search(query: string): Promise<PaymentSubmission[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .select('*')
      .or(`submission_number.ilike.%${query}%,transaction_reference.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getStats(): Promise<Record<string, number>> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('payment_submissions')
      .select('status');
    if (error) throw error;
    const stats: Record<string, number> = { total: 0 };
    for (const row of data || []) {
      stats.total++;
      stats[row.status] = (stats[row.status] || 0) + 1;
    }
    return stats;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('payment_submissions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// PHASE 4: MEMBERSHIP CARDS
// ============================================================

export const membershipCardsRepository = {
  async create(card: { user_id: string; membership_id?: string | null; membership_request_id?: string | null; card_number: string; qr_code_data?: string | null; issue_date?: string; expiry_date?: string | null; card_design?: string }): Promise<MembershipCard> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .insert(card)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(): Promise<MembershipCard[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<MembershipCard | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string): Promise<MembershipCard[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getActiveByUserId(userId: string): Promise<MembershipCard | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async renew(id: string, newExpiryDate: string): Promise<MembershipCard> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .update({ expiry_date: newExpiryDate, status: 'active' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deactivate(id: string): Promise<MembershipCard> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .update({ status: 'deactivated' })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async replace(id: string): Promise<{ old: MembershipCard; new: MembershipCard }> {
    const client = getSupabaseClient();
    const { data: oldCard } = await client.from('membership_cards').select('*').eq('id', id).single();
    if (!oldCard) throw new Error('Card not found');

    const newCardNumber = 'HG-' + Date.now().toString(36).toUpperCase();
    const { data: newCard, error: createError } = await client
      .from('membership_cards')
      .insert({
        user_id: oldCard.user_id,
        membership_id: oldCard.membership_id,
        card_number: newCardNumber,
        qr_code_data: newCardNumber,
        issue_date: new Date().toISOString().split('T')[0],
        expiry_date: oldCard.expiry_date,
        card_design: oldCard.card_design,
      })
      .select()
      .single();
    if (createError) throw createError;

    await client
      .from('membership_cards')
      .update({ status: 'replaced', replaced_by: newCard.id })
      .eq('id', id);

    return { old: { ...oldCard, status: 'replaced' as const }, new: newCard };
  },

  async getStats(): Promise<Record<string, number>> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('membership_cards')
      .select('status');
    if (error) throw error;
    const stats: Record<string, number> = { total: 0 };
    for (const row of data || []) {
      stats.total++;
      stats[row.status] = (stats[row.status] || 0) + 1;
    }
    return stats;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('membership_cards')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// DOWNLOAD ITEMS
// ============================================================

export const downloadItemsRepository = {
  async getAll(): Promise<DownloadItem[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('download_items')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getActive(): Promise<DownloadItem[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('download_items')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: string): Promise<DownloadItem[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('download_items')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<DownloadItem | null> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('download_items')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(item: Omit<DownloadItem, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'deleted_by'>): Promise<DownloadItem> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('download_items')
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<DownloadItem>): Promise<DownloadItem> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('download_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('download_items')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy })
      .eq('id', id);
    if (error) throw error;
  },

  async incrementDownloadCount(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('download_items')
      .update({ download_count: (client as any).rpc ? 0 : 0 })
      .eq('id', id);
    if (error) throw error;
  },
};

// ============================================================
// MEMBER DOWNLOADS
// ============================================================

export const memberDownloadsRepository = {
  async getByUserId(userId: string): Promise<MemberDownload[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('member_downloads')
      .select('*')
      .eq('user_id', userId)
      .order('downloaded_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async recordDownload(userId: string, downloadItemId: string): Promise<MemberDownload> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('member_downloads')
      .upsert({ user_id: userId, download_item_id: downloadItemId }, { onConflict: 'user_id,download_item_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async hasDownloaded(userId: string, downloadItemId: string): Promise<boolean> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('member_downloads')
      .select('id')
      .eq('user_id', userId)
      .eq('download_item_id', downloadItemId)
      .maybeSingle();
    if (error) throw error;
    return !!data;
  },
};

// ============================================================
// ACTIVITY LOGS
// ============================================================

export const activityLogsRepository = {
  async getByUserId(userId: string, limit = 50): Promise<ActivityLog[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },

  async create(log: Omit<ActivityLog, 'id' | 'created_at'>): Promise<ActivityLog> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('activity_logs')
      .insert(log)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getAll(limit = 100): Promise<ActivityLog[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  },
};

// ============================================================
// EXPERIENCE DOCUMENTS
// ============================================================

export const experienceDocumentsRepository = {
  async getByUserId(userId: string): Promise<ExperienceDocument[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getByExperienceRequestId(requestId: string): Promise<ExperienceDocument[]> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_documents')
      .select('*')
      .eq('experience_request_id', requestId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(doc: Omit<ExperienceDocument, 'id' | 'created_at'>): Promise<ExperienceDocument> {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('experience_documents')
      .insert(doc)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const client = getSupabaseClient();
    const { error } = await client
      .from('experience_documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};
