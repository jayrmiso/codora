import { ArrowUpRight, BadgeCheck, Clock3, Sparkles } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "../_components/sign-out-button";

type SessionResponse =
  | {
      ok: true;
      data: {
        authenticated: boolean;
        user: {
          id: string;
          email?: string | null;
        } | null;
        profile: {
          full_name: string | null;
          avatar_url: string | null;
        } | null;
      };
    }
  | {
      ok: false;
      error: string;
    };

async function loadSession() {
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

export default async function HomePage() {
  const session = await loadSession();
  if (!session || !session.authenticated) {
    redirect("/sign-in");
  }

  const displayName =
    session.profile?.full_name ?? session.user?.email ?? "Authenticated user";
  const email = session.user?.email ?? "Session active";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.04]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:px-8">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                Codora
              </p>
              <p className="text-sm text-white/60">Home workspace</p>
            </div>
          </div>

          <SignOutButton />
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.32em] text-white/45">
              <BadgeCheck size={12} />
              Session active
            </p>

            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/45">
              This is your default home page. Authenticated users land here at
              `/home`, while `/` just redirects through to this route.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  Status
                </p>
                <p className="mt-3 text-lg font-medium text-white">Authenticated</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  Email
                </p>
                <p className="mt-3 break-words text-sm text-white/70">{email}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  Route
                </p>
                <p className="mt-3 text-lg font-medium text-white">/home</p>
              </div>
            </div>
          </section>

          <aside className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                Session
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Cookie-backed auth
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/45">
                The session API still powers the request-time state check, but it
                now receives the browser cookies so login no longer loops.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/30">
                  <Clock3 size={12} />
                  Last check
                </p>
                <p className="mt-3 text-sm text-white/70">Request-time auth gate</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                  Identity
                </p>
                <p className="mt-3 text-sm text-white/70">
                  {session.profile?.full_name ?? session.user?.email ?? "Unknown"}
                </p>
              </div>
            </div>

            <div className="mt-auto rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-white/50">
                Need to inspect a route that does not exist yet?
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-white/70"
                href="/sign-in"
              >
                Open sign in
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
