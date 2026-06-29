"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import type {
  ProgrammingLanguageRow,
  SelectedLanguagePreference,
  LearningTagRow,
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
  const [languageQuery, setLanguageQuery] = useState("");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<Set<string>>(
    () => new Set(selectedLanguagePreferences.map((item) => item.languageId)),
  );
  const [languageDrafts, setLanguageDrafts] = useState<Record<string, string>>(
    () =>
      selectedLanguagePreferences.reduce<Record<string, string>>((accumulator, item) => {
        accumulator[item.languageId] = item.proficiencyLevel;
        return accumulator;
      }, {}),
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    () => new Set(selectedLearningTagIds),
  );

  const selectedLanguages = useMemo(
    () => programmingLanguages.filter((language) => selectedLanguageIds.has(language.id)),
    [programmingLanguages, selectedLanguageIds],
  );

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = languageQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return programmingLanguages;
    }

    return programmingLanguages.filter((language) => {
      const haystack = `${language.name} ${language.slug} ${language.description ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [languageQuery, programmingLanguages]);

  const selectedTags = useMemo(
    () => learningTags.filter((tag) => selectedTagIds.has(tag.id)),
    [learningTags, selectedTagIds],
  );

  const filteredTags = useMemo(() => {
    const normalizedQuery = tagQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return learningTags;
    }

    return learningTags.filter((tag) => {
      const haystack = `${tag.name} ${tag.slug} ${tag.description ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [learningTags, tagQuery]);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    const languagePreferences = selectedLanguages.map((language) => ({
      language_id: language.id,
      proficiency_level: languageDrafts[language.id] ?? proficiencyLevels[0].value,
    }));

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

  const selectedLanguageSummary =
    selectedLanguages.length > 0
      ? selectedLanguages.map((language) => language.name).slice(0, 3).join(", ")
      : "Select languages";

  const selectedTagSummary =
    selectedTags.length > 0
      ? selectedTags.map((tag) => tag.name).slice(0, 3).join(", ")
      : "Select tags";

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
              <h3 className="mt-2 text-base font-medium text-white">
                What do you want to learn?
              </h3>
            </div>
            <p className="text-sm text-white/45">{selectedLanguages.length} selected</p>
          </div>

          <div className="mt-4 relative">
            <button
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white transition hover:border-white/20 hover:bg-white/[0.05]"
              type="button"
              disabled={pending}
              onClick={() => setLanguageMenuOpen((current) => !current)}
            >
              <span className="min-w-0 flex-1 truncate text-white/70">
                {selectedLanguageSummary}
              </span>
              <ChevronDown
                size={16}
                className={
                  languageMenuOpen ? "rotate-180 text-white transition" : "text-white/45 transition"
                }
              />
            </button>

            {selectedLanguages.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedLanguages.map((language) => (
                  <button
                    key={language.id}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
                    type="button"
                    disabled={pending}
                    onClick={() => toggleLanguage(language.id)}
                  >
                    {language.name}
                    <X size={12} />
                  </button>
                ))}
              </div>
            ) : null}

            {selectedLanguages.length > 0 ? (
              <div className="mt-4 space-y-3">
                {selectedLanguages.map((language) => (
                  <div
                    key={language.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{language.name}</p>
                        <p className="mt-1 text-xs leading-5 text-white/45">
                          {language.description ?? "Choose how confident you feel with this language."}
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

            {languageMenuOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 rounded-3xl border border-white/10 bg-[#0c0c0c] p-3 shadow-2xl shadow-black/50">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  <Search size={14} className="text-white/35" />
                  <input
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                    value={languageQuery}
                    onChange={(event) => setLanguageQuery(event.target.value)}
                    placeholder="Search languages"
                    type="text"
                  />
                </label>

                <div className="mt-3 max-h-64 overflow-y-auto pr-1">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((language) => {
                        const active = selectedLanguageIds.has(language.id);

                        return (
                          <button
                            key={language.id}
                            className={[
                              "flex items-start gap-3 rounded-2xl border px-3 py-3 text-left transition",
                              active
                                ? "border-white/30 bg-white/[0.08]"
                                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                            ].join(" ")}
                            type="button"
                            disabled={pending}
                            onClick={() => toggleLanguage(language.id)}
                          >
                            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/15">
                              {active ? <Check size={12} className="text-white" /> : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-white">
                                {language.name}
                              </span>
                              <span className="block text-xs leading-5 text-white/45">
                                {language.description ?? "Pick the languages you want to practice."}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-white/45 sm:col-span-2">
                        No matching languages found.
                      </div>
                    )}
                  </div>
                </div>
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
                What do you want to focus on?
              </h3>
            </div>
            <p className="text-sm text-white/45">{selectedTags.length} selected</p>
          </div>

          <div className="mt-4 relative">
            <button
              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white transition hover:border-white/20 hover:bg-white/[0.05]"
              type="button"
              disabled={pending}
              onClick={() => setTagMenuOpen((current) => !current)}
            >
              <span className="min-w-0 flex-1 truncate text-white/70">
                {selectedTagSummary}
              </span>
              <ChevronDown
                size={16}
                className={tagMenuOpen ? "rotate-180 text-white transition" : "text-white/45 transition"}
              />
            </button>

            {selectedTags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
                    type="button"
                    disabled={pending}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                    <X size={12} />
                  </button>
                ))}
              </div>
            ) : null}

            {tagMenuOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 rounded-3xl border border-white/10 bg-[#0c0c0c] p-3 shadow-2xl shadow-black/50">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  <Search size={14} className="text-white/35" />
                  <input
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                    value={tagQuery}
                    onChange={(event) => setTagQuery(event.target.value)}
                    placeholder="Search tags"
                    type="text"
                  />
                </label>

                <div className="mt-3 max-h-64 overflow-y-auto pr-1">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => {
                        const active = selectedTagIds.has(tag.id);

                        return (
                          <button
                            key={tag.id}
                            className={[
                              "flex items-start gap-3 rounded-2xl border px-3 py-3 text-left transition",
                              active
                                ? "border-white/30 bg-white/[0.08]"
                                : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                            ].join(" ")}
                            type="button"
                            disabled={pending}
                            onClick={() => toggleTag(tag.id)}
                          >
                            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/15">
                              {active ? <Check size={12} className="text-white" /> : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-white">
                                {tag.name}
                              </span>
                              <span className="block text-xs leading-5 text-white/45">
                                {tag.description ?? "Focus area for future problems."}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-white/45 sm:col-span-2">
                        No matching tags found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-6 text-white/45">
          This should fit on one screen. Use the searchable pickers to avoid
          scrolling through long card lists.
        </p>

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
