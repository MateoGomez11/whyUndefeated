# Phase 0 Research: Directorio de Entradas y Páginas de Detalle

**Feature**: 001-entries-directory | **Date**: 2026-08-12

Este documento resuelve las decisiones abiertas (formato de contenido, validación en build, presupuesto
de rendimiento, estrategia de pruebas) antes del diseño de la Fase 1. El stack base (Next.js App Router +
TypeScript, Jest + Playwright, Vercel) viene fijado por la constitución y no se re-litiga aquí.

## Decisión 1: Formato de archivo de contenido — JSON + esquema Zod

- **Decisión**: Cada entrada es un archivo `content/entries/{slug}.json` validado contra un esquema Zod en
  tiempo de build.
- **Rationale**: Los campos de una entrada son mayormente estructurados (nivel de amenaza como enum,
  arreglo de retadores con nombre/evidencia/fuente, lista de fuentes con label/URL). Zod da: (1) validación
  declarativa con rutas de error precisas → cumple FR-013 (mensaje que nombra el campo y el archivo),
  (2) tipos TypeScript derivados (`z.infer`) para acceso tipado en RSC sin duplicar definiciones,
  (3) validación en build que revienta la generación estática si algo falta (no llega a producción).
- **Alternativas consideradas**:
  - *Markdown + frontmatter YAML*: mejor para prosa larga, pero parte la validación entre frontmatter y
    cuerpo, y el "moat" cabe bien como un string de párrafo en JSON. Menos robusto para el gate de
    integridad. Rechazado.
  - *MDX*: introduce JS/JSX en el contenido → contradice "contenido como datos" y complica la validación y
    la contribución por PR de no-desarrolladores. Rechazado.
  - *CMS / base de datos*: prohibido por la constitución (contenido principal nunca en DB). Rechazado.

## Decisión 2: Generación estática (SSG) con `generateStaticParams`

- **Decisión**: La home (`/`) y cada detalle (`/entries/[slug]`) se generan estáticamente. `[slug]` usa
  `generateStaticParams()` para pre-renderizar exactamente las 7 entradas semilla; `dynamicParams = false`
  para que cualquier slug no listado caiga en `not-found`.
- **Rationale**: Cumple FR-011 (sin fetching cliente para el contenido) y FR-005/FR-015. El contenido se
  lee en build desde el filesystem; no hay origen dinámico. ISR queda disponible vía `revalidate` si más
  adelante el contenido cambia sin rebuild, pero para el MVP con contenido en repo el rebuild-on-merge es
  suficiente y más simple.
- **Alternativas consideradas**:
  - *ISR con revalidate corto*: innecesario cuando el contenido solo cambia por commit → cada merge ya
    dispara un rebuild en Vercel. Se deja `revalidate` como opción futura, no en el MVP.
  - *Renderizado dinámico (SSR por request)*: desperdicia caché/SEO y añade latencia. Rechazado.

## Decisión 3: Validación de contenido en build (falla ruidosa)

- **Decisión**: Un módulo cargador (`lib/content/loader.ts`) lee todos los archivos de `content/entries/`,
  los valida con el esquema Zod y **lanza** un error con `{archivo, campo, motivo}` si alguno es inválido.
  Se invoca durante `generateStaticParams` / carga de página, de modo que `next build` falla.
- **Rationale**: FR-013 y SC-004 exigen que entradas inválidas detengan la publicación con mensaje claro.
  Lanzar durante el build es la forma más simple y determinista de bloquear producción. Se complementa con
  un test de Jest que alimenta fixtures inválidas y verifica el mensaje.
- **Validación de URL de fuente**: cada fuente MUST tener una URL con formato válido absoluto (`http(s)://`).
  Se valida el **formato** en build (Zod `.url()`), no la accesibilidad de red (frágil y no determinista en
  CI). La verificación de enlaces rotos se deja como tarea de mantenimiento futura fuera del build.

## Decisión 4: Orden por nivel de amenaza + desempate

- **Decisión**: Mapear nivel a peso (`high=3, medium=2, low=1`), ordenar descendente por peso y, en empate,
  ascendente alfabético por `appName` (locale-aware, estable). Implementado en `lib/content/sort.ts` puro.
- **Rationale**: FR-002 y el caso borde de empate. Función pura → fácil de testear con Jest.

## Decisión 5: Derivación de slug estable

- **Decisión**: El slug es un campo explícito en el archivo de contenido (no derivado en runtime), p. ej.
  `"twitter-x"`. El nombre de archivo DEBE coincidir con el slug. Un test valida unicidad de slug y
  coincidencia archivo↔slug.
- **Rationale**: Slugs explícitos son estables y evitan sorpresas de normalización (FR-004, SEO). El
  ejemplo "Twitter/X" → `twitter-x` queda como dato, no como lógica frágil.

## Decisión 6: Presupuesto de rendimiento (hace SC-007 medible)

- **Decisión**: Objetivo Lighthouse **Performance ≥ 90** en páginas de contenido; **LCP < 2.5 s** y
  **CLS < 0.1** en móvil emulado; JS de cliente enviado por página de contenido **≤ 30 KB gzip** (solo
  islas interactivas futuras). El contenido principal es 100% HTML del servidor.
- **Rationale**: Convierte "rápida" (SC-007) en umbrales verificables sin sobre-especificar. Alineado con
  el principio de Rendimiento y SEO de la constitución.
- **Nota**: En este feature no hay islas interactivas (orden/filtro diferidos), así que el JS de cliente
  tiende a ~0 KB; el presupuesto es un techo para el futuro.

## Decisión 7: Estrategia de pruebas (Jest + Playwright)

- **Jest (unit/integración)**: esquema/validación de entradas (fixtures válidas e inválidas → mensaje de
  error nombra campo+archivo), `sort.ts`, unicidad/coincidencia de slug, cargador sobre las 7 entradas
  reales.
- **Playwright (e2e)**: navegación home→detalle en un clic, presencia de badge con texto+color y leyenda,
  cada afirmación con enlace de fuente clickeable, slug inexistente → not-found, y **legibilidad con
  JavaScript desactivado** (`javaScriptEnabled: false`) en home y detalle.
- **Rationale**: Cubre la lógica crítica exigida por la constitución (Principio IV) y mapea 1:1 con los
  escenarios de aceptación del spec.

## Resumen de resoluciones

| Tema | Resolución |
|------|-----------|
| Formato de contenido | JSON + Zod en `content/entries/{slug}.json` |
| Rendering | SSG con `generateStaticParams`, `dynamicParams = false` |
| Validación | Build falla vía loader que lanza `{archivo, campo, motivo}`; URL con formato válido |
| Orden | peso por nivel desc, desempate alfabético asc |
| Slug | campo explícito, nombre de archivo == slug, unicidad testeada |
| Performance (SC-007) | Lighthouse ≥90, LCP <2.5s, CLS <0.1, JS ≤30 KB |
| Pruebas | Jest (validación/sort/slug/loader) + Playwright (nav/badges/fuentes/not-found/no-JS) |

No quedan marcadores NEEDS CLARIFICATION.
