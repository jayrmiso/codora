import type { NextRequest } from "next/server";

export type AuthErrorBody = {
  ok: false;
  error: string;
  details?: unknown;
};

export type AuthSuccessBody<T> = {
  ok: true;
  data: T;
  message?: string;
};

export function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

export function isStrongPassword(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 8;
}

export function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function readJsonBody(request: NextRequest) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function hasNonEmptyPayload(value: unknown) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0,
  );
}

export function hasValidOnboardingPayload(value: unknown) {
  if (!hasNonEmptyPayload(value) || !value || typeof value !== "object") {
    return false;
  }

  const languagePreferences = normalizeLanguagePreferences(
    (value as { language_preferences?: unknown }).language_preferences,
  );
  const learningTagIds = normalizeStringArray(
    (value as { learning_tag_ids?: unknown }).learning_tag_ids,
  );

  return languagePreferences.length > 0 && learningTagIds.length > 0;
}

export function normalizeEmail(value: unknown) {
  return isEmail(value) ? value.trim().toLowerCase() : "";
}

export function normalizeName(value: unknown) {
  return isString(value) ? value.trim() : undefined;
}

export function normalizeProficiencyLevel(value: unknown) {
  if (!isString(value)) {
    return "";
  }

  const normalized = value.trim().toLowerCase();

  return ["beginner", "intermediate", "advanced"].includes(normalized)
    ? normalized
    : "";
}

export function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export function normalizeLanguagePreferenceLevel(value: unknown) {
  return normalizeProficiencyLevel(value);
}

export function normalizeLanguagePreferences(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const preferences = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const languageId = typeof (item as { language_id?: unknown }).language_id === "string"
        ? (item as { language_id: string }).language_id.trim()
        : "";
      const proficiencyLevel = normalizeLanguagePreferenceLevel(
        (item as { proficiency_level?: unknown }).proficiency_level,
      );

      if (!languageId || !proficiencyLevel) {
        return null;
      }

      return {
        language_id: languageId,
        proficiency_level: proficiencyLevel,
      };
    })
    .filter(
      (preference): preference is {
        language_id: string;
        proficiency_level: string;
      } => Boolean(preference),
    );

  const seen = new Set<string>();

  return preferences.filter((preference) => {
    if (seen.has(preference.language_id)) {
      return false;
    }

    seen.add(preference.language_id);
    return true;
  });
}
