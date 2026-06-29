export function summarizeSelectionNames(names, emptyLabel, maxVisible) {
  if (names.length === 0) {
    return emptyLabel;
  }

  const visibleNames = names.slice(0, maxVisible);

  if (names.length <= maxVisible) {
    return visibleNames.join(", ");
  }

  return `${visibleNames.join(", ")} +${names.length - maxVisible} more`;
}
