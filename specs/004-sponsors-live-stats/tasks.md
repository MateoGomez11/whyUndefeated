---
description: "Task list for Sponsor Board & Live Telemetry (/sponsor)"
---

# Tasks: Sponsor Board & Live Telemetry (`/sponsor`)

**Input**: Design documents from `/specs/004-sponsors-live-stats/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/sponsor-ui.md, quickstart.md

**Tests**: INCLUIDOS — El plan y la constitución (Principio IV) exigen pruebas unitarias para la integridad de datos de los slots y telemetría (`tests/unit/sponsor.test.ts`) y pruebas E2E con Playwright (`e2e/sponsor.spec.ts`) incluyendo navegación y resiliencia en modo `no-js`. Orden TDD: escribir las pruebas primero (que fallen), luego implementar.

**Organization**: Tareas agrupadas por historia de usuario. MVP = US1 (Tablero de Patrocinadores con 10 slots fijos y FOMO).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: US1 (Tablero de Patrocinadores), US2 (Telemetría & Globo 3D), US3 (Navegación del Sitio)
- Rutas de archivo exactas incluidas en cada tarea

---

## Phase 1: Setup (Shared Data & Infrastructure)

**Purpose**: Definir los tipos de TypeScript, variables de entorno y los datos base para los 10 slots de patrocinio, métricas y telemetría (con soporte para Umami Analytics).

- [X] T001 [P] Crear `lib/sponsor/types.ts` con las interfaces `SponsorSlot`, `TelemetryEvent`, `CountryVisitorStat`, `SponsorTestimonial` y `SponsorOverviewMetrics` conforme a data-model.md.
- [X] T002 [P] Crear `lib/sponsor/data.ts` con la lista de los 10 slots (L1–L5, R1–R5), métricas globales, testimonios de cofundadores, lista de eventos de telemetría y visitantes por país.
- [X] T003 [P] Actualizar `.env.example` añadiendo las variables opcionales para Umami Analytics (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_PUBLIC_URL`).

---

## Phase 2: Foundational (Pruebas Unitarias de Datos & Módulos Base)

**Purpose**: Asegurar la integridad de datos de los slots y telemetría antes de construir los componentes de UI.

- [X] T004 [P] [TDD] Crear `tests/unit/sponsor.test.ts`: verificar que existen exactamente 10 slots (5 en riel izquierdo y 5 en riel derecho); que los estados son válidos (`TAKEN`, `SPONSOR DECIDING`, `OPEN`), que las URLs y `mailto:` se resuelven adecuadamente y que los eventos de telemetría no contienen PII (Principio VI) — DEBE fallar primero.

---

## Phase 3: User Story 1 - Tablero de Patrocinadores con FOMO y Slots Fijos (Priority: P1) 🎯 MVP

**Goal**: Renderizar la página `/sponsor` con la propuesta de valor comercial, los 10 slots fijos interactivos (abren web externa si `TAKEN` o `mailto:` si `OPEN`/`DECIDING`), precios, timeline y testimonios.

**Independent Test**: Navegar a `/sponsor`, revisar las 4 tarjetas de estadísticas, la cuadrícula de 10 slots (L1–L5, R1–R5) con sus estados FOMO, precio ($2,500/mes) y testimonios.

### Implementation for User Story 1

- [X] T005 [P] [US1] Implementar `components/sponsor/SponsorHero.tsx`: título "Sponsor whyundefeated.", subtítulo enfocado en builders y 4 stat cards (vistas mensuales, apps listadas, audiencia de builders, slots ocupados `10/10` en verde).
- [X] T006 [P] [US1] Implementar `components/sponsor/SponsorSlotsGrid.tsx`: cuadrícula responsive con 10 slots (L1–L5 y R1–R5), nombres de marcas, fechas de vencimiento, enlaces a patrocinadores externos (`target="_blank"`) o apertura de cliente de correo (`mailto:`), y etiquetas de estado con colores (`TAKEN`, `SPONSOR DECIDING`, `OPEN`).
- [X] T007 [P] [US1] Implementar `components/sponsor/SponsorPricingSection.tsx`: sección de precio mensual fijo ($2,500 flat con rate lock), timeline de fechas clave de reserva y testimonios de ROI.
- [X] T008 [P] [US1] Implementar `components/sponsor/SponsorAudienceGuide.tsx`: perfiles "Presence buyers" vs "Signup buyers" y categorías recomendadas.
- [X] T009 [US1] Crear la página Server Component `app/sponsor/page.tsx` integrando hero, pricing, slots grid y audience guide, con metadatos SEO optimizados y script condicional de Umami.

**Checkpoint**: US1 funcional y testeable de forma independiente — el tablero de patrocinadores está completo.

---

## Phase 4: User Story 2 - Telemetría en Vivo: Globo 3D, Feed de Lecturas y Tráfico Global (Priority: P2)

