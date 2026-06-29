import { NextRequest, NextResponse } from "next/server";

import { loadSupabaseUser } from "@/infrastructure/supabase/auth";
import { setAuthCookies, clearAuthCookies } from "@/infrastructure/supabase/cookies";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | {
        access_token?: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
      }
    | null;

  const accessToken = body?.access_token?.trim() ?? "";
  const refreshToken = body?.refresh_token?.trim() ?? "";
  const expiresIn = Number(body?.expires_in ?? 0);
  const tokenType = body?.token_type?.trim() || "bearer";

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { ok: false, error: "Missing OAuth session tokens." },
      { status: 400 },
    );
  }

  const userResult = await loadSupabaseUser(accessToken);

  if (!userResult.ok) {
    const response = NextResponse.json(
      { ok: false, error: userResult.error },
      { status: 401 },
    );

    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json({
    ok: true,
    data: {
      user: userResult.data,
    },
  });

  setAuthCookies(response, {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn : 3600,
    token_type: tokenType,
    user: userResult.data,
  });

  return response;
}
