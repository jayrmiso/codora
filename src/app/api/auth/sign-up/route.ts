import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookies, setAuthCookies } from "@/infrastructure/supabase/cookies";
import {
  signUpWithSupabase,
  toSessionPayload,
} from "@/infrastructure/supabase/auth";
import { SUPABASE_CONFIG_ERROR } from "@/infrastructure/supabase/config";
import {
  getTestAuthSession,
  isTestAuthCredentials,
  setTestAuthOnboardingComplete,
} from "@/infrastructure/supabase/test-auth";
import { readJsonBody, normalizeEmail, normalizeName, isStrongPassword } from "../_lib";

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  const email = normalizeEmail(body.email);
  const password = typeof body.password === "string" ? body.password.trim() : "";
  const name = normalizeName(body.name);

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
        message: "Signed up successfully.",
      },
      { status: 201 },
    );

    setAuthCookies(response, session);
    setTestAuthOnboardingComplete(response, false);
    return response;
  }

  const result = await signUpWithSupabase({ email, password, name });

  if (!result.ok) {
    const status = result.error === SUPABASE_CONFIG_ERROR ? 500 : 400;
    return NextResponse.json(
      { ok: false, error: result.error, details: result.details },
      { status },
    );
  }

  const session = "access_token" in result.data ? result.data : null;
  const response = NextResponse.json(
    {
      ok: true,
      data: session ? toSessionPayload(session) : null,
      message: session
        ? "Signed up successfully."
        : "Check your email to confirm your account.",
    },
    { status: 201 },
  );

  if (session) {
    setAuthCookies(response, session);
  } else {
    clearAuthCookies(response);
  }

  return response;
}
