# Feature Specification: Sponsor Board & Live Telemetry (`/sponsor`)

**Feature Branch**: `004-sponsors-live-stats`

**Created**: 2026-08-20

**Status**: Clarified

**Input**: User description: "la pagina es esteticamente hermosa, me gusta, me llama la atencion. todo excelente, ahora, me falta desarrollar una idea donde cualuier persona pueda ofrecer su alternativa a una app oficial... y la idea tambien es disenar un modulo de patrocinadores, que genere fomo, que se vea super bien y que la gente quiera pagar por poner su marca ahi, tambien disenar una parte donde salgan los visitantes de toda la pagina, de donde vienen, algo asi como la imagen que te comparto. en el header leaderboard se puede cambiar por otra cosa, no lo veo necesario"

## Clarifications

### Session 2026-08-20
- Q: ¿Cómo debe comportarse la interacción al hacer clic sobre las tarjetas de la cuadrícula de slots de patrocinio según su estado? → A: Si el slot está `TAKEN`, abre la web del patrocinador en una nueva pestaña; si está `OPEN` o `SPONSOR DECIDING`, abre el enlace de reserva/contacto (`mailto:`).
- Q: ¿Qué servicio preferimos conectar para la telemetría real y el enlace al `FULL DASHBOARD ->`? → A: Umami Analytics (script liviano y cookieless para medición anónima de páginas y países, enlace público `FULL DASHBOARD ->` hacia el dashboard compartido de Umami, con fallback graceful en el panel de telemetría de `/sponsor`).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar y evaluar el Tablero de Patrocinadores con FOMO y Slots Fijos (Priority: P1) 🎯 MVP

Como potencial patrocinador (fundador o marketer de una herramienta para developers/builders), quiero visitar `/sponsor` y ver una propuesta de patrocinio exclusiva, de alto impacto y con escasez real (10 slots fijos mensuales), para decidir reservar un espacio publicitario antes de que se agote.

**Why this priority**: Es el núcleo de monetización y posicionamiento comercial del sitio. Comunica exclusividad, alta demanda y valor publicitario de forma inmediata.

**Independent Test**: Navegar a `/sponsor`, revisar la propuesta de valor, la cuadrícula de 10 slots con sus estados (`TAKEN`, `SPONSOR DECIDING`, `OPEN`), el precio fijo ($2,500/mes), el timeline de reserva, los perfiles de anunciantes y hacer clic en el CTA o en un slot abierto para reclamarlo.

**Acceptance Scenarios**:
1. **Given** un visitante en `/sponsor`, **When** examina la cabecera, **Then** ve el título "Sponsor whyundefeated.", la propuesta de valor de 10 slots fijos para builders, y las métricas destacadas (300,000+ vistas mensuales, 1093 apps catalogadas, audiencia de builders, y `10/10` slots ocupados en verde).
2. **Given** un visitante en la sección de slots, **When** hace clic en un slot con estado `TAKEN`, **Then** se abre la URL externa del patrocinador en una nueva pestaña; si hace clic en un slot `OPEN` o `SPONSOR DECIDING`, **Then** se abre el cliente de correo con el asunto predefinido para solicitar la reserva.
3. **Given** un visitante interesado en contratar, **When** consulta las condiciones de patrocinio, **Then** ve el precio transparente ($2,500/mes flat con tasa bloqueada), el timeline de fechas clave (fin de exclusividad para actuales sponsors, apertura de vacantes y lanzamiento), testimonios reales de conversión y el CTA directo para reservar.

---

### User Story 2 - Visualizar Telemetría en Vivo: Globo 3D, Feed de Lecturas y Tráfico Global (Priority: P2)

Como visitante o anunciante potencial, quiero ver la actividad en tiempo real de quién está en la plataforma (globo terráqueo de puntos interactivo, conteo de usuarios activos, feed de lecturas recientes, distribución geográfica de visitantes y enlace al dashboard público de Umami), para comprobar que el sitio tiene tracción orgánica real y tráfico cualificado de todo el mundo.

**Why this priority**: Genera validación social y prueba de tráfico contundente y transparente que respalda la tarifa de patrocinio, garantizando al mismo tiempo la total privacidad de los usuarios (sin PII ni cookies).

**Independent Test**: Cargar el panel de telemetría en `/sponsor`, interactuar con el globo de puntos 3D animado, ver el feed de lecturas en tiempo real, consultar el desglose de visitantes de los últimos 7 días por país y hacer clic en `FULL DASHBOARD ->`.

