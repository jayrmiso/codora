import { NextRequest, NextResponse } from "next/server";

import {
  isOnboardingComplete,
  loadSupabaseProfile,
  loadSupabaseProfileLearningTagIds,
  loadSupabaseUser,
  isSupabaseConfigured,
  refreshSupabaseSession,
  toSessionPayload,
} from "@/infrastructure/supabase/auth";
import { AUTH_COOKIE_NAMES, SUPABASE_CONFIG_ERROR } from "@/infrastructure/supabase/config";
import { clearAuthCookies, setAuthCookies } from "@/infrastructure/supabase/cookies";

async function buildSessionState(accessToken: string, refreshToken: string) {
  const userResult = await loadSupabaseUser(accessToken);

  if (userResult.ok) {
    const profileResult = await loadSupabaseProfile(accessToken, userResult.data.id);
    const learningTagIdsResult = await loadSupabaseProfileLearningTagIds(
      accessToken,
      userResult.data.id,
    );
    const learningTagIds = learningTagIdsResult.ok ? learningTagIdsResult.data : [];

    return {
      user: userResult.data,
      profile: profileResult.ok ? profileResult.data : null,
      learningTagIds,
      onboardingComplete: isOnboardingComplete(
        profileResult.ok ? profileResult.data : null,
        learningTagIds,
      ),
      refreshedSession: null,
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

  const refreshedProfile = await loadSupabaseProfile(
    refreshed.data.access_token,
    refreshedUser.data.id,
  );
  const refreshedLearningTagIdsResult = await loadSupabaseProfileLearningTagIds(
    refreshed.data.access_token,
    refreshedUser.data.id,
  );
  const refreshedLearningTagIds = refreshedLearningTagIdsResult.ok
    ? refreshedLearningTagIdsResult.data
    : [];

  return {
    user: refreshedUser.data,
    profile: refreshedProfile.ok ? refreshedProfile.data : null,
    learningTagIds: refreshedLearningTagIds,
    onboardingComplete: isOnboardingComplete(
      refreshedProfile.ok ? refreshedProfile.data : null,
      refreshedLearningTagIds,
    ),
    refreshedSession: refreshed.data,
  };
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: SUPABASE_CONFIG_ERROR,
      },
      { status: 500 },
    );
  }

  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value ?? "";
  const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value ?? "";

  if (!accessToken && !refreshToken) {
    return NextResponse.json({
      ok: true,
      data: {
        authenticated: false,
        user: null,
        profile: null,
        learningTagIds: [],
        onboardingComplete: false,
        session: null,
      },
    });
  }

  const sessionState = await buildSessionState(accessToken, refreshToken);

  if (!sessionState) {
    const response = NextResponse.json(
      {
        ok: true,
        data: {
          authenticated: false,
          user: null,
          profile: null,
          learningTagIds: [],
          onboardingComplete: false,
          session: null,
        },
      },
      { status: 200 },
    );

    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json({
    ok: true,
    data: {
      authenticated: true,
      user: sessionState.user,
      profile: sessionState.profile,
      learningTagIds: sessionState.learningTagIds,
      onboardingComplete: sessionState.onboardingComplete,
      session: sessionState.refreshedSession
        ? toSessionPayload(sessionState.refreshedSession)
        : {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 0,
            user: sessionState.user,
          },
    },
  });

  if (sessionState.refreshedSession) {
    setAuthCookies(response, sessionState.refreshedSession);
  }

  return response;
}
