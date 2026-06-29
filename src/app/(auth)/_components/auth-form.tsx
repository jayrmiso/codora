"use client";

import { ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

type AuthMode = "sign-in" | "sign-up";

type Props = {
  mode: AuthMode;
};

const endpointByMode: Record<AuthMode, string> = {
  "sign-in": "/api/auth/sign-in",
  "sign-up": "/api/auth/sign-up",
};

const buttonLabelByMode: Record<AuthMode, string> = {
  "sign-in": "Sign in",
  "sign-up": "Create account",
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : "";

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token") ?? "";
    const refreshToken = params.get("refresh_token") ?? "";
    const expiresIn = Number(params.get("expires_in") ?? "0");
    const tokenType = params.get("token_type") ?? "bearer";

    if (!accessToken || !refreshToken) {
      return;
    }

    let cancelled = false;

    async function completeOauthSession() {
      setPending(true);
      setError(null);
      setNotice("Completing GitHub sign in...");

      try {
        const response = await fetch("/api/auth/complete-oauth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
            token_type: tokenType,
          }),
        });

        const result = (await response.json().catch(() => null)) as
          | { ok: true }
          | { ok: false; error?: string }
          | null;

        if (cancelled) {
          return;
        }

        if (!response.ok || !result || !result.ok) {
          setError(
            result && !result.ok ? result.error ?? "GitHub sign in failed." : "GitHub sign in failed.",
          );
          setNotice(null);
          setPending(false);
          return;
        }

        const sessionResponse = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const sessionResult = (await sessionResponse.json().catch(() => null)) as
          | {
              ok: true;
              data?: { authenticated?: boolean; onboardingComplete?: boolean };
            }
          | { ok: false; error?: string }
          | null;

        const onboardingComplete =
          sessionResponse.ok &&
          sessionResult &&
          "ok" in sessionResult &&
          sessionResult.ok &&
          sessionResult.data?.authenticated &&
          sessionResult.data.onboardingComplete;

        window.location.replace(onboardingComplete ? "/home" : "/onboarding");
      } catch {
        if (!cancelled) {
          setError("GitHub sign in failed.");
          setNotice(null);
          setPending(false);
        }
      }
    }

    void completeOauthSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setPending(true);
    setError(null);
    setNotice(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload =
      mode === "sign-in"
        ? {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          }
        : {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
          };

    try {
      const response = await fetch(endpointByMode[mode], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok: true; message?: string; data?: unknown }
        | { ok: false; error?: string }
        | null;

      if (!response.ok || !result || !result.ok) {
        setError(result && !result.ok ? result.error ?? "Unable to continue." : "Unable to continue.");
        setPending(false);
        return;
      }

      if (mode === "sign-up" && !result.data) {
        setNotice(result.message ?? "Check your email to confirm your account.");
        form.reset();
        setPending(false);
        return;
      }

      const sessionResponse = await fetch("/api/auth/session", {
        cache: "no-store",
      });
      const sessionResult = (await sessionResponse.json().catch(() => null)) as
        | {
            ok: true;
            data?: { authenticated?: boolean; onboardingComplete?: boolean };
          }
        | { ok: false; error?: string }
        | null;

      const onboardingComplete =
        sessionResponse.ok &&
        sessionResult &&
        "ok" in sessionResult &&
        sessionResult.ok &&
        sessionResult.data?.authenticated &&
        sessionResult.data.onboardingComplete;

      router.replace(onboardingComplete ? "/home" : "/onboarding");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-5">
      <a
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
        href="/api/auth/github?next=/home"
      >
        <span className="text-base">GH</span>
        Continue with GitHub
      </a>

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/25">
        <div className="h-px flex-1 bg-white/10" />
        or
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {mode === "sign-up" ? (
            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-white/35">
                <UserRound size={12} />
                Full name
              </span>
              <input
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.06]"
                disabled={pending}
                name="name"
                placeholder="Ari Stone"
                type="text"
                autoComplete="name"
                required
              />
            </label>
          ) : null}

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-white/35">
              <Mail size={12} />
              Email
            </span>
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.06]"
              disabled={pending}
              name="email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-white/35">
              <LockKeyhole size={12} />
              Password
            </span>
            <input
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/30 focus:bg-white/[0.06]"
              disabled={pending}
              name="password"
              placeholder="••••••••"
              type="password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
          </label>
        </div>

        {error ? (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

        {notice ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
          {notice}
        </p>
      ) : null}

        <button
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              Working
            </>
          ) : (
            <>
              {buttonLabelByMode[mode]}
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
