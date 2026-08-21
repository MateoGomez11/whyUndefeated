# Data Model: Community Alternatives & Verified Challengers

**Feature**: `005-community-alternatives`  
**Date**: 2026-08-20  

---

## 1. Supabase Postgres Schema (`community_alternatives`)

```sql
create table public.community_alternatives (
  id uuid primary key default gen_random_uuid(),
  target_slug text, -- null or 'general' if independent tool, or valid app slug like 'wikipedia'
  name varchar(60) not null,
  url text not null,
  icon text, -- emoji or valid https image URL
  description varchar(160) not null,
  creator_email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indices
create index idx_community_alternatives_target_status
  on public.community_alternatives (target_slug, status, is_verified desc, created_at desc);

create index idx_community_alternatives_global
  on public.community_alternatives (status, is_verified desc, created_at desc);

-- Row Level Security
alter table public.community_alternatives enable row level security;

-- Public read access: ONLY approved entries
create policy "Allow anonymous read for approved alternatives"
  on public.community_alternatives
  for select
  to anon, authenticated
  using (status = 'approved');

-- Public insert access: Any visitor can submit (defaults to pending)
create policy "Allow anonymous submission of alternatives"
  on public.community_alternatives
  for insert
  to anon, authenticated
  with check (status = 'pending' and is_verified = false);
```

---

## 2. TypeScript Types (`lib/alternatives/types.ts`)

```ts
export type AlternativeStatus = 'pending' | 'approved' | 'rejected';

export interface CommunityAlternative {
  id: string;
  target_slug?: string | null;
  target_name?: string | null;
  name: string;
  url: string;
  icon?: string | null;
  description: string;
  is_verified: boolean;
  created_at: string;
}

export interface SubmissionPayload {
  target_slug?: string | null;
  name: string;
  url: string;
  icon?: string | null;
  description: string;
  creator_email: string;
  is_verified_request?: boolean;
  honeypot?: string;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  id?: string;
}
```
