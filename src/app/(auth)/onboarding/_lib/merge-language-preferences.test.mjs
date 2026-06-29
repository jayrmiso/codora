import assert from "node:assert/strict";
import test from "node:test";

import { mergeLanguagePreferences } from "./merge-language-preferences.mjs";

test("preserves hidden preferences while replacing editable selections", () => {
  const result = mergeLanguagePreferences({
    existingPreferences: [
      {
        languageId: "python-id",
        languageSlug: "python",
        languageName: "Python",
        proficiencyLevel: "intermediate",
      },
      {
        languageId: "rust-id",
        languageSlug: "rust",
        languageName: "Rust",
        proficiencyLevel: "beginner",
      },
    ],
    selectedPreferences: [
      {
        languageId: "python-id",
        languageSlug: "python",
        languageName: "Python",
        proficiencyLevel: "advanced",
      },
    ],
    editableLanguageIds: ["python-id"],
  });

  assert.deepEqual(result, [
    {
      languageId: "rust-id",
      languageSlug: "rust",
      languageName: "Rust",
      proficiencyLevel: "beginner",
    },
    {
      languageId: "python-id",
      languageSlug: "python",
      languageName: "Python",
      proficiencyLevel: "advanced",
    },
  ]);
});

test("removes deselected editable languages while keeping hidden preferences", () => {
  const result = mergeLanguagePreferences({
    existingPreferences: [
      {
        languageId: "python-id",
        languageSlug: "python",
        languageName: "Python",
        proficiencyLevel: "intermediate",
      },
      {
        languageId: "rust-id",
        languageSlug: "rust",
        languageName: "Rust",
        proficiencyLevel: "beginner",
      },
    ],
    selectedPreferences: [],
    editableLanguageIds: ["python-id"],
  });

  assert.deepEqual(result, [
    {
      languageId: "rust-id",
      languageSlug: "rust",
      languageName: "Rust",
      proficiencyLevel: "beginner",
    },
  ]);
});
