# Contract: Ruta y Contrato de UI — `/methodology`

**Feature**: 002-methodology-page | **Artifact**: `app/methodology/page.tsx`

Contrato de la ruta expuesta a visitantes públicos. RSC generada estáticamente (SSG), sin fetching de
datos del lado del cliente, legible con JavaScript desactivado — mismo contrato no-funcional que
`specs/001-entries-directory/contracts/routes.md`.

## Ruta: `/methodology` — Página de metodología

- **Método/Render**: GET, estático (SSG). Sin `generateStaticParams` (no hay segmento dinámico — ruta
  única y fija, a diferencia de `/entries/[slug]`).
- **Metadata**: `generateMetadata` (o `export const metadata`) propio con `title` y `description`
  específicos de la página (no hereda el metadata genérico de `app/layout.tsx` sin más) — Decisión 5 de
  `research.md`.
- **Contenido MUST incluir, en este orden, cuatro secciones**:
  1. **Threat Tiers**: los tres niveles de amenaza, cada uno con `label` y `caption` importados de
     `lib/content/tiers.ts` — texto idéntico al que usa `TierStats` en la home (FR-002, SC-002).
  2. **Evidence Types**: los tres tipos de evidencia aceptados (traffic/usage stats, AI capability
     benchmarks, user migration signals), cada uno con una definición fija — sin ejemplos citados de
     `content/entries/` (FR-003).
  3. **Content Integrity Rule**: explicación en lenguaje llano de que toda entrada requiere ≥1 fuente,
     que el moat debe citar ≥1 fuente existente, que cualquier retador presente debe citar una fuente
     existente, y que el incumplimiento de cualquiera de estas reglas bloquea `next build` nombrando el
     campo y el archivo (FR-004; debe corresponder exactamente a las reglas V1–V8/V1b de
     `specs/001-entries-directory/contracts/entry.schema.md`, sin agregar ninguna regla que el esquema no
     implemente — SC-005).
  4. **Related Apps Grouping**: nota breve de que la sección "related apps" del detalle muestra las demás
     entradas que comparten la misma `category` (FR-005).
- **Sin JS**: las cuatro secciones son texto/HTML de servidor — legibles y navegables con
  `javaScriptEnabled: false` (FR-007, FR-009).
- **Responsive**: cumple NFR-001–NFR-005 heredados de `001-entries-directory` — sin scroll horizontal ni
  contenido recortado en los tres breakpoints (móvil `<640px` / tablet `640–1024px` / desktop `>1024px`).
  Al ser layout de texto en columna única (sin tabla ni grid de dos columnas), no hay nada que colapsar en
  el sentido de NFR-002/NFR-005 — se listan por completitud de cobertura de breakpoints (SC-004 de
  spec.md).
- **Chrome compartido**: usa el mismo `NavBar`/`Footer` que el resto del sitio, vía `app/layout.tsx` — no
  se renderiza un header/footer propio.
- **Contrato de aceptación**: US1 escenarios 1–4, US2 escenarios 1–2; SC-001–SC-005.

## Cambio a un contrato existente: `NavBar` (`components/NavBar.tsx`)

- **Antes**: el link `{ label: 'Methodology', href: '#' }` en `LINKS` no navegaba a ningún lado.
- **Ahora**: `href: '/methodology'` — MUST apuntar a la ruta real en todas las páginas que rendericen
  `NavBar` (todo el sitio, vía `app/layout.tsx`) (FR-006).
- **Fuera de alcance**: el prop `active` de `NavBar` sigue hardcodeado a `"Home"` en `app/layout.tsx`; esta
  feature no agrega resaltado de "Methodology" como activo al visitar `/methodology` (ver Assumptions de
  spec.md).

## Contrato no funcional (heredado de `001-entries-directory/research.md` Decisión 6)

| Atributo | Umbral | Fuente |
|----------|--------|--------|
| Lighthouse Performance | ≥ 90 | `001-entries-directory/research.md` Decisión 6 |
| LCP (móvil emulado) | < 2.5 s | ídem |
| CLS | < 0.1 | ídem |
| JS de cliente por página | ~110 KB gzip, aceptado como baseline de framework (0 propio de esta feature) | ídem (actualizado 2026-08-17) |
| Indexable / legible sin JS | Sí | FR-007, FR-009 |
| Responsive 3 breakpoints | Sin scroll horizontal / recorte | NFR-001–NFR-005, SC-004 |
