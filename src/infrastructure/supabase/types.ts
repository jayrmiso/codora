export type SupabaseAuthUser = {
  id: string;
  aud?: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  created_at?: string;
  confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  updated_at?: string | null;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type?: string;
  user: SupabaseAuthUser;
};

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  proficiency_level: string | null;
  language_proficiency_levels: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type AuthResponse<T> =
  | {
      ok: true;
      data: T;
      message?: string;
    }
  | {
      ok: false;
      error: string;
      details?: unknown;
    };
