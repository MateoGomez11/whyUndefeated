---
description: "Task list for Página de Metodología"
---

# Tasks: Página de Metodología

**Input**: Design documents from `/specs/002-methodology-page/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/route.md, quickstart.md

**Tests**: INCLUIDOS — el plan (Technical Context) y la constitución (Principio IV) piden pruebas para la
única lógica real de esta feature (`lib/content/tiers.ts`) y para el comportamiento end-to-end de la
página nueva. Orden TDD: escribir la prueba primero (que falle), luego implementar.

**Organization**: Tareas agrupadas por historia de usuario. MVP = US1 (contenido de la página).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: US1 (contenido), US2 (link de nav)
- Rutas de archivo exactas incluidas en cada tarea

## Path Conventions

Se integra al proyecto Next.js App Router existente (`001-entries-directory`): `app/`, `components/`,
`lib/content/`, `tests/unit/`, `e2e/` en la raíz del repo — sin estructura nueva.

---

## Phase 1: Setup (Shared Infrastructure)

**No aplica.** Esta feature se integra al proyecto Next.js/Jest/Playwright ya existente — sin dependencias
nuevas, sin configuración nueva (ver plan.md § Technical Context: "sin dependencias nuevas"). Se pasa
directo a Foundational.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extraer el texto de los tiers a una fuente compartida (Clarification de la sesión
2026-08-17, FR-002) — bloquea a US1 porque la página de metodología necesita importar ese mismo texto, no
redefinirlo.

**⚠️ CRITICAL**: US1 no puede empezar hasta que `lib/content/tiers.ts` exista y `TierStats.tsx` lo use.

- [X] T001 [P] [TDD] Escribir prueba unitaria en `tests/unit/tiers.test.ts`: `TIERS` exporta exactamente 3
  elementos (`high`/`medium`/`low`), cada uno con `level` (reutilizando el tipo `ThreatLevel` de
  `lib/content/schema.ts`), `label`, `caption`, `shortCaption`, `color` y `glow` no vacíos — DEBE fallar
  primero (el módulo no existe)
- [X] T002 Implementar `lib/content/tiers.ts`: mover el array `TIERS` que hoy vive inline en
  `components/TierStats.tsx` (mismos 3 objetos, mismos valores de `label`/`caption`/`shortCaption`/
  `color`/`glow` — sin cambiar ni una palabra del copy) — hace pasar T001 (FR-002, data-model.md § Forma
  `Tier`)
- [X] T003 Refactorizar `components/TierStats.tsx` para importar `TIERS` desde `lib/content/tiers.ts` en
  vez de definirlo inline — sin cambios de JSX/estilos/comportamiento (mismo output visual). No lleva test
  nuevo: la regresión se valida corriendo la suite e2e existente que ya cubre `TierStats`
  (`e2e/directory.spec.ts`, `e2e/responsive.spec.ts`) — ver T009 en Polish

**Checkpoint**: `lib/content/tiers.ts` es la única fuente de verdad del texto de los tiers; la home sigue
viéndose y comportándose exactamente igual que antes del refactor.

---

## Phase 3: User Story 1 - Entender cómo se determina un veredicto de amenaza (Priority: P1) 🎯 MVP

**Goal**: Página en `/methodology` con las 4 secciones (Threat Tiers, Evidence Types, Content Integrity
Rule, Related Apps Grouping) descritas en el contrato de ruta.

**Independent Test**: Visitar `/methodology` directamente (sin pasar por el nav, que aún apunta a `#` en
esta fase) y verificar que las 4 secciones están presentes con el contenido correcto.

### Tests for User Story 1 (TDD — escribir primero, deben fallar)

