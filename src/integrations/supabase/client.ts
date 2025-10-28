import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export let supabase: any;

if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: localStorage, persistSession: true, autoRefreshToken: true },
  });
} else {
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null }),
      signUp: async () => ({ error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      resetPasswordForEmail: async () => ({ error: new Error('Supabase not configured') }),
    },
    from: (_table: string) => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: [], error: new Error('Supabase not configured') }),
      update: async () => ({ data: [], error: new Error('Supabase not configured') }),
      delete: async () => ({ data: [], error: new Error('Supabase not configured') }),
      order: () => ({ select: async () => ({ data: [], error: null }), eq: () => ({ select: async () => ({ data: [], error: null }) }) }),
      eq: () => ({ select: async () => ({ data: [], error: null }) }),
    }),
  };
}