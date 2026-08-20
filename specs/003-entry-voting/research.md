# Phase 0 Research: Votación de Veredicto en el Detalle de Entrada

**Feature**: 003-entry-voting | **Date**: 2026-08-17

No quedan marcadores `NEEDS CLARIFICATION` en el spec (4 clarificaciones resueltas en `/speckit-clarify`,
sesión 2026-08-17). Este documento resuelve las decisiones técnicas necesarias para implementar lo que el
spec ya fijó, heredando el stack base de `001-entries-directory`/`002-methodology-page` sin re-litigarlo.

## Decisión 1: Cliente de Supabase — solo `@supabase/supabase-js`, sin `@supabase/ssr`

- **Decisión**: Única dependencia nueva del proyecto: `@supabase/supabase-js`. El cliente se instancia
  una sola vez dentro de `VoteWidget.tsx` (o en `lib/votes/client.ts`, inyectable) con la URL pública y la
  `anon key`, ambas vía `NEXT_PUBLIC_*`.
- **Rationale**: Toda la interacción de voto es 100% del lado del cliente y anónima — no hay sesión de
  usuario que sincronizar entre servidor y navegador (`@supabase/ssr` existe justamente para eso: cookies
  de sesión de auth). Añadir ese paquete sería una dependencia sin propósito en un sitio sin login
  (Principio VI: "Autenticación: Ninguna en el MVP").
- **Alternativas consideradas**:
  - *`@supabase/ssr` + Route Handler server-side*: permitiría validar/limitar en el servidor antes de
    escribir a Supabase. Rechazado por ahora — añade una capa (API route) que el input de la feature no
    pidió ("requiere un componente cliente y una escritura a base de datos", framing que apunta a
    escritura directa desde el cliente) y no resuelve nada que RLS + la unique constraint no resuelvan ya
    (ver Decisión 4). Si en el futuro se necesita lógica de servidor más sofisticada, es una migración
    aislada (el contrato de datos no cambia).

## Decisión 2: Escritura directa desde el cliente (sin Route Handler intermedio)

- **Decisión**: `VoteWidget.tsx` llama a Supabase directamente desde el navegador (vía
  `lib/votes/client.ts`) — no hay `app/api/vote/route.ts` en esta feature.
- **Rationale**: Es el patrón estándar e idiomático de Supabase (`anon key` + RLS *es* el modelo de
  seguridad, diseñado para escritura directa desde el cliente). Coincide con el framing del input de la
  feature. Simplifica el sistema: sin capa adicional para razonar, testear ni desplegar.
- **Alternativas consideradas**:
  - *Route Handler server-side*: ver Decisión 1. Rechazado por ahora, no descartado para el futuro.

## Decisión 3: Modelo de datos — sin FK a `content/entries/`

- **Decisión**: La tabla `votes` guarda `entry_slug` como texto libre, sin llave foránea hacia ningún dato
  de contenido (que vive en archivos, no en la DB). No se valida en la base de datos que el slug
  corresponda a una entrada real.
- **Rationale**: `content/entries/*.json` no está en Supabase (Principio II) — no existe una tabla de
  entradas contra la cual hacer FK. Rechazar slugs inválidos en la DB requeriría sincronizar la lista de
  slugs válidos hacia Postgres en cada build, una complejidad que el MVP no necesita: un voto con un slug
  inventado es ruido inofensivo (nunca se lee, porque la página solo consulta el conteo de su propio
  slug), no un problema de seguridad ni de integridad del contenido real.
- **Alternativas consideradas**:
  - *Sincronizar slugs a una tabla `entries` en cada build y usar FK*: over-engineering para el problema
    real; introduce una segunda fuente de verdad para datos que el Principio II ya fija como
    exclusivamente basados en archivo. Rechazado.

## Decisión 4: Un voto activo por entrada — `UNIQUE (entry_slug, voter_id)` + upsert

- **Decisión**: Restricción `UNIQUE (entry_slug, voter_id)` en `votes`; `VoteWidget` siempre hace un
  **upsert** (`INSERT ... ON CONFLICT (entry_slug, voter_id) DO UPDATE SET choice = ...`), nunca un
  INSERT plano. Esto implementa FR-002 (cambiar de opción actualiza el voto existente) y FR-004 (nunca más
  de un voto activo contado) con una sola operación atómica de base de datos — sin necesidad de un paso
  previo de "leer si ya voté".
