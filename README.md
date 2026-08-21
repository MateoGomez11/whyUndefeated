# whyUndefeated

An evidence-based threat-level tracker: is AI actually replacing the apps and platforms people use every
day? Every claim ships with a source. No invented scores, no "confidence %" — see
`specs/001-entries-directory/spec.md` for the full feature spec and constitution principles behind that
rule.

## Stack

Next.js (App Router) + TypeScript, statically generated. Content lives in versioned JSON files, not a
database — see [Content format](#content-format) below. No client-side data fetching; pages are readable
with JavaScript disabled.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Supabase Setup (Community Voting)

Community voting on entry detail pages uses Supabase (PostgreSQL). To enable live voting locally or in production:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your project URL and public anon key from your Supabase project settings (`Settings -> API`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Apply the database migration in `supabase/migrations/0001_votes.sql` via the Supabase SQL Editor or CLI (`supabase db push`).

> Note: Running `npm test`, `npm run build`, and `npm run test:e2e` does not require Supabase credentials (tests use network/client mocks, and pages are SSG). If credentials are not configured, the voting widget degrades gracefully to an unavailable status without breaking page rendering.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build. Reads and validates every file in `content/entries/`; **fails the build** if any entry is missing a required field or has a dangling source reference |
| `npm run start` | Serve the production build (run `build` first) |
| `npm test` | Jest — schema/loader validation, sort, slug, tally, related-apps logic |
| `npm run test:e2e` | Playwright — end-to-end scenarios, including a `javaScriptEnabled: false` pass for both the home and detail pages |
| `npm run lint` | ESLint |

## Content format

Each entry is one JSON file at `content/entries/{slug}.json`. The filename (minus `.json`) must match the
entry's `slug`. Schema and full validation contract: `specs/001-entries-directory/contracts/entry.schema.md`.

```jsonc
{
  "slug": "pinterest",           // kebab-case, must match the filename
  "appName": "Pinterest",
  "threatLevel": "low",          // "low" | "medium" | "high"
  "category": "Content",         // "Social" | "Content" | "Knowledge" | "Community"
  "summary": "One-line summary shown on the home card.",
  "moat": "Paragraph explaining why AI hasn't replaced this app yet.",
  "moatSourceIds": ["s1"],       // at least one id, must exist in `sources`
  "challengers": [                // optional — omit or leave empty if there are none
    { "name": "...", "evidence": "One-line evidence.", "sourceId": "s2" }
  ],
  "sources": [                    // at least one
    { "id": "s1", "label": "...", "url": "https://..." },
    { "id": "s2", "label": "...", "url": "https://..." }
  ]
}
```

Rules enforced at build time (naming both the field and the file on failure):

- `threatLevel` and `category` are required and must be one of the listed enum values.
- `moat` and at least one `sources` entry are required.
- `moatSourceIds` must have at least one id, and every id (there and in each challenger's `sourceId`) must
  exist in that entry's `sources`.
- Challengers are optional at the entry level, but any challenger that is present must cite a source.

## Project structure

```
app/                    # Routes: / (directory), /entries/[slug] (detail), /methodology, not-found
components/             # UI components (ThreatBadge, EntryCard, EntryDetail, VoteWidget, ...)
lib/content/            # Content schema (Zod), loader, sort, slug, tally, related-apps logic
lib/votes/              # Client & voter ID logic for community voting
content/entries/        # Versioned entry content — the actual data
supabase/               # Database migrations (0001_votes.sql)
tests/                  # Jest: unit + integration (schema, loader, votes client, voterId)
e2e/                    # Playwright end-to-end specs (directory, detail, methodology, responsive, voting, no-js)
design-reference/       # Visual reference only — never imported by the app, excluded from deploy
```
