create extension if not exists pgcrypto;

alter table public.profiles
add column if not exists proficiency_level text;

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.difficulty_levels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_learning_tags (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  learning_tag_id uuid not null references public.learning_tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, learning_tag_id)
);

create table if not exists public.problems (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  topic_id uuid not null references public.topics (id) on delete restrict,
  difficulty_id uuid not null references public.difficulty_levels (id) on delete restrict,
  title text not null,
  prompt text not null,
  starter_code text not null default '',
  example_input text,
  example_output text,
  canonical_language text not null default 'python',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.problem_tags (
  problem_id uuid not null references public.problems (id) on delete cascade,
  learning_tag_id uuid not null references public.learning_tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (problem_id, learning_tag_id)
);

create table if not exists public.problem_test_cases (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  sort_order integer not null default 0,
  input_data text not null,
  expected_output text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.problem_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  problem_id uuid not null references public.problems (id) on delete cascade,
  language text not null default 'python',
  source_code text not null default '',
  status text not null default 'in_progress',
  passed boolean not null default false,
  tests_total integer not null default 0,
  tests_passed integer not null default 0,
  feedback_summary text,
  feedback_payload jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  finished_at timestamptz,
  duration_ms integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint problem_attempts_status_check
    check (status in ('in_progress', 'submitted', 'graded', 'error', 'abandoned')),
  constraint problem_attempts_counts_check
    check (
      tests_total >= 0
      and tests_passed >= 0
      and tests_passed <= tests_total
    ),
  constraint problem_attempts_duration_check
    check (duration_ms is null or duration_ms >= 0)
);

create table if not exists public.reviewer_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  topic_id uuid references public.topics (id) on delete set null,
  difficulty_id uuid references public.difficulty_levels (id) on delete set null,
  title text not null,
  summary text,
  body text not null,
  is_published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.topics enable row level security;
alter table public.difficulty_levels enable row level security;
alter table public.learning_tags enable row level security;
alter table public.profile_learning_tags enable row level security;
alter table public.problems enable row level security;
alter table public.problem_tags enable row level security;
alter table public.problem_test_cases enable row level security;
alter table public.problem_attempts enable row level security;
alter table public.reviewer_articles enable row level security;

drop policy if exists "Topics are publicly readable" on public.topics;
create policy "Topics are publicly readable"
on public.topics
for select
using (true);

drop policy if exists "Difficulty levels are publicly readable" on public.difficulty_levels;
create policy "Difficulty levels are publicly readable"
on public.difficulty_levels
for select
using (true);

drop policy if exists "Learning tags are publicly readable" on public.learning_tags;
create policy "Learning tags are publicly readable"
on public.learning_tags
for select
using (true);

drop policy if exists "Profile learning tags are readable by owner" on public.profile_learning_tags;
create policy "Profile learning tags are readable by owner"
on public.profile_learning_tags
for select
using (auth.uid() = profile_id);

drop policy if exists "Profile learning tags are insertable by owner" on public.profile_learning_tags;
create policy "Profile learning tags are insertable by owner"
on public.profile_learning_tags
for insert
with check (auth.uid() = profile_id);

drop policy if exists "Profile learning tags are deletable by owner" on public.profile_learning_tags;
create policy "Profile learning tags are deletable by owner"
on public.profile_learning_tags
for delete
using (auth.uid() = profile_id);

drop policy if exists "Published problems are readable by authenticated users" on public.problems;
create policy "Published problems are readable by authenticated users"
on public.problems
for select
using (auth.uid() is not null and is_published);

drop policy if exists "Problem tags are readable by authenticated users" on public.problem_tags;
create policy "Problem tags are readable by authenticated users"
on public.problem_tags
for select
using (auth.uid() is not null);

drop policy if exists "Problem attempts are readable by owner" on public.problem_attempts;
create policy "Problem attempts are readable by owner"
on public.problem_attempts
for select
using (auth.uid() = user_id);

drop policy if exists "Problem attempts are insertable by owner" on public.problem_attempts;
create policy "Problem attempts are insertable by owner"
on public.problem_attempts
for insert
with check (auth.uid() = user_id);

drop policy if exists "Problem attempts are updatable by owner" on public.problem_attempts;
create policy "Problem attempts are updatable by owner"
on public.problem_attempts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Problem attempts are deletable by owner" on public.problem_attempts;
create policy "Problem attempts are deletable by owner"
on public.problem_attempts
for delete
using (auth.uid() = user_id);

drop policy if exists "Published reviewer articles are readable by authenticated users" on public.reviewer_articles;
create policy "Published reviewer articles are readable by authenticated users"
on public.reviewer_articles
for select
using (auth.uid() is not null and is_published);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_topics_updated_at on public.topics;
create trigger set_topics_updated_at
before update on public.topics
for each row
execute function public.set_updated_at();

drop trigger if exists set_difficulty_levels_updated_at on public.difficulty_levels;
create trigger set_difficulty_levels_updated_at
before update on public.difficulty_levels
for each row
execute function public.set_updated_at();

drop trigger if exists set_learning_tags_updated_at on public.learning_tags;
create trigger set_learning_tags_updated_at
before update on public.learning_tags
for each row
execute function public.set_updated_at();

drop trigger if exists set_problems_updated_at on public.problems;
create trigger set_problems_updated_at
before update on public.problems
for each row
execute function public.set_updated_at();

drop trigger if exists set_problem_attempts_updated_at on public.problem_attempts;
create trigger set_problem_attempts_updated_at
before update on public.problem_attempts
for each row
execute function public.set_updated_at();

drop trigger if exists set_reviewer_articles_updated_at on public.reviewer_articles;
create trigger set_reviewer_articles_updated_at
before update on public.reviewer_articles
for each row
execute function public.set_updated_at();

create index if not exists problems_topic_id_idx on public.problems (topic_id);
create index if not exists problems_difficulty_id_idx on public.problems (difficulty_id);
create index if not exists problems_is_published_idx on public.problems (is_published);
create index if not exists problem_tags_learning_tag_id_idx on public.problem_tags (learning_tag_id);
create index if not exists problem_test_cases_problem_id_idx on public.problem_test_cases (problem_id);
create index if not exists problem_attempts_user_id_created_at_idx on public.problem_attempts (user_id, created_at desc);
create index if not exists problem_attempts_problem_id_created_at_idx on public.problem_attempts (problem_id, created_at desc);
create index if not exists reviewer_articles_topic_id_idx on public.reviewer_articles (topic_id);
create index if not exists reviewer_articles_difficulty_id_idx on public.reviewer_articles (difficulty_id);
create index if not exists reviewer_articles_is_published_idx on public.reviewer_articles (is_published);
