# Implementation Plan: Votación de Veredicto en el Detalle de Entrada

**Branch**: `003-entry-voting` | **Date**: 2026-08-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-entry-voting/spec.md`

## Summary

Agregar un widget de voto "Agree"/"Disagree" en cada página `/entries/{slug}`, junto al `ThreatBadge`,
que deja reaccionar a cualquier visitante (sin login) al veredicto de nivel de amenaza. Es la primera
feature del proyecto que toca una base de datos: los votos viven en una tabla `votes` de Supabase
(Postgres), nunca en `content/entries/*.json`, y toda la interacción vive en un único componente cliente
(`components/VoteWidget.tsx`) — el resto del sitio permanece 100% estático. El conteo agregado por
entrada se expone vía una vista Postgres de solo-agregado (`vote_counts`) con RLS que bloquea la lectura
de filas individuales; el conteo de la home (`totalVotes`) permanece en 0, sin cambios (diferido). Si
Supabase no responde, la página completa sigue renderizando igual — solo el widget de voto degrada a un
estado "no disponible", nunca bloquea el resto del contenido.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 24 LTS (mismo stack que `001-entries-directory`/
`002-methodology-page`)

**Primary Dependencies**: Next.js (App Router) — SIN cambios; se agrega **`@supabase/supabase-js`** como
única dependencia nueva del proyecto (cliente Postgrest ligero, sin el paquete `@supabase/ssr` porque no
hay sesión de auth que sincronizar — toda la interacción es anónima y ocurre 100% en el navegador).

**Storage**: **Primer uso real de la base de datos del proyecto** — tabla `votes` en Supabase/PostgreSQL
(Principio II de la constitución: DB únicamente para contadores de voto/reacción, nunca contenido
principal). El resto del contenido (`content/entries/*.json`) no se toca ni se referencia desde la DB
(sin FK — ver research.md Decisión 3).

**Testing**: Jest para la única lógica pura y testeable en `node` (sin DOM): el módulo de identificador de
votante (`lib/votes/voterId.ts`, con storage inyectado/mockeado) y el wrapper del cliente de Supabase
(`lib/votes/client.ts`, con el cliente de Supabase mockeado — sin red real). Playwright para el
comportamiento real del widget: emitir/cambiar voto, ver el contador actualizarse, y — clave para US2 —
simular que Supabase no responde interceptando las requests con `page.route()`, sin depender de un
proyecto Supabase real para correr la suite.

**Target Platform**: Web en Vercel, igual que el resto del sitio; el backend de datos es Supabase (tier
gratuito), servicio externo gestionado — no hay servidor propio que operar.

**Project Type**: Aplicación web (Next.js App Router, single project) — se integra al proyecto existente.

**Performance Goals**: Hereda el presupuesto de `001-entries-directory/research.md` Decisión 6 (Lighthouse
≥90, LCP<2.5s, CLS<0.1) para la carga inicial de la página, que sigue siendo 100% estática y no depende de
Supabase para renderizar. El JS del SDK de Supabase + `VoteWidget` es JS de **feature real** (a diferencia
del baseline de framework ya aceptado) — vive únicamente en el bundle de `/entries/[slug]` gracias al
code-splitting por ruta de Next.js (nunca se carga en `/` ni en `/methodology`); se mide por separado en
Polish (no se fija un techo numérico nuevo en el spec, pero se reporta el delta real).

**Constraints**: Contenido principal sigue 100% renderizado en servidor y legible sin JS (FR-009); el
widget de voto es la ÚNICA parte del sitio que requiere JS y toca la base de datos — un caso ya
sancionado explícitamente por el Principio III ("'use client' se usa SOLO para islas interactivas
genuinas (botón de voto...)"). Sin autenticación (Principio VI). Sin PII almacenada junto al voto
(FR-005). Lectura pública limitada al conteo agregado, nunca filas individuales (FR-013).

**Scale/Scope**: 1 tabla + 1 vista + políticas RLS en Supabase; 1 componente cliente nuevo
(`VoteWidget.tsx`) montado desde `EntryDetail.tsx` (plantilla compartida — FR-009 de
`001-entries-directory` sigue cumpliéndose, ningún layout por-entrada); 2 módulos de lógica pura en
`lib/votes/`; 0 cambios a `content/entries/*.json` o al esquema Zod existente.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | ¿Cómo lo satisface el plan? | Estado |
|-----------|------------------------------|--------|
| I. Integridad de Contenido Basada en Evidencia | El veredicto de amenaza sigue siendo 100% derivado de evidencia versionada; el voto es una reacción de la comunidad, NUNCA altera ni influye el `threatLevel` almacenado. Sin overlap con el pipeline de contenido. | ✅ PASS |
| II. Contenido como Código | Los votos viven exclusivamente en Supabase, nunca en `content/entries/*.json` — exactamente el uso que este principio reserva para la DB ("únicamente para contadores de voto/reacción"). | ✅ PASS |
| III. Rendimiento y SEO con Prioridad en Servidor | `VoteWidget` es la única isla `"use client"` del sitio — caso explícitamente sancionado por este principio. El resto de la página sigue siendo RSC/SSG; legible sin JS (FR-009). | ✅ PASS |
| IV. Pruebas Primero para Lógica Crítica | `lib/votes/voterId.ts` y `lib/votes/client.ts` llevan tests Jest (con mocks, sin red real) antes de darse por terminados; comportamiento end-to-end (votar, cambiar voto, degradación sin Supabase) cubierto por Playwright con `page.route()`. | ✅ PASS |
| V. Plantilla de Entrada Consistente y Contenido en Inglés | `VoteWidget` se monta desde la plantilla compartida `EntryDetail.tsx` — mismo lugar, mismo comportamiento en las 7 entradas, sin excepciones por entrada. Copy del widget en inglés ("Agree"/"Disagree"). | ✅ PASS |
| VI. Requisitos de Seguridad | Sin autenticación, sin PII junto al voto (FR-005). La `anon key` de Supabase es pública por diseño (no es un secreto — la seguridad real la da RLS, no la key); NUNCA se usa la service-role key en el cliente. HTTPS heredado de Vercel/Supabase. Lectura restringida al agregado (FR-013). | ✅ PASS |

**Resultado del gate (pre-Fase 0)**: PASS — sin violaciones. Complexity Tracking vacío: la única pieza
"nueva" de infraestructura (Supabase) ya estaba pre-aprobada en la constitución desde su redacción
original, no es una desviación que deba justificarse aquí.

**Re-evaluación post-Fase 1**: PASS — el diseño (tabla + vista de solo-agregado + RLS, cliente aislado en
un único componente, mocking de Supabase para tests) no introduce ningún componente cliente adicional,
ninguna ruta nueva, ni ningún dato personal. Ver `data-model.md` y `contracts/`.

## Project Structure

### Documentation (this feature)

```text
specs/003-entry-voting/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   └── votes-api.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

Se integra al proyecto Next.js App Router existente — sin `backend/`/`frontend/` separados. La única
carpeta nueva de infraestructura es `supabase/` (SQL de esquema versionado, no código de aplicación).

```text
supabase/
└── migrations/
    └── 0001_votes.sql          # Tabla `votes`, vista `vote_counts`, políticas RLS (ver data-model.md)

lib/
└── votes/
    ├── voterId.ts               # Identificador de votante persistente (storage inyectado — testeable)
    └── client.ts                 # Wrapper del cliente de Supabase: fetchVoteCounts / castVote

components/
├── VoteWidget.tsx                # ÚNICO "use client" del sitio — botones Agree/Disagree + conteo
└── EntryDetail.tsx               # Modificado: monta <VoteWidget slug={entry.slug} /> junto al ThreatBadge

tests/
└── unit/
    ├── voterId.test.ts           # NUEVO: genera/persiste id en storage mockeado
    └── votes-client.test.ts      # NUEVO: fetchVoteCounts/castVote contra un cliente Supabase mockeado

e2e/
└── voting.spec.ts                # NUEVO: votar, cambiar voto, conteo concurrente, degradación sin
                                   # Supabase (page.route mock), legibilidad sin JS (proyecto no-js)

.env.example                      # NUEVO: + NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
package.json                      # Modificado: + dependencia @supabase/supabase-js
```

**Structure Decision**: Se integra directamente al proyecto existente. `lib/votes/` sigue la convención ya
establecida de `lib/content/*` (módulos puros, testeados con Jest, sin acceso a DOM). `VoteWidget.tsx` es
deliberadamente el ÚNICO archivo del repo con `"use client"` — toda la superficie de riesgo de
interactividad/DB queda contenida ahí, en línea con el Principio III. El SQL de Supabase se versiona en
`supabase/migrations/` (convención estándar de la CLI de Supabase) en vez de aplicarse a mano y sin
registro — mantiene el esquema de la DB auditable por diff, igual que el resto del proyecto.

**Prerrequisito de infraestructura fuera de este repo (no automatizable por tareas de código)**: esta
feature requiere que exista un proyecto Supabase real con la migración de `supabase/migrations/0001_votes.sql`
aplicada, y sus credenciales (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) configuradas
como variables de entorno en desarrollo/Vercel. Ninguna tarea de `/speckit-tasks` puede "completar" la
creación de ese proyecto — es un paso manual de aprovisionamiento, documentado en quickstart.md. El
desarrollo y los tests (Jest + Playwright) NO requieren un proyecto Supabase real: Jest mockea el cliente
por completo, y Playwright intercepta las requests de red con `page.route()`.

## Complexity Tracking

> Sin violaciones de la constitución. Tabla no aplicable.
