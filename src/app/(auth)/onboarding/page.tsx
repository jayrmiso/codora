import { redirect } from "next/navigation";

import { loadSessionState } from "@/app/_lib/load-session";
import {
  loadSupabaseLearningTags,
  loadSupabaseProgrammingLanguages,
} from "@/infrastructure/supabase/auth";

import { OnboardingForm } from "./_components/onboarding-form";

export default async function OnboardingPage() {
  const session = await loadSessionState();

  if (!session || !session.authenticated) {
    redirect("/sign-in");
  }

  if (session.onboardingComplete) {
    redirect("/home");
  }

  const [tagsResult, languagesResult] = await Promise.all([
    loadSupabaseLearningTags(),
    loadSupabaseProgrammingLanguages(),
  ]);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-white/35">
              Codora
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Build your learning path in three steps
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/55 sm:text-[15px]">
                Set the languages you are working with, tell us how confident you
                feel, and choose the topics you want Codora to emphasize.
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-left text-sm text-white/70 sm:grid-cols-3 lg:min-w-[30rem]">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200/75">
                Step 1
              </p>
              <p className="mt-2 font-medium text-white">Pick your languages</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200/75">
                Step 2
              </p>
              <p className="mt-2 font-medium text-white">Set your confidence</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200/75">
                Step 3
              </p>
              <p className="mt-2 font-medium text-white">Choose focus tags</p>
            </div>
          </div>
        </div>
      </div>

      <OnboardingForm
        programmingLanguages={languagesResult.ok ? languagesResult.data : []}
        learningTags={tagsResult.ok ? tagsResult.data : []}
        selectedLanguagePreferences={session.languagePreferences}
        selectedLearningTagIds={session.learningTagIds}
        errorMessage={
          !languagesResult.ok
            ? languagesResult.error
            : !tagsResult.ok
              ? tagsResult.error
              : null
        }
      />
    </div>
  );
}
