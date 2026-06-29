"use client";

import { LogOut, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    if (pending) {
      return;
    }

    setPending(true);

    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
      });
    } finally {
      router.replace("/sign-in");
      router.refresh();
      setPending(false);
    }
  }

  return (
    <button
      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:text-white/40"
      disabled={pending}
      onClick={handleSignOut}
      type="button"
    >
      {pending ? <LoaderCircle size={14} className="animate-spin" /> : <LogOut size={14} />}
      {pending ? "Signing out" : "Sign out"}
    </button>
  );
}
