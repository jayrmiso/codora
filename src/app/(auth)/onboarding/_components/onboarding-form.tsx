"use client";

import { ArrowRight, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import { SearchableMultiSelect } from "@/components/searchable-multi-select";
import { mergeLanguagePreferences } from "../_lib/merge-language-preferences.mjs";
import { summarizeSelectionNames } from "../_lib/selection-summary.mjs";
import type {
  LearningTagRow,
  ProgrammingLanguageRow,
  SelectedLanguagePreference,
} from "@/infrastructure/supabase/auth";

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

function LanguageIcon({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={[
        "flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-[11px] font-semibold tracking-[0.2em] text-sky-100",
        className,
      ].join(" ")}
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
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<Set<string>>(
    () => new Set(selectedLanguagePreferences.map((item) => item.languageId)),
  );
  const [languageDrafts, setLanguageDrafts] = useState<Record<string, string>>(
    () =>
      selectedLanguagePreferences.reduce<Record<string, string>>((accumulator, item) => {
        const available = programmingLanguages.find((language) => language.id === item.languageId);

        if (!available) {
          return accumulator;
        }

        accumulator[item.languageId] = item.proficiencyLevel;
        return accumulator;
      }, {}),
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    () => new Set(selectedLearningTagIds),
  );

  const availableLanguages = useMemo(
    () => programmingLanguages,
    [programmingLanguages],
  );

  const selectedLanguages = useMemo(
    () => availableLanguages.filter((language) => selectedLanguageIds.has(language.id)),
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
    () => summarizeSelectionNames(selectedLanguages.map((language) => language.name), "Select languages", 2),
    [selectedLanguages],
  );

  const topicLabel =
    selectedLanguages[0]?.name ?? "selected languages";

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
    () => summarizeSelectionNames(selectedTags.map((tag) => tag.name), "Select tags", 3),
    [selectedTags],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    const languagePreferences = mergeLanguagePreferences({
      existingPreferences: selectedLanguagePreferences,
      selectedPreferences: selectedLanguages.map((language) => ({
        languageId: language.id,
        languageSlug: language.slug,
        languageName: language.name,
        proficiencyLevel: languageDrafts[language.id] ?? proficiencyLevels[0].value,
      })),
      editableLanguageIds: availableLanguages.map((language) => language.id),
    });

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_preferences: languagePreferences,
          learning_tag_ids: Array.from(selectedTagIds),
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

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                Languages
              </p>
              <h3 className="mt-2 text-base font-medium text-white">Programming languages</h3>
            </div>
            <p className="text-sm text-white/45">{selectedLanguages.length} selected</p>
          </div>

          <div className="mt-4">
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

            {selectedLanguages.length > 0 ? (
              <div className="mt-3 max-h-28 overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map((language) => (
                    <button
                      key={language.id}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
                      type="button"
                      disabled={pending}
                      onClick={() => toggleLanguage(language.id)}
                    >
                      <LanguageIcon
                        label={language.name}
                        className="h-5 w-5 rounded-full text-[8px] tracking-[0.12em]"
                      />
                      {language.name}
                      <X size={12} />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedLanguages.length > 0 ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {selectedLanguages.map((language) => (
                  <div
                    key={language.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{language.name}</p>
                        <p className="mt-1 text-xs leading-5 text-white/45">
                          {language.description ??
                            "Choose how confident you feel with this language."}
                        </p>
                      </div>
                      <button
                        className="rounded-full border border-white/10 bg-white/[0.03] p-1.5 text-white/45 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                        type="button"
                        disabled={pending}
                        onClick={() => toggleLanguage(language.id)}
                        aria-label={`Remove ${language.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <label className="mt-3 block">
                      <span className="sr-only">{`${language.name} proficiency level`}</span>
                      <select
                        className="h-11 w-full rounded-xl border border-white/10 bg-[#0c0c0c] px-3 text-sm text-white outline-none transition focus:border-white/30"
                        disabled={pending}
                        value={languageDrafts[language.id] ?? proficiencyLevels[0].value}
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
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                Learning tags
              </p>
              <h3 className="mt-2 text-base font-medium text-white">
                Focus tags for {topicLabel}
              </h3>
            </div>
            <p className="text-sm text-white/45">{selectedTags.length} selected</p>
          </div>

          <div className="mt-4">
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
              <div className="mt-3 max-h-28 overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <button
                      key={tag.id}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
                      type="button"
                      disabled={pending}
                      onClick={() => toggleTag(tag.id)}
                    >
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
                        {topicLabel}
                      </span>
                      {tag.name}
                      <X size={12} />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
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