- **Rationale**: Resuelve FR-011 (precisión bajo concurrencia) gratis: la unique constraint es la garantía
  de atomicidad de Postgres, no lógica de aplicación propensa a condiciones de carrera. También sirve como
  la mitigación de abuso básica que pide FR-010: votar 50 veces rápido desde el mismo `voter_id` sigue
  resultando en **un** voto contado, nunca en inflación del conteo.
- **Alternativas consideradas**:
  - *SELECT primero, luego INSERT o UPDATE según corresponda*: dos round-trips, ventana de condición de
    carrera entre el SELECT y el INSERT bajo votos concurrentes del mismo visitante (poco probable pero
    posible con doble clic). Rechazado a favor del upsert atómico.

## Decisión 5: Identificador de votante — `localStorage`, no cookie

- **Decisión**: `lib/votes/voterId.ts` genera un UUID v4 la primera vez que hace falta y lo persiste en
  `localStorage` bajo una clave propia del sitio; lecturas posteriores reutilizan el mismo id. El módulo
  recibe el `Storage` como parámetro (en vez de acceder a `window.localStorage` directamente), lo que lo
  hace testeable en Jest con un mock simple, sin necesitar jsdom.
- **Rationale**: `localStorage` sobrevive cerrar/reabrir el navegador (requisito de FR-004, resuelto en
  `/speckit-clarify`) sin necesitar ningún viaje de ida y vuelta al servidor (a diferencia de una cookie,
  que además tendría que leerse en el servidor para tener sentido, cosa que esta arquitectura 100%
  client-side no necesita). Es un identificador opaco, nunca enviado como header HTTP a nuestro propio
  servidor — solo viaja directamente a Supabase como parte del payload del voto.
- **Alternativas consideradas**:
  - *Cookie de primera parte*: funcionaría igual de bien para persistencia, pero añadiría un valor a cada
    request HTTP a `whyundefeated.dev` sin que el servidor de Next.js lo use para nada (toda la lógica es
    client→Supabase directa) — overhead sin beneficio. Rechazada.
  - *`sessionStorage`*: no sobrevive cerrar la pestaña — no cumple FR-004 (identificador persistente,
    Clarification de la sesión). Rechazada explícitamente por el spec.

## Decisión 6: Mitigación de abuso — sin rate-limiting por IP

- **Decisión**: La única mitigación de abuso implementada es la que ya da la Decisión 4 (upsert +
  constraint única). NO se agrega throttling por dirección IP.
