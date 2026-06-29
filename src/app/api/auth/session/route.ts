import { NextRequest, NextResponse } from "next/server";

import {
  isOnboardingComplete,
  loadSupabaseProgrammingLanguages,
  loadSupabaseProfile,
  loadSupabaseProfileLanguagePreferences,
  loadSupabaseProfileLearningTagIds,
  loadSupabaseUser,
  isSupabaseConfigured,
  refreshSupabaseSession,
  toSessionPayload,
  type SelectedLanguagePreference,
} from "@/infrastructure/supabase/auth";
import { AUTH_COOKIE_NAMES, SUPABASE_CONFIG_ERROR } from "@/infrastructure/supabase/config";
import { clearAuthCookies, setAuthCookies } from "@/infrastructure/supabase/cookies";

async function buildSessionState(accessToken: string, refreshToken: string) {
  const userResult = await loadSupabaseUser(accessToken);

  if (userResult.ok) {
    const [profileResult, learningTagIdsResult, languagePreferencesResult, languagesResult] =
      await Promise.all([
        loadSupabaseProfile(accessToken, userResult.data.id),
        loadSupabaseProfileLearningTagIds(accessToken, userResult.data.id),
        loadSupabaseProfileLanguagePreferences(accessToken, userResult.data.id),
        loadSupabaseProgrammingLanguages(),
      ]);

    const learningTagIds = learningTagIdsResult.ok ? learningTagIdsResult.data : [];
    const languagesById = new Map(
      languagesResult.ok ? languagesResult.data.map((language) => [language.id, language]) : [],
    );
    const languagePreferences: SelectedLanguagePreference[] = languagePreferencesResult.ok
      ? languagePreferencesResult.data
          .map((preference) => {
            const language = languagesById.get(preference.language_id);

            if (!language) {
              return null;
            }

            return {
              languageId: language.id,
              languageSlug: language.slug,
              languageName: language.name,
              proficiencyLevel: preference.proficiency_level,
            };
          })
          .filter((preference): preference is SelectedLanguagePreference => Boolean(preference))
      : [];

    return {
      user: userResult.data,
      profile: profileResult.ok ? profileResult.data : null,
      languagePreferences,
      learningTagIds,
      onboardingComplete: isOnboardingComplete(
        profileResult.ok ? profileResult.data : null,
        languagePreferences,
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

  const [refreshedProfile, refreshedLearningTagIdsResult, refreshedLanguagePreferencesResult, languagesResult] =
    await Promise.all([
      loadSupabaseProfile(refreshed.data.access_token, refreshedUser.data.id),
      loadSupabaseProfileLearningTagIds(refreshed.data.access_token, refreshedUser.data.id),
      loadSupabaseProfileLanguagePreferences(refreshed.data.access_token, refreshedUser.data.id),
      loadSupabaseProgrammingLanguages(),
    ]);
  const refreshedLearningTagIds = refreshedLearningTagIdsResult.ok
    ? refreshedLearningTagIdsResult.data
    : [];
  const languagesById = new Map(
    languagesResult.ok ? languagesResult.data.map((language) => [language.id, language]) : [],
  );
  const refreshedLanguagePreferences: SelectedLanguagePreference[] =
    refreshedLanguagePreferencesResult.ok
      ? refreshedLanguagePreferencesResult.data
          .map((preference) => {
            const language = languagesById.get(preference.language_id);

            if (!language) {
              return null;
            }

            return {
              languageId: language.id,
              languageSlug: language.slug,
              languageName: language.name,
              proficiencyLevel: preference.proficiency_level,
            };
          })
          .filter((preference): preference is SelectedLanguagePreference => Boolean(preference))
      : [];

  return {
    user: refreshedUser.data,
    profile: refreshedProfile.ok ? refreshedProfile.data : null,
    languagePreferences: refreshedLanguagePreferences,
    learningTagIds: refreshedLearningTagIds,
    onboardingComplete: isOnboardingComplete(
      refreshedProfile.ok ? refreshedProfile.data : null,
      refreshedLanguagePreferences,
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
        languagePreferences: [],
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
        languagePreferences: [],
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
      languagePreferences: sessionState.languagePreferences,
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
