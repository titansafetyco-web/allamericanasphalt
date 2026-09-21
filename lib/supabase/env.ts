const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const supabaseUrl = url;
export const supabaseAnonKey = key;

export function isSupabaseConfigured() {
  return Boolean(url && key);
}
