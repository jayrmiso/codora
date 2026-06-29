import { NextRequest, NextResponse } from "next/server";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/infrastructure/supabase/config";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/")) {
    return "/home";
  }

  return value;
}

export async function GET(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const callbackUrl = new URL("/api/auth/callback", request.url);
  callbackUrl.searchParams.set("next", next);

  const authorizeUrl = new URL("/auth/v1/authorize", SUPABASE_URL);
  authorizeUrl.searchParams.set("provider", "github");
  authorizeUrl.searchParams.set("redirect_to", callbackUrl.toString());

  return NextResponse.redirect(authorizeUrl);
}
