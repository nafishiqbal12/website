import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidSupabaseUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname);
  } catch {
    return false;
  }
}

const isValidConfiguration = isValidSupabaseUrl(supabaseUrl) && Boolean(supabaseAnonKey?.trim());

export const supabaseConfiguration = {
  url: supabaseUrl ?? '',
  anonKey: supabaseAnonKey ?? '',
  isConfigured: isValidConfiguration,
};

let configuredClient: SupabaseClient | null = null;

if (supabaseConfiguration.isConfigured) {
  try {
    configuredClient = createBrowserClient(supabaseConfiguration.url, supabaseConfiguration.anonKey, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch {
    configuredClient = null;
  }
}

export const supabase: SupabaseClient | null = configuredClient;
