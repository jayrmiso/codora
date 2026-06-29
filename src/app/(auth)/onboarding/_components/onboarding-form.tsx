"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";

import type { LearningTagRow } from "@/infrastructure/supabase/auth";

const proficiencyLevels = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Learning the basics and building confidence.",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Comfortable with common patterns and problem solving.",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Ready for deeper reasoning and harder implementation.",
  },
] as const;

type Props = {
  learningTags: LearningTagRow[];
  selectedLearningTagIds: string[];
  selectedProficiencyLevel: string;
  errorMessage: string | null;
};

export function OnboardingForm({
  learningTags,
  selectedLearningTagIds,
  selectedProficiencyLevel,
  errorMessage,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(
    selectedProficiencyLevel || proficiencyLevels[0].value,
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    () => new Set(selectedLearningTagIds),
  );

  const tagCount = useMemo(() => selectedTagIds.size, [selectedTagIds]);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const proficiencyLevel = String(formData.get("proficiency_level") ?? "").trim();
    const learningTagIds = formData
      .getAll("learning_tag_ids")
      .map((value) => String(value).trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proficiency_level: proficiencyLevel,
          learning_tag_ids: learningTagIds,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null;

      if (!response.ok || !result || !result.ok) {
        setError(result && !result.ok ? result.error ?? "Unable to save onboarding." : "Unable to save onboarding.");
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-3">
        {errorMessage ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
            {errorMessage}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          {proficiencyLevels.map((level) => {
            const active = selectedLevel === level.value;

            return (
              <label
                key={level.value}
                className={[
                  "cursor-pointer rounded-2xl border p-4 transition",
                  active
                    ? "border-white/30 bg-white/[0.08]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                ].join(" ")}
              >
                <input
                  className="sr-only"
                  disabled={pending}
                  name="proficiency_level"
                  type="radio"
                  value={level.value}
                  checked={active}
                  onChange={() => setSelectedLevel(level.value)}
                />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{level.label}</p>
                    <p className="mt-1 text-sm leading-6 text-white/45">
                      {level.description}
                    </p>
                  </div>
                  {active ? <Check size={16} className="text-white" /> : null}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/35">
              Learning tags
            </p>
            <h3 className="mt-2 text-lg font-medium text-white">
              Pick what you want to work on
            </h3>
          </div>
          <p className="text-sm text-white/45">{tagCount} selected</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {learningTags.length > 0 ? (
            learningTags.map((tag) => {
              const active = selectedTagIds.has(tag.id);

              return (
                <label
                  key={tag.id}
                  className={[
                    "cursor-pointer rounded-2xl border p-4 transition",
                    active
                      ? "border-white/30 bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <input
                    className="sr-only"
                    disabled={pending}
                    name="learning_tag_ids"
                    type="checkbox"
                    value={tag.id}
                    checked={active}
                    onChange={() => toggleTag(tag.id)}
                  />
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/15">
                      {active ? <Check size={12} className="text-white" /> : null}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tag.name}</p>
                      <p className="mt-1 text-sm leading-6 text-white/45">
                        {tag.description ?? "Focus area for future problems."}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45 sm:col-span-2">
              No learning tags are available right now.
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-white/45">
          This only takes a moment. We use this to personalize the first
          problem set and keep the app focused.
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
