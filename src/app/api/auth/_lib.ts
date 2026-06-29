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

export function normalizeEmail(value: unknown) {
  return isEmail(value) ? value.trim().toLowerCase() : "";
}

export function normalizeName(value: unknown) {
  return isString(value) ? value.trim() : undefined;
}

