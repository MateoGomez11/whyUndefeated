---
description: "Task list for Directorio de Entradas y Páginas de Detalle"
---

# Tasks: Directorio de Entradas y Páginas de Detalle

**Input**: Design documents from `/specs/001-entries-directory/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: INCLUIDOS y obligatorios — el spec exige Jest + Playwright y la constitución (Principio IV)
exige pruebas para lógica crítica (conteo/derivados, carga/validación de contenido, generación de páginas).
Orden TDD: escribir la prueba primero (que falle), luego implementar.

**Organization**: Tareas agrupadas por historia de usuario. MVP = US1 (directorio).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: US1 (directorio), US2 (detalle), US3 (gate de validación)
- Rutas de archivo exactas incluidas en cada tarea

## Path Conventions

App web Next.js App Router de un solo proyecto (ver plan.md): `app/`, `components/`, `lib/content/`,
`content/entries/`, `tests/` (Jest), `e2e/` (Playwright) en la raíz del repo.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto y herramientas

- [X] T001 Crear la estructura de carpetas del proyecto (`app/`, `components/`, `lib/content/`, `content/entries/`, `tests/unit/`, `tests/integration/`, `tests/fixtures/`, `e2e/`) según plan.md
- [X] T002 Inicializar proyecto Next.js (App Router) + TypeScript con dependencias (next, react, react-dom, zod) en `package.json`
- [X] T003 [P] Configurar TypeScript en `tsconfig.json` (paths, strict)
- [X] T004 [P] Configurar Jest para TS en `jest.config.ts` (ts-jest o babel, entornos node/jsdom)
- [X] T005 [P] Configurar Playwright en `playwright.config.ts` con un proyecto adicional `javaScriptEnabled: false` para las pruebas sin JS
- [X] T006 [P] Configurar ESLint + Prettier (`.eslintrc`, `.prettierrc`) alineados con reglas de Next.js/TS
- [X] T007 [P] Verificar que `design-reference/` está excluido del deploy en `.vercelignore` y NO se importa desde `app/`/`components/`/`lib/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Pipeline de contenido + esqueleto/estilo que TODAS las historias necesitan

**⚠️ CRITICAL**: Ninguna historia de usuario puede comenzar hasta completar esta fase

- [X] T008 Portar los tokens de `design-reference/tokens/*.css` a `app/globals.css` como CSS custom properties (colores de superficie/marca, amenaza como sistema semántico independiente, escala de espaciado, radios, efectos) — ver "Sistema de Diseño (resuelto)" en plan.md
- [X] T009 Configurar `next/font` para Space Grotesk y JetBrains Mono en `app/layout.tsx` (reemplaza el `@import` de Google Fonts de la referencia — desviación obligatoria)
- [X] T010 Implementar el layout raíz `app/layout.tsx` (fondo `--bg-0`, fuentes, `max-width 1240px`, metadata base para SEO)
- [X] T011 [P] [TDD] Escribir prueba unitaria del esquema en `tests/unit/schema.test.ts`: caso válido + fallo por cada campo obligatorio faltante/ inválido (threatLevel, category, moat, sources vacío, moatSourceIds, sourceId colgante) — DEBE fallar primero
- [X] T012 Implementar el esquema Zod y tipos derivados en `lib/content/schema.ts` (Entry/Challenger/Source, `category` enum Social|Content|Knowledge|Community, `threatLevel` enum, `sources` min 1, `moatSourceIds` min 1 + integridad referencial, `url` válida) — contrato en contracts/entry.schema.md (V1–V8, V1b)
- [X] T013 Implementar el loader en `lib/content/loader.ts`: lee `content/entries/*.json`, valida con el esquema y **lanza** `{archivo, campo, motivo}` ante cualquier violación; devuelve `Entry[]` ordenado (FR-013)
- [X] T014 [P] [TDD] Escribir prueba unitaria de orden en `tests/unit/sort.test.ts` (peso high>medium>low desc, desempate alfabético asc) — DEBE fallar primero
- [X] T015 [P] Implementar `lib/content/sort.ts` (orden por nivel de amenaza + desempate) — FR-002
- [X] T016 [P] [TDD] Escribir prueba unitaria de slug en `tests/unit/slug.test.ts` (kebab-case, unicidad, coincidencia archivo↔slug) — DEBE fallar primero
- [X] T017 [P] Implementar utilidades de slug en `lib/content/slug.ts` — FR-004, Decisión 5
> **Nota (Principio V)**: todo el copy de cara al usuario en los archivos semilla (summary, moat, evidence
> de retadores, label de fuentes) DEBE estar en **inglés**. Los `threatLevel` en enum `low|medium|high`.

