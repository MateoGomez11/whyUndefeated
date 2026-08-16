# Contract: Esquema de Contenido de Entrada

**Feature**: 001-entries-directory | **Artifact**: `lib/content/schema.ts` + `content/entries/*.json`

Este es el contrato de datos entre los archivos de contenido (autores/contribuidores por PR) y la
aplicación. Es la fuente de verdad para la validación en build. Cualquier archivo que no cumpla este
contrato hace fallar `next build`.

## Esquema (representación Zod prevista)

```text
Source = {
  id:    string (no vacío, único en la entrada)
  label: string (no vacío)
  url:   string (URL absoluta http/https válida)
}

Challenger = {
  name:     string (no vacío)
  evidence: string (no vacío, una línea)
  sourceId: string (DEBE existir en sources[].id)
}

Entry = {
  slug:          string (kebab-case, == nombre de archivo, único global)
  appName:       string (no vacío)
  threatLevel:   "low" | "medium" | "high"
  category:      "Social" | "Content" | "Knowledge" | "Community"
  summary:       string (no vacío)
  moat:          string (no vacío)
  moatSourceIds: string[] (min 1; cada valor existe en sources[].id)
  challengers:   Challenger[] (puede estar vacío)
  sources:       Source[] (min 1)
}
```

## Reglas de validación (contrato de fallo del build)

| # | Regla | Requisito | Error esperado (formato) |
|---|-------|-----------|--------------------------|
| V1 | `threatLevel` presente y en enum | FR-013, FR-014 | `{file}: campo 'threatLevel' — falta o valor inválido (esperado low|medium|high)` |
| V1b | `category` presente y en enum | FR-019 | `{file}: campo 'category' — falta o valor inválido (esperado Social|Content|Knowledge|Community)` |
| V2 | `sources` con ≥ 1 elemento | FR-013 | `{file}: campo 'sources' — se requiere al menos una fuente` |
| V3 | `moat` no vacío | FR-013 | `{file}: campo 'moat' — falta la explicación del moat` |
| V4 | cada `source.url` es URL válida | Decisión 3 | `{file}: campo 'sources[i].url' — URL inválida` |
| V5 | cada `challenger.sourceId` existe en `sources` | FR-006/FR-007 | `{file}: campo 'challengers[i].sourceId' — referencia a fuente inexistente 'X'` |
| V6 | cada `moatSourceIds[j]` existe en `sources` | FR-007, FR-013 | `{file}: campo 'moatSourceIds[j]' — referencia a fuente inexistente 'X'` |
| V6b | `moatSourceIds` con ≥ 1 elemento | FR-007, FR-013 | `{file}: campo 'moatSourceIds' — el moat debe citar al menos una fuente` |
| V7 | `slug` kebab-case y == nombre de archivo | FR-004, Decisión 5 | `{file}: campo 'slug' — no coincide con el nombre de archivo o formato inválido` |
| V8 | `slug` único entre todas las entradas | Decisión 5 | `slug duplicado 'X' en {fileA} y {fileB}` |

## Contrato de comportamiento del loader

- `loadAllEntries()` lee todos los `content/entries/*.json`, valida cada uno (V1–V8) y devuelve
  `Entry[]` **ordenado** por las reglas de `sort.ts`.
- Ante cualquier violación, **lanza** un `Error` cuyo mensaje incluye archivo, campo y motivo (tabla
  anterior). El throw ocurre durante la generación estática → `next build` falla (SC-004).
- `challengers: []` es válido y NO lanza (FR-018).

## Entradas semilla obligatorias (exactamente 7)

`pinterest`, `wikipedia`, `reddit`, `twitter-x`, `tiktok`, `goodreads`, `linkedin` (FR-012). Un test de
integración verifica que el conjunto cargado es exactamente estos 7 slugs.

## Campos prohibidos

- **`confidenceScore` / puntaje de confianza / índice compuesto** (p. ej. "78%"): PROHIBIDO. El esquema no
  lo define y el loader no lo acepta. Sería dato especulativo/sin fuente y viola el Principio I. El único
  agregado numérico permitido es el contador derivado (FR-021), computado fuera del esquema de entrada por
  `lib/content/tally.ts`.
