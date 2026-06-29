import { NextRequest, NextResponse } from "next/server";

import {
  isOnboardingComplete,
  loadSupabaseLearningTags,
  loadSupabaseProfile,
  loadSupabaseProfileLearningTagIds,
  loadSupabaseUser,
  refreshSupabaseSession,
  updateSupabaseOnboarding,
} from "@/infrastructure/supabase/auth";
import { AUTH_COOKIE_NAMES, SUPABASE_CONFIG_ERROR } from "@/infrastructure/supabase/config";
import { setAuthCookies } from "@/infrastructure/supabase/cookies";
import type { SupabaseSession } from "@/infrastructure/supabase/types";
import {
  normalizeProficiencyLevel,
  normalizeStringArray,
  readJsonBody,
} from "../../auth/_lib";

async function resolveSession(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? "";
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value ?? "";

  const userResult = accessToken ? await loadSupabaseUser(accessToken) : null;

  if (userResult?.ok) {
    return {
      accessToken,
      refreshToken,
      userId: userResult.data.id,
      user: userResult.data,
      refreshedSession: null as SupabaseSession | null,
    };
  }

  if (!refreshToken) {
    return null;
  }

  const refreshed = await refreshSupabaseSession(refreshToken);

  if (!refreshed.ok) {
    return null;
  }

  const refreshedUser = await loadSupabaseUser(refreshed.data.access_token);

  if (!refreshedUser.ok) {
    return null;
  }

  return {
    accessToken: refreshed.data.access_token,
    refreshToken: refreshed.data.refresh_token,
    userId: refreshedUser.data.id,
    user: refreshedUser.data,
    refreshedSession: refreshed.data,
  };
}

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  const proficiencyLevel = normalizeProficiencyLevel(body.proficiency_level);
  const learningTagIds = [...new Set(normalizeStringArray(body.learning_tag_ids))];

  if (!proficiencyLevel) {
    return NextResponse.json(
      { ok: false, error: "Choose a proficiency level." },
      { status: 400 },
    );
  }

  if (learningTagIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Choose at least one learning tag." },
      { status: 400 },
    );
  }

  const session = await resolveSession(request);

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "You need to be signed in to continue." },
      { status: 401 },
    );
  }

  const tagsResult = await loadSupabaseLearningTags();

  if (!tagsResult.ok) {
    return NextResponse.json(
      { ok: false, error: tagsResult.error },
      { status: tagsResult.error === SUPABASE_CONFIG_ERROR ? 500 : 400 },
    );
  }

  const allowedTagIds = new Set(tagsResult.data.map((tag) => tag.id));
  const invalidTagIds = learningTagIds.filter((tagId) => !allowedTagIds.has(tagId));

  if (invalidTagIds.length > 0) {
    return NextResponse.json(
      { ok: false, error: "One or more learning tags are invalid." },
      { status: 400 },
    );
  }

  const updateResult = await updateSupabaseOnboarding({
    accessToken: session.accessToken,
    userId: session.userId,
    proficiencyLevel,
    learningTagIds,
  });

  if (!updateResult.ok) {
    return NextResponse.json(
      { ok: false, error: updateResult.error, details: updateResult.details },
      { status: 400 },
    );
  }

  const profileResult = await loadSupabaseProfile(session.accessToken, session.userId);
  const tagIdsResult = await loadSupabaseProfileLearningTagIds(
    session.accessToken,
    session.userId,
  );
  const onboardingComplete = isOnboardingComplete(
    profileResult.ok ? profileResult.data : null,
    tagIdsResult.ok ? tagIdsResult.data : [],
  );

  const response = NextResponse.json({
    ok: true,
    data: {
      onboardingComplete,
    },
  });

  if (session.refreshedSession) {
    setAuthCookies(response, session.refreshedSession);
  }

  return response;
}
