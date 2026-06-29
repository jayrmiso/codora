import assert from "node:assert/strict";
import test from "node:test";

import { getSearchableMultiSelectState } from "./searchable-multi-select.mjs";

test("hides selected options and restores them after deselection", () => {
  const items = [
    {
      id: "python",
      label: "Python",
      description: "A general-purpose language",
      badge: "py",
    },
    {
      id: "rust",
      label: "Rust",
      description: "A systems language",
      badge: "rs",
    },
  ];

  const selectedState = getSearchableMultiSelectState({
    items,
    query: "py",
    selectedIds: new Set(["python"]),
    emptyMessage: "No matching languages found.",
  });

  assert.deepEqual(selectedState.filteredItems.map((item) => item.id), []);
  assert.equal(selectedState.emptyStateMessage, "All matching items are selected.");

  const deselectedState = getSearchableMultiSelectState({
    items,
    query: "py",
    selectedIds: new Set(),
    emptyMessage: "No matching languages found.",
  });

  assert.deepEqual(deselectedState.filteredItems.map((item) => item.id), ["python"]);
  assert.equal(deselectedState.emptyStateMessage, "No matching languages found.");
});
