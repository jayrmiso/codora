import assert from "node:assert/strict";
import test from "node:test";

import { summarizeSelectionNames } from "./selection-summary.mjs";

test("compacts language and tag selection summaries", () => {
  assert.equal(summarizeSelectionNames([], "Select languages", 2), "Select languages");
  assert.equal(summarizeSelectionNames(["Python"], "Select languages", 2), "Python");
  assert.equal(summarizeSelectionNames(["Python", "Rust"], "Select languages", 2), "Python, Rust");
  assert.equal(
    summarizeSelectionNames(["Python", "Rust", "Go"], "Select languages", 2),
    "Python, Rust +1 more",
  );
  assert.equal(
    summarizeSelectionNames(["Python", "Rust", "Go", "Zig"], "Select tags", 3),
    "Python, Rust, Go +1 more",
  );
});
