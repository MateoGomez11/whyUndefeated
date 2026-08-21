# Implementation Plan: Community Alternatives & Verified Challengers

**Feature**: `005-community-alternatives`  
**Branch**: `005-community-alternatives`  
**Date**: 2026-08-20  
**Status**: Ready for Tasks  

---

## Constitution Check & Gates

- [x] **Principio I (Integridad de Contenido)**: Las alternativas comunitarias están estrictamente separadas de los retadores oficiales y el moat basado en evidencia.
- [x] **Principio II (Contenido como Código)**: El contenido curado permanece en `content/entries/*.json`. Los envíos comunitarios dinámicos se almacenan exclusivamente en Supabase PostgreSQL (`community_alternatives`).
- [x] **Principio III (Rendimiento & Server First)**: Server Components por defecto, carga rápida, enlaces seguros, y resiliencia total si Supabase se desconecta.
- [x] **Principio IV (Pruebas Primero)**: Pruebas unitarias en Jest (validación de formulario, anti-spam, sanitización) y pruebas E2E en Playwright (`/submit`, `/alternatives`, `/entries/[slug]`).
- [x] **Principio V (Plantilla y Copys en Inglés)**: Toda la interfaz, formularios y componentes en inglés consistente.
- [x] **Principio VI (Seguridad & Privacidad)**: Moderación previa (`status = 'pending'`), RLS habilitado, honeypot anti-spam, y correos de creadores nunca expuestos al público.

---

## Technical Context

- **Framework**: Next.js 15 App Router (React Server Components + Client Islands for Forms).
- **Storage**: Supabase Postgres (`community_alternatives` table).
- **Navigation**: NavBar links `Alternatives` (`/alternatives`) and `Submit` (`/submit`).
- **Styling**: Cyber-terminal CSS variables (`var(--bg-1)`, `var(--brand-500)`, `var(--threat-low)`).
- **Testing**: Jest unit tests (`tests/unit/alternatives.test.ts`) + Playwright E2E (`e2e/alternatives.spec.ts`, `e2e/submit.spec.ts`).

---

## Architecture & Implementation Phases

### Phase 1: Data Model & Supabase Client Layer
1. Create Supabase migration / SQL definition for `community_alternatives` with RLS.
2. Define TypeScript types in `lib/alternatives/types.ts`.
3. Build database query and submission client helper in `lib/alternatives/client.ts` with graceful fallback and URL sanitization.

### Phase 2: Submission Page (`/submit`) & Anti-Spam
1. Create `app/submit/page.tsx` with target selector (7 seed apps + "None / Independent Tool").
2. Build interactive form `components/alternatives/SubmitAlternativeForm.tsx` with:
   - Real-time client-side validation (HTTPS check, character limits).
   - Honeypot hidden input.
   - Immediate feedback / success confirmation view.
   - Verification tier request option.
3. Create Server Action / API Route handler in `app/api/alternatives/submit/route.ts`.

### Phase 3: Global Directory Page (`/alternatives`)
1. Create `app/alternatives/page.tsx` with metadata, search filter, and category grouping.
2. Build `components/alternatives/AlternativesList.tsx` and `components/alternatives/AlternativeCard.tsx`.
3. Display verified alternatives in the #1 spot with purple verification badge.

### Phase 4: App Detail Integration (`/entries/[slug]`)
1. In `app/entries/[slug]/page.tsx`, fetch approved alternatives for the target slug.
2. Render `"X Community Alternatives"` badge in the entry summary.
3. Render the `"Community Alternatives & Challengers"` vertical list on the desktop right-hand column.
4. Provide clean CTA: `+ Submit an alternative to {appName}`.

### Phase 5: Automated Testing & Verification
1. Jest unit tests for URL validation, anti-spam sanitization, and fallback behavior.
2. Playwright E2E tests for `/submit` flow, `/alternatives` navigation, and `/entries/[slug]` right-rail layout.
