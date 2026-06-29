import assert from "node:assert/strict";
import test from "node:test";

import { mergeLanguagePreferences } from "./merge-language-preferences.mjs";

test("preserves hidden preferences while replacing the editable language", () => {
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
    editableLanguageSlug: "python",
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
