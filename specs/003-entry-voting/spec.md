# Feature Specification: Votación de Veredicto en el Detalle de Entrada

**Feature Branch**: `003-entry-voting`

**Created**: 2026-08-17

**Status**: Draft

**Input**: User description: "Build the voting feature for WhyUndefeated entry detail pages. What: A
simple agree/disagree voting mechanism on each entry detail page, letting visitors react to the
threat-level verdict. A visible vote count updates after voting. Where: On each "/entries/{slug}" page,
near the verdict/threat badge. How: Vote counts are stored in Supabase (PostgreSQL), per the
constitution's storage principle — never in the versioned content files. This is the one feature in the
project that requires a client component ("use client") and a database write. Who: Any visitor, no
authentication required. Constraints: Abuse prevention — basic rate limiting to prevent duplicate votes
from the same browser session; no personally identifiable information is stored. User experience: Two
options per entry — "Agree" and "Disagree" — each showing a live count; once a visitor votes, their choice
is remembered for that session; if Supabase is unreachable, the page must still render and be readable.
Explicit error handling: if the vote write fails, show a clear, non-intrusive message without blocking the
rest of the page."

## Clarifications

### Session 2026-08-17

- Q: ¿Esta feature también activa el contador agregado "Community Votes Cast" de la home (hoy fijo en 0),
  o el conteo agregado de la home queda diferido a una feature futura y esta solo cubre el conteo
  por-entrada en el detalle? → A: Queda diferido — la home se mantiene 100% derivada de
  `content/entries/` (SSG puro, sin dependencia de la base de datos); activar el ticker agregado es una
  feature futura separada.
- Q: ¿Cuánto dura la prevención de doble voto — solo mientras la pestaña/sesión del navegador sigue
  abierta, o un identificador más persistente que sobrevive cerrar y reabrir el navegador? → A: Persistente
  — el identificador sobrevive cerrar/reabrir el navegador (no una limpieza deliberada de cookies o modo
  incógnito, que sigue siendo una limitación conocida y aceptada).
- Q: ¿Un visitante puede cambiar su voto (de Agree a Disagree) después de emitirlo, o queda bloqueado
  permanentemente una vez emitido? → A: Sí, puede cambiarlo — en todo momento cuenta como un solo voto
  activo por entrada (alternar Agree↔Disagree actualiza el voto existente, nunca suma uno nuevo).
- Q: ¿Los visitantes pueden consultar filas individuales de voto (con su identificador de cliente), o
  solo el conteo agregado por entrada? → A: Solo el conteo agregado — ningún visitante puede leer
  registros de voto individuales (ni el propio ni el de otros), solo el número total de agree/disagree
  por entrada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reaccionar al veredicto de una entrada (Priority: P1)

Un visitante lee el veredicto de nivel de amenaza de una entrada y quiere expresar si está de acuerdo o
en desacuerdo. Ve dos opciones cerca del badge de amenaza — "Agree" / "Disagree" — cada una con un
contador visible. Hace clic en una, y el contador de esa opción se actualiza para reflejar su voto.

**Why this priority**: Es el propósito completo de la feature — sin esta interacción no hay valor que
entregar. Convierte al sitio de un índice de solo lectura a uno con una capa ligera de comunidad, sin
comprometer el Principio I (el veredicto sigue basado en evidencia, no en el voto).

**Independent Test**: Se puede probar completamente abriendo cualquier "/entries/{slug}", haciendo clic en
"Agree" o "Disagree", y verificando que el contador correspondiente sube en 1 y que la interfaz refleja
que el voto del visitante quedó registrado.

**Acceptance Scenarios**:

1. **Given** una página de detalle con 0 votos en ambas opciones, **When** el visitante hace clic en
   "Agree", **Then** el contador de "Agree" pasa a 1 y la interfaz indica que ese es el voto del visitante.