- [X] T018 [P] Crear archivo semilla `content/entries/pinterest.json` (category=Content) válido, copy en inglés: threatLevel (`low|medium|high`), summary, moat, moatSourceIds, sources verificables (≥1), challengers opcionales con fuente — Principios I y V
- [X] T019 [P] Crear archivo semilla `content/entries/wikipedia.json` (category=Knowledge) válido con fuentes verificables
- [X] T020 [P] Crear archivo semilla `content/entries/reddit.json` (category=Community) válido con fuentes verificables
- [X] T021 [P] Crear archivo semilla `content/entries/twitter-x.json` (category=Social) válido con fuentes verificables
- [X] T022 [P] Crear archivo semilla `content/entries/tiktok.json` (category=Content) válido con fuentes verificables
- [X] T023 [P] Crear archivo semilla `content/entries/goodreads.json` (category=Community) válido con fuentes verificables
- [X] T024 [P] Crear archivo semilla `content/entries/linkedin.json` (category=Social) válido con fuentes verificables

**Checkpoint**: Pipeline de contenido validado + estilo base listos — las historias pueden comenzar

---

## Phase 3: User Story 1 - Explorar el directorio de entradas (Priority: P1) 🎯 MVP

**Goal**: Home en `/` que lista las 7 entradas como tarjetas ordenadas alto→bajo, con leyenda, badge
color+texto, contador agregado derivado, y navegación al detalle.

**Independent Test**: Cargar `/`; ver 7 tarjetas ordenadas, leyenda visible, contador con totales reales,
y que un clic navega a `/entries/{slug}`; legible sin JS.

### Tests for User Story 1 (TDD — escribir primero, deben fallar)

- [X] T025 [P] [US1] Prueba unitaria del contador en `tests/unit/tally.test.ts`: `totalApps=nº entradas`, `totalCitations=Σ sources`, `totalVotes=0` — coincide con los datos (FR-021, SC-008)
- [X] T026 [P] [US1] Prueba de integración en `tests/integration/loader.valid.test.ts`: el loader carga exactamente los 7 slugs semilla y todos con `category` válida (FR-012, SC-009)
- [X] T027 [P] [US1] E2E en `e2e/directory.spec.ts`: 7 tarjetas, orden alto→bajo, leyenda visible, badge con color+texto, contador presente, clic → `/entries/{slug}` (US1 esc. 1–4)
- [X] T028 [P] [US1] E2E sin JS en `e2e/no-js.spec.ts` (parte home): listado, badges, leyenda, contador y enlaces legibles con `javaScriptEnabled:false` (US1 esc. 5, FR-011)

### Implementation for User Story 1

- [X] T029 [US1] Implementar `lib/content/tally.ts` (totales derivados en build; votos=0) — hace pasar T025 (FR-021)
- [X] T030 [P] [US1] Componente `components/ThreatBadge.tsx` (color + etiqueta de texto uppercase + glow) — FR-017
- [X] T031 [P] [US1] Componente `components/ThreatLegend.tsx` (leyenda bajo/medio/alto) — FR-003
- [X] T032 [P] [US1] Componente `components/EntryCard.tsx` (logo placeholder mono, nombre, ThreatBadge, resumen, link) — FR-001/FR-004
- [X] T033 [US1] Componente `components/HomeStats.tsx` (StatCounter estilo mono; valor final en HTML de servidor, count-up como mejora progresiva) — FR-021
- [X] T034 [US1] Página `app/page.tsx` (RSC/SSG): carga vía loader ordenado, renderiza HomeStats + ThreatLegend + grid de EntryCard (estilo de filas de la tabla del design-reference, sin columna "Updated") — FR-001/FR-002/FR-011

**Checkpoint**: US1 funcional y testeable de forma independiente (MVP)

---

## Phase 4: User Story 2 - Ver el detalle completo de una entrada (Priority: P1)

