import { NextRequest, NextResponse } from "next/server";

import { setAuthCookies } from "@/infrastructure/supabase/cookies";
import {
  signInWithSupabase,
  toSessionPayload,
} from "@/infrastructure/supabase/auth";
import { SUPABASE_CONFIG_ERROR } from "@/infrastructure/supabase/config";
import {
  getTestAuthSession,
  isTestAuthCredentials,
  setTestAuthOnboardingComplete,
} from "@/infrastructure/supabase/test-auth";
import { normalizeEmail, readJsonBody, isStrongPassword } from "../_lib";

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password.trim() : "";

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required." },
      { status: 400 },
    );
  }

  if (!isStrongPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters long." },
      { status: 400 },
    );
  }

  if (isTestAuthCredentials(email, password)) {
    const session = getTestAuthSession();
    const response = NextResponse.json(
      {
        ok: true,
        data: toSessionPayload(session),
        message: "Signed in successfully.",
      },
      { status: 200 },
    );

    setAuthCookies(response, session);
    setTestAuthOnboardingComplete(response, false);
    return response;
  }

  const result = await signInWithSupabase({ email, password });

  if (!result.ok) {
    const status = result.error === SUPABASE_CONFIG_ERROR ? 500 : 401;
    return NextResponse.json(
      { ok: false, error: result.error, details: result.details },
      { status },
    );
  }

  const response = NextResponse.json(
    {
      ok: true,
      data: toSessionPayload(result.data),
      message: "Signed in successfully.",
    },
    { status: 200 },
  );

  setAuthCookies(response, result.data);
  return response;
}
