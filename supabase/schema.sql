-- YouTabbed stores only team-approved collaboration data in Supabase.
-- Open tabs, history, cookies, passwords and browser sessions remain local.
create extension if not exists pgcrypto;
create table public.team_spaces (id uuid primary key default gen_random_uuid(), name text not null, created_by uuid not null references auth.users(id), created_at timestamptz not null default now());
create table public.team_members (team_id uuid not null references public.team_spaces(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role text not null default 'member' check (role in ('owner','admin','member','viewer')), joined_at timestamptz not null default now(), primary key(team_id,user_id));
create table public.projects (id uuid primary key default gen_random_uuid(), team_id uuid not null references public.team_spaces(id) on delete cascade, name text not null, color text not null default '#1768ef', created_by uuid not null references auth.users(id), created_at timestamptz not null default now());
create table public.shared_favorites (id uuid primary key default gen_random_uuid(), team_id uuid not null references public.team_spaces(id) on delete cascade, project_id uuid references public.projects(id) on delete set null, title text not null check(char_length(title) between 1 and 240), url text not null check(char_length(url) between 1 and 2048), note text check(char_length(note)<=2000), tags text[] not null default '{}', added_by uuid not null references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create index shared_favorites_team_project_idx on public.shared_favorites(team_id,project_id,created_at desc);
alter table public.team_spaces enable row level security; alter table public.team_members enable row level security; alter table public.projects enable row level security; alter table public.shared_favorites enable row level security;
create or replace function public.is_team_member(requested_team uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.team_members where team_id=requested_team and user_id=auth.uid()) $$;
create policy "members read teams" on public.team_spaces for select using(public.is_team_member(id));
create policy "members read memberships" on public.team_members for select using(public.is_team_member(team_id));
create policy "members read projects" on public.projects for select using(public.is_team_member(team_id));
create policy "members create projects" on public.projects for insert with check(public.is_team_member(team_id) and created_by=auth.uid());
create policy "members read favorites" on public.shared_favorites for select using(public.is_team_member(team_id));
create policy "members create favorites" on public.shared_favorites for insert with check(public.is_team_member(team_id) and added_by=auth.uid());
create policy "members update favorites" on public.shared_favorites for update using(public.is_team_member(team_id)) with check(public.is_team_member(team_id));
alter publication supabase_realtime add table public.projects; alter publication supabase_realtime add table public.shared_favorites;
