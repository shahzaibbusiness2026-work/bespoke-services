import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const activeKey = supabaseAnonKey || supabaseServiceKey || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('http') &&
    typeof activeKey === 'string' &&
    activeKey.length > 10
  );
};

// Client-safe Supabase instance
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, activeKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key');

// Server-side Admin Supabase instance (Bypasses RLS)
export const getAdminClient = (): SupabaseClient => {
  if (isSupabaseConfigured() && supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabase;
};
