import type { ReactNode } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.05]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
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
                Auth routes
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Clean auth surfaces with a dark command-line feel.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/45">
                Sign in, sign up, and protected routes share one visual system.
                The layout follows the sample theme&apos;s sharp contrast, muted
                chrome, and compact hierarchy.
              </p>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-white/45 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                `/` is protected by Proxy.
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                404s stay separate and readable.
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
