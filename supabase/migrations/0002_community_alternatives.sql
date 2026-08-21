create table if not exists community_alternatives (
  id uuid primary key default gen_random_uuid(),
  target_slug text,
  name varchar(60) not null,
  url text not null,
  icon text,
  description varchar(160) not null,
  creator_email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indices
create index if not exists idx_community_alternatives_target_status
  on community_alternatives (target_slug, status, is_verified desc, created_at desc);

create index if not exists idx_community_alternatives_global
  on community_alternatives (status, is_verified desc, created_at desc);

-- Row Level Security
alter table community_alternatives enable row level security;

-- Public read access: ONLY approved entries
create policy "Allow anonymous read for approved alternatives"
  on community_alternatives
  for select
  to anon, authenticated
  using (status = 'approved');

-- Public insert access: Any visitor can submit (strictly forced to pending & unverified)
create policy "Allow anonymous submission of alternatives"
  on community_alternatives
  for insert
  to anon, authenticated
  with check (status = 'pending' and is_verified = false);

grant select, insert on community_alternatives to anon, authenticated;
