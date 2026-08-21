create table votes (
  id bigint generated always as identity primary key,
  entry_slug text not null,
  voter_id uuid not null,
  choice text not null check (choice in ('agree', 'disagree')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entry_slug, voter_id)
);

alter table votes enable row level security;

create policy "anon can insert votes"
  on votes for insert
  to anon
  with check (choice in ('agree', 'disagree'));

create policy "anon can update their own vote row"
  on votes for update
  to anon
  using (true)
  with check (choice in ('agree', 'disagree'));

grant select, insert, update on votes to anon, authenticated;

create policy "anon can select votes"
  on votes for select
  to anon
  using (true);

create view vote_counts as
  select entry_slug, choice, count(*) as votes
  from votes
  group by entry_slug, choice;

grant select on vote_counts to anon, authenticated;

