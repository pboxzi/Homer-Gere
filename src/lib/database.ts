import { supabase } from './supabase';

// Database table types (to be used with Supabase)
export interface DBMember {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  membership_tier: string | null;
  membership_status: 'active' | 'expired' | 'pending' | 'none';
  created_at: string;
  updated_at: string;
}

export interface DBMembership {
  id: string;
  member_id: string;
  plan: string;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  start_date: string;
  end_date: string;
  renewal_date?: string;
  payment_id?: string;
}

export interface DBExperienceRequest {
  id: string;
  member_id: string;
  experience_type: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  organization?: string;
  event_date?: string;
  event_location?: string;
  budget?: string;
  purpose?: string;
  additional_details?: string;
  status: 'pending' | 'under_review' | 'approved' | 'declined' | 'completed';
  created_at: string;
  updated_at: string;
}

// Database helpers
export const db = {
  members: {
    async get(userId: string) {
      const { data, error } = await supabase.from('members').select('*').eq('user_id', userId).single();
      if (error) throw error;
      return data as DBMember;
    },
    async update(userId: string, updates: Partial<DBMember>) {
      const { data, error } = await supabase.from('members').update(updates).eq('user_id', userId).select().single();
      if (error) throw error;
      return data;
    },
  },

  memberships: {
    async getByMember(memberId: string) {
      const { data, error } = await supabase.from('memberships').select('*').eq('member_id', memberId).order('created_at', { ascending: false }).limit(1).single();
      if (error) throw error;
      return data as DBMembership;
    },
    async create(membership: Omit<DBMembership, 'id'>) {
      const { data, error } = await supabase.from('memberships').insert(membership).select().single();
      if (error) throw error;
      return data;
    },
  },

  experienceRequests: {
    async create(request: Omit<DBExperienceRequest, 'id' | 'created_at' | 'updated_at'>) {
      const { data, error } = await supabase.from('experience_requests').insert(request).select().single();
      if (error) throw error;
      return data;
    },
    async getByMember(memberId: string) {
      const { data, error } = await supabase.from('experience_requests').select('*').eq('member_id', memberId).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  },
};
