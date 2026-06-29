import type { NextResponse } from "next/server";

import { AUTH_COOKIE_NAMES } from "./config";
import type { SupabaseSession } from "./types";

function baseCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(typeof maxAge === "number" ? { maxAge } : {}),
  };
}

export function setAuthCookies(
  response: NextResponse,
  session: SupabaseSession,
  maxAge = session.expires_in,
) {
  response.cookies.set(
    AUTH_COOKIE_NAMES.accessToken,
    session.access_token,
    baseCookieOptions(maxAge),
  );
  response.cookies.set(
    AUTH_COOKIE_NAMES.refreshToken,
    session.refresh_token,
    baseCookieOptions(60 * 60 * 24 * 30),
  );
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, "", baseCookieOptions(0));
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, "", baseCookieOptions(0));
}

