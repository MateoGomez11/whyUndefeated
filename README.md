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
app/                    # Routes: / (directory), /entries/[slug] (detail), not-found
components/             # Presentational components (ThreatBadge, EntryCard, EntryDetail, ...)
lib/content/            # Schema (Zod), loader, sort, slug, tally, related-apps logic
content/entries/        # Versioned entry content — the actual data
tests/                  # Jest: unit + integration (incl. fixtures for the validation gate)
e2e/                    # Playwright end-to-end specs
design-reference/       # Visual reference only — never imported by the app, excluded from deploy
```
