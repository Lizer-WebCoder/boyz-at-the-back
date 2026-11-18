-- ============================================================
-- Boyz at the Back - Full Supabase Schema
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  inmate_id text unique not null default lpad((floor(random() * 90000) + 10000)::text, 5, '0'),
  status text not null default 'on_parole'
    check (status in ('in_the_yard', 'solitary', 'out_on_bail', 'on_parole')),
  custom_status text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- ROLES
-- ------------------------------------------------------------
create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  color text not null default '#FF5F1F',
  position int not null default 0,
  permissions jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.user_roles (
  user_id uuid references public.profiles(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  primary key (user_id, role_id)
);

-- ------------------------------------------------------------
-- CATEGORIES ("Wings") & CHANNELS ("Cell Blocks" / "Payphones")
-- ------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  position int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.channels (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  type text not null check (type in ('text', 'voice')),
  is_private boolean default false,
  position int not null default 0,
  topic text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- MESSAGES + REACTIONS + THREADS
-- ------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid references public.channels(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete set null,
  content text,
  media_urls text[],
  reply_to_id uuid references public.messages(id) on delete set null,
  thread_id uuid,
  is_edited boolean default false,
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.message_reactions (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references public.messages(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now(),
  unique(message_id, user_id, emoji)
);

create table if not exists public.threads (
  id uuid primary key default uuid_generate_v4(),
  parent_message_id uuid references public.messages(id) on delete cascade,
  channel_id uuid references public.channels(id) on delete cascade,
  title text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- DIRECT MESSAGES
-- ------------------------------------------------------------
create table if not exists public.dm_channels (
  id uuid primary key default uuid_generate_v4(),
  is_group boolean default false,
  name text,
  created_at timestamptz default now()
);

create table if not exists public.dm_participants (
  dm_channel_id uuid references public.dm_channels(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (dm_channel_id, user_id)
);

create table if not exists public.dm_messages (
  id uuid primary key default uuid_generate_v4(),
  dm_channel_id uuid references public.dm_channels(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  content text,
  media_urls text[],
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- FRIENDSHIPS ("Cellmate Requests")
-- ------------------------------------------------------------
create table if not exists public.friendships (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid references public.profiles(id) on delete cascade,
  addressee_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz default now(),
  unique(requester_id, addressee_id)
);

-- ------------------------------------------------------------
-- VOICE PARTICIPANTS ("Payphones")
-- ------------------------------------------------------------
create table if not exists public.voice_participants (
  channel_id uuid references public.channels(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  is_muted boolean default false,
  is_deafened boolean default false,
  joined_at timestamptz default now(),
  primary key (channel_id, user_id)
);

-- ------------------------------------------------------------
-- LOCKDOWN MODE
-- ------------------------------------------------------------
create table if not exists public.channel_lockdowns (
  channel_id uuid primary key references public.channels(id) on delete cascade,
  locked_by uuid references public.profiles(id),
  locked_at timestamptz default now(),
  reason text
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
create index if not exists idx_messages_channel_created
  on public.messages(channel_id, created_at desc);
create index if not exists idx_messages_author
  on public.messages(author_id);
create index if not exists idx_dm_messages_channel
  on public.dm_messages(dm_channel_id, created_at desc);
create index if not exists idx_friendships_users
  on public.friendships(requester_id, addressee_id);

-- ------------------------------------------------------------
-- TRIGGER: auto-create profile on signup
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, inmate_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'inmate_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'Fresh Fish'),
    lpad((floor(random() * 90000) + 10000)::text, 5, '0')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.message_reactions enable row level security;
alter table public.threads enable row level security;
alter table public.dm_channels enable row level security;
alter table public.dm_participants enable row level security;
alter table public.dm_messages enable row level security;
alter table public.friendships enable row level security;
alter table public.voice_participants enable row level security;
alter table public.channel_lockdowns enable row level security;

-- Profiles
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Categories & Channels (open for now – tighten with roles later)
create policy "Authenticated can read categories"
  on public.categories for select to authenticated using (true);

create policy "Authenticated can read channels"
  on public.channels for select to authenticated using (true);

create policy "Authenticated can create channels"
  on public.channels for insert to authenticated with check (true);

-- Messages
create policy "Authenticated can read messages"
  on public.messages for select to authenticated using (true);

create policy "Users can insert own messages"
  on public.messages for insert to authenticated
  with check (auth.uid() = author_id);

create policy "Users can update own messages"
  on public.messages for update using (auth.uid() = author_id);

create policy "Users can delete own messages"
  on public.messages for delete using (auth.uid() = author_id);

-- Reactions
create policy "Authenticated can read reactions"
  on public.message_reactions for select to authenticated using (true);

create policy "Users can manage own reactions"
  on public.message_reactions for all using (auth.uid() = user_id);

-- Roles (read-only for now)
create policy "Authenticated can read roles"
  on public.roles for select to authenticated using (true);

create policy "Authenticated can read user_roles"
  on public.user_roles for select to authenticated using (true);

-- Friendships
create policy "Users can see own friendships"
  on public.friendships for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can create friendship requests"
  on public.friendships for insert to authenticated
  with check (auth.uid() = requester_id);

create policy "Users can update own friendship rows"
  on public.friendships for update using (
    auth.uid() = requester_id or auth.uid() = addressee_id
  );

-- Voice
create policy "Authenticated can manage voice presence"
  on public.voice_participants for all to authenticated using (true);

-- Lockdowns
create policy "Authenticated can read lockdowns"
  on public.channel_lockdowns for select to authenticated using (true);

-- ------------------------------------------------------------
-- REALTIME
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.message_reactions;
alter publication supabase_realtime add table public.voice_participants;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.channel_lockdowns;
alter publication supabase_realtime add table public.channels;
alter publication supabase_realtime add table public.categories;

-- ------------------------------------------------------------
-- SEED DATA
-- ------------------------------------------------------------
insert into public.roles (name, color, position) values
  ('Warden', '#FF5F1F', 100),
  ('Shot Caller', '#FF8C42', 80),
  ('Lifer', '#A0A0A0', 50),
  ('Fresh Fish', '#4A90D9', 10)
on conflict do nothing;

insert into public.categories (name, position) values
  ('Maximum Security', 0),
  ('The Yard', 1),
  ('Visitation', 2)
on conflict do nothing;

-- Insert default channels after categories exist
do $$
declare
  max_sec uuid;
  yard uuid;
  visit uuid;
begin
  select id into max_sec from public.categories where name = 'Maximum Security' limit 1;
  select id into yard from public.categories where name = 'The Yard' limit 1;
  select id into visit from public.categories where name = 'Visitation' limit 1;

  if max_sec is not null then
    insert into public.channels (category_id, name, type, position) values
      (max_sec, 'general-population', 'text', 0),
      (max_sec, 'solitary-chat', 'text', 1),
      (max_sec, 'block-a-payphone', 'voice', 2)
    on conflict do nothing;
  end if;

  if yard is not null then
    insert into public.channels (category_id, name, type, position) values
      (yard, 'the-yard', 'text', 0),
      (yard, 'weight-pile', 'text', 1),
      (yard, 'yard-payphone', 'voice', 2)
    on conflict do nothing;
  end if;

  if visit is not null then
    insert into public.channels (category_id, name, type, position) values
      (visit, 'visitation-room', 'text', 0),
      (visit, 'lawyer-calls', 'voice', 1)
    on conflict do nothing;
  end if;
end $$;

-- Done
select 'Boyz at the Back schema applied successfully' as status;
