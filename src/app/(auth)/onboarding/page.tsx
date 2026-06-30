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
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-7">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-white/35">
            Codora
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Finish your setup
            </h1>
            <p className="max-w-xl text-sm leading-6 text-white/55 sm:text-[15px]">
              Pick your languages, set confidence, and choose a few focus
              areas for your first milestone.
            </p>
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
