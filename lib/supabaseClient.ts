import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get user on server-side (e.g. in API routes or server components)
// For admin-level operations, you might create a separate service role client.
export const createSupabaseServerClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or Service Role Key for server client in .env.local');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}