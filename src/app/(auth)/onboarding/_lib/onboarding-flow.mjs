import { mergeLanguagePreferences } from "./merge-language-preferences.mjs";

export function isConfidenceStepReady(selectedLanguageCount) {
  return selectedLanguageCount > 0;
}

function toLanguagePreferencePayload(preference) {
  return {
    language_id: preference.languageId,
    language_slug: preference.languageSlug,
    language_name: preference.languageName,
    proficiency_level: preference.proficiencyLevel,
  };
}

export function buildOnboardingSubmission({
  selectedLanguagePreferences,
  selectedLanguages,
  languageDrafts,
  editableLanguages,
  selectedTagIds,
}) {
  const language_preferences = mergeLanguagePreferences({
    existingPreferences: selectedLanguagePreferences,
    selectedPreferences: selectedLanguages.map((language) => ({
      languageId: language.id,
      languageSlug: language.slug,
      languageName: language.name,
      proficiencyLevel: languageDrafts[language.id] ?? "beginner",
    })),
    editableLanguageIds: editableLanguages.map((language) => language.id),
  });

  return {
    language_preferences: language_preferences.map(toLanguagePreferencePayload),
    learning_tag_ids: Array.from(selectedTagIds),
  };
}