- **Rationale**: El propio spec ya acepta como limitación conocida que un visitante decidido (limpiar
  cookies/localStorage, modo incógnito, generar un `voter_id` nuevo por request) puede votar más de una
  vez sin autenticación (Assumptions de spec.md). Agregar rate-limiting por IP para cerrar ese hueco
  entraría en tensión directa con el Principio VI ("no recopilar información de identificación personal...
  no cookies/logging de IP atado a identidad") — el costo de privacidad no se justifica para un caso de
  abuso ya aceptado como no-crítico (votos son solo un contador de reacción, no afectan el veredicto real,
  Principio I). FR-010 queda satisfecho por la Decisión 4: es "mitigación básica", no "infalible".
- **Alternativas consideradas**:
  - *Throttling por IP a nivel de Supabase Edge Function o middleware de Next.js*: técnicamente posible,
    pero requeriría loggear/inspeccionar IPs de forma que roza el principio de no-PII sin necesidad real.
    Rechazada; se deja documentada como opción futura si el abuso real lo justifica.

## Decisión 7: Lectura pública — vista `vote_counts`, RLS deniega la tabla base

- **Decisión**: RLS habilitado en `votes` sin ninguna política `SELECT` para el rol `anon` (lectura de
  filas individuales denegada por defecto). Se expone una vista `vote_counts` (agregada por
  `entry_slug, choice`), creada por un rol con permiso para leer `votes` directamente (bypassa RLS de la
  forma estándar en que Postgres/Supabase resuelve vistas), con `GRANT SELECT ON vote_counts TO anon`.
  `VoteWidget` solo consulta `vote_counts`, nunca `votes`.
- **Rationale**: Implementa exactamente FR-013/SC-007 (Clarification de la sesión 2026-08-17): la única
  lectura pública posible es el conteo agregado, nunca el registro individual con su `voter_id`. Es el
  patrón estándar de Supabase para "agregado público, fila privada" — no requiere una Edge Function
  aparte.
- **Alternativas consideradas**:
  - *Función RPC `get_vote_counts(slug)` en vez de vista*: equivalente en seguridad; una vista es más
    simple de declarar y de consultar vía PostgREST estándar (`?entry_slug=eq.foo&select=choice,votes`)
    sin sintaxis de RPC. Se prefiere la vista por simplicidad; documentada como alternativa válida en
    `data-model.md` por si el plan de implementación la prefiere.

## Decisión 8: Conteos se leen en el cliente, no se hornean en el build estático

- **Decisión**: `VoteWidget` consulta `vote_counts` al montar (client-side fetch), no recibe el conteo
  como prop pre-calculado en build time.
- **Rationale**: El sitio es 100% SSG (`force-static`, sin `revalidate`) — un conteo horneado en build
  quedaría desactualizado hasta el próximo deploy, contradiciendo "un contador visible se actualiza
  después de votar" (spec, sección "How"/"User experience") para visitantes *distintos* al que vota. Leer
  en el cliente mantiene la página HTML 100% estática (resiliente, indexable, rápida — Principio III)
  mientras el conteo se mantiene razonablemente fresco sin necesitar ISR/`revalidate` en toda la ruta de
  detalle solo por esta feature.
- **Alternativas consideradas**:
  - *ISR con `revalidate` corto en `/entries/[slug]`*: introduciría staleness/complejidad de caché a TODA
    la página de detalle (no solo al widget) solo para resolver el conteo de votos. Desproporcionado.
    Rechazada.

## Decisión 9: Degradación ante Supabase inalcanzable o env vars ausentes

- **Decisión**: `VoteWidget` valida que `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` existan
  antes de intentar crear el cliente; si faltan, o si el fetch de conteos falla por cualquier motivo
  (red, timeout, error HTTP), el widget renderiza el mismo estado de "voting unavailable" — nunca lanza
  una excepción no controlada que pudiera tumbar el árbol de React alrededor.
- **Rationale**: Cumple FR-007/US2 directamente. Tratar "env vars faltantes" igual que "red caída" es
  barato de implementar y cubre el escenario más probable de fallo real durante el desarrollo temprano de
  esta feature (antes de que el proyecto Supabase esté aprovisionado — ver plan.md, prerrequisito de
  infraestructura).

## Decisión 10: Estrategia de pruebas — mocks, sin Supabase real

- **Decisión**: Jest testea `lib/votes/voterId.ts` (con un mock simple de `Storage`) y
  `lib/votes/client.ts` (con un cliente de Supabase mockeado — sin red). Playwright testea el
  comportamiento real del widget en un navegador, interceptando las llamadas de red a Supabase con
  `page.route()` para simular tanto éxito como fallo (US2), sin depender de que exista un proyecto
  Supabase real ni de credenciales reales para correr la suite.
- **Rationale**: Cumple el Principio IV sin acoplar la suite de tests a un servicio externo real (más
  rápido, determinista, no depende de red ni de un proyecto Supabase de pruebas). El proyecto real de
  Supabase solo hace falta para desarrollo manual (`npm run dev`) y producción — nunca para `npm test` ni
  `npx playwright test`.
- **Alternativas consideradas**:
  - *Proyecto Supabase real dedicado a tests (o el emulador local de Supabase CLI)*: más fiel al
    comportamiento real de Postgres/RLS, pero añade infraestructura y latencia a la suite, y requeriría
    credenciales/Docker en CI. Desproporcionado para el alcance de esta feature; queda como mejora futura
    si el equipo crece.

## Heredado sin cambios de `001-entries-directory/research.md`

| Tema | Resolución heredada |
|------|---------------------|
| Stack base | Next.js App Router + TypeScript, Jest + Playwright, Vercel |
| Performance (contenido) | Lighthouse ≥90, LCP <2.5s, CLS <0.1; JS de framework ~110KB gzip aceptado (Decisión 6, actualizada 2026-08-17) |
| Legibilidad sin JS | Verificada con Playwright `javaScriptEnabled: false` (proyecto `no-js`) — el widget de voto es la única excepción documentada (FR-009) |

No quedan marcadores NEEDS CLARIFICATION.
