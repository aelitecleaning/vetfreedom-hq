-- ─────────────────────────────────────────────────────────────────────────────
-- Military to Financial Freedom — Supabase schema
-- Run in the Supabase SQL editor. Row-level security is ON for every user table.
--
-- PRIVACY NOTE: we intentionally store NO sensitive PII — no SSNs, no VA file
-- numbers, no medical records or uploads. Claim tracking is stored client-side
-- (localStorage) in v1; only profile, membership, usage, and analytics live here.
-- ─────────────────────────────────────────────────────────────────────────────

-- Profiles: one row per auth user.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text,
  branch text,
  status text check (status in ('active','transitioning','out')),
  tier text not null default 'free' check (tier in ('free','playbook')),
  stripe_customer_id text,
  grandfathered_until timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are self-readable" on public.profiles;
create policy "profiles are self-readable"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles are self-updatable" on public.profiles;
create policy "profiles are self-updatable"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "profiles are self-insertable" on public.profiles;
create policy "profiles are self-insertable"
  on public.profiles for insert with check (auth.uid() = id);

-- On signup, create a profile row and (during the free launch) grandfather the
-- account for 90 days so early adopters keep full access when paid tiers turn on.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, tier, grandfathered_until)
  values (new.id, new.email, 'free', now() + interval '90 days')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Daily AI usage metering (free tier cap). One row per user per day.
create table if not exists public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default current_date,
  message_count int not null default 0,
  primary key (user_id, usage_date)
);

alter table public.ai_usage enable row level security;

drop policy if exists "ai usage is self-readable" on public.ai_usage;
create policy "ai usage is self-readable"
  on public.ai_usage for select using (auth.uid() = user_id);

-- Atomically increment and return today's count. Called from the chat route.
create or replace function public.increment_ai_usage(p_user uuid)
returns int
language plpgsql
security definer set search_path = public
as $$
declare
  new_count int;
begin
  insert into public.ai_usage (user_id, usage_date, message_count)
  values (p_user, current_date, 1)
  on conflict (user_id, usage_date)
  do update set message_count = public.ai_usage.message_count + 1
  returning message_count into new_count;
  return new_count;
end;
$$;

-- Privacy-light analytics events.
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event text not null,
  props jsonb not null default '{}'::jsonb,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;
-- Insert-only from clients; reads restricted to service role (dashboards).
drop policy if exists "anyone can insert events" on public.analytics_events;
create policy "anyone can insert events"
  on public.analytics_events for insert with check (true);

-- Public roadmap feature votes.
create table if not exists public.feature_votes (
  id bigint generated always as identity primary key,
  feature_key text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (feature_key, user_id)
);

alter table public.feature_votes enable row level security;
drop policy if exists "votes readable" on public.feature_votes;
create policy "votes readable" on public.feature_votes for select using (true);
drop policy if exists "auth users can vote" on public.feature_votes;
create policy "auth users can vote"
  on public.feature_votes for insert with check (auth.uid() = user_id);
