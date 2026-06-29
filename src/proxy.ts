import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = new Set(["/sign-in", "/sign-up"]);
const PROTECTED_PATHS = new Set(["/", "/home"]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessToken = request.cookies.get("codora-access-token")?.value;
  const refreshToken = request.cookies.get("codora-refresh-token")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (PROTECTED_PATHS.has(path) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (AUTH_PATHS.has(path) && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