**Goal**: Página de detalle en `/entries/[slug]` con nombre, nivel de amenaza, retadores con fuente,
moat con cita clickeable, sección de fuentes deduplicada, y sección "related apps"; slug inexistente →
not-found.

**Independent Test**: Abrir `/entries/pinterest`; ver todos los campos y cada afirmación con fuente
clickeable; abrir un slug inexistente → not-found; legible sin JS.

### Tests for User Story 2 (TDD — escribir primero, deben fallar)

- [ ] T035 [P] [US2] Prueba unitaria en `tests/unit/related.test.ts`: "related apps" = otras entradas de la misma `category`, excluye la propia, y omite si es única de su categoría (FR-020, SC-009)
- [ ] T036 [P] [US2] E2E en `e2e/detail.spec.ts`: campos completos, cada retador con enlace de fuente, moat con cita clickeable, sección de fuentes deduplicada, related apps, slug inexistente → not-found (US2 esc. 1–5, FR-006/07/08/15)
- [ ] T037 [P] [US2] E2E sin JS en `e2e/no-js.spec.ts` (parte detalle): contenido, related apps y enlaces de fuentes legibles/clickeables con `javaScriptEnabled:false` (US2 esc. 6, FR-011)

### Implementation for User Story 2

- [ ] T038 [US2] Implementar `lib/content/related.ts` (related apps por categoría) — hace pasar T035 (FR-020)
- [ ] T039 [P] [US2] Componente `components/ChallengerList.tsx` (nombre, evidencia de una línea, enlace de fuente) — FR-006; maneja lista vacía (FR-018)
- [ ] T040 [P] [US2] Componente `components/SourcesList.tsx` (fuentes deduplicadas, clickeables) — FR-008
- [ ] T041 [P] [US2] Componente `components/RelatedApps.tsx` (cards de misma categoría; omite si vacío) — FR-020
- [ ] T042 [US2] Componente `components/EntryDetail.tsx`: PLANTILLA COMPARTIDA que compone header (Badge categoría + logo placeholder, SIN "Updated", SIN "Confidence"), nombre h1, ThreatBadge, moat con citas, ChallengerList, SourcesList, RelatedApps — FR-009 + desviaciones del design-reference
- [ ] T043 [US2] Página `app/entries/[slug]/page.tsx` (RSC/SSG) con `generateStaticParams()` (7 slugs) y `dynamicParams = false`; usa EntryDetail — FR-005/FR-011
- [ ] T044 [US2] Página `app/not-found.tsx` legible (404) para slug inexistente — FR-015

**Checkpoint**: US1 y US2 funcionan de forma independiente

---

## Phase 5: User Story 3 - Bloquear entradas inválidas antes de producción (Priority: P2)

**Goal**: Una entrada a la que le falte un campo obligatorio detiene la publicación con un mensaje que
nombra el campo y el archivo; las entradas inválidas nunca llegan a producción en silencio.

**Independent Test**: Introducir una fixture inválida y verificar que la validación/build falla nombrando
campo + archivo.

### Tests for User Story 3 (TDD — escribir primero, deben fallar)

- [ ] T045 [P] [US3] Crear fixtures inválidas en `tests/fixtures/` (falta threatLevel; falta moat; `sources: []`; category fuera de enum; `sourceId` colgante; retador sin fuente)
- [ ] T046 [P] [US3] Prueba de integración en `tests/integration/loader.invalid.test.ts`: por cada fixture, el loader lanza y el mensaje nombra el campo y el archivo (FR-013, SC-004; contrato V1–V8/V1b)

### Implementation for User Story 3

- [ ] T047 [US3] Ajustar el formato de error del loader `lib/content/loader.ts` a `{archivo, campo, motivo}` legible y consistente con el contrato — hace pasar T046
- [ ] T048 [US3] Garantizar que la validación corre en build: `generateStaticParams`/carga de `app/page.tsx` invoca el loader de modo que `next build` falle ante contenido inválido; documentar en `package.json` (script build) — SC-004
- [ ] T049 [US3] Prueba de integración en `tests/integration/loader.build-gate.test.ts`: una entrada válida completa el build sin errores; una inválida lo detiene (US3 esc. 1–4)

**Checkpoint**: Las 3 historias funcionan de forma independiente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Calidad transversal y verificación final

