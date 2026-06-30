import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookies } from "@/infrastructure/supabase/cookies";
import { signOutWithSupabase } from "@/infrastructure/supabase/auth";
import { AUTH_COOKIE_NAMES, SUPABASE_CONFIG_ERROR } from "@/infrastructure/supabase/config";
import { isTestAuthToken } from "@/infrastructure/supabase/test-auth";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? "";
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value ?? "";

  if (isTestAuthToken(accessToken, refreshToken)) {
    const response = NextResponse.json(
      {
        ok: true,
        data: null,
        message: "Signed out successfully.",
      },
      { status: 200 },
    );

    clearAuthCookies(response);
    return response;
  }

  if (accessToken) {
    const result = await signOutWithSupabase(accessToken);
    if (!result.ok && result.error === SUPABASE_CONFIG_ERROR) {
      const response = NextResponse.json(
        {
          ok: false,
          error: result.error,
        },
        { status: 500 },
      );

      clearAuthCookies(response);
      return response;
    }
  }

  const response = NextResponse.json(
    {
      ok: true,
      data: null,
      message: "Signed out successfully.",
    },
    { status: 200 },
  );

  clearAuthCookies(response);
  return response;
}