**Acceptance Scenarios**:
1. **Given** el panel de telemetría en `/sponsor`, **When** se carga la página, **Then** se renderiza un globo terráqueo de matriz de puntos con pings brillantes de actividad y un contador en vivo de personas conectadas ("X people on the site right now / from Y countries").
2. **Given** el feed de actividad en vivo, **When** se visualiza la sección de lecturas, **Then** se muestran entradas con banderas de país, acción realizada y timestamp relativo (ej. "🟢 someone in Canada is reading /pinterest · 30s ago", "🟢 someone in United States read /wikipedia · 1m ago").
3. **Given** la sección de distribución por países y el enlace `FULL DASHBOARD ->`, **When** el usuario hace clic en el enlace, **Then** se abre el dashboard público transparente de analíticas de Umami.

---

### User Story 3 - Navegación Principal Actualizada y Accesibilidad (Priority: P3)

Como usuario del sitio, quiero una barra de navegación (NavBar) clara y actualizada donde "Leaderboard" haya sido reemplazado por "Alternatives" y exista un enlace directo a "Sponsors", además de enlaces en el pie de página, funcionando tanto en desktop como en dispositivos móviles y con o sin JavaScript.

**Why this priority**: Asegura la descubribilidad natural del módulo de patrocinadores y alinea la navegación con la evolución del producto hacia alternativas comunitarias.

**Independent Test**: Navegar por el sitio desde home, entradas y metodología, verificando que el NavBar incluye `Home`, `Alternatives`, `Methodology`, `Sponsors` y `Submit`, y que hacer clic en `Sponsors` lleva directamente a `/sponsor`.

**Acceptance Scenarios**:
1. **Given** la barra de navegación en cualquier página, **When** el usuario lee los enlaces, **Then** ve `Home` (`/`), `Alternatives` (`#` o `/alternatives`), `Methodology` (`/methodology`), `Sponsors` (`/sponsor`), y `Submit` (`#` o `/submit`).
2. **Given** un usuario navegando con JavaScript desactivado (`no-js`), **When** hace clic en "Sponsors" en el menú o footer, **Then** la página `/sponsor` carga completa, estilizada y legible con server-rendering.

---

### Edge Cases

