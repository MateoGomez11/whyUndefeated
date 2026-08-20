# Contract: API de Votos (Supabase) y Widget de Voto

**Feature**: 003-entry-voting | **Artifact**: `lib/votes/client.ts`, `components/VoteWidget.tsx`

Contrato entre `VoteWidget` (único componente cliente del sitio) y Supabase (PostgREST, vía
`@supabase/supabase-js`), más el contrato de UI del propio widget. A diferencia de
`001-entries-directory/contracts/routes.md` (rutas de Next.js), este contrato describe una integración con
un servicio externo — ver `data-model.md` para el esquema completo.

## Lectura: conteo agregado por entrada

- **Operación**: `supabase.from('vote_counts').select('choice, votes').eq('entry_slug', slug)`
- **Autenticación**: `anon key` pública (ninguna otra credencial).
- **Respuesta esperada**: `[{ choice: 'agree', votes: number }, { choice: 'disagree', votes: number }]`
  (0, 1 o 2 filas — una entrada sin votos en una opción simplemente no tiene fila para esa opción; el
  cliente MUST tratar la ausencia como `0`, no como error).
- **Contrato de fallo**: cualquier error de red, timeout, o respuesta no-2xx MUST resultar en el estado
  "voting unavailable" del widget (FR-007) — nunca en una excepción no controlada.
- **Garantía de seguridad**: esta es la ÚNICA lectura pública posible sobre datos de voto — la vista
  `vote_counts` nunca expone `voter_id` ni filas individuales (FR-013, data-model.md).

## Escritura: emitir o cambiar un voto

- **Operación**: `supabase.from('votes').upsert({ entry_slug, voter_id, choice }, { onConflict: 'entry_slug,voter_id' })`
- **Autenticación**: `anon key` pública.
- **Precondición del cliente**: `voter_id` MUST provenir de `lib/votes/voterId.ts` (persistente en
  `localStorage`, generado una sola vez por navegador — FR-004).
- **Efecto esperado**: si es la primera vez que ese `voter_id` vota en ese `entry_slug`, inserta una fila;
  si ya existe, actualiza `choice` (y `updated_at`) de la fila existente — nunca crea una segunda fila
  (constraint `UNIQUE (entry_slug, voter_id)`, ver data-model.md).
- **Contrato de fallo**: cualquier error MUST mostrar el mensaje no-intrusivo de FR-008 y MUST revertir
  cualquier actualización optimista del conteo mostrado en la UI — el conteo visible nunca debe quedar
  desincronizado del estado real tras un fallo conocido.

## Contrato de UI: `VoteWidget`

- **Props**: `{ slug: string }` — el slug de la entrada actual; el widget deriva todo lo demás
  internamente (no recibe conteos por props, los obtiene él mismo — research.md Decisión 8).
- **Estados**:
  1. **Cargando**: al montar, antes de que resuelva `fetchVoteCounts` — breve, no bloqueante para el
     resto de la página (que ya está renderizada por el servidor).
  2. **Listo**: dos opciones con conteo visible; si el visitante ya votó antes en esta entrada (mismo
     `voter_id`), su elección actual se refleja visualmente (FR-003).
  3. **Voto en curso**: tras un clic, mientras se espera la confirmación de `castVote`.
  4. **No disponible**: si el fetch inicial de conteos falla, o si faltan las variables de entorno de
     Supabase — mensaje claro, sin botones interactivos rotos (FR-007, research.md Decisión 9).
  5. **Error de escritura**: si `castVote` falla después de que el visitante hizo clic — mensaje no
     intrusivo de que el voto no se registró (FR-008); el resto de la página MUST permanecer intacta.
- **Ubicación**: dentro de `EntryDetail.tsx`, inmediatamente después de `<ThreatBadge>`, dentro del mismo
  contenedor `maxWidth: 620` del header — cerca del veredicto, como pide el spec ("near the
  verdict/threat badge").
- **Sin JS**: si JavaScript está desactivado, `VoteWidget` (siendo `"use client"`) simplemente no se
  hidrata/no aparece interactivo — el resto de `EntryDetail` (moat, retadores, fuentes, related apps)
  MUST seguir renderizando y siendo navegable, sin ningún hueco roto en el layout (FR-009).

## Contrato no funcional

| Atributo | Umbral | Fuente |
|----------|--------|--------|
| Tiempo de reflejo del voto en la UI | < 3 s en condiciones normales de red | SC-001 |
| Legibilidad de la página si Supabase no responde | 100% del contenido principal intacto | SC-002, US2 |
| Precisión bajo concurrencia | Conteo final = votos efectivamente emitidos, sin pérdidas/duplicados | SC-006 |
| Exposición de datos de voto | Solo agregado; nunca filas individuales | SC-007 |
| Legibilidad sin JS del resto de la página | 100% (excepto el widget de voto en sí) | SC-005 |
