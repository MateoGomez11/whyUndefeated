# Data Model: Directorio de Entradas y Páginas de Detalle

**Feature**: 001-entries-directory | **Date**: 2026-08-12

El modelo de datos es el contenido versionado en el repositorio. No hay base de datos en esta feature.
Cada entrada es un archivo `content/entries/{slug}.json` conforme al esquema Zod de `lib/content/schema.ts`.

## Entidad: Entry (Entrada)

Una app/plataforma evaluada. Un archivo por entrada; el nombre de archivo DEBE ser `{slug}.json`.

| Campo | Tipo | Obligatorio | Reglas de validación |
|-------|------|-------------|----------------------|
| `slug` | string | Sí | kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$`; único entre entradas; DEBE coincidir con el nombre de archivo |
| `appName` | string | Sí | No vacío; nombre visible (p. ej. "Twitter/X") |
| `threatLevel` | enum | Sí | Uno de `"low" | "medium" | "high"` (FR-014) |
| `category` | enum | Sí | Uno de `"Social" | "Content" | "Knowledge" | "Community"` (FR-019); alimenta "related apps" y futuros filtros |
| `summary` | string | Sí | Resumen de una línea; no vacío; recomendado ≤ 160 chars (tarjeta + meta description SEO) |
| `moat` | string | Sí | Párrafo no vacío que explica el moat (FR-013) |
| `challengers` | Challenger[] | Sí (puede estar vacío) | Arreglo; puede ser `[]` (retadores opcionales, FR-018); si tiene elementos, cada uno se valida |
| `sources` | Source[] | Sí | Mínimo 1 elemento (FR-013: al menos una fuente) |

**Reglas derivadas / de integridad**:
- Toda `sourceId` referenciada por un `Challenger` DEBE existir en `sources` (integridad referencial).
- El moat DEBERÍA citar al menos una fuente vía `moatSourceIds` para cumplir "toda afirmación del moat
  muestra su fuente" (FR-007). Ver campo `moatSourceIds` abajo.
- Un archivo que viole cualquier regla obligatoria hace que el loader **lance** en build con
  `{archivo, campo, motivo}` (FR-013, SC-004).

## Entidad: Challenger (Retador)

Un competidor real nombrado dentro de una entrada.

| Campo | Tipo | Obligatorio | Reglas de validación |
|-------|------|-------------|----------------------|
| `name` | string | Sí | No vacío; nombre del retador |
| `evidence` | string | Sí | Resumen de evidencia de una línea (financiamiento, ranking o tracción) |
| `sourceId` | string | Sí | DEBE referenciar el `id` de un elemento de `sources` (cada afirmación con fuente, FR-006/FR-007) |

## Entidad: Source (Fuente)

Una referencia verificable citada por una o más afirmaciones. Se lista una sola vez por página (FR-008).

| Campo | Tipo | Obligatorio | Reglas de validación |
|-------|------|-------------|----------------------|
| `id` | string | Sí | Único dentro de la entrada; referenciado por `challengers[].sourceId` y `moatSourceIds` |
| `label` | string | Sí | Título/etiqueta legible de la fuente |
| `url` | string | Sí | URL absoluta válida `http(s)://` (Zod `.url()`); se valida formato, no accesibilidad de red |

## Campo de la entrada para citar el moat

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `moatSourceIds` | string[] | Sí | Mínimo 1; cada valor DEBE referenciar un `sources[].id` (FR-007: la explicación del moat muestra fuente) |

## Relaciones

```text
Entry (1) ──< (0..n) Challenger        # challengers puede estar vacío (FR-018)
Entry (1) ──< (1..n) Source            # al menos una fuente (FR-013)
Challenger (n) ──> (1) Source          # via sourceId (integridad referencial)
Entry.moatSourceIds (1..n) ──> Source  # via id (integridad referencial)
```

## Reglas de derivación en tiempo de render

- **Orden de la home**: `weight(high)=3, medium=2, low=1`; orden descendente por peso, desempate
  ascendente alfabético por `appName` (locale-aware). Función pura en `lib/content/sort.ts` (FR-002).
- **Sección de fuentes**: se computa recorriendo `sources` de la entrada; las citas duplicadas en
  afirmaciones apuntan al mismo `Source` y aparecen una sola vez en la lista (FR-008, caso borde "Fuente
  duplicada").
- **Slug → ruta**: `/entries/{slug}`; `generateStaticParams` emite exactamente los slugs de las 7
  entradas; `dynamicParams = false` → slug desconocido cae en `not-found` (FR-015).
- **Related apps (detalle)**: para una entrada, las "related apps" son las demás entradas con la misma
  `category` (excluyéndose a sí misma), en orden estable (mismo criterio que `sort.ts`). Si el resultado es
  vacío, la sección se omite (FR-020, caso borde "Categoría con una sola entrada").
- **Contador agregado (home)**: computado en build por `lib/content/tally.ts` a partir de `Entry[]`:
  - `totalApps` = `entries.length`
  - `totalCitations` = `sum(entry.sources.length)` sobre todas las entradas
  - `totalVotes` = `0` (constante hasta que exista la feature de votación; sin datos de voto → 0)
  Los tres son 100% derivados; NUNCA un puntaje inventado, editorial ni compuesto (FR-021, Principio I).

## Categoría de las 7 entradas semilla (canónica)

| Entrada | category |
|---------|----------|
| twitter-x | Social |
| linkedin | Social |
| pinterest | Content |
| tiktok | Content |
| wikipedia | Knowledge |
| reddit | Community |
| goodreads | Community |

## Alternativa rechazada: "confidence score"

Un puntaje de confianza (p. ej. "78%") o cualquier índice compuesto/editorial NO forma parte de este
modelo de datos y no debe añadirse a ninguna entidad ni a la UI. Sería un dato especulativo/sin fuente que
viola el Principio I de la constitución. El único agregado numérico permitido es el contador derivado
descrito arriba.

## Ejemplo de archivo (`content/entries/pinterest.json`)

```json
{
  "slug": "pinterest",
  "appName": "Pinterest",
  "threatLevel": "low",
  "category": "Content",
  "summary": "Visual discovery engine whose taste graph resists generic AI feeds.",
  "moat": "Pinterest's moat is its human-curated taste graph and purchase intent data ...",
  "moatSourceIds": ["s1"],
  "challengers": [
    { "name": "Example AI Boards", "evidence": "Raised $20M Series A in 2025", "sourceId": "s2" }
  ],
  "sources": [
    { "id": "s1", "label": "Pinterest Q4 2025 shareholder letter", "url": "https://example.com/a" },
    { "id": "s2", "label": "TechCrunch funding report", "url": "https://example.com/b" }
  ]
}
```

> Nota: los valores de contenido reales (evidencia, cifras, URLs) deben ser verificables y provistos durante
> la implementación conforme al Principio I. El ejemplo usa placeholders.
