# WhyUndefeated Design System

## Context
WhyUndefeated is a dark, developer-culture website that tracks how close AI is to
replacing well-known social/content platforms (Pinterest, Wikipedia, Reddit, Twitter/X,
TikTok, Goodreads, LinkedIn, and more). Each tracked app gets a **threat-level verdict**
(High / Medium / Low) backed by evidence: traffic & usage stats, AI capability
benchmarks, and user-migration signals. A light community layer lets readers
agree/disagree with each verdict.

Built from scratch for this project — no existing codebase, Figma file, or brand asset
library was provided. All tokens, components, and copy voice below were originated here
per the brief and follow-up answers gathered at kickoff.

**Voice:** objective analyst ("Wikipedia shows early signs of decline," not "we think...").
**Aggregate counter:** a live tally derived from entry data (e.g. "3 High / 2 Medium / 2
Low"), not an editorial index score.

## Index
- `styles.css` — root stylesheet, imports everything under `tokens/`
- `tokens/` — colors, typography, spacing, fonts, effects/motion (CSS custom properties)
- `components/` — reusable React primitives, grouped by concern:
  - `core/` — Button, Badge, Card
  - `data/` — ThreatBadge, StatCounter
  - `forms/` — FilterPill, SearchInput
  - `feedback/` — VoteWidget
  - `navigation/` — NavBar, Footer
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `ui_kits/whyundefeated/` — homepage (tracker grid) + app detail page, wired together
  and click-through in `index.html`
- `SKILL.md` — portable skill file for Claude Code / other agent tools

### Intentional additions
No component inventory was provided by a source, so the primitive set was authored from
the product brief: Button, Badge, Card, ThreatBadge, StatCounter, FilterPill,
SearchInput, VoteWidget, NavBar, Footer — sized to what the two built screens need, not
a generic kit.

## Content fundamentals
- **Tone:** confident, premium, slightly mysterious. Data-dense but scannable — every
  verdict is a claim plus evidence, never a bare opinion.
- **Voice:** objective analyst, third-person about the platforms ("Reddit's threads are
  exactly the messy, human-authored data AI labs pay to train on"). Never "we think" or
  breathless hype language.
- **Casing:** sentence case for headlines and body copy; UPPERCASE tracked-out mono for
  labels, badges, and section eyebrows (`AI REPLACEMENT TRACKER`, `HIGH THREAT`).
- **Verdicts are falsifiable claims, not vibes** — every verdict pairs with 2–3 evidence
  items tagged by type (traffic/usage stats, AI capability benchmark, user migration
  signal).
- **No emoji anywhere.** The developer-culture register uses monospace punctuation
  (`→`, `/`, a blinking cursor) instead.
- **Category is metadata, not editorializing** — Content / Knowledge / Community /
  Social labels are neutral-toned, never color-coded (that would compete with the
  threat-badge semantic system).

## Visual foundations
- **Palette:** near-black cool-toned background (`--bg-0 #0a0a0f`) with three raised
  surface levels for panels/cards/hover. One decorative accent — electric violet
  (`--brand-500 #8b5cf6`) — used for links, active states, focus, glow. Threat-tier
  colors (red/orange, amber, green) are a **strictly semantic, independent system**:
  never reused decoratively.
- **Type:** Space Grotesk for headlines/body (bold, confident, geometric sans).
  JetBrains Mono for data, labels, badges, and UI chrome — reinforces the "technical
  verdict" feeling. Uppercase mono labels get `+0.08em` tracking.
- **Shape language:** sharp-to-barely-rounded corners (2–4px). Thin 1px borders in muted
  violet-gray (`--border-subtle/default/strong`), never heavy drop shadows — depth comes
  from a violet glow (`--glow-hover`, `--glow-active`) on hover/active states.
- **Backgrounds:** flat, no gradients, no imagery-heavy hero. The one hero visual is the
  live tally counter (StatCounter). Full-bleed treatments are reserved for the nav/footer
  bands only.
- **Motion:** odometer-style count-up on StatCounter, glow-pulse on card hover, fade +
  10px slide-in on scroll-into-view (`ds-fade-in`), a blinking-cursor motif after key
  headlines (`ds-cursor`). Standard easing `cubic-bezier(0.2, 0.8, 0.2, 1)`, ~200ms for
  micro-interactions, ~420ms for entrance.
- **Hover/press states:** hover adds a 1px violet border + soft glow (no color swap on
  backgrounds); press/active intensifies the glow. Disabled states drop to
  `--fg-disabled` text on `--bg-3`, no border color change.
- **Transparency/blur:** none in this v1 — surfaces are opaque flat panels. Glow effects
  use `box-shadow` with alpha, not backdrop blur.
- **Cards:** `--bg-2` fill, 1px `--border-subtle`, `--radius-md` (4px), no shadow at
  rest; border brightens to violet + glow on hover for clickable cards.
- **Imagery:** none provided. App "logos" in the tracker are monospace initials in a
  bordered square placeholder — swap for real product marks when available.

## Iconography
No icon set was provided. The site currently uses **no icon glyphs** — unicode
characters (`▲` `▼` `←` `/`) stand in for vote arrows, back-navigation, and the search
shortcut hint, consistent with the developer-culture, keyboard-driven tone. If a real
icon need arises (e.g. a settings gear, external-link glyph), substitute a CDN set with
a thin 1.5px stroke weight to match the site's hairline-border aesthetic — Lucide is a
good match — and document the substitution here.

## Logo
No logo/mark was provided. The wordmark is plain mono type: `why` in `--fg-primary` +
`undefeated` in `--brand-500`, with the blinking-cursor motif after it. No mark was
invented — if a real logo is designed later, drop it into `assets/` and update
`NavBar.jsx`.

## Fonts
Space Grotesk and JetBrains Mono are loaded via a Google Fonts `@import` in
`tokens/fonts.css` (not self-hosted binaries) — both are exact matches to the brief, no
substitution needed.

## Sources
None — built from the product brief and ask_user answers gathered at project kickoff (no
codebase, Figma file, or existing brand assets were attached).
