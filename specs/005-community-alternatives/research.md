# Research: Community Alternatives & Verified Challengers Architecture

**Feature**: `005-community-alternatives`  
**Date**: 2026-08-20  
**Status**: Completed  

---

## 1. Anti-Spam & Malicious Link Protection

### Decision
Implement a multi-layered defense in `/submit`:
1. **Strict Protocol & URL Validation**: Only `https://` and `http://` protocols are allowed. Disallow all `javascript:`, `data:`, `vbscript:`, IP-literal domains, and suspicious character sets.
2. **Honeypot Hidden Field**: A hidden CSS-styled input (`website_hp`) that real users cannot see or fill. If populated, the submission is silently dropped.
3. **Mandatory Moderation Quarantine**: Every new alternative is inserted with `status = 'pending'`. Anonymous visitors CANNOT read pending submissions via Supabase RLS.
4. **Link Hardening on Render**: Every outbound link is rendered with `target="_blank"` and `rel="noopener noreferrer nofollow"`.

### Rationale
Protects readers from phishing, malware, SEO spam, and malicious redirects while keeping the submission form friction-free (no complex captchas or mandatory account creation in MVP).

---

## 2. Database Schema & RLS Architecture (Supabase / Postgres)

### Decision
Create table `community_alternatives`:
- `id`: `uuid default gen_random_uuid() primary key`
- `target_slug`: `text` (nullable or `'general'`)
- `name`: `varchar(60) not null`
- `url`: `text not null`
- `icon`: `text` (emoji or small logo URL)
- `description`: `varchar(160) not null`
- `creator_email`: `text not null` (private)
- `status`: `text not null default 'pending' check (status in ('pending', 'approved', 'rejected'))`
- `is_verified`: `boolean not null default false`
- `created_at`: `timestamptz not null default now()`
- `updated_at`: `timestamptz not null default now()`

**Row Level Security (RLS)**:
- `SELECT`: `USING (status = 'approved')` for `anon` role. The `creator_email` column is excluded from public views or protected.
- `INSERT`: `WITH CHECK (true)` for `anon` role, strictly forcing `status = 'pending'` and `is_verified = false`.
- `UPDATE` / `DELETE`: Disallowed for `anon` role (admin only).

### Rationale
Ensures 100% data integrity, prevents private emails from leaking, and guarantees that unreviewed submissions are never exposed.

---

## 3. UI Layout & Desktop 2-Column Space Utilization

### Decision
1. **On `/entries/[slug]` (App Detail)**:
   - In the header/hero: A metric chip `"X Community Alternatives"` (e.g. `5 community alternatives`).
   - In the right-hand column on desktop (>1024px): A dedicated card panel titled `"Community Alternatives & Challengers"` with the vertical list of approved alternatives (Icon, Name, 1-line description, verified badge, and visit link).
   - Below the list: A subtle button `+ Submit an alternative to {appName}` leading to `/submit?target={slug}`.
2. **On `/alternatives` (Global Directory)**:
   - Full-width exploratory catalogue of all approved community alternatives across all categories, with target app badges, search/filter by name or company, and verified alternatives prioritized at the top.
3. **On `/submit`**:
   - Clean, focused form with target selector (including `"None / Independent Tool"`), inputs, and clear success screen.

### Rationale
Makes maximum use of the desktop right rail, separates official evidence-based challengers from user-submitted alternatives, and creates a clear discovery hub at `/alternatives`.
