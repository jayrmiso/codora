import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { setAuthCookies, clearAuthCookies } from "@/infrastructure/supabase/cookies";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/infrastructure/supabase/config";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/")) {
    return "/home";
  }

  return value;
}

export async function GET(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    clearAuthCookies(response);
    return response;
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!code) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    clearAuthCookies(response);
    return response;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  setAuthCookies(response, data.session);
  return response;
}
