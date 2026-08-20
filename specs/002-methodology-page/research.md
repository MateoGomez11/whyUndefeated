# Phase 0 Research: Página de Metodología

**Feature**: 002-methodology-page | **Date**: 2026-08-17

No quedan marcadores `NEEDS CLARIFICATION` — las dos decisiones de arquitectura con múltiples opciones
razonables ya se resolvieron en `/speckit-clarify` (ver spec.md § Clarifications) y el resto del contexto
técnico vino resuelto en el input del usuario a `/speckit-plan`. Este documento consolida esas decisiones
en el mismo formato que `specs/001-entries-directory/research.md`, del cual esta feature hereda el stack
base, el presupuesto de performance y la estrategia de pruebas (no se re-litigan aquí).

## Decisión 1: Ubicación del texto de tiers — `lib/content/tiers.ts`

- **Decisión**: Extraer el array `TIERS` (level, label, caption, shortCaption, color, glow) que hoy vive
  inline en `components/TierStats.tsx` a un módulo nuevo `lib/content/tiers.ts`. `TierStats.tsx` pasa a
  importar `TIERS` desde ahí; la página de metodología importa el mismo array.
- **Rationale**: Resuelve la Clarification de la sesión 2026-08-17 (FR-002): una sola fuente de verdad
  para el copy de los tiers evita que la home y `/methodology` diverjan si alguien edita la redacción en
  un solo lugar. `lib/content/` es la convención ya establecida en el repo para módulos puros de contenido
  (`schema.ts`, `sort.ts`, `slug.ts`, `tally.ts`, `related.ts`); `tiers.ts` encaja ahí en vez de en
  `components/`, porque ahora lo consumen dos componentes distintos, no uno.
- **Alternativas consideradas**:
  - *Duplicar el texto como constante en la página nueva*: rechazado explícitamente en `/speckit-clarify`
    — reintroduce el riesgo de desincronización que la clarificación buscaba eliminar.
  - *Mover `TIERS` a `lib/content/schema.ts`*: rechazado — `schema.ts` es el contrato de validación de
    `Entry`/`Challenger`/`Source`; el copy de los tiers no es un esquema de contenido versionado, mezclar
    ambos oscurece el propósito del archivo.
  - *Exportarlo desde `components/TierStats.tsx` y que la página lo importe desde ahí*: técnicamente
    funciona, pero mezcla "módulo de datos" con "componente de presentación" en el mismo archivo y crea un
    acoplamiento raro (una página importando de un componente en vez de al revés). Rechazado a favor de un
    módulo de datos independiente.

## Decisión 2: Ruta y estrategia de renderizado — `app/methodology/page.tsx`, estática, sin parámetro

- **Decisión**: Página nueva en `app/methodology/page.tsx` (RSC, sin `"use client"`), SSG por defecto (sin
  `generateStaticParams` porque no hay segmento dinámico — es una única ruta fija, a diferencia de
  `/entries/[slug]`).
- **Rationale**: Sigue el mismo patrón de `001-entries-directory` (Decisión 2 de su research.md): contenido
  100% servidor, sin fetching de cliente. Al no haber parámetro no aplica el mecanismo de
  `dynamicParams = false` / `not-found` que sí necesita `/entries/[slug]` — esta ruta siempre existe o no
  existe (control de versiones), no hay "slug inexistente" posible aquí (ver Edge Cases de spec.md).
- **Alternativas consideradas**:
  - *Renderizar la metodología como sección dentro de `/` (ancla en la home)*: rechazado por el propio
    input de la feature ("Where: /methodology") y porque mezclar el directorio con la explicación del
    método diluye el propósito de ambas páginas.

## Decisión 3: Contenido de "tipos de evidencia" — solo definicional, sin leer `content/entries/`

- **Decisión**: La sección de evidencia es texto estático (3 definiciones fijas); la página NO llama a
  `loadAllEntries()` ni a ningún otro loader de contenido.
- **Rationale**: Resuelve la Clarification de la sesión 2026-08-17. Mantiene la página completamente
  desacoplada del pipeline de contenido versionado — no hay riesgo de que un build falle en esta página por
  una entrada inválida en `content/entries/`, y el alcance de implementación queda mínimo (sin lógica,
  solo copy).
- **Alternativas consideradas**:
  - *Citar un ejemplo real por tipo de evidencia leyendo las entradas semilla*: más ilustrativo pero
    acopla la página al content pipeline y a datos que cambian con el tiempo; explícitamente rechazado en
    `/speckit-clarify`.

## Decisión 4: Testing

- **Decisión**: Jest cubre únicamente la lógica nueva real: `lib/content/tiers.ts` (forma/valores de
  `TIERS`) y una prueba de regresión de que `TierStats` sigue renderizando los mismos labels/colores tras
  el refactor de import. Playwright cubre `/methodology` end-to-end: presencia de las 4 secciones (Threat
  Tiers, Evidence Types, Content Integrity Rule, Related Apps Grouping), el link del nav ya no cae en 404,
  y NFR-001–NFR-005 reutilizando el patrón de viewports emulados de `e2e/responsive.spec.ts` (mobile
  375px / tablet 768px / desktop 1280px) más una verificación en el proyecto `no-js`.
- **Rationale**: Cumple el Principio IV (pruebas antes de dar por terminada la lógica crítica) sin
  sobre-testear copy estático — no hay lógica de negocio en el contenido de la página en sí, solo en el
  refactor de `tiers.ts`, que es lo único con riesgo real de regresión.
- **Alternativas consideradas**:
  - *Snapshot test de todo el HTML de la página*: frágil ante cualquier cambio de copy/estilo menor, no
    aporta más señal que las aserciones targeted de Playwright. Rechazado.

## Decisión 5: Metadata / SEO

- **Decisión**: La página exporta su propio `generateMetadata` (o `export const metadata`) con `title` y
  `description` propios de la metodología, en vez de heredar el metadata genérico de `app/layout.tsx`.
- **Rationale**: Cada ruta de contenido en este sitio (home, detalle) ya define su propósito vía metadata
  específico; una página de metodología indexable por buscadores se beneficia de un `title`/`description`
  que la describan a ella, no al sitio en general (Principio III: SEO con prioridad en servidor).
- **Alternativas consideradas**: *No definir metadata propio (heredar el de `layout.tsx`)* — funcionaría
  pero perdería la oportunidad de un `title` de página específico para SEO/pestañas del navegador.
  Rechazado por bajo costo de hacerlo bien.

## Heredado sin cambios de `001-entries-directory/research.md`

| Tema | Resolución heredada |
|------|---------------------|
| Stack base | Next.js App Router + TypeScript, Jest + Playwright, Vercel |
| Performance (SC-007 equivalente) | Lighthouse ≥90, LCP <2.5s, CLS <0.1; JS ~110 KB gzip aceptado como baseline de framework (Decisión 6, actualizada 2026-08-17) |
| Legibilidad sin JS | Verificada con Playwright `javaScriptEnabled: false` (proyecto `no-js`) |
| Responsive | NFR-001–NFR-005 y breakpoints ya implementados en `app/globals.css` (móvil `<640px` / tablet `640–1024px` / desktop `>1024px`) |

No quedan marcadores NEEDS CLARIFICATION.