- [ ] T050 [P] Verificar presupuesto de rendimiento con Lighthouse en `/` y `/entries/pinterest` (Performance ≥90, LCP <2.5s, CLS <0.1, JS ≤30KB) — SC-007
- [ ] T051 [P] Verificar accesibilidad del badge (nivel por color + texto, no solo color) y navegación por teclado — FR-017
- [ ] T052 [P] Spot-check visual de `components/` contra `design-reference/` (tokens, tabla, hero de dos líneas, header de detalle sin "Updated"/"Confidence")
- [ ] T053 Confirmar que `design-reference/` no entra al output de build de producción (`.vercelignore` + sin imports) — plan.md
- [ ] T054 Ejecutar la validación de `quickstart.md` de punta a punta (escenarios 1–7)
- [ ] T055 [P] Escribir `README.md` (cómo correr dev/build/tests; formato de `content/entries/*.json`)
- [ ] T056 Limpieza/refactor y confirmación de que NO existe ningún "confidence score" en código ni UI (Principio I)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias — puede empezar de inmediato
- **Foundational (Phase 2)**: depende de Setup — BLOQUEA todas las historias
- **US1 (Phase 3)** y **US2 (Phase 4)**: dependen de Foundational; independientes entre sí (pueden ir en paralelo)
- **US3 (Phase 5)**: depende de Foundational (loader T013); independiente de US1/US2 en pruebas
- **Polish (Phase 6)**: depende de las historias deseadas completas

### User Story Dependencies

- **US1 (P1)**: tras Foundational. Necesita schema/loader/sort/seed (Fase 2) + tally (T029).
- **US2 (P1)**: tras Foundational. Necesita schema/loader/seed + related (T038). No depende de US1.
- **US3 (P2)**: tras Foundational. Reutiliza el loader que ya lanza (T013); añade fixtures + gate.

### Within Each User Story

- Pruebas (TDD) escritas y en rojo ANTES de implementar
- `lib/` (lógica pura) antes que componentes; componentes antes que páginas
- Historia completa antes de pasar a la siguiente prioridad

### Parallel Opportunities

- Setup: T003–T007 en paralelo
- Foundational: T014/T016 (tests) con T011; los 7 seed files T018–T024 en paralelo; sort/slug (T015/T017) en paralelo
- US1: tests T025–T028 en paralelo; componentes T030/T031/T032 en paralelo
- US2: tests T035–T037 en paralelo; componentes T039/T040/T041 en paralelo
- US3: T045/T046 en paralelo
- Con equipo: tras Foundational, un dev toma US1 y otro US2 simultáneamente

---

## Parallel Example: User Story 1

```bash
# Pruebas de US1 juntas (deben fallar primero):
Task: "tests/unit/tally.test.ts"
Task: "tests/integration/loader.valid.test.ts"
Task: "e2e/directory.spec.ts"
Task: "e2e/no-js.spec.ts (home)"

# Componentes de presentación de US1 juntos:
Task: "components/ThreatBadge.tsx"
Task: "components/ThreatLegend.tsx"
Task: "components/EntryCard.tsx"
```

---

## Implementation Strategy

### MVP First (solo US1)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational — CRÍTICO, bloquea todo)
3. Completar Phase 3 (US1)
4. **PARAR y VALIDAR**: probar el directorio de forma independiente
5. Deploy/demo si está listo

### Incremental Delivery

1. Setup + Foundational → base lista
2. + US1 (directorio) → validar → deploy (MVP)
3. + US2 (detalle + related apps) → validar → deploy
4. + US3 (gate de validación) → validar → deploy
5. Polish (rendimiento, a11y, quickstart)

---

## Notes

- Tests obligatorios (spec + Principio IV): escribir en rojo antes de implementar.
- [P] = archivos distintos, sin dependencias pendientes.
- Todo el contenido semilla debe tener fuentes verificables (Principio I); nunca datos especulativos.
- Todo el copy de cara al usuario (entradas y UI) debe estar en inglés (Principio V); `threatLevel` usa el
  enum `low|medium|high`, con etiquetas mostradas "Low/Medium/High".
- Desviaciones del design-reference obligatorias: sin "confidence score", sin línea/columna "Updated",
  filtros interactivos diferidos, `next/font`, animaciones como mejora progresiva (ver plan.md).
- Commit tras cada tarea o grupo lógico; parar en cualquier checkpoint para validar.
