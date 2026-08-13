import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member';
  membershipTier: string | null;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const STORAGE_KEY = 'homer_auth';

const ADMIN_USER: User = {
  id: 'admin-1',
  email: 'admin@homergere.com',
  firstName: 'Super',
  lastName: 'Admin',
  role: 'admin',
  membershipTier: 'Platinum',
  emailVerified: true,
  createdAt: '2024-01-01',
};

function loadUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.email) {
        return parsed as User;
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

function saveUserToStorage(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadUserFromStorage();
    setUser(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  const signIn = useCallback(async (email: string, _password: string): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));

      let authenticatedUser: User;

      if (email === ADMIN_USER.email) {
        authenticatedUser = { ...ADMIN_USER };
      } else {
        authenticatedUser = {
          id: generateId(),
          email,
          firstName: email.split('@')[0],
          lastName: '',
          role: 'member',
          membershipTier: null,
          emailVerified: false,
          createdAt: new Date().toISOString().slice(0, 10),
        };
      }

      setUser(authenticatedUser);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<{ error?: string }> => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));

      const newUser: User = {
        id: generateId(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'member',
        membershipTier: null,
        emailVerified: false,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setUser(newUser);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = user !== null;

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
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
