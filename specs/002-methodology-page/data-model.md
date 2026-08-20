# Data Model: Página de Metodología

**Feature**: 002-methodology-page | **Date**: 2026-08-17

Esta feature **no introduce entidades de datos persistidas ni contenido versionado**. No hay archivo
`content/entries/*.json` nuevo, no hay cambio al esquema Zod de `lib/content/schema.ts`, y no hay base de
datos involucrada (spec.md § Key Entities: "No aplica").

Lo único que se modela aquí es la **forma del módulo de contenido compartido** que resuelve la
Clarification de la sesión 2026-08-17 (FR-002): el copy de los tres niveles de amenaza, movido de
`components/TierStats.tsx` a `lib/content/tiers.ts` como fuente única de verdad.

## Forma: `Tier` (en `lib/content/tiers.ts`)

No es una entidad de contenido versionado como `Entry` — es un objeto de configuración de UI en código
TypeScript, sin archivo `.json` ni validación Zod (no hay entrada de usuario/contribuidor que validar
aquí; el único "autor" de este texto es quien edita el código fuente).

| Campo | Tipo | Obligatorio | Notas |
|-------|------|-------------|-------|
| `level` | `ThreatLevel` (`"low" \| "medium" \| "high"`, importado de `lib/content/schema.ts`) | Sí | Reutiliza el mismo tipo que ya usa `Entry.threatLevel` — no se define un enum paralelo |
| `label` | string | Sí | Etiqueta visible del nivel (hoy: "High Threat" / "Medium Threat" / "Low Threat / Safe") |
| `caption` | string | Sí | Descripción completa de una línea (usada en desktop/tablet y en la página de metodología) |
| `shortCaption` | string | Sí | Versión compacta de `caption` para el layout móvil de `TierStats` (NFR-003) — la página de metodología usa `caption`, no `shortCaption` |
| `color` | string (custom property CSS) | Sí | p. ej. `var(--threat-high)` — el mismo token que ya usa `ThreatBadge` |
| `glow` | string (custom property CSS) | Sí | p. ej. `var(--threat-high-glow)` |

**Regla de uso**: `components/TierStats.tsx` y `app/methodology/page.tsx` MUST importar el mismo array
`TIERS` exportado desde `lib/content/tiers.ts` — ninguno de los dos define esta lista de forma inline
(Clarification, FR-002). El orden del array (`high`, `medium`, `low`) es el orden alto→bajo en el que ya se
muestran ambos.

## Relación con el modelo de datos de `001-entries-directory`

```text
lib/content/schema.ts  →  export type ThreatLevel = "low" | "medium" | "high"
        ↑ (reutilizado, no redefinido)
lib/content/tiers.ts   →  TIERS: Tier[]  (uno por cada ThreatLevel)
        ↑ importado por ambos
components/TierStats.tsx        app/methodology/page.tsx
```

No hay relación con `Entry`, `Challenger` o `Source` más allá de que `ThreatLevel` es el mismo tipo
compartido — `tiers.ts` no lee ni depende de `content/entries/`.

## Contenido estático adicional de la página (no modelado como datos)

Las otras tres secciones de `/methodology` (Evidence Types, Content Integrity Rule, Related Apps Grouping)
son párrafos de texto fijo escritos directamente en `app/methodology/page.tsx` — no ameritan una forma de
datos propia porque no se reutilizan en ningún otro lugar del sitio (a diferencia del texto de los tiers,
que sí se comparte con la home). No se crea ningún módulo adicional para ellas.
