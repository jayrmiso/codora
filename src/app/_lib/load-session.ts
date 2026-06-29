import { headers } from "next/headers";

export type SessionState =
  | {
      authenticated: true;
      user: {
        id: string;
        email?: string | null;
      };
      profile: {
        full_name: string | null;
        avatar_url: string | null;
        proficiency_level: string | null;
      } | null;
      learningTagIds: string[];
      onboardingComplete: boolean;
      session: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        expires_at?: number;
        token_type?: string;
        user: {
          id: string;
          email?: string | null;
        };
      };
    }
  | {
      authenticated: false;
      user: null;
      profile: null;
      learningTagIds: [];
      onboardingComplete: false;
      session: null;
    };

type SessionResponse =
  | {
      ok: true;
      data: SessionState;
    }
  | {
      ok: false;
      error: string;
    };

export async function loadSessionState(): Promise<SessionState | null> {
  const headerList = await headers();
  const host = headerList.get("host");
  const cookie = headerList.get("cookie") ?? "";

  if (!host) {
    return null;
  }

  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  try {
    const response = await fetch(`${protocol}://${host}/api/auth/session`, {
      cache: "no-store",
      headers: cookie ? { cookie } : undefined,
    });
    const payload = (await response.json().catch(() => null)) as SessionResponse | null;

    if (!response.ok || !payload || !payload.ok) {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  }
}
