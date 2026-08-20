# Implementation Plan: Directorio de Entradas y Páginas de Detalle

**Branch**: `001-entries-directory` | **Date**: 2026-08-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-entries-directory/spec.md`

## Summary

Construir la página principal (directorio de entradas como tarjetas ordenadas por nivel de amenaza) y las
páginas de detalle por entrada para WhyUndefeated. El contenido de las 7 entradas semilla vive como
archivos JSON versionados en el repositorio, validados en tiempo de build contra un esquema Zod (un archivo
inválido rompe `next build` con un mensaje que nombra campo y archivo). Las páginas se generan
estáticamente como React Server Components, sin fetching de datos del lado del cliente y legibles con
JavaScript desactivado. Toda afirmación sobre un retador o el moat muestra una fuente clickeable, y cada
detalle reúne todas las citas en una sección de "fuentes". No hay autenticación, base de datos ni islas
interactivas en esta feature.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 24 LTS

**Primary Dependencies**: Next.js (App Router, última estable) con React Server Components; Zod para
validación de esquema de contenido

**Storage**: Archivos JSON versionados en el repositorio (`content/entries/*.json`). Sin base de datos en
esta feature (los contadores de voto vía Supabase quedan fuera de alcance).

**Testing**: Jest (unit/integración: validación de esquema, sort, slug, loader) + Playwright (e2e:
navegación, badges/fuentes, not-found, legibilidad con JS desactivado)

**Target Platform**: Web estática desplegada en Vercel (Fluid Compute por defecto); navegadores modernos y
degradación grácil sin JS

**Project Type**: Aplicación web (Next.js App Router, single project)

**Performance Goals**: Lighthouse Performance ≥ 90 en páginas de contenido; LCP < 2.5 s y CLS < 0.1 en
móvil emulado; JS de cliente ~110 KB gzip por página, aceptado como baseline de framework (0 propio de
esta feature al no haber islas) — ver research.md Decisión 6, actualizada 2026-08-17 tras medición real

**Constraints**: Contenido principal 100% renderizado en servidor (SSG); sin fetching cliente para
mostrar contenido; páginas legibles con JavaScript desactivado; sin secretos en el repo; sin PII;
responsive en tres breakpoints (móvil `<640px`, tablet `640–1024px`, desktop `>1024px`, NFR-001–NFR-005)
manteniéndose legible sin JS en los tres

**Scale/Scope**: 7 entradas semilla; 1 ruta de listado + 1 ruta dinámica de detalle + not-found; ~8
componentes de presentación + ~6 módulos de librería de contenido (incluye `tally` para el contador
derivado y `related` para "related apps" por categoría)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | ¿Cómo lo satisface el plan? | Estado |
|-----------|------------------------------|--------|
| I. Integridad de Contenido Basada en Evidencia | Validación Zod en build exige nivel de amenaza, moat y ≥1 fuente; cada retador presente requiere fuente; toda cita se renderiza clickeable (FR-007). Build falla nombrando campo+archivo. | ✅ PASS |
| II. Contenido como Código | Contenido en `content/entries/*.json` versionado, un archivo por entrada, listo para PR. DB no usada aquí. | ✅ PASS |
| III. Rendimiento y SEO con Prioridad en Servidor | RSC + SSG, `"use client"` = ninguno en esta feature, legible sin JS, presupuesto de performance definido. | ✅ PASS |
| IV. Pruebas Primero para Lógica Crítica | Jest cubre validación/carga/sort/slug; Playwright cubre navegación, votos (N/A aquí), generación y no-JS. Tests antes de dar por terminado. | ✅ PASS |
| V. Plantilla de Entrada Consistente y Contenido en Inglés | Un único componente `EntryDetail` compartido por todas las entradas; contenido de datos en inglés. | ✅ PASS |
| VI. Requisitos de Seguridad | Sin secretos (no hay Supabase/tokens en esta feature); sin PII ni auth; HTTPS por TLS de Vercel. | ✅ PASS |

**Resultado del gate (pre-Fase 0)**: PASS — sin violaciones. Complexity Tracking vacío.

**Re-evaluación post-Fase 1**: PASS — el diseño (esquema JSON, componentes de presentación compartidos,
loader que lanza en build) mantiene todos los principios. Ver `data-model.md` y `contracts/`.

## Sistema de Diseño (resuelto)

Extraído de `design-reference/` (export de Claude Design), que es la **fuente de verdad visual**. Se
documentan tokens de referencia, no volcados de código. Tema: violeta/negro, developer-culture, sin
gradientes ni sombras pesadas — la profundidad viene de bordes 1px + glow violeta. Sin emoji.

### Paleta de color

| Rol | Token | Hex / valor |
|-----|-------|-------------|
| Fondo de página | `--bg-0` | `#0a0a0f` |
| Panel/fila elevada | `--bg-1` | `#101018` |
| Card | `--bg-2` | `#16161f` |
| Card hover/activo | `--bg-3` | `#1d1d29` |
| Bordes | `--border-subtle/default/strong` | `#221f30` / `#34324a` / `#4a4768` (1px) |
| Texto | `--fg-primary/secondary/tertiary/disabled` | `#f1f1f6` / `#a3a1b8` / `#6d6b85` / `#4a4860` |
| **Acento violeta** (único decorativo) | `--brand-300/400/500/600/700` | `#c4b5fd` / `#a78bfa` / `#8b5cf6` / `#7c3aed` / `#6d28d9` |
| Links | `--link` / `--link-hover` | `--brand-400` / `--brand-300` |

**Colores de nivel de amenaza — sistema semántico INDEPENDIENTE** (nunca reutilizado decorativamente;
FR-017): High `--threat-high #f0453a`, Medium `--threat-medium #f2b13c`, Low `--threat-low #35d68e`. Cada
tier trae `-bg`, `-border` y `-glow` en oklch. La categoría (Social/Content/Knowledge/Community) es
metadata neutral — **nunca** con color, para no competir con el sistema de amenaza.

### Tipografía

- **Familias**: `--font-sans` = **Space Grotesk** (titulares y cuerpo); `--font-mono` = **JetBrains Mono**
  (datos, labels, badges, chrome). Labels mono en mayúsculas con tracking `+0.08em`.
- **Escala**: display 56 · h1 40 · h2 28 · h3 20 · body-lg 17 · body 15 · sm 13 · xs 11 · mono-data 14 (px).
- **Interlínea**: tight 1.1 · snug 1.3 · normal 1.55. **Tracking**: tight −0.02em · wide 0.04em · label 0.08em.
- **Pesos**: 400/500/600/700. Roles: `h1` = 700 40/1.1 sans −0.02em; `label` = 500 11 mono uppercase 0.08em;
  `data` = 600 14 mono. Casing: sentence-case en titulares/cuerpo, UPPERCASE mono en labels/badges/eyebrows.
- **Rendimiento (desviación obligatoria)**: la referencia carga fuentes vía `@import` de Google Fonts en
  runtime. En producción usar **`next/font`** (auto-hospedado) para cumplir el Principio III (sin CSS
  externo bloqueante) y VI (sin dependencia de host externo). No copiar el `@import`.

### Espaciado, radios y layout

- **Escala de espaciado** (px): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 96 (`--space-1`…`--space-24`).
- **Radios** (forma nítida): `--radius-xs 2` · `sm 3` · `md 4` · `pill 999`. Borde 1px.
- **Layout**: `--page-max-width 1240px`, gutter `--space-6 (24px)`.
- **Motion**: ease `cubic-bezier(0.2,0.8,0.2,1)`; ~120ms micro, ~220ms normal, ~420ms entrada. Glow en hover
  (`--glow-hover`), cursor parpadeante tras titulares (`.ds-cursor`). Todo esto es **mejora progresiva**.

### Patrón de hero (headline fijo de dos líneas)

Hero **centrado**. Eyebrow: label mono uppercase en `--brand-400` ("AI REPLACEMENT TRACKER") — **sin
cursor**. Debajo, **titular de display fijo a dos líneas** en Space Grotesk 700
`clamp(32px, 5vw, 64px)/1.15`, tracking −0.02em, `max-width` 880, centrado:
- **Línea 1** (`white-space: nowrap`): `Is <nombre de app>` — el nombre cicla con efecto typewriter
  (subrayado `--brand-600`, color `--brand-400`) seguido del **cursor parpadeante `.ds-cursor`**.
- **Línea 2**: `Still Undefeated?`

El cursor parpadeante existe **únicamente** en esta animación del hero, **nunca** en el header/wordmark
(el wordmark `why`+`undefeated` no lleva cursor). El typewriter es **mejora progresiva**: el primer nombre
se renderiza en servidor, así que sin JS el titular se lee completo ("Is <primer nombre> Still Undefeated?").
Luego párrafo `body-lg` en `--fg-secondary`, `max-width` ~520, centrado, y debajo el ticker (contador).

### Estilo de ticker / contador (StatCounter)

El contador agregado de la home (FR-021) se muestra como **ticker compacto en línea**, centrado: mono 12px,
uppercase, `letter-spacing 0.06em`, `--fg-tertiary`, con los números en `--brand-300` 700 separados por
`·` (`--border-strong`). El count-up odómetro (`ds-digit-flip`) es **mejora progresiva**: el valor final
está en el HTML de servidor (sin JS se ve el número estático — FR-011). Contenido = **totales de FR-021**
(apps rastreadas / citas de fuente / votos = 0), derivados de datos — nunca un índice editorial. El
`StatCounter` grande (56/72px) del design-reference se usa en los "TierBlocks" High/Medium/Low, que en esta
feature quedan **diferidos** por ser filtros interactivos (FR-002).

### Estilo de filas de la tabla (tracker list)

Contenedor con 1px `--border-subtle`, `--radius-md`, `overflow:hidden`. Cabecera: `.ds-label` mono
uppercase, grid, padding `10px var(--space-5)`, fondo `--bg-1`, texto `--fg-tertiary`. Filas de datos: grid,
`align-items:center`, padding `var(--space-4) var(--space-5)`, fondo `--bg-2`, separador 1px
`--border-subtle`, hover → `--bg-3` (120ms). Celda de app: **logo placeholder** = cuadro 32×32, `--bg-1`,
1px `--border-default`, `--radius-sm`, inicial en mono 700 `--fg-secondary`; junto al nombre en sans 600 15.
Categoría: `Badge` neutral (sin color). Resumen: `--fg-secondary` 13. Amenaza: `ThreatBadge size="sm"`.
**Desviación**: la referencia incluye una columna "Updated" — se **omite** (no existe campo de fecha; ver
brief). Grid sin esa columna, p. ej. `2fr 1fr 2.6fr 1.2fr`.

### ThreatBadge (satisface FR-017)

`inline-flex` con punto de color + etiqueta mono 700 uppercase ("HIGH THREAT" / "MEDIUM THREAT" /
"LOW THREAT"), padding `5px 12px` (`sm` `3px 8px`), `--radius-xs`, `bg`/`border`/`color` del tier + glow
`box-shadow`. Comunica el nivel por **color y texto**, cumpliendo FR-017.

### Header de la página de detalle

Link de regreso mono 13 `--brand-400` ("← back to tracker"). Fila de cabecera `space-between`:
- **Columna izquierda** (max ~620): fila con `Badge` de categoría (neutral) + **logo placeholder** (cuadro
  de inicial mono, mismo estilo que la tabla). Debajo, nombre de la app como `h1` (700 40/1.1, −0.02em),
  párrafo de veredicto `body-lg` `--fg-secondary`, y `ThreatBadge`.
- **Desviaciones obligatorias**: (1) **sin** línea "Updated X days ago" (el brief la elimina; no hay campo
  de fecha); (2) **sin** contador "Confidence %" — la referencia lo muestra, pero el puntaje de confianza
  está RECHAZADO (Principio I). No reintroducir ninguno.
- Cuerpo: grid `1fr 320px` — principal (evidencia/fuentes) + sidebar "Related apps" (cards con nombre +
  `ThreatBadge sm`), que mapea a la sección de FR-020.

### Responsive / Breakpoints (NFR-001–NFR-005)

**Breakpoints**: móvil `<640px` · tablet `640–1024px` · desktop `>1024px`. El `design-reference/` no define
ninguna media query — todos sus layouts son de ancho fijo/desktop; el colapso responsive documentado aquí
es enteramente nuevo en esta feature, no portado de la referencia.

- **Tabla de tracker (home)**: en `<640px` la grid `2fr 1fr 2.6fr 1.2fr` (ver "Estilo de filas de la
  tabla") colapsa a tarjetas apiladas — una por entrada, en columna: logo+nombre arriba, luego `Badge` de
  categoría, resumen y `ThreatBadge`. Sin scroll horizontal ni columnas desbordadas (NFR-002).
- **Hero**: el titular fijo a dos líneas ya usa `clamp(32px, 5vw, 64px)` (ver "Patrón de hero"), así que
  reduce tamaño de forma fluida sin romper el patrón de dos líneas. La barra de búsqueda y el ticker/stat
  blocks pasan de fila a columna en `<640px` (`flex-direction: column`) (NFR-003).
- **Header nav**: en `<1024px` los links colapsan detrás de un toggle compacto. Implementación preferida:
  **puro CSS** (`<input type="checkbox">` oculto + `label` visible como botón + selector
  `:checked ~ .nav-links { display: flex }`, o `<details>/<summary>` nativo) en vez de un componente
  cliente — preserva el Principio III: sin JS, los links de navegación siguen presentes/navegables en el
  HTML, solo se pierde la animación de colapso (NFR-004).
- **Detalle**: la grid `1fr 320px` (contenido + sidebar "Related apps") colapsa a una columna
  (`grid-template-columns: 1fr`) en `<640px`. "Related apps" se posiciona **después** del contenido
  principal en el orden natural del DOM (no vía `order` de flex/grid), para que la lectura sin CSS/JS
  también siga el orden lógico correcto (NFR-005).

### Resumen de desviaciones respecto a `design-reference/`

1. Sin "Confidence %" en detalle (puntaje de confianza rechazado — Principio I).
2. Sin línea/columna "Updated" (no hay campo de fecha en el modelo de datos).
3. Contador de la home = totales de FR-021, no un índice editorial.
4. `FilterPill`/`SearchInput` existen como estilo, pero el **filtrado/búsqueda interactivo está DIFERIDO**
   (clarificación "solo orden estático", FR-002); en esta feature la categoría solo alimenta "related apps"
   estático.
5. Fuentes vía `next/font`, no `@import` de Google Fonts en runtime.
6. Animaciones (count-up, glow, cursor) son mejora progresiva; el contenido y los números son legibles sin JS.
7. Breakpoints y colapso responsive (móvil/tablet/desktop, NFR-001–NFR-005): el `design-reference/` es
   desktop-only y no define ninguno — ver "Responsive / Breakpoints" arriba.

## Project Structure

### Documentation (this feature)

```text
specs/001-entries-directory/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (entry schema + route contract)
│   ├── entry.schema.md
│   └── routes.md
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                 # Layout raíz (metadata base, sin JS de cliente)
├── page.tsx                   # Home: directorio de entradas (RSC, SSG)
├── not-found.tsx              # Página de "no encontrado" legible (FR-015)
└── entries/
    └── [slug]/
        └── page.tsx           # Detalle de entrada (RSC, SSG, generateStaticParams)

components/
├── EntryCard.tsx              # Tarjeta de la home (nombre, badge, resumen, link)
├── ThreatBadge.tsx            # Badge con color + etiqueta de texto (FR-017)
├── TierStats.tsx              # Tier stat blocks: conteo + leyenda por nivel (FR-003)
├── HomeStats.tsx              # Contador agregado derivado en build (FR-021)
├── EntryDetail.tsx            # PLANTILLA COMPARTIDA de detalle (FR-009)
├── ChallengerList.tsx         # Lista de retadores (nombre, evidencia, fuente)
├── RelatedApps.tsx            # Sección "related apps" por categoría (FR-020)
└── SourcesList.tsx            # Sección de fuentes deduplicadas (FR-008)

lib/
└── content/
    ├── schema.ts              # Esquema Zod + tipos derivados (Entry, Challenger, Source, Category)
    ├── loader.ts              # Lee/parsea/valida content/entries/*.json; lanza en build
    ├── sort.ts                # Orden por nivel de amenaza + desempate alfabético
    ├── tally.ts               # Totales derivados: apps, citas de fuente, votos=0 (FR-021)
    ├── related.ts             # Related apps por categoría (FR-020)
    └── slug.ts                # Utilidades de slug (unicidad, coincidencia archivo↔slug)

content/
└── entries/
    ├── pinterest.json
    ├── wikipedia.json
    ├── reddit.json
    ├── twitter-x.json
    ├── tiktok.json
    ├── goodreads.json
    └── linkedin.json

tests/
├── unit/                      # Jest: schema, sort, slug, tally, related
│   ├── schema.test.ts
│   ├── sort.test.ts
│   ├── slug.test.ts
│   ├── tally.test.ts          # Verifica que los totales coinciden con los datos (FR-021, SC-008)
│   └── related.test.ts        # Related apps por categoría, incluye caso categoría única (FR-020)
├── integration/               # Jest: loader sobre fixtures + 7 entradas reales
│   ├── loader.valid.test.ts
│   └── loader.invalid.test.ts
└── fixtures/                  # Entradas inválidas para probar el gate de validación

e2e/                           # Playwright
├── directory.spec.ts          # Home: 7 tarjetas, orden, leyenda, navegación
├── detail.spec.ts             # Detalle: campos, fuentes clickeables, not-found
└── no-js.spec.ts              # Legibilidad con JavaScript desactivado
```

**Structure Decision**: Aplicación web Next.js App Router de un solo proyecto. Las rutas viven en `app/`,
la presentación en `components/` (con `EntryDetail` como única plantilla de detalle para satisfacer
FR-009), la lógica de contenido testeable en `lib/content/`, y el contenido versionado en
`content/entries/`. Jest en `tests/`, Playwright en `e2e/`. No se usan `backend/`/`frontend/` separados
porque esta feature es puramente de presentación estática sin API ni base de datos.

**Fuente de verdad visual**: las implementaciones en `components/` DEBEN coincidir visualmente con
`design-reference/` (tokens y patrones documentados arriba en "Sistema de Diseño (resuelto)"), aplicando
las desviaciones obligatorias listadas (sin confidence score, sin "Updated", filtros diferidos, `next/font`,
animaciones como mejora progresiva). Los tokens (`design-reference/tokens/*.css`) se portan a la app como
CSS custom properties / `next/font`; los `.jsx` de la referencia son guía visual, no código a copiar tal
cual.

**`design-reference/` es material de referencia únicamente — NO es código enviado a producción.** No se
importa desde `app/`, `components/` ni `lib/`, por lo que Next.js no lo incluye en el bundle. Además se
excluye del despliegue vía `.vercelignore` (entrada `design-reference/`) para que no forme parte del output
de build de producción. (Alternativa equivalente: añadirlo a `.gitignore` si se prefiere no versionarlo;
aquí se mantiene versionado como referencia pero fuera del deploy.)

## Complexity Tracking

> Sin violaciones de la constitución. Tabla no aplicable.
