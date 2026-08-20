# Quickstart / Validación: Página de Metodología

**Feature**: 002-methodology-page | **Date**: 2026-08-17

Guía para ejecutar y validar la feature end-to-end. Detalles de contenido en
[data-model.md](./data-model.md) y de ruta en [contracts/route.md](./contracts/route.md). Reutiliza
prerrequisitos y comandos de `specs/001-entries-directory/quickstart.md` (mismo proyecto).

## Comandos

```bash
npm run dev                 # http://localhost:3000/methodology
npm run build                # DEBE seguir pasando (esta feature no toca el gate de validación de content/entries/)
npm test                     # Jest: incluye tests/unit/tiers.test.ts nuevo
npx playwright test          # Playwright: incluye e2e/methodology.spec.ts nuevo
```

## Escenarios de validación

### 1. La página muestra las cuatro secciones con el contenido correcto (US1)

- **Acción**: abrir `/methodology`.
- **Esperado**: se ven, en orden, Threat Tiers (3 niveles con label+caption idénticos a la home),
  Evidence Types (3 tipos, solo definiciones, sin citas de entradas reales), Content Integrity Rule
  (coincide con las reglas reales de `entry.schema.md`), y Related Apps Grouping.
- **Automatizado**: `e2e/methodology.spec.ts`.

### 2. El texto de los tiers coincide literalmente con la home (SC-002)

- **Acción**: comparar el texto de cada nivel de amenaza en `/methodology` contra la leyenda de `/`.
- **Esperado**: coincide carácter por carácter porque ambos importan `TIERS` desde
  `lib/content/tiers.ts` — no hay redacción independiente en ningún lado.
- **Automatizado**: `tests/unit/tiers.test.ts` (verifica la forma/valores de `TIERS`) +
  `e2e/methodology.spec.ts` (compara el DOM renderizado de ambas páginas).

### 3. El refactor de `TierStats` no cambia el output visual (regresión)

- **Acción**: correr la suite de Jest/Playwright existente que ya cubre `TierStats` en la home
  (`e2e/directory.spec.ts`, `e2e/responsive.spec.ts`) después del refactor a `lib/content/tiers.ts`.
- **Esperado**: sigue en verde sin ningún cambio — mismos labels, colores y comportamiento responsive de
  antes del refactor.
- **Automatizado**: suite existente (no requiere tests nuevos para esto, es una prueba de no-regresión).

### 4. El link "Methodology" del nav ya no lleva a un 404/ancla muerta (US2, FR-006)

- **Acción**: desde `/` o desde cualquier `/entries/{slug}`, clic en "Methodology" en el header.
- **Esperado**: navega a `/methodology` y la página carga correctamente (200, no 404).
- **Automatizado**: `e2e/methodology.spec.ts`.

### 5. Legibilidad sin JavaScript (SC-003)

- **Acción**: cargar `/methodology` con `javaScriptEnabled: false`.
- **Esperado**: las cuatro secciones y el link del nav son legibles/navegables sin JS.
- **Automatizado**: `e2e/methodology.spec.ts` bajo el proyecto `no-js`.

### 6. Responsive en los tres breakpoints (SC-004)

- **Acción**: cargar `/methodology` a 375px (móvil), 768px (tablet) y 1280px (desktop).
- **Esperado**: sin scroll horizontal ni contenido recortado en ninguno de los tres.
- **Automatizado**: `e2e/methodology.spec.ts`, reutilizando el patrón de `test.use({ viewport })` de
  `e2e/responsive.spec.ts`.

### 7. El contenido de integridad no afirma nada que el esquema no valide (SC-005)

- **Acción**: revisión manual/cruzada del texto de la sección "Content Integrity Rule" contra la tabla
  V1–V8/V1b de `specs/001-entries-directory/contracts/entry.schema.md`.
- **Esperado**: cada afirmación de la página corresponde a una fila real de esa tabla; ninguna afirmación
  adicional sin respaldo en el esquema.
- **Automatizado**: revisión de código en PR (no es automatizable como assertion de test — es un criterio
  de contenido, ver Notes del checklist de requirements.md).

## Definición de "hecho" para esta feature

- [x] `npm run build` sigue pasando (esta feature no debería romper el build existente).
- [x] `npm test` y `npx playwright test` en verde, cubriendo los escenarios 1–6.
- [x] El texto de los tiers en `/methodology` y en `/` proviene literalmente del mismo módulo
      (`lib/content/tiers.ts`) — verificable por inspección de imports, no por dos copias de texto.
- [x] El link "Methodology" del header apunta a `/methodology` en todas las páginas.
- [x] Contenido legible sin JS y responsive en los tres breakpoints (escenarios 5–6).
- [x] Revisión manual del escenario 7 (contenido de integridad vs. esquema real) completada.
