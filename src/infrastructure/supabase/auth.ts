import {
  SUPABASE_ANON_KEY,
  SUPABASE_CONFIG_ERROR,
  SUPABASE_URL,
} from "./config";
import type {
  AuthResponse,
  ProfileRow,
  SupabaseAuthUser,
  SupabaseSession,
} from "./types";

export type LearningTagRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type CookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge?: number;
};

function supabaseUrl(path: string) {
  return new URL(path, SUPABASE_URL).toString();
}

function cookieOptions(maxAge?: number): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

function parseJson<T>(value: unknown): T | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as T;
}

function profileFromUnknown(value: unknown): ProfileRow | null {
  const profile = parseJson<ProfileRow>(value);

  if (
    !profile ||
    typeof profile.id !== "string" ||
    typeof profile.created_at !== "string" ||
    typeof profile.updated_at !== "string"
  ) {
    return null;
  }

  return profile;
}

function learningTagFromUnknown(value: unknown): LearningTagRow | null {
  const tag = parseJson<LearningTagRow>(value);

  if (
    !tag ||
    typeof tag.id !== "string" ||
    typeof tag.slug !== "string" ||
    typeof tag.name !== "string" ||
    typeof tag.created_at !== "string" ||
    typeof tag.updated_at !== "string"
  ) {
    return null;
  }

  return tag;
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<AuthResponse<T>> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      ok: false,
      error: SUPABASE_CONFIG_ERROR,
    };
  }

  const headers = new Headers(init.headers);

  headers.set("apikey", SUPABASE_ANON_KEY);
  headers.set("Content-Type", "application/json");

  if (init.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(supabaseUrl(path), {
    ...init,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "msg" in payload
        ? String((payload as { msg?: unknown }).msg ?? "Supabase request failed.")
        : "Supabase request failed.";

    return {
      ok: false,
      error: message,
      details: payload,
    };
  }

  return {
    ok: true,
    data: payload as T,
  };
}

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function signUpWithSupabase(input: {
  email: string;
  password: string;
  name?: string;
  proficiencyLevel?: string;
}) {
  return supabaseRequest<SupabaseSession | { user: SupabaseAuthUser }>(
    "/auth/v1/signup",
    {
      method: "POST",
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        options: {
          data: {
            ...(input.name ? { full_name: input.name } : {}),
            ...(input.proficiencyLevel
              ? { proficiency_level: input.proficiencyLevel }
              : {}),
          },
        },
      }),
    },
  );
}

export async function signInWithSupabase(input: {
  email: string;
  password: string;
}) {
  return supabaseRequest<SupabaseSession>("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });
}

export async function refreshSupabaseSession(refreshToken: string) {
  return supabaseRequest<SupabaseSession>("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });
}

export async function loadSupabaseUser(accessToken: string) {
  return supabaseRequest<SupabaseAuthUser>("/auth/v1/user", {
    method: "GET",
    token: accessToken,
  });
}

export async function loadSupabaseProfile(accessToken: string, userId: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      ok: false as const,
      error: SUPABASE_CONFIG_ERROR,
    };
  }

  const response = await fetch(
    `${supabaseUrl("/rest/v1/profiles")}?id=eq.${encodeURIComponent(userId)}&select=*`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      error: "Failed to load user profile.",
    };
  }

  const rows = (await response.json().catch(() => [])) as unknown;
  const profile = Array.isArray(rows) ? profileFromUnknown(rows[0]) : null;

  return {
    ok: true as const,
    data: profile,
  };
}

export async function loadSupabaseLearningTags() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      ok: false as const,
      error: SUPABASE_CONFIG_ERROR,
    };
  }

  const response = await fetch(
    `${supabaseUrl("/rest/v1/learning_tags")}?select=*&order=sort_order.asc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      error: "Failed to load learning tags.",
    };
  }

  const rows = (await response.json().catch(() => [])) as unknown;
  const tags = Array.isArray(rows)
    ? rows.map(learningTagFromUnknown).filter((tag): tag is LearningTagRow => Boolean(tag))
    : [];

  return {
    ok: true as const,
    data: tags,
  };
}

export async function loadSupabaseProfileLearningTagIds(
  accessToken: string,
  userId: string,
) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      ok: false as const,
      error: SUPABASE_CONFIG_ERROR,
    };
  }

  const response = await fetch(
    `${supabaseUrl("/rest/v1/profile_learning_tags")}?profile_id=eq.${encodeURIComponent(userId)}&select=learning_tag_id`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      error: "Failed to load onboarding selections.",
    };
  }

  const rows = (await response.json().catch(() => [])) as unknown;
  const learningTagIds = Array.isArray(rows)
    ? rows
        .map((row) => {
          if (!row || typeof row !== "object" || !("learning_tag_id" in row)) {
            return null;
          }

          const value = (row as { learning_tag_id?: unknown }).learning_tag_id;
          return typeof value === "string" ? value : null;
        })
        .filter((tagId): tagId is string => Boolean(tagId))
    : [];

  return {
    ok: true as const,
    data: learningTagIds,
  };
}

export function isOnboardingComplete(
  profile: ProfileRow | null,
  learningTagIds: string[],
) {
  return Boolean(profile?.proficiency_level && learningTagIds.length > 0);
}

export async function updateSupabaseOnboarding(input: {
  accessToken: string;
  userId: string;
  proficiencyLevel: string;
  learningTagIds: string[];
}) {
  const profileUpdate = await supabaseRequest<null>(
    `/rest/v1/profiles?id=eq.${encodeURIComponent(input.userId)}`,
    {
      method: "PATCH",
      token: input.accessToken,
      body: JSON.stringify({
        proficiency_level: input.proficiencyLevel,
      }),
    },
  );

  if (!profileUpdate.ok) {
    return profileUpdate;
  }

  const deleteSelections = await supabaseRequest<null>(
    `/rest/v1/profile_learning_tags?profile_id=eq.${encodeURIComponent(input.userId)}`,
    {
      method: "DELETE",
      token: input.accessToken,
    },
  );

  if (!deleteSelections.ok) {
    return deleteSelections;
  }

  if (input.learningTagIds.length === 0) {
    return {
      ok: true as const,
      data: null,
    };
  }

  const insertSelections = await supabaseRequest<null>("/rest/v1/profile_learning_tags", {
    method: "POST",
    token: input.accessToken,
    body: JSON.stringify(
      input.learningTagIds.map((learningTagId) => ({
        profile_id: input.userId,
        learning_tag_id: learningTagId,
      })),
    ),
  });

  return insertSelections;
}

export async function signOutWithSupabase(accessToken: string) {
  return supabaseRequest<null>("/auth/v1/logout", {
    method: "POST",
    token: accessToken,
    body: JSON.stringify({
      scope: "global",
    }),
  });
}

export function sessionCookieOptions(expiresInSeconds: number) {
  return cookieOptions(expiresInSeconds);
}

export function blankSessionCookiesOptions() {
  return cookieOptions(0);
}

export function toSessionPayload(session: SupabaseSession) {
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    token_type: session.token_type,
    user: session.user,
  };
}
