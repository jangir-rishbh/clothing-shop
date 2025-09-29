
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type CustomUser = { id: string; email: string; name?: string; mobile?: string | null; gender?: string | null; state?: string | null; role?: 'admin' | 'user'; two_factor_enabled?: boolean } | null;

type AuthContextType = {
  session: CustomUser;
  loading: boolean;
  supabase: typeof supabase;
  signUp: (email: string, password: string, name: string) => Promise<{
    error: any;
    data: any;
  }>;
  signIn: (email: string, password: string, otp?: string, captchaText?: string, captchaToken?: string) => Promise<{
    error: any;
    data: any;
  }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CustomUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const resp = await fetch('/api/me', { cache: 'no-store' });
        const data = await resp.json();
        setSession(data.user);
        try {
          if (data.user) localStorage.setItem('custom_user', JSON.stringify(data.user));
          else localStorage.removeItem('custom_user');
        } catch {}
      } catch {
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem('custom_user');
          if (raw) setSession(JSON.parse(raw));
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    // Optional: Keep for compatibility or refactor to custom signup later
    return { data: null, error: null };
  };

  const signIn = async (email: string, password: string, otp?: string, captchaText?: string, captchaToken?: string) => {
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp, captcha: captchaText, captchaToken })
      });
      const result = await resp.json();
      if (!resp.ok) {
        return { data: null, error: result.error || 'Invalid credentials' };
      }
      // If server indicates OTP step is required, do not set session yet
      if (result.requiresOtp) {
        return { data: result, error: null };
      }
      try { localStorage.setItem('custom_user', JSON.stringify(result.user)); } catch {}
      setSession(result.user);
      return { data: result, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      try { localStorage.removeItem('custom_user'); } catch {}
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const resp = await fetch('/api/me', { cache: 'no-store' });
      const data = await resp.json();
      setSession(data.user);
      try {
        if (data.user) localStorage.setItem('custom_user', JSON.stringify(data.user));
        else localStorage.removeItem('custom_user');
      } catch {}
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const value = {
    session,
    loading,
    supabase,
    signUp,
    signIn,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
