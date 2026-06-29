export function getSearchableMultiSelectState({ items, query, selectedIds, emptyMessage }) {
  const normalizedQuery = query.trim().toLowerCase();

  const matchingItems = normalizedQuery
    ? items.filter((item) => {
        const haystack = [item.label, item.description ?? "", item.badge ?? ""]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
    : items;

  const filteredItems = matchingItems.filter((item) => !selectedIds.has(item.id));

  const emptyStateMessage =
    matchingItems.length === 0
      ? emptyMessage
      : filteredItems.length === 0
        ? "All matching items are selected."
        : emptyMessage;

  return {
    filteredItems,
    emptyStateMessage,
  };
}
