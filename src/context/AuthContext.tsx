import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { profilesRepository, adminsRepository, registrationRepository } from '../lib/repositories';
import { emailService } from '../lib/email';
import type { Profile, Admin } from '../types/database';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member' | 'super_admin' | 'pending';
  membershipTier: string | null;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  admin: Admin | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const buildUser = useCallback(async (authUser: { id: string; email?: string; created_at: string; user_metadata?: Record<string, unknown> }) => {
    try {
      const userProfile = await profilesRepository.getById(authUser.id);
      if (!userProfile) return null;

      let adminRecord: Admin | null = null;
      try {
        adminRecord = await adminsRepository.getByUserId(authUser.id);
      } catch {
        // Not an admin — that's fine
      }

      const role: User['role'] = adminRecord
        ? (adminRecord.admin_role === 'super_admin' ? 'super_admin' : 'admin')
        : (userProfile.role as User['role']) || 'member';

      const u: User = {
        id: authUser.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role,
        membershipTier: userProfile.membership_tier,
        avatar: userProfile.avatar_url || undefined,
        emailVerified: userProfile.email_verified,
        createdAt: userProfile.created_at,
      };

      setProfile(userProfile);
      setAdmin(adminRecord);
      return u;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const u = await buildUser(session.user);
        if (mounted) {
          setUser(u);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const u = await buildUser(session.user);
        if (mounted) setUser(u);
      } else {
        setUser(null);
        setProfile(null);
        setAdmin(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [buildUser]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        const u = await buildUser(data.user);
        setUser(u);
        setLoading(false);
        if (!u) return { error: 'Account not found or pending approval. Please register and wait for admin approval.' };
        return {};
      }
      setLoading(false);
      return { error: 'Sign in failed. Please try again.' };
    } catch {
      setLoading(false);
      return { error: 'An unexpected error occurred.' };
    }
  }, [buildUser]);

  const signUp = useCallback(async (data: SignUpData): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      // Step 1: Create registration application (not auth user yet)
      const existing = await registrationRepository.getByEmail(data.email).catch(() => null);
      if (existing && existing.status === 'pending') {
        setLoading(false);
        return { error: 'A pending application already exists for this email. Please wait for admin review.' };
      }
      if (existing && existing.status === 'approved') {
        setLoading(false);
        return { error: 'An account already exists for this email. Please sign in instead.' };
      }

      // Step 2: Create the registration application
      await registrationRepository.create({
        user_id: null,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: null,
        country: null,
        date_of_birth: null,
        membership_tier: null,
        status: 'pending',
        reviewed_by: null,
        reviewed_at: null,
        rejection_reason: null,
        notes: null,
        application_number: null,
        membership_plan_requested: null,
        reason_for_joining: null,
        referral_source: null,
        device_type: null,
        browser: null,
        operating_system: null,
        preferred_language: 'en',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        ip_address: null,
        city_detected: null,
        country_detected: null,
        review_notes: null,
        status_history: [],
        assigned_admin: null,
        approved_at: null,
        rejected_at: null,
      });

      // Send registration received email
      emailService.registrationReceived(data.email, data.firstName).catch(() => {});

      setLoading(false);
      return {};
    } catch (err) {
      setLoading(false);
      return { error: err instanceof Error ? err.message : 'Registration failed. Please try again.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAdmin(null);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) return { error: error.message };
      return {};
    } catch {
      return { error: 'Failed to send reset email.' };
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const u = await buildUser({ id: user.id, email: user.email, created_at: user.createdAt });
    if (u) setUser(u);
  }, [user, buildUser]);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isAuthenticated = user !== null;

  const value: AuthContextType = {
    user,
    profile,
    admin,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile,
    isAdmin,
    isSuperAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
