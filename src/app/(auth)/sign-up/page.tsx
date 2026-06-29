import Link from "next/link";

import { AuthForm } from "../_components/auth-form";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/35">
          Codora
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Start solving problems
        </h2>
        <p className="text-sm leading-6 text-white/45">
          Set up your profile, choose what you want to work on, and begin
          building a visible attempt history.
        </p>
      </div>

      <AuthForm mode="sign-up" />

      <p className="text-sm text-white/45">
        Already have an account?{" "}
        <Link className="text-white transition hover:text-white/70" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}
