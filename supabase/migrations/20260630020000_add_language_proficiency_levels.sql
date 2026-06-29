alter table public.profiles
add column if not exists language_proficiency_levels jsonb not null default '{}'::jsonb;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    proficiency_level,
    language_proficiency_levels
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(
      new.raw_user_meta_data ->> 'proficiency_level',
      new.raw_user_meta_data -> 'language_proficiency_levels' ->> 'python'
    ),
    coalesce(
      new.raw_user_meta_data -> 'language_proficiency_levels',
      jsonb_build_object(
        'python',
        coalesce(new.raw_user_meta_data ->> 'proficiency_level', new.raw_user_meta_data ->> 'level')
      )
    )
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    proficiency_level = coalesce(excluded.proficiency_level, public.profiles.proficiency_level),
    language_proficiency_levels = coalesce(
      excluded.language_proficiency_levels,
      public.profiles.language_proficiency_levels
    ),
    updated_at = now();

  return new;
end;
$$;
