export function mergeLanguagePreferences({
  existingPreferences,
  selectedPreferences,
  editableLanguageSlug,
}) {
  const preservedPreferences = existingPreferences.filter(
    (preference) => preference.languageSlug !== editableLanguageSlug,
  );

  return [...preservedPreferences, ...selectedPreferences];
}
