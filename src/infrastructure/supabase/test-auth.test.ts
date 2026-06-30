import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  AUTH_TEST_BYPASS: process.env.AUTH_TEST_BYPASS,
  AUTH_TEST_BYPASS_SECRET: process.env.AUTH_TEST_BYPASS_SECRET,
};

beforeEach(() => {
  process.env.NODE_ENV = originalEnv.NODE_ENV;
  process.env.AUTH_TEST_BYPASS = originalEnv.AUTH_TEST_BYPASS;
  process.env.AUTH_TEST_BYPASS_SECRET = originalEnv.AUTH_TEST_BYPASS_SECRET;
});

test("test auth helpers expose the bypass account and cookie flag", async () => {
  process.env.NODE_ENV = "development";
  process.env.AUTH_TEST_BYPASS = "true";
  process.env.AUTH_TEST_BYPASS_SECRET = "test-secret";

  const auth = await import("./test-auth.ts");
  const { hasValidOnboardingPayload, hasNonEmptyPayload } = await import("../../app/api/auth/_lib.ts");

  assert.equal(auth.TEST_AUTH_ENABLED, true);
  assert.equal(auth.isTestAuthCredentials("arjayramiso@gmail.com", "Arjay123!"), true);
  assert.equal(auth.isTestAuthCredentials("ARJAYRAMISO@GMAIL.COM", "Jayrmiso123!"), true);
  assert.equal(auth.isTestAuthCredentials("someone@example.com", "Arjay123!"), false);
  assert.equal(auth.isTestAuthCredentials("arjayramiso@gmail.com", "wrongpass"), false);
  const session = auth.getTestAuthSession();
  assert.equal(auth.isTestAuthToken(session.access_token, session.refresh_token), true);
  assert.equal(session.user.email, "arjayramiso@gmail.com");
  assert.equal(hasNonEmptyPayload({ hello: "world" }), true);
  assert.equal(hasNonEmptyPayload({}), false);
  assert.equal(hasNonEmptyPayload(null), false);
  assert.equal(
    hasValidOnboardingPayload({
      language_preferences: [{ language_id: "python", proficiency_level: "beginner" }],
      learning_tag_ids: ["loops"],
    }),
    true,
  );
  assert.equal(
    hasValidOnboardingPayload({
      language_preferences: [],
      learning_tag_ids: ["loops"],
    }),
    false,
  );
});

test("test auth onboarding cookie round-trips through the response store", async () => {
  process.env.NODE_ENV = "development";
  process.env.AUTH_TEST_BYPASS = "true";
  process.env.AUTH_TEST_BYPASS_SECRET = "test-secret";

  const { NextResponse } = await import("next/server.js");
  const auth = await import("./test-auth.ts");

  const response = NextResponse.json({ ok: true });

  auth.setTestAuthOnboardingComplete(response, true);
  assert.equal(response.cookies.get(auth.TEST_AUTH_ONBOARDING_COOKIE)?.value, "true");
  assert.equal(
    auth.getTestAuthOnboardingComplete({
      get: (name: string) =>
        name === auth.TEST_AUTH_ONBOARDING_COOKIE ? { value: "true" } : undefined,
    }),
    true,
  );

  auth.setTestAuthOnboardingComplete(response, false);
  assert.equal(response.cookies.get(auth.TEST_AUTH_ONBOARDING_COOKIE)?.value, "false");
});

test("test auth fallback taxonomy exposes the expanded language and tag catalog", async () => {
  process.env.NODE_ENV = "development";
  process.env.AUTH_TEST_BYPASS = "true";
  process.env.AUTH_TEST_BYPASS_SECRET = "test-secret";

  const auth = await import("./test-auth.ts");

  assert.deepEqual(
    auth.TEST_AUTH_PROGRAMMING_LANGUAGES.map((language) => language.slug),
    ["python", "javascript", "typescript", "java", "go", "ruby", "rust", "csharp"],
  );
  assert.equal(
    auth.TEST_AUTH_PROGRAMMING_LANGUAGES.find((language) => language.slug === "python")
      ?.description,
    "A general-purpose language used across scripting, backend work, and automation.",
  );
  assert.deepEqual(
    auth.TEST_AUTH_LEARNING_TAGS.map((tag) => tag.slug),
    [
      "variables",
      "conditionals",
      "loops",
      "functions",
      "arrays",
      "strings",
      "hash-maps",
      "sets",
      "sorting",
      "search",
      "recursion",
      "stacks",
      "queues",
      "trees",
      "graphs",
    ],
  );
});
