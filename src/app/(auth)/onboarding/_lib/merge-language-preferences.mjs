export function mergeLanguagePreferences({
  existingPreferences,
  selectedPreferences,
  editableLanguageIds,
}) {
  const editableLanguageIdSet = new Set(editableLanguageIds);
  const preservedPreferences = existingPreferences.filter(
    (preference) => !editableLanguageIdSet.has(preference.languageId),
  );

  return [...preservedPreferences, ...selectedPreferences];
}
