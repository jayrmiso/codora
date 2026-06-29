import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ScanSearch } from "lucide-react";

export const metadata: Metadata = {
  title: "404 · Codora",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.04]" />

      <div className="relative flex min-h-screen w-full items-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-white/70">
            <ScanSearch size={20} />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-white/35">
            Not found
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            404 - page not found
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/45">
            The route does not exist in the app router. If you were trying to
            reach the protected workspace, sign in first and then return to `/`.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
              href="/sign-in"
            >
              Go to sign in
              <ArrowUpRight size={14} />
            </Link>
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                href="/home"
              >
                <ArrowLeft size={14} />
                Back to workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