2. **Given** un visitante que ya votó "Agree" en esta entrada, **When** hace clic en "Disagree" en la
   misma entrada, **Then** su voto cambia a "Disagree" (el contador de "Agree" baja en 1 y el de
   "Disagree" sube en 1) — en todo momento cuenta como un solo voto activo suyo por entrada, nunca dos.
3. **Given** dos visitantes distintos votando casi simultáneamente en la misma entrada, **When** ambos
   votos se procesan, **Then** el contador final refleja ambos votos con precisión (sin perder ni duplicar
   ninguno).
4. **Given** un visitante con JavaScript desactivado, **When** abre la página de detalle, **Then** el
   resto del contenido (veredicto, retadores, moat, fuentes, related apps) sigue siendo legible y
   funcional; la interacción de voto simplemente no está disponible.

---

### User Story 2 - La página sigue funcionando si el almacén de votos no responde (Priority: P2)

Supabase no está disponible (caída, timeout de red, error del backend). Un visitante abre una página de
detalle. La página completa carga y es legible igual que siempre; solo la interacción de voto queda
inhabilitada de forma clara, sin romper ni bloquear el resto de la página.

**Why this priority**: El sitio es "static-first" por diseño (Principio III) — el veredicto, la
evidencia y las fuentes son el valor principal y NUNCA deben depender de un servicio externo para
mostrarse. La votación es una mejora progresiva, no un requisito de carga de la página.

**Independent Test**: Se puede probar simulando que el backend de votos no responde (o forzando que el
intento de voto falle) y verificando que la página de detalle carga completa e igual de legible, y que
al intentar votar aparece un mensaje claro y no intrusivo de que el voto no se registró.

**Acceptance Scenarios**:

1. **Given** el almacén de votos no responde, **When** un visitante abre "/entries/{slug}", **Then** la
   página carga completa (veredicto, retadores, moat, fuentes, related apps) sin ningún error visible en
   el contenido principal.
2. **Given** el almacén de votos no responde, **When** el visitante intenta votar, **Then** ve un mensaje
   claro y no intrusivo de que su voto no se registró, sin que el resto de la página se bloquee o
   desaparezca.
3. **Given** el intento de voto falla por un error de red transitorio, **When** el visitante lo reintenta
   más tarde (backend ya disponible), **Then** el voto se registra normalmente.

---

### Edge Cases

- **Voto sin JavaScript**: con JS desactivado, la interacción de voto no se ofrece (no hay fallback de
  formulario tradicional) — el resto de la página permanece 100% legible sin JS, igual que hoy (FR-011 de
  `001-entries-directory`).
- **Voto duplicado por manipulación deliberada** (limpiar cookies, modo incógnito, script simple): el
  sistema NO puede garantizar prevención perfecta sin autenticación — se acepta como limitación conocida,
  documentada en Assumptions, no como bug.
- **Carrera de escritura concurrente**: dos votos casi simultáneos en la misma entrada NUNCA deben
  perderse ni duplicarse en el conteo final (ver Acceptance Scenario 3 de US1).
- **Entrada sin ningún voto todavía**: ambos contadores muestran 0, no un placeholder roto ni "N/A".
- **Fallo de escritura tras un voto aparentemente exitoso en la UI**: si el backend confirma error después
  de que la UI ya mostró el voto como registrado, la UI DEBE corregirse para reflejar que el voto no se
  guardó (no debe quedar una cuenta "fantasma" visible solo en el cliente).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada página de detalle de entrada MUST mostrar dos opciones de voto ("Agree" / "Disagree",
  o un framing equivalente consistente con el tono del sitio) ubicadas cerca del badge de nivel de
  amenaza, cada una con un contador visible del número de votos.
- **FR-002**: Un visitante MUST poder emitir un voto (Agree o Disagree) por entrada haciendo clic en una
  de las dos opciones. Un visitante que ya votó en esa entrada MUST poder cambiar su elección (alternar
  entre Agree y Disagree); cambiar de opción actualiza su voto existente, nunca agrega un voto adicional.
