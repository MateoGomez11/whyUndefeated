# Implementation Plan: Página de Metodología

**Branch**: `002-methodology-page` | **Date**: 2026-08-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-methodology-page/spec.md`

## Summary

Agregar una página estática nueva en `/methodology` que explique el método de WhyUndefeated: los tres
niveles de amenaza (reutilizando textualmente la misma redacción que ya usa la home, vía una fuente
compartida), los tres tipos de evidencia aceptados (solo definicional, sin ejemplos de `content/entries/`),
la regla real de integridad de contenido que hace fallar `next build` ante una entrada inválida, y cómo se
agrupan las "related apps" (misma `category`). El enlace "Methodology" del header, que hoy apunta a `#`,
pasa a apuntar a `/methodology`. Como paso previo, el texto de los tiers se extrae de
`components/TierStats.tsx` a un módulo compartido `lib/content/tiers.ts` (Clarification de la sesión
2026-08-17) del que importan tanto `TierStats` como la página nueva — refactor pequeño, mismo output visual,
cubierto por un test unitario nuevo.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 24 LTS (mismo stack que `001-entries-directory`)

**Primary Dependencies**: Next.js (App Router) con React Server Components — sin dependencias nuevas; no se
usa Zod aquí porque no hay contenido versionado que validar (ver Storage)

**Storage**: N/A — el copy de la página es texto estático embebido en componentes TypeScript
(`lib/content/tiers.ts` + el propio `app/methodology/page.tsx`), no un archivo en `content/entries/`; no
hay validación de esquema para esta feature (Key Entities de spec.md: "No aplica")

**Testing**: Jest (un test unitario nuevo para `lib/content/tiers.ts` + verificación de que `TierStats`
sigue renderizando los mismos labels/colores tras el refactor) + Playwright (un e2e nuevo para
`/methodology`, reutilizando el patrón de viewports emulados de `e2e/responsive.spec.ts` y el proyecto
`no-js`)

**Target Platform**: Web estática en Vercel — igual que el resto del sitio; misma ruta de despliegue, sin
infraestructura nueva

**Project Type**: Aplicación web (Next.js App Router, single project) — se integra al proyecto existente,
no crea uno nuevo

**Performance Goals**: Hereda el mismo presupuesto que `001-entries-directory` (research.md Decisión 6,
actualizada 2026-08-17 tras medición real): Lighthouse Performance ≥ 90, LCP < 2.5s, CLS < 0.1 en móvil
emulado, JS de cliente ~110 KB gzip aceptado como baseline del framework (no ≤30KB — ese techo original
asumía JS ~0 y no contempló el runtime de hidratación de Next.js App Router). Esta página en particular no
agrega NINGÚN JS de cliente propio (RSC puro, sin `"use client"`), así que el
JS por página se mantiene en el mismo nivel de framework-baseline que ya tienen `/` y `/entries/[slug]`.

**Constraints**: Página 100% estática (SSG, sin `generateStaticParams` porque es una ruta única no
paramétrica); sin fetching de datos en build ni en cliente; legible con JavaScript desactivado; responsive
en los tres breakpoints ya establecidos (NFR-001–NFR-005, heredados de `001-entries-directory`); sin
duplicar el texto de los tiers (Clarification — debe venir de una fuente compartida)

**Scale/Scope**: 1 ruta nueva (`/methodology`) + 1 módulo de contenido compartido (`lib/content/tiers.ts`)
+ 1 corrección de 1 línea en `components/NavBar.tsx` (el href de "Methodology"); ningún componente de
presentación reutilizable nuevo más allá de lo necesario para maquetar secciones de texto dentro de la
propia página

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | ¿Cómo lo satisface el plan? | Estado |
|-----------|------------------------------|--------|
| I. Integridad de Contenido Basada en Evidencia | No aplica contenido de entradas nuevo; la página *describe* la regla de integridad ya existente sin inventar ninguna regla nueva (FR-004 exige que el copy coincida con lo que el esquema realmente valida). | ✅ PASS |
| II. Contenido como Código | El copy de esta página no es "contenido principal" versionado por entrada (no es una app/plataforma evaluada) — es texto de UI, igual que el resto de copy estático del sitio (hero, footer, nav). No se guarda en `content/entries/` ni requiere esquema Zod (ver Key Entities de spec.md). | ✅ PASS |
| III. Rendimiento y SEO con Prioridad en Servidor | RSC puro, sin `"use client"`, SSG, sin JS de cliente añadido, legible sin JS (FR-007, FR-009). | ✅ PASS |
| IV. Pruebas Primero para Lógica Crítica | El único código con lógica (la extracción a `lib/content/tiers.ts`) lleva su test unitario antes de darse por terminado; el e2e de la página nueva se escribe siguiendo el mismo patrón TDD que `001-entries-directory`. | ✅ PASS |
| V. Plantilla de Entrada Consistente y Contenido en Inglés | No aplica plantilla de entrada (esta no es una página de entrada tipo `/entries/[slug]`, es una página de contenido único). El copy de la página se escribe en inglés, igual que el resto del sitio. | ✅ PASS |
| VI. Requisitos de Seguridad | Sin secretos, sin PII, sin formularios ni datos de usuario; HTTPS heredado de Vercel. | ✅ PASS |

**Resultado del gate (pre-Fase 0)**: PASS — sin violaciones. Complexity Tracking vacío.

**Re-evaluación post-Fase 1**: PASS — el diseño (módulo de tiers compartido, página RSC sin fetching,
contrato de ruta único) no introduce ningún componente cliente, ningún dato nuevo persistido, ni ninguna
plantilla adicional. Ver `data-model.md` y `contracts/`.

## Project Structure

### Documentation (this feature)

```text
specs/002-methodology-page/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/            # Phase 1 output
│   └── route.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

Aplicación web Next.js App Router de un solo proyecto — mismo repo y misma estructura que
`001-entries-directory`, sin `backend/`/`frontend/` separados.

```text
app/
└── methodology/
    └── page.tsx            # Página nueva (RSC, SSG, sin generateStaticParams — ruta única)

components/
└── TierStats.tsx           # Refactor: importa TIERS desde lib/content/tiers.ts en vez de definirlo inline

lib/
└── content/
    └── tiers.ts             # NUEVO: fuente única de verdad para label/caption/shortCaption/color/glow
                              # por nivel de amenaza (antes vivía inline en TierStats.tsx)

tests/
└── unit/
    └── tiers.test.ts         # NUEVO: verifica que TIERS expone los 3 niveles con la forma esperada;
                              # test de regresión de TierStats confirma que sigue renderizando los mismos
                              # labels/colores tras el refactor (mismo archivo o tests/unit/tier-stats.test.ts)

e2e/
└── methodology.spec.ts       # NUEVO: visita /methodology, verifica las 4 secciones, el link del nav,
                              # y NFR-001–NFR-005 (viewports emulados + proyecto no-js)
```

**Structure Decision**: Se integra directamente al proyecto Next.js existente de `001-entries-directory`
— ninguna estructura nueva de carpetas de alto nivel. La única pieza de lógica real (`lib/content/tiers.ts`)
sigue la convención ya establecida de `lib/content/*` (módulos puros, testeados con Jest). La página en sí
(`app/methodology/page.tsx`) es hoja del App Router, sin rutas dinámicas ni `generateStaticParams` porque
no hay parámetro — a diferencia de `/entries/[slug]`, esta es una única ruta fija.

## Complexity Tracking

> Sin violaciones de la constitución. Tabla no aplicable.
