"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.05]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1120px] items-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.05]" />

      <div className="relative flex min-h-screen w-full items-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid w-full gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
          <section className="flex min-h-[220px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/35">
                  Codora
                </p>
                <p className="text-sm text-white/60">Session-gated workspace</p>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] uppercase tracking-[0.32em] text-white/45">
                <ShieldCheck size={12} />
                Codora workspace
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Solve problems, track attempts, and measure progress.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/45">
                Codora is a programming problem-solving app. Open a problem,
                write code in the editor, submit it against tests, and review
                your attempt history over time.
              </p>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-white/45 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                `/home` is the workspace entry point.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                The reviewer area stays read-only.
              </div>
            </div>
          </section>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0a0a0a]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/onboarding")) {
    return <OnboardingShell>{children}</OnboardingShell>;
  }

  return <AuthShell>{children}</AuthShell>;
}
