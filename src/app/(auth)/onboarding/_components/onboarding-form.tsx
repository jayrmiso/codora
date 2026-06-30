"use client";

import { ArrowRight, LoaderCircle, X } from "lucide-react";
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

function StepBadge({ step }: { step: number }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/12 text-sm font-semibold text-sky-100">
      {step}
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

  const topicLabel = selectedLanguages[0]?.name ?? "selected languages";

  const tagPickerItems = useMemo(
    () =>
      learningTags.map((tag) => ({
        id: tag.id,
        label: tag.name,
        description: tag.description ?? "Focus area for future practice.",
        badge: topicLabel,
        leading: <TagIcon label={tag.name} />,
      })),
    [learningTags, topicLabel],
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

      <div className="space-y-4">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]">
          <div className="flex flex-col gap-5 border-b border-white/8 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <StepBadge step={1} />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                  Step 1
                </p>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Which languages are part of your current milestone?
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-white/50">
                    Choose the languages you want to practice first. You can set
                    confidence levels in the next step.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                Progress
              </p>
              <p className="mt-2 font-medium text-white">
                {selectedLanguages.length} language
                {selectedLanguages.length === 1 ? "" : "s"} selected
              </p>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
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
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]">
          <div className="flex flex-col gap-5 border-b border-white/8 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <StepBadge step={2} />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                  Step 2
                </p>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    How confident do you feel with each language?
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-white/50">
                    Use these levels to tune practice difficulty and recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                Milestone
              </p>
              <p className="mt-2 font-medium text-white">
                {confidenceReady
                  ? "Set your starting point"
                  : "Select languages first"}
              </p>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
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
                          <select
                            className="h-9 min-w-32 rounded-lg border border-white/10 bg-[#0c0c0c] px-3 text-sm text-white outline-none transition focus:border-white/30"
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
                Add at least one language in Step 1 to unlock confidence levels.
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]">
          <div className="flex flex-col gap-5 border-b border-white/8 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <StepBadge step={3} />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                  Step 3
                </p>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    What should we focus on for {topicLabel}?
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-white/50">
                    Pick the themes you want to see in future exercises and guidance.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">
                Progress
              </p>
              <p className="mt-2 font-medium text-white">
                {selectedTags.length} tag{selectedTags.length === 1 ? "" : "s"} selected
              </p>
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
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
              <div className="mt-4 max-h-24 overflow-y-auto pr-1">
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
            ) : null}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-white/35">
            Ready to continue
          </p>
          <p className="text-sm text-white/55">
            Your selections will be saved as your initial onboarding milestone.
          </p>
        </div>

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
              Continue
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