- **FR-003**: Al emitir o cambiar un voto exitosamente, el contador de la opción elegida MUST
  actualizarse para reflejar el voto (y, si el visitante cambió de opción, el contador de su elección
  anterior MUST bajar en 1), y la interfaz MUST indicar cuál es la elección actual del visitante.
- **FR-004**: El sistema MUST impedir que un mismo visitante tenga más de un voto activo simultáneo
  contado para la misma entrada (ver FR-002 — cambiar de opción está permitido, votar dos veces sumando no
  lo está). Esta prevención se basa en un identificador del lado del cliente que MUST persistir a través
  de cierres/reaperturas del navegador (no solo mientras la pestaña permanece abierta); no se garantiza
  contra una limpieza deliberada de cookies o modo incógnito (ver Assumptions).
- **FR-005**: Votar MUST NOT requerir autenticación ni recolectar información de identificación personal
  (Principio VI de la constitución) — ningún dato que identifique a una persona específica se almacena
  junto al voto.
- **FR-006**: Los conteos de voto MUST almacenarse fuera de los archivos de contenido versionados —en la
  base de datos (Supabase/PostgreSQL), conforme al Principio II de la constitución. Los archivos
  `content/entries/*.json` MUST NOT modificarse nunca como resultado de un voto.
- **FR-007**: Si el almacén de votos no responde o la escritura del voto falla, la página de detalle MUST
  seguir renderizando completa y legible — únicamente la interacción de voto queda no disponible; ningún
  otro contenido de la página (veredicto, retadores, moat, fuentes, related apps) MUST verse afectado.
- **FR-008**: Si un voto falla al registrarse (red, backend caído, error de escritura), el sistema MUST
  mostrar un mensaje claro y no intrusivo de que el voto no se registró, sin bloquear ni ocultar el resto
  del contenido de la página. Si la interfaz había mostrado el voto como registrado antes de conocerse el
  fallo, MUST corregirse para no dejar un conteo visible que en realidad no se guardó.
- **FR-009**: La interacción de voto MUST ser la única parte de la página de detalle que requiere
  JavaScript — el resto de la página (contenido principal) MUST seguir siendo legible y funcional sin JS,
  consistente con el requisito existente de todo el sitio (FR-011 de `001-entries-directory`).
- **FR-010**: El sistema MUST aplicar alguna forma de mitigación básica contra abuso trivial (clics
  repetidos rápidos, scripts simples) sobre el mecanismo de voto, entendiendo que sin autenticación esta
  protección no puede ser perfecta (ver Edge Cases y Assumptions).
- **FR-011**: El conteo mostrado para cada entrada MUST ser preciso incluso bajo votos concurrentes — dos
  votos simultáneos en la misma entrada NUNCA deben perderse ni contarse dos veces uno de ellos.
- **FR-012**: El contador agregado "Community Votes Cast" de la home (`lib/content/tally.ts`, FR-021/
  SC-008 de `001-entries-directory`) MUST permanecer en 0 y sin cambios en esta feature — activarlo con la
  suma real de votos queda explícitamente diferido a una feature futura separada (Clarifications). La home
  MUST seguir siendo 100% estática, derivada únicamente de `content/entries/`, sin ninguna dependencia
  nueva de la base de datos introducida por esta feature.
- **FR-013**: El sistema MUST impedir que cualquier visitante lea registros de voto individuales (ni el
  propio ni el de otros) — la única lectura pública permitida es el conteo agregado (número total de
  `agree` y de `disagree`) por entrada. Esto aplica incluso siendo datos no-PII: minimiza la superficie de
  datos expuesta y evita que un tercero enumere o analice patrones de voto fila por fila.

### Key Entities *(include if feature involves data)*

