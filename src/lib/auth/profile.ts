import { supabase } from '../supabase/client';

export type UserProfile = {
  id: string;
  displayName: string | null;
  avatarPath: string | null;
  timezone: string | null;
  locale: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_path: string | null;
  timezone: string | null;
  locale: string | null;
  created_at: string;
  updated_at: string;
};

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    displayName: row.display_name,
    avatarPath: row.avatar_path,
    timezone: row.timezone,
    locale: row.locale,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCurrentProfile(userId: string): Promise<{ profile: UserProfile | null; error: Error | null }> {
  if (!supabase) return { profile: null, error: new Error('Authentication is not configured in this environment.') };

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return { profile: data ? mapProfile(data as ProfileRow) : null, error };
}

export async function updateCurrentProfile(
  userId: string,
  input: Pick<UserProfile, 'displayName' | 'timezone' | 'locale'>,
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  if (!supabase) return { profile: null, error: new Error('Authentication is not configured in this environment.') };

  const { data, error } = await supabase
    .from('profiles')
    .update({
      display_name: input.displayName,
      timezone: input.timezone,
      locale: input.locale,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single();

  return { profile: data ? mapProfile(data as ProfileRow) : null, error };
}