**Goal**: Dotar a `/sponsor` de un panel interactivo con un globo terráqueo Canvas 2D en matriz de puntos (<8KB, 60fps), contador de visitantes en vivo, feed de lecturas recientes, desglose por países y enlace al dashboard público transparente de Umami (`FULL DASHBOARD ->`).

**Independent Test**: Observar la rotación del globo de puntos y sus pings luminosos, el contador de personas conectadas en vivo, el feed de actividad con timestamps relativos y el enlace a `FULL DASHBOARD ->`.

### Implementation for User Story 2

- [X] T010 [P] [US2] Implementar `components/sponsor/GlobeCanvas.tsx` (`"use client"`): esfera de matriz de puntos 3D rotatoria en Canvas 2D nativo con proyección matemática de puntos, sombreado de profundidad y marcadores de actividad pulsantes amarillos/verdes.
- [X] T011 [P] [US2] Implementar `components/sponsor/LiveActivityTicker.tsx` (`"use client"`): contador de personas activas en el sitio y feed de actividad en vivo con animación de nuevos eventos y badges de países con banderas.
- [X] T012 [US2] Implementar `components/sponsor/LiveTelemetryDashboard.tsx` (`"use client"`): panel contenedor con estética terminal ("LIVE · WHO'S ON THE SITE RIGHT NOW · PUBLIC, BECAUSE WHY NOT") integrando `GlobeCanvas`, `LiveActivityTicker`, enlace `FULL DASHBOARD ->` y estadísticas de visitantes de 7 días por país.
- [X] T013 [US2] Integrar `LiveTelemetryDashboard` en `app/sponsor/page.tsx` entre el hero y la sección de precios.

**Checkpoint**: US1 y US2 funcionan juntas — el tablero comercial y la telemetría en vivo están completos.

---

## Phase 5: User Story 3 - Navegación Principal Actualizada y Enlaces (Priority: P3)

**Goal**: Actualizar la barra de navegación y pie de página del sitio para reemplazar "Leaderboard" por "Alternatives" y agregar "Sponsors" apuntando a `/sponsor`.

**Independent Test**: Verificar que en todas las rutas (`/`, `/entries/[slug]`, `/methodology`, `/sponsor`) el NavBar muestra `Home`, `Alternatives`, `Methodology`, `Sponsors`, `Submit` y que el enlace a `Sponsors` navega correctamente.

### Implementation for User Story 3

- [X] T014 [US3] Actualizar `components/NavBar.tsx`: reemplazar el enlace "Leaderboard" por "Alternatives" y añadir "Sponsors" (`/sponsor`), manteniendo el resaltado activo y el menú móvil CSS-only.
- [X] T015 [US3] Actualizar `components/Footer.tsx`: incluir el enlace directo a `/sponsor`.

**Checkpoint**: Todas las historias de usuario están integradas y navegables en toda la aplicación.

---

## Phase 6: Polish & Verificación de Calidad

**Purpose**: Pruebas E2E, verificación de regresión, compatibilidad sin JavaScript y build de producción.

- [X] T016 [P] Crear `e2e/sponsor.spec.ts`: pruebas Playwright para verificar navegación a `/sponsor`, visibilidad de los 10 slots con sus estados e interacciones, renderizado del panel de telemetría y legibilidad en modo `no-js`.
- [X] T017 Correr suite completa de pruebas (`npm test` y `npx playwright test`) para certificar cero regresiones en las features existentes.
- [X] T018 Ejecutar `npm run build` y verificar que la ruta `/sponsor` se genera estáticamente con éxito.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — inicia de inmediato (T001, T002, T003).
- **Foundational (Phase 2)**: Depende de Setup (T004).
- **US1 (Phase 3)**: Depende de Foundational (T005–T008 en paralelo, T009 integra).
- **US2 (Phase 4)**: Depende de US1 (T010, T011 en paralelo, T012 y T013 integran).
- **US3 (Phase 5)**: Depende de que `/sponsor` exista (T014, T015).
- **Polish (Phase 6)**: Depende de US1, US2 y US3 completas (T016, T017, T018).

---

## Parallel Opportunities

- **Setup**: T001, T002, T003 en paralelo.
- **US1**: T005, T006, T007, T008 en paralelo (archivos independientes).
- **US2**: T010, T011 en paralelo.
- **US3**: T014, T015 en paralelo.
- **Polish**: T016 en paralelo con T017.

---

## Implementation Strategy

### MVP First (Setup + Foundational + US1)
1. Completar Phase 1 (Setup de tipos y datos).
2. Completar Phase 2 (Foundational TDD en Jest).
3. Completar Phase 3 (US1: Tablero de Sponsors con 10 slots).
4. Validar navegación e interacciones de slots.

### Incremental Delivery
1. + US2 (Telemetría, Globo 3D Canvas 2D, Ticker y Umami).
2. + US3 (NavBar con Alternatives y Sponsors, Footer).
3. Polish & validación E2E (Jest, Playwright, SSG build).
