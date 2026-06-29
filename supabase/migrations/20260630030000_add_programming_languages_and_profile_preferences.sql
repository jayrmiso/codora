create extension if not exists pgcrypto;

create table if not exists public.programming_languages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_language_preferences (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  language_id uuid not null references public.programming_languages (id) on delete cascade,
  proficiency_level text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, language_id)
);

alter table public.programming_languages enable row level security;
alter table public.profile_language_preferences enable row level security;

drop policy if exists "Programming languages are publicly readable" on public.programming_languages;
create policy "Programming languages are publicly readable"
on public.programming_languages
for select
using (true);

drop policy if exists "Profile language preferences are readable by owner" on public.profile_language_preferences;
create policy "Profile language preferences are readable by owner"
on public.profile_language_preferences
for select
using (auth.uid() = profile_id);

drop policy if exists "Profile language preferences are insertable by owner" on public.profile_language_preferences;
create policy "Profile language preferences are insertable by owner"
on public.profile_language_preferences
for insert
with check (auth.uid() = profile_id);

drop policy if exists "Profile language preferences are updatable by owner" on public.profile_language_preferences;
create policy "Profile language preferences are updatable by owner"
on public.profile_language_preferences
for update
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

drop policy if exists "Profile language preferences are deletable by owner" on public.profile_language_preferences;
create policy "Profile language preferences are deletable by owner"
on public.profile_language_preferences
for delete
using (auth.uid() = profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_programming_languages_updated_at on public.programming_languages;
create trigger set_programming_languages_updated_at
before update on public.programming_languages
for each row
execute function public.set_updated_at();

drop trigger if exists set_profile_language_preferences_updated_at on public.profile_language_preferences;
create trigger set_profile_language_preferences_updated_at
before update on public.profile_language_preferences
for each row
execute function public.set_updated_at();

insert into public.programming_languages (slug, name, description, sort_order)
values
  ('python', 'Python', 'A general-purpose language that stays the active runtime for problems.', 10),
  ('javascript', 'JavaScript', 'A widely used language for web and general application development.', 20),
  ('typescript', 'TypeScript', 'Typed JavaScript for larger codebases and stricter tooling.', 30),
  ('java', 'Java', 'A strongly typed language used in enterprise and backend systems.', 40),
  ('go', 'Go', 'A simple compiled language well suited to services and tooling.', 50),
  ('ruby', 'Ruby', 'A productive dynamic language with a strong developer ecosystem.', 60),
  ('rust', 'Rust', 'A language focused on performance, safety, and control.', 70),
  ('csharp', 'C#', 'A modern language for application and platform development.', 80)
on conflict (slug) do nothing;

insert into public.profile_language_preferences (profile_id, language_id, proficiency_level)
select
  profiles.id,
  languages.id,
  preference.value
from public.profiles as profiles
cross join lateral jsonb_each_text(coalesce(profiles.language_proficiency_levels, '{}'::jsonb)) as preference(slug, value)
join public.programming_languages as languages
  on languages.slug = preference.slug
where preference.value <> ''
on conflict do nothing;

insert into public.profile_language_preferences (profile_id, language_id, proficiency_level)
select
  profiles.id,
  python_language.id,
  profiles.proficiency_level
from public.profiles as profiles
cross join lateral (
  select id
  from public.programming_languages
  where slug = 'python'
) as python_language
where profiles.proficiency_level is not null
  and profiles.proficiency_level <> ''
  and not exists (
    select 1
    from public.profile_language_preferences as preferences
    where preferences.profile_id = profiles.id
      and preferences.language_id = python_language.id
  );
