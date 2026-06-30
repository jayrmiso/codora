"use client";

import { ArrowRight, ChevronDown, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { SearchableMultiSelect } from "@/components/searchable-multi-select";
import type {
  LearningTagRow,
  ProgrammingLanguageRow,
  SelectedLanguagePreference,
} from "@/infrastructure/supabase/auth";

import {
  buildOnboardingSubmission,
  isConfidenceStepReady,
} from "../_lib/onboarding-flow.mjs";
import { summarizeSelectionNames } from "../_lib/selection-summary.mjs";

const proficiencyLevels = [
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "advanced",
    label: "Advanced",
  },
] as const;

type Props = {
  programmingLanguages: ProgrammingLanguageRow[];
  learningTags: LearningTagRow[];
  selectedLanguagePreferences: SelectedLanguagePreference[];
  selectedLearningTagIds: string[];
  errorMessage: string | null;
};

function LanguageIcon({
  label,
  className = "",
  ariaHidden = false,
}: {
  label: string;
  className?: string;
  ariaHidden?: boolean;
}) {
  return (
    <span
      className={[
        "flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-[11px] font-semibold tracking-[0.2em] text-sky-100",
        className,
      ].join(" ")}
      aria-hidden={ariaHidden}
    >
      {label.slice(0, 2).toUpperCase()}
    </span>
  );
}

