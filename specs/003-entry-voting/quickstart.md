# Quickstart / Validación: Votación de Veredicto en el Detalle de Entrada

**Feature**: 003-entry-voting | **Date**: 2026-08-17

Guía para configurar, ejecutar y validar la feature end-to-end. Detalles de esquema en
[data-model.md](./data-model.md) y del contrato de integración en
[contracts/votes-api.md](./contracts/votes-api.md).

## Prerrequisito único: un proyecto Supabase real (no automatizable)

`npm test` y `npx playwright test` **NO requieren** esto — usan mocks (research.md Decisión 10). Este
paso solo hace falta para `npm run dev`/producción:

1. Crear un proyecto en [supabase.com](https://supabase.com) (tier gratuito, ya decidido en la
   constitución).
2. Correr el SQL de `supabase/migrations/0001_votes.sql` (ver data-model.md) en el SQL Editor del
   proyecto, o vía `supabase db push` si se usa la CLI.
3. Copiar `Project URL` y `anon public key` desde Settings → API del proyecto.
4. Crear `.env.local` (no versionado, ya cubierto por `.gitignore`) a partir de `.env.example`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
   ```

## Comandos

```bash
npm install                  # instala @supabase/supabase-js (dependencia nueva de esta feature)
npm run dev                  # http://localhost:3000/entries/pinterest — requiere .env.local (ver arriba)
npm run build                 # DEBE seguir pasando sin .env.local (build no depende de Supabase — SSG)
npm test                      # Jest: incluye tests/unit/voterId.test.ts y votes-client.test.ts (mocks)
npx playwright test           # Playwright: incluye e2e/voting.spec.ts (mock de red, sin Supabase real)
```

## Escenarios de validación

### 1. Votar y ver el conteo actualizarse (US1, SC-001)

- **Acción**: abrir `/entries/{slug}`, hacer clic en "Agree".
- **Esperado**: el contador de "Agree" sube en 1 en menos de 3 segundos; la UI indica que ese es el voto
  del visitante.
- **Automatizado**: `e2e/voting.spec.ts` (con red de Supabase mockeada vía `page.route()`).

### 2. Cambiar de opción (US1, Acceptance Scenario 2, FR-002)

- **Acción**: tras votar "Agree", hacer clic en "Disagree" en la misma entrada.
- **Esperado**: el conteo de "Agree" baja en 1, el de "Disagree" sube en 1 — nunca ambos suben a la vez.
- **Automatizado**: `e2e/voting.spec.ts`.

### 3. El voto persiste entre recargas/reaperturas (FR-004, Clarification)

- **Acción**: votar, recargar la página (o cerrar y reabrir la pestaña simulando una nueva sesión de
  Playwright con el mismo storage state).
- **Esperado**: la UI sigue mostrando la elección del visitante como activa (mismo `voter_id` persistido
  en `localStorage`).
- **Automatizado**: `e2e/voting.spec.ts`.

### 4. La página sigue funcionando si Supabase no responde (US2, SC-002)

- **Acción**: interceptar con `page.route()` las requests a Supabase y forzar que fallen (timeout o 5xx);
  abrir `/entries/{slug}`.
- **Esperado**: veredicto, retadores, moat, fuentes y related apps cargan igual que siempre; el widget de
  voto muestra un mensaje de "no disponible" en vez de romperse.
- **Automatizado**: `e2e/voting.spec.ts`.

### 5. Fallo al votar muestra un mensaje claro sin romper la página (US2, FR-008)

- **Acción**: con la lectura de conteos funcionando pero la escritura del voto forzada a fallar
  (`page.route()` solo sobre el endpoint de escritura), hacer clic en "Agree".
- **Esperado**: mensaje no intrusivo de que el voto no se registró; el conteo mostrado NO queda
  incrementado de forma fantasma; el resto de la página no se ve afectado.
- **Automatizado**: `e2e/voting.spec.ts`.

### 6. Legibilidad sin JavaScript (FR-009, SC-005)

- **Acción**: cargar `/entries/{slug}` con `javaScriptEnabled: false`.
- **Esperado**: todo el contenido excepto el widget de voto es legible/navegable, igual que antes de esta
  feature.
- **Automatizado**: `e2e/voting.spec.ts` bajo el proyecto `no-js` (extiende la cobertura ya existente de
  `e2e/no-js.spec.ts` para `/entries/pinterest`).

### 7. Solo el conteo agregado es accesible, nunca filas individuales (FR-013, SC-007)

- **Acción**: revisión manual — inspeccionar `supabase/migrations/0001_votes.sql` y, con un proyecto real
  provisionado, intentar un `select * from votes` con la `anon key` (debe fallar/devolver vacío por RLS) y
  un `select * from vote_counts` (debe funcionar).
- **Esperado**: la tabla base rechaza la lectura anónima; la vista agregada la permite.
- **Automatizado**: no automatizable sin un proyecto Supabase real — revisión de código/SQL en PR (igual
  que el escenario 7 de `002-methodology-page/quickstart.md`).

## Definición de "hecho" para esta feature

- [ ] `npm run build` sigue pasando **sin** `.env.local` configurado (la página sigue siendo SSG; el
      widget degrada, no rompe el build).
- [ ] `npm test` y `npx playwright test` en verde, cubriendo los escenarios 1–6, sin depender de un
      proyecto Supabase real.
- [ ] `supabase/migrations/0001_votes.sql` versionado en el repo, con RLS y la vista `vote_counts`
      exactamente como en data-model.md.
- [ ] `VoteWidget` es el único archivo del repo con `"use client"`.
- [ ] El resto del sitio (home, otras entradas, metodología) no cambia de comportamiento ni de bundle JS.
- [ ] Revisión manual del escenario 7 completada contra un proyecto Supabase real antes de producción.
