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
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/35">
          Codora
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Finish your setup
        </h2>
        <p className="text-sm leading-6 text-white/45">
          Choose Python, then pick the tags you want to focus on.
        </p>
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