- **Vote (Voto)**: Un voto individual emitido por un visitante sobre una entrada. Vive en la base de datos
  (Supabase), nunca en `content/entries/`. Atributos: referencia a la entrada (`slug`), elección
  (`agree` | `disagree`), marca de tiempo. Explícitamente NO incluye ningún dato de identificación
  personal — ningún nombre, email, ni dirección IP asociada a una identidad. Puede incluir un
  identificador no-personal del lado del cliente (p. ej. un token de sesión opaco) usado únicamente para
  prevenir votos duplicados — este identificador no debe permitir reconstruir la identidad del visitante.
- **Conteo de voto por entrada**: Derivado de los `Vote` almacenados — número de votos `agree` y número de
  votos `disagree` por `slug`. Se muestra en la página de detalle; nunca se guarda como campo separado en
  el contenido versionado de la entrada (el conteo vive/se deriva en la base de datos, no en el JSON).
  **Es el único dato de voto de lectura pública** (FR-013) — los registros `Vote` individuales nunca se
  exponen a los visitantes, ni siquiera el propio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante puede emitir un voto y ver el contador actualizado en la interfaz en menos de
  3 segundos en condiciones normales de red.
- **SC-002**: El 100% de las páginas de detalle permanecen completamente legibles y navegables (veredicto,
  retadores, moat, fuentes, related apps) incluso cuando el almacén de votos está completamente
  inalcanzable — verificable simulando la falla del backend.
- **SC-003**: Ningún visitante puede lograr que se cuenten dos votos suyos para la misma entrada mediante
  el uso normal de la interfaz (sin recargar con intención de burlar el sistema) — verificable con una
  prueba automatizada que intenta votar dos veces seguidas en la misma sesión.
- **SC-004**: El 0% de los votos almacenados incluye información que identifique a una persona específica
  — verificable por inspección del esquema de datos de voto.
- **SC-005**: El 100% de las páginas de detalle permanecen legibles y navegables sin JavaScript, con la
  única excepción de la interacción de voto en sí misma (que no está disponible sin JS) — verificable con
  Playwright `javaScriptEnabled: false`.
- **SC-006**: Bajo votos concurrentes simulados sobre la misma entrada, el conteo final registrado
  corresponde exactamente al número de votos efectivamente emitidos (sin pérdidas ni duplicados).
- **SC-007**: Ningún intento de lectura pública (sin credenciales especiales) devuelve registros de voto
  individuales — solo el conteo agregado por entrada es accesible — verificable inspeccionando las
  políticas de acceso a datos configuradas.

## Assumptions

- El copy exacto de las dos opciones ("Agree"/"Disagree" u otro framing equivalente) se ajusta durante
  `/speckit-plan`/implementación al tono ya establecido del sitio; el input del usuario ya sugiere estas
  etiquetas como punto de partida razonable.
- El mecanismo concreto de identificador del lado del cliente usado para prevenir doble voto (cookie,
  almacenamiento local, u otro) es una decisión de implementación diferida a `/speckit-plan` — el spec
  exige que sea persistente a través de cierres/reaperturas del navegador y no-personal (FR-004), pero no
  prescribe la tecnología concreta.
- La prevención de doble voto y la mitigación de abuso (FR-004, FR-010) son best-effort, no infalibles:
  sin autenticación, un visitante decidido a manipular el sistema (borrar cookies, modo incógnito) puede
  lograr votar más de una vez. Esta es una limitación conocida y aceptada del modelo "sin login" del MVP,
  no un defecto a corregir en esta feature.
- No hay panel de moderación ni capacidad de anular/eliminar votos individuales en esta feature — fuera de
  alcance del MVP de votación.
- Supabase (tier gratuito), ya decidido en la constitución como la base de datos del proyecto, es
  suficiente para la escala esperada del MVP — no se re-evalúa aquí la elección de proveedor.
- El voto es de solo agregado (conteos), nunca se expone una lista pública de "quién votó qué" — no
  aplicaría de todas formas al no recolectarse identidad.
