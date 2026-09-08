import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfiguration } from '../supabase/client';
import { AuthContext, type AuthContextValue } from './AuthContext';

function missingConfigurationError() {
  return new Error('Authentication is not configured in this environment.');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setIsLoading(false);
      return undefined;
    }

    let mounted = true;
    const initialize = async () => {
      const { data } = await client.auth.getSession();
      if (mounted) {
        setSession(data.session);
        setIsLoading(false);
      }
    };

    void initialize();
    const { data: subscription } = client.auth.onAuthStateChange((event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setRecoveryMode(event === 'PASSWORD_RECOVERY');
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    session,
    isLoading,
    isConfigured: supabaseConfiguration.isConfigured,
    recoveryMode,
    signIn: async (email, password) => {
      if (!supabase) return { error: missingConfigurationError() };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    },
    signUp: async (email, password) => {
      if (!supabase) return { error: missingConfigurationError() };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/profile` },
      });
      return { error };
    },
    signOut: async () => {
      if (!supabase) return { error: missingConfigurationError() };
      const { error } = await supabase.auth.signOut();
      return { error };
    },
    requestPasswordReset: async (email) => {
      if (!supabase) return { error: missingConfigurationError() };
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    },
    updatePassword: async (password) => {
      if (!supabase) return { error: missingConfigurationError() };
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    },
  }), [isLoading, recoveryMode, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
