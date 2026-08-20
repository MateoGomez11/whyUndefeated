# Contract: Rutas y Contrato de UI

**Feature**: 001-entries-directory | **Artifact**: `app/` (App Router)

Contrato de las rutas expuestas a visitantes públicos. Todas son RSC generadas estáticamente (SSG), sin
fetching de datos del lado del cliente para el contenido, y legibles con JavaScript desactivado.

## Ruta: `/` — Directorio de entradas

- **Método/Render**: GET, estático (SSG).
- **Contenido**: una `EntryCard` por entrada publicada, ordenadas por nivel de amenaza alto→bajo con
  desempate alfabético (FR-002); una `ThreatLegend` visible (FR-003).
- **Cada tarjeta muestra**: `appName`, `ThreatBadge` (color + etiqueta de texto, FR-017), `summary` de una
  línea, y enlaza a `/entries/{slug}` (FR-004).
- **Contador agregado**: `HomeStats` muestra totales derivados en build (apps rastreadas, citas de fuente
  documentadas, votos de la comunidad = 0) computados por `lib/content/tally.ts` a partir de los datos;
  nunca un puntaje inventado o compuesto (FR-021, SC-008).
- **Sin JS**: listado, badges, leyenda, contador y enlaces funcionan (FR-011).
- **Contrato de aceptación**: US1 escenarios 1–5; SC-008.

## Ruta: `/entries/[slug]` — Detalle de entrada

- **Método/Render**: GET, estático. `generateStaticParams()` emite los 7 slugs semilla;
  `dynamicParams = false`.
- **Renderiza** (vía `EntryDetail`, plantilla compartida — FR-009): `appName`, `ThreatBadge` (nivel),
  `ChallengerList` (cada retador: nombre, evidencia de una línea, enlace de fuente clickeable — FR-006),
  párrafo `moat` con su(s) cita(s) de fuente clickeable(s) (FR-007), y `SourcesList` con todas las fuentes
  deduplicadas (FR-008).
- **Entrada sin retadores**: la sección de retadores se omite limpiamente (FR-018).
- **Related apps**: `RelatedApps` lista de forma estática las demás entradas de la misma `category`; si la
  entrada es la única de su categoría, la sección se omite (FR-020, SC-009).
- **Sin JS**: todo el contenido, related apps y los enlaces de fuentes son legibles/clickeables (FR-011).
- **Contrato de aceptación**: US2 escenarios 1–6; SC-009.

## Ruta: slug inexistente → `not-found`

- **Comportamiento**: un `/entries/{slug}` que no corresponde a una entrada publicada renderiza
  `app/not-found.tsx` (página legible, no error crudo) con código 404 (FR-015).
- **Contrato de aceptación**: US2 escenario 5.

## Contrato no funcional (aplica a todas las rutas de contenido)

| Atributo | Umbral | Fuente |
|----------|--------|--------|
| Lighthouse Performance | ≥ 90 | research Decisión 6 / SC-007 |
| LCP (móvil emulado) | < 2.5 s | research Decisión 6 |
| CLS | < 0.1 | research Decisión 6 |
| JS de cliente por página | ~110 KB gzip, aceptado como baseline de framework (0 propio de esta feature) | research Decisión 6 (actualizada 2026-08-17) |
| Indexable / legible sin JS | Sí | FR-011, SC-005, SC-007 |
