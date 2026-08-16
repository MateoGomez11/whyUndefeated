# Quickstart / Validación: Directorio de Entradas y Páginas de Detalle

**Feature**: 001-entries-directory | **Date**: 2026-08-12

Guía para ejecutar y validar la feature end-to-end. Detalles de esquema en
[contracts/entry.schema.md](./contracts/entry.schema.md) y rutas en [contracts/routes.md](./contracts/routes.md).

## Prerrequisitos

- Node.js 24 LTS
- Dependencias instaladas: `npm install` (Next.js, React, Zod, Jest, @playwright/test)
- Las 7 entradas semilla presentes en `content/entries/*.json` conforme al contrato de esquema

## Comandos

```bash
# Desarrollo
npm run dev                 # http://localhost:3000

# Build (incluye validación de contenido en build)
npm run build               # DEBE fallar si alguna entrada es inválida

# Pruebas
npm test                    # Jest: schema, sort, slug, loader
npx playwright test         # Playwright: e2e (incluye escenario sin JS)
```

## Escenarios de validación

### 1. Home muestra el directorio ordenado (US1)

- **Acción**: abrir `/`.
- **Esperado**: exactamente 7 tarjetas; ordenadas alto→bajo por nivel de amenaza (desempate alfabético);
  cada tarjeta con `appName`, badge (color + texto) y resumen; leyenda visible.
- **Automatizado**: `e2e/directory.spec.ts`.

### 2. Navegación a detalle en un clic (US1 / SC-001)

- **Acción**: clic en una tarjeta.
- **Esperado**: navega a `/entries/{slug}` de esa entrada.
- **Automatizado**: `e2e/directory.spec.ts`.

### 3. Detalle con fuentes clickeables (US2 / SC-002)

- **Acción**: abrir `/entries/pinterest`.
- **Esperado**: se muestran `appName`, nivel de amenaza, lista de retadores (nombre + evidencia + enlace de
  fuente), párrafo del moat con cita clickeable, y sección de fuentes deduplicada. El 100% de las
  afirmaciones tienen fuente clickeable.
- **Automatizado**: `e2e/detail.spec.ts`.

### 4. Slug inexistente → not-found (US2 / FR-015)

- **Acción**: abrir `/entries/does-not-exist`.
- **Esperado**: página "no encontrado" legible con status 404, no un error crudo.
- **Automatizado**: `e2e/detail.spec.ts`.

### 5. Legibilidad sin JavaScript (SC-005 / FR-011)

- **Acción**: cargar `/` y `/entries/pinterest` con `javaScriptEnabled: false`.
- **Esperado**: contenido, badges, leyenda, y enlaces de fuentes visibles y clickeables.
- **Automatizado**: `e2e/no-js.spec.ts`.

### 6. El build bloquea contenido inválido (US3 / SC-004)

- **Acción**: en una fixture, quitar `threatLevel` (o `moat`, o `sources`) y correr la validación.
- **Esperado**: el proceso falla con un mensaje que nombra el campo y el archivo (ver tabla V1–V8 del
  contrato de esquema).
- **Automatizado**: `tests/integration/loader.invalid.test.ts`.

### 7. Exactamente las 7 entradas semilla (FR-012)

- **Acción**: cargar todas las entradas.
- **Esperado**: el conjunto de slugs es exactamente
  `{pinterest, wikipedia, reddit, twitter-x, tiktok, goodreads, linkedin}`.
- **Automatizado**: `tests/integration/loader.valid.test.ts`.

## Presupuesto de rendimiento (SC-007)

Verificar con Lighthouse (móvil) en páginas de contenido: Performance ≥ 90, LCP < 2.5 s, CLS < 0.1, JS de
cliente ≤ 30 KB gzip (≈ 0 en esta feature al no haber islas interactivas).

## Definición de "hecho" para esta feature

- [ ] `npm run build` pasa con las 7 entradas válidas y falla ruidosamente con una inválida.
- [ ] `npm test` y `npx playwright test` en verde, cubriendo los escenarios 1–7.
- [ ] Todas las páginas de detalle usan la misma plantilla `EntryDetail` (SC-003).
- [ ] Contenido legible sin JS en home y detalle (SC-005).
