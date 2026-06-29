import Link from "next/link";

import { AuthForm } from "../_components/auth-form";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/35">
          Codora
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Pick up where you left off
        </h2>
        <p className="text-sm leading-6 text-white/45">
          Jump back into problems, attempts, and progress tracking.
        </p>
      </div>

      <AuthForm mode="sign-in" />

      <p className="text-sm text-white/45">
        No account yet?{" "}
        <Link className="text-white transition hover:text-white/70" href="/sign-up">
          Create one
        </Link>
      </p>
    </div>
  );
}
