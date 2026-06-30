import assert from "node:assert/strict";
import test from "node:test";

import {
  buildOnboardingSubmission,
  isConfidenceStepReady,
} from "./onboarding-flow.mjs";

test("marks the confidence step ready only after at least one language is selected", () => {
  assert.equal(isConfidenceStepReady(0), false);
  assert.equal(isConfidenceStepReady(1), true);
});

test("builds the onboarding submission payload from the selected state", () => {
  const payload = buildOnboardingSubmission({
    selectedLanguagePreferences: [
      {
        languageId: "ruby-id",
        languageSlug: "ruby",
        languageName: "Ruby",
        proficiencyLevel: "intermediate",
      },
    ],
    selectedLanguages: [
      {
        id: "python-id",
        slug: "python",
        name: "Python",
      },
      {
        id: "typescript-id",
        slug: "typescript",
        name: "TypeScript",
      },
    ],
    languageDrafts: {
      "python-id": "advanced",
    },
    editableLanguages: [
      {
        id: "python-id",
      },
      {
        id: "typescript-id",
      },
    ],
    selectedTagIds: new Set(["loops-id", "debugging-id"]),
  });

  assert.deepEqual(payload, {
    language_preferences: [
      {
        language_id: "ruby-id",
        language_slug: "ruby",
        language_name: "Ruby",
        proficiency_level: "intermediate",
      },
      {
        language_id: "python-id",
        language_slug: "python",
        language_name: "Python",
        proficiency_level: "advanced",
      },
      {
        language_id: "typescript-id",
        language_slug: "typescript",
        language_name: "TypeScript",
        proficiency_level: "beginner",
      },
    ],
    learning_tag_ids: ["loops-id", "debugging-id"],
  });
});
