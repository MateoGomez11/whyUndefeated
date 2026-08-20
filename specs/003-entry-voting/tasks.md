---
description: "Task list for Votación de Veredicto en el Detalle de Entrada"
---

# Tasks: Votación de Veredicto en el Detalle de Entrada

**Input**: Design documents from `/specs/003-entry-voting/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/votes-api.md, quickstart.md

**Tests**: INCLUIDOS — el plan (Technical Context) y la constitución (Principio IV) piden pruebas para la
lógica pura nueva (`lib/votes/*`) y para el comportamiento end-to-end del widget de voto (votar, cambiar
voto, degradación sin Supabase). Orden TDD: escribir la prueba primero (que falle), luego implementar.

**Organization**: Tareas agrupadas por historia de usuario. MVP = US1 (votar y ver el conteo).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: US1 (votar y ver el conteo), US2 (la página resiste si Supabase no responde)
- Rutas de archivo exactas incluidas en cada tarea

## Path Conventions

Se integra al proyecto Next.js App Router existente: `app/`, `components/`, `lib/`, `tests/unit/`, `e2e/`
en la raíz del repo, más `supabase/migrations/` (nuevo, SQL versionado — ver plan.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencia nueva, variables de entorno, y el SQL de la migración versionado en el repo.

- [ ] T001 [P] Agregar `@supabase/supabase-js` a `package.json` (única dependencia nueva del proyecto —
  ver research.md Decisión 1) y correr `npm install`
- [ ] T002 [P] Crear `.env.example` (no existe todavía en el repo) con `NEXT_PUBLIC_SUPABASE_URL` y
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` como placeholders documentados — ya cubierto por `.gitignore`
  (`.env*` con excepción de `.env.example`)
- [ ] T003 [P] Escribir `supabase/migrations/0001_votes.sql`: tabla `votes` (con `UNIQUE (entry_slug,
  voter_id)`), políticas RLS (insert/update para `anon`, sin select), y vista `vote_counts` con
  `GRANT SELECT ... TO anon` — contenido exacto en data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Esquema real en Supabase + los dos módulos de lógica pura (`lib/votes/*`) que tanto US1 como
US2 necesitan.

**⚠️ CRITICAL**: Ninguna historia de usuario puede completarse de verdad hasta que este esquema exista en
el proyecto Supabase real — aunque los tests automatizados (Jest + Playwright con mocks) no lo requieren.

- [ ] T004 Aplicar `supabase/migrations/0001_votes.sql` contra el proyecto Supabase real, vía las
  herramientas del MCP de Supabase (requiere que la sesión haya recargado el toolset tras la
  autenticación — ver conversación) o, si no está disponible, corriendo el SQL manualmente en el SQL
  Editor del proyecto. Confirmar con una consulta real (no solo "el SQL no dio error") que `votes`,
  `vote_counts` y las políticas RLS existen — quickstart.md Prerrequisito
- [ ] T005 [P] [TDD] Escribir prueba unitaria en `tests/unit/voterId.test.ts`: dado un `Storage` mockeado
  vacío, genera y persiste un UUID nuevo; dado un `Storage` que ya tiene uno guardado, lo reutiliza sin
  generar otro — DEBE fallar primero (el módulo no existe)
- [ ] T006 Implementar `lib/votes/voterId.ts`: `getOrCreateVoterId(storage: Storage): string` — recibe el
  storage inyectado (no accede a `window.localStorage` directamente, para ser testeable sin jsdom) — hace
  pasar T005 (research.md Decisión 5, FR-004)
- [ ] T007 [P] [TDD] Escribir prueba unitaria en `tests/unit/votes-client.test.ts`: con un cliente de
  Supabase mockeado, `fetchVoteCounts` devuelve `{agree, disagree}` a partir de filas de `vote_counts`
  (tratando ausencia de fila como 0) y devuelve `null` ante cualquier error; `castVote` hace upsert con
  `onConflict: 'entry_slug,voter_id'` y devuelve `true`/`false` según éxito — DEBE fallar primero
- [ ] T008 Implementar `lib/votes/client.ts`: `fetchVoteCounts(supabase, slug)` y
  `castVote(supabase, slug, voterId, choice)` conforme al contrato de `contracts/votes-api.md` — hace
  pasar T007 (FR-006, FR-011, FR-013)

**Checkpoint**: Esquema real verificado en Supabase + `lib/votes/*` testeado y listo — las historias de
usuario pueden empezar.

---

## Phase 3: User Story 1 - Reaccionar al veredicto de una entrada (Priority: P1) 🎯 MVP

**Goal**: Widget de voto en `/entries/{slug}` junto al `ThreatBadge`: votar, ver el conteo actualizarse,
cambiar de opción, y que el voto persista entre recargas.

**Independent Test**: Abrir cualquier `/entries/{slug}`, votar "Agree", ver el contador subir; hacer clic
en "Disagree", ver el conteo moverse de una opción a la otra; recargar la página y ver que el voto sigue
marcado como activo.

### Tests for User Story 1 (TDD — escribir primero, deben fallar)

- [ ] T009 [P] [US1] E2E en `e2e/voting.spec.ts` (proyecto `chromium`, con la red de Supabase mockeada
  vía `page.route()` — sin depender de un proyecto real): (a) votar "Agree" en una entrada con 0 votos y
  ver el contador subir a 1 en la UI (SC-001); (b) tras votar "Agree", hacer clic en "Disagree" y ver el
  conteo moverse (Acceptance Scenario 2 de US1, FR-002/FR-003); (c) recargar la página con el mismo
  `localStorage` y ver que el voto del visitante sigue marcado (FR-004); (d) con JS desactivado (proyecto
  `no-js`), confirmar que el resto de la página (veredicto, retadores, moat, fuentes, related apps) sigue
  legible y que el widget de voto simplemente no aparece interactivo (Acceptance Scenario 4, FR-009) —
  DEBE fallar primero (`VoteWidget` no existe)

### Implementation for User Story 1

- [ ] T010 [US1] Implementar `components/VoteWidget.tsx` (`"use client"` — el ÚNICO del repo): al montar,
  obtiene `voterId` (`lib/votes/voterId.ts` + `window.localStorage`) y llama `fetchVoteCounts`; renderiza
  dos opciones ("Agree"/"Disagree") con conteo visible y resalta la elección actual del visitante si ya
  votó; al hacer clic, llama `castVote` (upsert) y actualiza el conteo mostrado de forma optimista. Valida
  que `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` existan antes de crear el cliente —
  contrato completo (5 estados) en `contracts/votes-api.md` — hace pasar T009 (FR-001, FR-002, FR-003)
- [ ] T011 [US1] Editar `components/EntryDetail.tsx`: montar `<VoteWidget slug={entry.slug} />`
  inmediatamente después de `<ThreatBadge level={entry.threatLevel} />`, dentro del mismo contenedor
  `maxWidth: 620` del header — mismo lugar en las 7 entradas, sin excepciones (FR-001, Principio V)

**Checkpoint**: US1 funcional y testeable de forma independiente — votar, ver el conteo, cambiar de
opción, persistencia entre recargas.

---

## Phase 4: User Story 2 - La página sigue funcionando si el almacén de votos no responde (Priority: P2)

**Goal**: Si Supabase no responde (o faltan las credenciales), la página de detalle carga completa e
igual de legible; el widget de voto degrada a un estado claro de "no disponible" sin romper nada.

**Independent Test**: Interceptar con `page.route()` las requests a Supabase y forzarlas a fallar; abrir
`/entries/{slug}` y confirmar que todo el contenido principal carga normal y que el widget muestra un
mensaje de no disponible en vez de un error roto o una excepción visible.

### Tests for User Story 2 (TDD — escribir primero, deben fallar si el guard aún no existe)

- [ ] T012 [P] [US2] Agregar casos en `e2e/voting.spec.ts`: (a) con **todas** las requests a Supabase
  interceptadas para fallar (timeout/5xx), abrir `/entries/{slug}` y verificar que veredicto, retadores,
  moat, fuentes y related apps cargan sin ningún error visible en el contenido principal, y que el widget
  muestra el estado "no disponible" (US2 Acceptance Scenario 1, SC-002); (b) con la lectura de conteos
  funcionando pero la escritura (`castVote`) interceptada para fallar, hacer clic en "Agree" y verificar
  que aparece un mensaje no intrusivo de que el voto no se registró, y que el conteo mostrado NO queda
  incrementado de forma fantasma (US2 Acceptance Scenario 2, FR-008) — correr contra el `VoteWidget` de
  T010; si algún caso ya pasa porque T010 fue suficientemente defensivo, documentarlo como tal en vez de
  forzar un rojo artificial

### Implementation for User Story 2

- [ ] T013 [US2] Revisar/reforzar `components/VoteWidget.tsx` a partir de los resultados de T012: confirmar
  que el guard de variables de entorno ausentes entra en el mismo estado "no disponible" que un fallo de
  red (research.md Decisión 9); confirmar que un fallo de `castVote` revierte cualquier actualización
  optimista del conteo (no debe quedar un conteo mostrado que no corresponde a lo realmente guardado —
  Edge Case de spec.md) — hace pasar T012 (FR-007, FR-008)

**Checkpoint**: US1 y US2 funcionan juntas — votar funciona, y un fallo de Supabase nunca rompe la página.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Regresión, rendimiento, verificación de seguridad/privacidad, y validación final.

- [ ] T014 [P] Correr la suite completa existente (`npm test` + `npx playwright test --project=chromium
  --project=no-js`) y confirmar que ninguna página/feature previa (`/`, `/methodology`,
  `/entries/[slug]` sin el widget) cambió de comportamiento
- [ ] T015 [P] Verificar presupuesto de rendimiento con Lighthouse en `/entries/pinterest` (con el widget
  de voto ya montado): Performance ≥90, LCP<2.5s, CLS<0.1; medir y reportar el delta real de JS que
  agrega el SDK de Supabase + `VoteWidget` (primera vez que una feature agrega JS más allá del baseline de
  framework — plan.md § Performance Goals)
- [ ] T016 [P] Confirmar por `grep` que `components/VoteWidget.tsx` es el único archivo del repo con
  `"use client"` (Principio III)
- [ ] T017 [P] Confirmar por `grep`/revisión de código que en ningún lugar del código cliente se referencia
  una service-role key de Supabase — solo la `anon key` pública vía `NEXT_PUBLIC_*` (Principio VI)
- [ ] T018 Revisión manual del escenario 7 de `quickstart.md` contra el proyecto Supabase real: confirmar
  que `select * from votes` con la `anon key` falla/devuelve vacío por RLS, y que
  `select * from vote_counts` sí funciona (FR-013, SC-007)
- [ ] T019 [P] Actualizar `README.md` con la sección de configuración de Supabase (variables de entorno,
  cómo aplicar la migración) siguiendo el mismo formato que el resto del documento
- [ ] T020 Ejecutar la validación de `quickstart.md` de punta a punta (escenarios 1–7)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias — puede empezar de inmediato
- **Foundational (Phase 2)**: depende de Setup (T003 debe existir antes de T004) — BLOQUEA el
  funcionamiento real de ambas historias, aunque no bloquea escribir sus tests (que usan mocks)
- **US1 (Phase 3)**: depende de Foundational (T006/T008). Independiente de US2 en cuanto a código.
- **US2 (Phase 4)**: depende de que `VoteWidget` exista (T010 de US1) — no es código independiente, es
  una capa de dureza/tests adicionales sobre el mismo componente (igual que US3 hizo con el loader en
  `001-entries-directory`).
- **Polish (Phase 5)**: depende de US1 y US2 completas.

### Within Each Phase

- Pruebas (TDD) escritas y en rojo ANTES de implementar, salvo donde se documenta explícitamente que ya
  pasan por dureza heredada (ver nota en T012).
- Foundational: tests de `voterId`/`client` antes de sus implementaciones; T004 (migración real) no
  bloquea escribir T005–T008 (que usan mocks), pero si bloquea que la feature funcione de verdad fuera de
  los tests.
- Historia completa antes de pasar a la siguiente prioridad.

### Parallel Opportunities

- Setup: T001/T002/T003 en paralelo (archivos distintos).
- Foundational: T005 y T007 en paralelo (tests de módulos distintos); T006 depende de T005, T008 depende
  de T007, pero T006+T007 podrían solaparse.
- US1: solo T009 en esta fase (un archivo).
- Polish: T014/T015/T016/T017/T019 en paralelo entre sí; T018 y T020 al final.

---

## Parallel Example: Setup

```bash
Task: "package.json (+ @supabase/supabase-js)"
Task: ".env.example (nuevo)"
Task: "supabase/migrations/0001_votes.sql"
```

---

## Implementation Strategy

### MVP First (Foundational + US1)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational — incluye aplicar el esquema al proyecto Supabase real)
3. Completar Phase 3 (US1): votar, ver el conteo, cambiar de opción
4. **PARAR y VALIDAR**: probar el flujo de voto de punta a punta manualmente contra el proyecto real
5. Deploy/demo si está listo (US2 puede seguir después sin bloquear el MVP)

### Incremental Delivery

1. Setup + Foundational → esquema real listo, `lib/votes/*` testeado
2. + US1 (votar) → validar → deploy (MVP)
3. + US2 (resiliencia) → validar → deploy
4. Polish (regresión, rendimiento, seguridad, quickstart completo)

---

## Notes

- Tests obligatorios para toda la lógica nueva real (`lib/votes/*`) y para el comportamiento e2e del
  widget (Principio IV) — sin tests de renderizado de React en Jest (mismo motivo documentado en
  `002-methodology-page/tasks.md`: `jest.config.js` usa `testEnvironment: 'node'`, sin Testing Library).
- [P] = archivos distintos, sin dependencias pendientes.
- `VoteWidget.tsx` es deliberadamente el único `"use client"` del repo — verificado explícitamente en
  Polish (T016), no solo asumido.
- La aplicación real de la migración (T004) y la revisión de RLS contra el proyecto real (T018) son los
  dos únicos pasos de esta lista que dependen de infraestructura fuera del repo — todo lo demás (código,
  tests) es autocontenido y no requiere un proyecto Supabase real para completarse.
- Commit tras cada tarea o grupo lógico; parar en cualquier checkpoint para validar.
