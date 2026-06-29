export const SUPABASE_URL = process.env.SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY?.trim() ?? "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

export const AUTH_COOKIE_NAMES = {
  accessToken: "codora-access-token",
  refreshToken: "codora-refresh-token",
} as const;

export const SUPABASE_CONFIG_ERROR =
  "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.";

export function assertSupabaseConfig() {
  if (!SUPABASE_URL) {
    throw new Error("Missing SUPABASE_URL environment variable.");
  }

  if (!SUPABASE_ANON_KEY) {
    throw new Error("Missing SUPABASE_ANON_KEY environment variable.");
  }
}