- [X] T004 [P] [US1] E2E en `e2e/methodology.spec.ts` (proyecto `chromium`): visitar `/methodology` y
  verificar (a) las 4 secciones presentes en orden (Threat Tiers, Evidence Types, Content Integrity Rule,
  Related Apps Grouping); (b) los 3 niveles en Threat Tiers muestran el mismo `label` y `caption` que
  `lib/content/tiers.ts` (comparar contra el DOM de `/` para SC-002, igual que hace
  `e2e/detail.spec.ts` al comparar dos páginas); (c) Evidence Types lista los 3 tipos (traffic/usage
  stats, AI capability benchmarks, user migration signals) sin ningún enlace/cita a `content/entries/`; (d)
  sin scroll horizontal en los 3 breakpoints (375px/768px/1280px, reusando el patrón `test.use({viewport})`
  de `e2e/responsive.spec.ts`) — DEBE fallar primero (la ruta no existe, 404)
- [X] T005 [P] [US1] Agregar caso en `e2e/no-js.spec.ts` (proyecto `no-js`): `/methodology` con
  `javaScriptEnabled:false` — las 4 secciones son legibles y el contenido de texto está presente — DEBE
  fallar primero

### Implementation for User Story 1

- [X] T006 [US1] Implementar `app/methodology/page.tsx` (RSC, sin `"use client"`, SSG, sin
  `generateStaticParams` — ruta única): `generateMetadata`/`export const metadata` propio (title +
  description); sección Threat Tiers mapeando `TIERS` de `lib/content/tiers.ts` (label + caption, mismo
  orden alto→bajo); sección Evidence Types con 3 definiciones estáticas fijas (traffic/usage stats, AI
  capability benchmarks, user migration signals — solo definicional, sin leer `content/entries/`); sección
  Content Integrity Rule con el texto que refleja exactamente las reglas V1–V8/V1b de
  `specs/001-entries-directory/contracts/entry.schema.md` (≥1 fuente, `moatSourceIds` con integridad
  referencial, `challengers[].sourceId` debe existir, build bloquea nombrando campo+archivo); sección
  Related Apps Grouping explicando agrupación por `category`. Usa el `NavBar`/`Footer` compartidos (vía
  `app/layout.tsx`, sin renderizarlos de nuevo) y las clases/tokens de `app/globals.css` (`.page`,
  `.ds-label`, etc. — sin sistema de diseño paralelo) — hace pasar T004/T005 (FR-001, FR-002, FR-003,
  FR-004, FR-005, FR-007, FR-008, FR-009)

**Checkpoint**: US1 funcional y testeable de forma independiente visitando `/methodology` por URL directa.

---

## Phase 4: User Story 2 - Llegar a la metodología desde cualquier página (Priority: P2)

**Goal**: El link "Methodology" del header, que hoy apunta a `#`, lleva a `/methodology` desde cualquier
página del sitio.

**Independent Test**: Desde `/` o cualquier `/entries/{slug}`, clic en "Methodology" en el header navega a
`/methodology` (sin 404); funciona igual con JavaScript desactivado.

### Tests for User Story 2 (TDD — escribir primero, debe fallar)

- [X] T007 [US2] Agregar caso en `e2e/methodology.spec.ts`: desde `/`, clic en "Methodology" en el header
  navega a `/methodology` con status 200 (no 404); agregar el caso equivalente en `e2e/no-js.spec.ts`
  (clic funciona vía enlace real, sin manejador de cliente) — DEBE fallar primero (el link sigue
  apuntando a `#`, no navega)

### Implementation for User Story 2

- [X] T008 [US2] Editar `components/NavBar.tsx`: cambiar `{ label: 'Methodology', href: '#' }` a
  `href: '/methodology'` en el array `LINKS` — hace pasar T007 (FR-006)

**Checkpoint**: US1 y US2 funcionan juntas — cualquier visitante llega a la metodología en un clic desde
el header, en cualquier página del sitio.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Calidad transversal, regresión y verificación final

- [X] T009 [P] Correr la suite completa existente (`npm test` + `npx playwright test --project=chromium
  --project=no-js`) y confirmar que `e2e/directory.spec.ts` y `e2e/responsive.spec.ts` — que ya cubren
  `TierStats` en la home — siguen en verde sin cambios tras el refactor de T003 (regresión del Foundational)
- [X] T010 [P] Verificar presupuesto de rendimiento con Lighthouse en `/methodology` (Performance ≥90, LCP
  <2.5s, CLS <0.1, JS ≤30KB) — mismo presupuesto heredado de `001-entries-directory/research.md` Decisión 6
