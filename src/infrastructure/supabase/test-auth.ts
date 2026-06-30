import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

import type { LearningTagRow, ProgrammingLanguageRow } from "./auth";
import type { SupabaseSession } from "./types";

export const TEST_AUTH_EMAIL =
  "arjayramiso@gmail.com";

export const TEST_AUTH_PASSWORDS = ["Arjay123!", "Jayrmiso123!"] as const;

export const TEST_AUTH_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.AUTH_TEST_BYPASS !== "false" &&
  Boolean(process.env.AUTH_TEST_BYPASS_SECRET?.trim());

const TEST_AUTH_SECRET = process.env.AUTH_TEST_BYPASS_SECRET?.trim() ?? "";

export const TEST_AUTH_ACCESS_TOKEN = "codora-test-access-token";
export const TEST_AUTH_REFRESH_TOKEN = "codora-test-refresh-token";
export const TEST_AUTH_ONBOARDING_COOKIE = "codora-test-onboarding-complete";
export const TEST_AUTH_PROFILE_ID = "ai-admin";

export const TEST_AUTH_LEARNING_TAGS: LearningTagRow[] = [
  {
    id: "tag-variables",
    slug: "variables",
    name: "Variables",
    description: "Track state and reuse values cleanly.",
    sort_order: 1,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-conditionals",
    slug: "conditionals",
    name: "Conditionals",
    description: "Choose branches and make decisions.",
    sort_order: 2,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-loops",
    slug: "loops",
    name: "Loops",
    description: "Repeat work with controlled iteration.",
    sort_order: 3,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-functions",
    slug: "functions",
    name: "Functions",
    description: "Break logic into reusable building blocks.",
    sort_order: 4,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-arrays",
    slug: "arrays",
    name: "Arrays",
    description: "Store ordered collections and iterate over them.",
    sort_order: 5,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-strings",
    slug: "strings",
    name: "Strings",
    description: "Manipulate text, formatting, and parsing.",
    sort_order: 6,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-hash-maps",
    slug: "hash-maps",
    name: "Hash Maps",
    description: "Map keys to values for fast lookups.",
    sort_order: 7,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-sets",
    slug: "sets",
    name: "Sets",
    description: "Manage unique values and membership checks.",
    sort_order: 8,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "tag-sorting",
    slug: "sorting",
    name: "Sorting",
    description: "Order collections with comparison logic.",
    sort_order: 9,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
];

export const TEST_AUTH_PROGRAMMING_LANGUAGES: ProgrammingLanguageRow[] = [
  {
    id: "language-python",
    slug: "python",
    name: "Python",
    description: "A general-purpose language that stays readable under pressure.",
    sort_order: 1,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "language-typescript",
    slug: "typescript",
    name: "TypeScript",
    description: "Typed JavaScript for larger codebases and stronger tooling.",
    sort_order: 2,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "language-go",
    slug: "go",
    name: "Go",
    description: "A simple compiled language well suited to services and tooling.",
    sort_order: 3,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
  {
    id: "language-ruby",
    slug: "ruby",
    name: "Ruby",
    description: "A productive dynamic language with a strong developer ecosystem.",
    sort_order: 4,
    created_at: "1970-01-01T00:00:00.000Z",
    updated_at: "1970-01-01T00:00:00.000Z",
  },
];

type CookieReader = Pick<NextRequest["cookies"], "get">;

type TestAuthTokenPayload = {
  profileId: string;
  email: string;
  role: "admin";
  issuedAt: number;
};

function baseCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(typeof maxAge === "number" ? { maxAge } : {}),
  };
}

function encodeTestAuthToken(payload: TestAuthTokenPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", TEST_AUTH_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function decodeTestAuthToken(token: string) {
  if (!TEST_AUTH_ENABLED) {
    return null;
  }

  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", TEST_AUTH_SECRET).update(body).digest("base64url");

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<TestAuthTokenPayload>;

    if (
      payload &&
      payload.profileId === TEST_AUTH_PROFILE_ID &&
      payload.email === TEST_AUTH_EMAIL &&
      payload.role === "admin"
    ) {
      return payload as TestAuthTokenPayload;
    }
  } catch {
    return null;
  }

  return null;
}

export function isTestAuthCredentials(email: string, password: string) {
  return (
    TEST_AUTH_ENABLED &&
    email.trim().toLowerCase() === TEST_AUTH_EMAIL &&
    TEST_AUTH_PASSWORDS.includes(password)
  );
}

export function isTestAuthToken(accessToken: string, refreshToken: string) {
  return (
    TEST_AUTH_ENABLED &&
    accessToken === refreshToken &&
    Boolean(decodeTestAuthToken(accessToken))
  );
}

export function getTestAuthSession(): SupabaseSession {
  const token = encodeTestAuthToken({
    profileId: TEST_AUTH_PROFILE_ID,
    email: TEST_AUTH_EMAIL,
    role: "admin",
    issuedAt: Math.floor(Date.now() / 1000),
  });

  return {
    access_token: token,
    refresh_token: token,
    expires_in: 60 * 60 * 24 * 30,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    token_type: "bearer",
    user: {
      id: TEST_AUTH_PROFILE_ID,
      email: TEST_AUTH_EMAIL,
      role: "admin",
      aud: "authenticated",
      user_metadata: {
        full_name: "AI Admin",
      },
      app_metadata: {
        provider: "test-auth",
      },
    },
  };
}

export function getTestAuthOnboardingComplete(cookies: CookieReader) {
  return cookies.get(TEST_AUTH_ONBOARDING_COOKIE)?.value === "true";
}

export function setTestAuthOnboardingComplete(
  response: NextResponse,
  completed: boolean,
) {
  response.cookies.set(
    TEST_AUTH_ONBOARDING_COOKIE,
    completed ? "true" : "false",
    baseCookieOptions(60 * 60 * 24 * 30),
  );
}
