import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

type AuthResult = { error: Error | null };

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  recoveryMode: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
