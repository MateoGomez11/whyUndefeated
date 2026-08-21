# Tasks: Community Alternatives & Verified Challengers

**Feature**: `005-community-alternatives`  
**Status**: Completed  

---

## Phase 1: Setup & Foundational (Prerequisites)

- [X] T001 Create Supabase migration file `supabase/migrations/20260820000003_community_alternatives.sql` with schema, indices, and RLS policies
- [X] T002 [P] Define TypeScript interfaces and schemas in `lib/alternatives/types.ts`
- [X] T003 [P] Build URL sanitization, protocol checking, and anti-spam honeypot validator in `lib/alternatives/validation.ts`
- [X] T004 Build Supabase client helpers and resilient query functions in `lib/alternatives/client.ts`

---

## Phase 2: User Story 1 — Submit Alternative (`/submit`) & Anti-Spam (Priority: P1)

- [X] T005 [US1] Create submission API Route Handler / Server Action in `app/api/alternatives/submit/route.ts` with honeypot and moderation quarantine
- [X] T006 [US1] Build interactive submission form `components/alternatives/SubmitAlternativeForm.tsx` with target selector, validation, and success screen
- [X] T007 [US1] Create `/submit` page in `app/submit/page.tsx` with metadata, target pre-selection, and guidelines
- [X] T008 [P] [US1] Add unit tests for form validation and anti-spam in `tests/unit/submit-validation.test.ts`

---

## Phase 3: User Story 2 — Community Alternatives on App Detail (`/entries/[slug]`) (Priority: P1)

- [X] T009 [US2] Build `components/alternatives/CommunityAlternativesRail.tsx` for the right-hand column layout of app detail pages
- [X] T010 [US2] Integrate alternatives count chip and `CommunityAlternativesRail` in `app/entries/[slug]/page.tsx`
- [X] T011 [P] [US2] Add unit tests for right rail sorting (verified first) and empty state in `tests/unit/alternatives-rail.test.ts`

---

## Phase 4: User Story 3 — Global Alternatives Directory (`/alternatives`) (Priority: P1)

- [X] T012 [P] [US3] Build `components/alternatives/AlternativeCard.tsx` and `components/alternatives/AlternativesGrid.tsx` with target app badges
- [X] T013 [US3] Create page `app/alternatives/page.tsx` with search filter and category breakdown
- [X] T014 [US3] Ensure `components/NavBar.tsx` links `Alternatives` to `/alternatives` and `Submit` to `/submit`
- [X] T015 [P] [US3] Add unit tests for global directory sorting in `tests/unit/alternatives-directory.test.ts`

---

## Phase 5: User Story 4 — Verification & Resilience (Priority: P2)

- [X] T016 [US4] Add Playwright E2E tests for `/submit` flow, honeypot drop, and validation errors in `e2e/submit.spec.ts`
- [X] T017 [US4] Add Playwright E2E tests for `/alternatives` and `/entries/[slug]` right rail in `e2e/alternatives.spec.ts`
- [X] T018 Run full test suites (`npm test`, `npx playwright test`, `npm run build`) to verify 100% pass rate