- **JavaScript Desactivado (`no-js`)**: La página `/sponsor` debe renderizarse como Server Component estático completo; el globo terráqueo degrada elegantemente a un mapa/gráfico estático de matriz de puntos sin bloquear el resto de la información.
- **Pantallas Móviles (375px) y Tablets (768px)**: La cuadrícula de 10 slots se reorganiza en una columna única apilada con separación clara entre rieles; el panel de telemetría y el feed se adaptan sin scroll horizontal.
- **Slots 100% Ocupados (`10/10 TAKEN`)**: Si todos los slots están tomados, el CTA principal cambia automáticamente a "Join the waitlist for next month" manteniendo la sensación de escasez y urgencia.
- **Respeto a la Privacidad (Principio VI)**: No se captura ni muestra ninguna IP, nombre ni identificador personal; la integración con Umami opera en modo cookieless y la telemetría solo maneja código de país y slug de entrada leída.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE proveer la ruta pública `/sponsor` con diseño coherente con la identidad visual de WhyUndefeated (tema oscuro, tipografía monospace/sans moderna, acentos cyberpunk/terminal verde y naranja).
- **FR-002**: `/sponsor` DEBE mostrar una cabecera con la propuesta de valor "Sponsor whyundefeated.", subtítulo descriptivo enfocado en builders y bloque de métricas clave (vistas mensuales, conteo de apps, audiencia de builders y slots ocupados).
- **FR-003**: El sistema DEBE renderizar una cuadrícula con 10 slots fijos de patrocinio etiquetados como Left Rail (L1–L5) y Right Rail (R1–R5).
- **FR-004**: Cada slot DEBE incluir el nombre del patrocinador o slot abierto, vigencia (ej. "taken until Aug 31") y estado FOMO claramente identificado (`TAKEN`, `SPONSOR DECIDING`, `OPEN`). Al hacer clic en un slot `TAKEN`, el sistema DEBE abrir el enlace externo del patrocinador en una nueva pestaña; al hacer clic en un slot `OPEN` o `SPONSOR DECIDING`, DEBE abrir el enlace de reserva/contacto por correo (`mailto:sponsors@whyundefeated.com`).
- **FR-005**: El sistema DEBE mostrar la sección de tarifa fija ($2,500 flat por 30 días, tasa protegida durante permanencia) y el cronograma de fechas clave (cierre de preferencia para actuales, apertura de vacantes, puesta en vivo del tablero).
- **FR-006**: La página DEBE incluir la guía "Who sponsors here" detallando los perfiles de anunciantes ("Presence buyers" vs. "Signup buyers") y los nichos más afines (AI coding tools, infra & hosting, APIs & inference, payments, analytics).
- **FR-007**: El sistema DEBE incluir una sección de testimonios y métricas de ROI de anunciantes anteriores.
- **FR-008**: El sistema DEBE renderizar el módulo de telemetría en vivo con un globo terráqueo interactivo/animado de matriz de puntos con pings luminosos.
- **FR-009**: El panel de telemetría DEBE mostrar el contador de personas conectadas en vivo y países de origen, e incluir el enlace `FULL DASHBOARD ->` apuntando al dashboard público de Umami (configurable mediante variable de entorno con fallback).
- **FR-010**: El panel de telemetría DEBE incluir una lista dinámica de actividad reciente con banderas de país, acciones y timestamps relativos.
- **FR-011**: El sistema DEBE desplegar el resumen de visitantes de los últimos 7 días desglosado por país con banderas.
- **FR-012**: El sistema DEBE proporcionar botones y enlaces directos de contacto (`mailto:sponsors@whyundefeated.com`) para reservar slots o ingresar a lista de espera.
- **FR-013**: La telemetría DEBE operar con datos agregados sin almacenar ni exponer información de identificación personal (PII), y el script de Umami (si está configurado con `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) se carga de forma asíncrona sin bloquear el renderizado ni usar cookies.
- **FR-014**: El NavBar DEBE actualizarse para reemplazar "Leaderboard" por "Alternatives" e incorporar el enlace activo a "Sponsors" (`/sponsor`).
- **FR-015**: El Footer DEBE incorporar el enlace directo a `/sponsor`.

---

## Key Entities

- **SponsorSlot**:
  - `id`: Identificador del slot (ej. `L1`, `L2`, `R1`, `R2`).
  - `rail`: `left` | `right`.
  - `sponsorName`: Nombre de la marca patrocinadora o `"Open Slot"`.
  - `expiryDate`: Fecha hasta la cual está reservado.
  - `status`: `'TAKEN'` | `'SPONSOR DECIDING'` | `'OPEN'`.
  - `url`: Enlace opcional a la web del patrocinador.
  - `badgeIcon`: Emoji/ícono opcional de la marca.

- **TelemetryFeedItem**:
  - `countryCode`: Código ISO de dos letras (ej. `'CA'`, `'US'`).
  - `countryName`: Nombre del país (ej. `'Canada'`, `'United States'`).
  - `action`: Acción realizada (ej. `'reading /pinterest'`, `'read /wikipedia'`).
  - `timeAgo`: Cadena de tiempo relativo (ej. `'30s ago'`, `'2m ago'`).

- **CountryVisitorStat**:
  - `countryCode`: Código ISO del país.
  - `flagEmoji`: Emoji de la bandera del país.
  - `count`: Número de visitantes en los últimos 7 días.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los usuarios pueden acceder a `/sponsor` desde cualquier página del sitio a través del NavBar o Footer en un solo clic.
- **SC-002**: La página `/sponsor` logra una puntuación de rendimiento Lighthouse ≥ 90 y First Contentful Paint < 1.5s.
- **SC-003**: Los 10 slots muestran su estado y disponibilidad con total claridad en menos de 1 segundo de carga.
- **SC-004**: La visualización de telemetría (globo, feed y países) se renderiza fluidamente a 60 FPS sin degradar el rendimiento del navegador.
- **SC-005**: La navegación del sitio y la estructura informativa de `/sponsor` permanecen 100% legibles y operativas con JavaScript desactivado.
- **SC-006**: La suite completa de pruebas unitarias y E2E se mantiene al 100% aprobada.

---

## Assumptions

- En la primera fase, la gestión de cobro y reserva de slots se realiza de forma directa/manual (vía correo o enlace de contacto directo) conforme a las directrices de la constitución para diferir pasarelas de pago automatizadas en el MVP.
- La analítica pública se apoya en Umami Analytics (cookieless, configurable vía variables de entorno `NEXT_PUBLIC_UMAMI_WEBSITE_ID` y `NEXT_PUBLIC_UMAMI_PUBLIC_URL`), con fallback visual autónomo en el panel de telemetría si las variables no están configuradas.
- La privacidad de los visitantes se mantiene estrictamente: no se envían IPs a clientes ni se guarda PII.