- [X] T011 [P] Revisión manual (no automatizable): comparar línea por línea el texto de la sección Content
  Integrity Rule contra la tabla V1–V8/V1b de `specs/001-entries-directory/contracts/entry.schema.md` —
  confirmar que ninguna afirmación de la página excede lo que el esquema realmente valida (SC-005)
- [X] T012 Ejecutar la validación de `quickstart.md` de punta a punta (escenarios 1–7)
- [X] T013 [P] Confirmar que no aparece ningún "confidence score" ni afirmación de validación aspiracional
  en el contenido nuevo (Principio I; mismo chequeo que T056 de `001-entries-directory`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no aplica — se pasa directo a Foundational
- **Foundational (Phase 2)**: sin dependencias externas — BLOQUEA a US1 (US1 necesita `lib/content/tiers.ts`)
- **US1 (Phase 3)**: depende de Foundational. Independiente de US2 en cuanto a *contenido* de la página
  (se puede visitar `/methodology` por URL directa sin que US2 esté hecho).
- **US2 (Phase 4)**: depende de que la ruta `/methodology` exista para que su test end-to-end sea
  verificable (clic → 200, no 404) — en la práctica va después de US1, aunque el cambio de código en sí
  (`NavBar.tsx`) es de una sola línea y no depende de los internals de US1.
- **Polish (Phase 5)**: depende de US1 y US2 completas.

### Within Each Phase

- Pruebas (TDD) escritas y en rojo ANTES de implementar.
- Foundational: test de `tiers.ts` antes de implementarlo; el refactor de `TierStats.tsx` no lleva test
  nuevo (se apoya en la suite e2e existente, verificada en Polish).
- Historia completa antes de pasar a la siguiente prioridad.

### Parallel Opportunities

- Foundational: T001 no tiene paralelos (es el único test de esta fase); T002/T003 son secuenciales entre
  sí (T003 depende de que T002 exista).
- US1: T004 y T005 en paralelo (archivos distintos: `e2e/methodology.spec.ts` y `e2e/no-js.spec.ts`).
- Polish: T009/T010/T011/T013 en paralelo entre sí (verificaciones independientes); T012 al final.

---

## Parallel Example: User Story 1

```bash
# Pruebas de US1 juntas (deben fallar primero):
Task: "e2e/methodology.spec.ts"
Task: "e2e/no-js.spec.ts (caso /methodology)"
```

---

## Implementation Strategy

### MVP First (solo US1)

1. Completar Phase 2 (Foundational — bloquea todo)
2. Completar Phase 3 (US1): la página existe y es correcta, aunque nadie pueda llegar a ella desde el nav
   todavía
3. **PARAR y VALIDAR**: visitar `/methodology` directamente y confirmar las 4 secciones
4. Deploy/demo si está listo (la URL ya funciona aunque el link del header no la exponga aún)

### Incremental Delivery

1. Foundational → `lib/content/tiers.ts` listo, `TierStats` sin regresión
2. + US1 (contenido de la página) → validar → deploy (MVP)
3. + US2 (link del nav) → validar → deploy
4. Polish (regresión, rendimiento, revisión de contenido, quickstart)

---

## Notes

- Tests obligatorios para la única lógica real (`tiers.ts`) y para el comportamiento e2e de la página
  nueva (Principio IV) — no se generan tests unitarios de renderizado de React porque el proyecto no tiene
  configurado un entorno de DOM/Testing Library en Jest (`jest.config.js` usa `testEnvironment: 'node'`,
  igual que el resto de `tests/unit/*.test.ts`, que testean datos/funciones puras, no componentes). La
  regresión visual de `TierStats` se valida con la suite Playwright existente, que sí renderiza en un
  navegador real — ver T009. Añadir React Testing Library sería una dependencia nueva no pedida por el plan
  ("sin dependencias nuevas" en Technical Context).
- [P] = archivos distintos, sin dependencias pendientes.
- Todo el contenido de la página se escribe en inglés (Principio V), igual que el resto del sitio.
- Commit tras cada tarea o grupo lógico; parar en cualquier checkpoint para validar.