function TagIcon({ label }: { label: string }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[11px] font-semibold tracking-[0.18em] text-white/70">
      {label.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function OnboardingForm({
  programmingLanguages,
  learningTags,
  selectedLanguagePreferences,
  selectedLearningTagIds,
  errorMessage,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<Set<string>>(
    () => new Set(selectedLanguagePreferences.map((item) => item.languageId)),
  );
  const [languageDrafts, setLanguageDrafts] = useState<Record<string, string>>(
    () =>
      selectedLanguagePreferences.reduce<Record<string, string>>(
        (accumulator, item) => {
          const available = programmingLanguages.find(
            (language) => language.id === item.languageId,
          );

          if (!available) {
            return accumulator;
          }

          accumulator[item.languageId] = item.proficiencyLevel;
          return accumulator;
        },
        {},
      ),
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    () => new Set(selectedLearningTagIds),
  );

  const availableLanguages = useMemo(
    () => programmingLanguages,
    [programmingLanguages],
  );

  const selectedLanguages = useMemo(
    () =>
      availableLanguages.filter((language) => selectedLanguageIds.has(language.id)),
    [availableLanguages, selectedLanguageIds],
  );

  const selectedTags = useMemo(
    () => learningTags.filter((tag) => selectedTagIds.has(tag.id)),
    [learningTags, selectedTagIds],
  );

  function toggleLanguage(languageId: string) {
    setSelectedLanguageIds((current) => {
      const next = new Set(current);

      if (next.has(languageId)) {
        next.delete(languageId);
        setLanguageDrafts((drafts) => {
          const nextDrafts = { ...drafts };
          delete nextDrafts[languageId];
          return nextDrafts;
        });
      } else {
        next.add(languageId);
        setLanguageDrafts((drafts) => ({
          ...drafts,
          [languageId]: drafts[languageId] ?? proficiencyLevels[0].value,
        }));
      }

      return next;
    });
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((current) => {
      const next = new Set(current);

      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }

      return next;
    });
  }

  function updateLanguageDraft(languageId: string, proficiencyLevel: string) {
    setLanguageDrafts((current) => ({
      ...current,
      [languageId]: proficiencyLevel,
    }));
  }

  const languagePickerItems = useMemo(
    () =>
      availableLanguages.map((language) => ({
        id: language.id,
        label: language.name,
        description:
          language.description ?? "Use this as your starting point for onboarding.",
        badge: language.slug,
        leading: <LanguageIcon label={language.name} />,
      })),
    [availableLanguages],
  );

  const selectedLanguageSummary = useMemo(
    () =>
      summarizeSelectionNames(
        selectedLanguages.map((language) => language.name),
        "Select languages",
        2,
      ),
    [selectedLanguages],
  );

  const tagPickerItems = useMemo(
    () =>
      learningTags.map((tag) => ({
        id: tag.id,
        label: tag.name,
        description: tag.description ?? "Focus area for future practice.",
        badge: "All languages",
        leading: <TagIcon label={tag.name} />,
      })),
    [learningTags],
  );

  const selectedTagSummary = useMemo(
    () =>
      summarizeSelectionNames(
        selectedTags.map((tag) => tag.name),
        "Select tags",
        3,
      ),
    [selectedTags],
  );

  const confidenceReady = isConfidenceStepReady(selectedLanguages.length);
  const stepLabels = ["Choose languages", "Set confidence", "Pick focus tags"];

  const stepContent = useMemo(
    () =>
      ({
        1: {
          title: "Pick the languages in your first milestone",
          description:
            "Choose the languages you want Codora to focus on first. You can change this later, but the wizard starts here.",
          progress: selectedLanguages.length
            ? `${selectedLanguages.length} language${selectedLanguages.length === 1 ? "" : "s"} selected`
            : "No languages selected",
          cta: "Next",
          helper: "Select at least one language to continue.",
        },
        2: {
          title: "Set the milestone level for each language",
          description:
            "Tell us how confident you feel so the app can match your first exercises and recommendations.",
          progress: confidenceReady
            ? "Confidence ready"
            : "Select languages first",
          cta: "Next",
          helper: "Add a language in step 1 before setting confidence.",
        },
        3: {
          title: "Choose the focus areas you want to see next",
          description:
            "Pick the topics and themes you want to surface in future exercises and guidance.",
          progress: `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"} selected`,
          cta: "Finish onboarding",
          helper: "You can skip tags if you want to finish now.",
        },
      }) satisfies Record<
        1 | 2 | 3,
      {
        title: string;
        description: string;
        progress: string;
        cta: string;
        helper: string;
      }
      >,
    [confidenceReady, selectedLanguages.length, selectedTags.length],
  );

  function goToNextStep() {
    if (currentStep === 1 && selectedLanguages.length === 0) {
      setError("Select at least one language to continue.");
      return;
    }

    if (currentStep === 2 && !confidenceReady) {
      setError("Select at least one language before setting confidence.");
      setCurrentStep(1);
      return;
    }

    setError(null);
    setCurrentStep((step) => {
      if (step === 1) {
        return 2;
      }

      return 3;
    });
  }

  function goToPreviousStep() {
    setError(null);
    setCurrentStep((step) => {
      if (step === 3) {
        return 2;
      }

      return 1;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep !== 3) {
      goToNextStep();
      return;
    }

    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    const { language_preferences, learning_tag_ids } = buildOnboardingSubmission({
      selectedLanguagePreferences,
      selectedLanguages,
      languageDrafts,
      editableLanguages: availableLanguages,
      selectedTagIds,
    });

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_preferences,
          learning_tag_ids,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null;

      if (!response.ok || !result || !result.ok) {
        setError(
          result && !result.ok
            ? result.error ?? "Unable to save onboarding."
            : "Unable to save onboarding.",
        );
        setPending(false);
        return;
      }

      router.replace("/home");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errorMessage || error ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
          {errorMessage ?? error}
        </p>
      ) : null}

      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="border-b border-white/8 px-5 py-5 sm:px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/35">
            Codora onboarding
          </p>

          <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2">
            {[1, 2, 3].map((step, index) => {
              const active = step === currentStep;
              const completed = step < currentStep;

              return (
                <div key={step} className="contents">
                  <button
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition",
                      active
                        ? "border-sky-300/40 bg-sky-400/15 text-sky-100"
                        : completed
                          ? "border-white/20 bg-white/[0.06] text-white"
                          : "border-white/12 bg-black/20 text-white/45",
                    ].join(" ")}
                    type="button"
                    disabled={pending || step > currentStep}
                    onClick={() => setCurrentStep(step as 1 | 2 | 3)}
                    aria-current={active ? "step" : undefined}
                    aria-label={`Step ${step}: ${stepLabels[index]}`}
                  >
                    {step}
                  </button>

                  {index < stepLabels.length - 1 ? (
                    <div
                      className={[
                        "h-px w-full",
                        step < currentStep ? "bg-white/35" : "bg-white/12",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3 text-[11px] uppercase tracking-[0.22em] text-white/35">
            {stepLabels.map((label, index) => (
              <p
                key={label}
                className={
                  index + 1 === currentStep ? "text-white/70" : undefined
                }
              >
                {label}
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {stepContent[currentStep].title}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-white/55 sm:text-[15px]">
                {stepContent[currentStep].description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <p className="font-medium text-white">{stepContent[currentStep].progress}</p>
              <p className="text-white/45">{stepContent[currentStep].helper}</p>
            </div>
          </div>

            {currentStep === 1 ? (
              <section className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">
                    Which languages are part of your current milestone?
                  </h3>
                  <p className="max-w-2xl text-sm leading-6 text-white/50">
                    Start with the languages you want to practice first.
                  </p>
                </div>

                <SearchableMultiSelect
                  label="Language picker"
                  summary={selectedLanguageSummary}
                  items={languagePickerItems}
                  selectedIds={selectedLanguageIds}
                  disabled={pending || availableLanguages.length === 0}
                  emptyMessage="No matching languages found."
                  searchPlaceholder="Search languages"
                  searchLabel="Search languages"
                  onToggle={toggleLanguage}
                />

                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.length > 0 ? (
                    selectedLanguages.map((language) => (
                      <button
                        key={language.id}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
                        type="button"
                        disabled={pending}
                        onClick={() => toggleLanguage(language.id)}
                      >
                        <span className="truncate">{language.name}</span>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/20 text-white/55 transition group-hover:text-white/80">
                          <X size={10} />
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-white/45">
                      Pick at least one language to unlock the next step.
                    </p>
                  )}
                </div>
              </section>
            ) : null}

            {currentStep === 2 ? (
              <section className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">
                    How confident do you feel with each selected language?
                  </h3>
                  <p className="max-w-2xl text-sm leading-6 text-white/50">
                    This sets the starting point for the first exercises Codora suggests.
                  </p>
                </div>

                {confidenceReady ? (
                  <div className="rounded-3xl border border-white/10 bg-black/15">
                    <div className="max-h-80 overflow-y-auto">
                      {selectedLanguages.map((language) => (
                        <div
                          key={language.id}
                          className="flex flex-col gap-3 border-b border-white/8 px-4 py-4 last:border-b-0 lg:flex-row lg:items-center lg:justify-between"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <LanguageIcon
                              label={language.name}
                              className="h-8 w-8 rounded-xl text-[8px] tracking-[0.14em]"
                              ariaHidden
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-white">
                                {language.name}
                              </p>
                              <p className="mt-0.5 text-xs leading-5 text-white/45">
                                {language.description ??
                                  "Choose how confident you feel with this language."}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 lg:shrink-0">
                            <label className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.025] px-3 py-2">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                                Level
                              </span>
                              <span className="sr-only">{`${language.name} proficiency level`}</span>
                              <span className="relative">
                                <select
                                  className="h-9 min-w-32 appearance-none rounded-lg border border-white/10 bg-[#0c0c0c] px-3 pr-9 text-sm text-white outline-none transition focus:border-white/30"
                                  disabled={pending}
                                  value={
                                    languageDrafts[language.id] ??
                                    proficiencyLevels[0].value
                                  }
                                  onChange={(event) =>
                                    updateLanguageDraft(language.id, event.target.value)
                                  }
                                >
                                  {proficiencyLevels.map((level) => (
                                    <option key={level.value} value={level.value}>
                                      {level.label}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={14}
                                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45"
                                  aria-hidden="true"
                                />
                              </span>
                            </label>

                            <button
                              className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/45 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                              type="button"
                              disabled={pending}
                              onClick={() => toggleLanguage(language.id)}
                              aria-label={`Remove ${language.name}`}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-black/15 px-5 py-8 text-sm leading-6 text-white/45">
                    Add at least one language in step 1 to unlock confidence levels.
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map((language) => (
                    <span
                      key={language.id}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70"
                    >
                      {language.name}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {currentStep === 3 ? (
              <section className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">
                    What should we focus on for {topicLabel}?
                  </h3>
                  <p className="max-w-2xl text-sm leading-6 text-white/50">
                    Pick the themes you want to see in future exercises and guidance.
                  </p>
                </div>

                <SearchableMultiSelect
                  label="Tag picker"
                  summary={selectedTagSummary}
                  items={tagPickerItems}
                  selectedIds={selectedTagIds}
                  disabled={pending}
                  emptyMessage="No matching tags found."
                  searchPlaceholder="Search tags"
                  searchLabel="Search tags"
                  onToggle={toggleTag}
                />

                {selectedTags.length > 0 ? (
                  <div className="max-h-24 overflow-y-auto pr-1">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTags.map((tag) => (
                        <button
                          key={tag.id}
                          className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
                          type="button"
                          disabled={pending}
                          onClick={() => toggleTag(tag.id)}
                        >
                          <span className="truncate">{tag.name}</span>
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/20 text-white/55 transition group-hover:text-white/80">
                            <X size={10} />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/45">
                    No tags selected. You can finish onboarding now or add focus areas.
                  </p>
                )}
              </section>
            ) : null}
        </div>
      </section>

      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-white/35">
            {currentStep === 3 ? "Ready to finish" : "Continue the wizard"}
          </p>
          <p className="text-sm text-white/55">
            {currentStep === 3
              ? "Your selections will be saved as your initial onboarding milestone."
              : "Use Back and Next to move through each step without losing your selections."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {currentStep > 1 ? (
            <button
              className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:bg-white/[0.03] disabled:text-white/35"
              disabled={pending}
              type="button"
              onClick={goToPreviousStep}
            >
              Back
            </button>
          ) : null}

          {currentStep < 3 ? (
            <button
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40"
              disabled={pending || (currentStep === 1 && selectedLanguages.length === 0)}
              type="button"
              onClick={goToNextStep}
            >
              {stepContent[currentStep].cta}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/40"
              disabled={pending}
              type="submit"
            >
              {pending ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  {stepContent[currentStep].cta}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
