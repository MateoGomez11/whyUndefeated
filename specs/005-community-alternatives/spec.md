# Feature Specification: Community Alternatives & Verified Challengers

**Feature Branch**: `005-community-alternatives`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "Permitir que cualquier persona o creador pueda subir su alternativa a una app oficial (o independiente). En el dashboard de cada app (ej. /entries/wikipedia) debe salir un indicador como '5 community alternatives', y dentro de la página de detalle en el lado derecho (aprovechando el espacio amplio) una lista larga de alternativas con nombre, logo pequeño, descripción corta y enlace (las verificadas de primero). En el formulario /submit se puede elegir a qué app reemplaza o si es una herramienta independiente ('None'), con protecciones estrictas anti-spam, links maliciosos y redirects raros. En /alternatives se muestra el directorio global con todas las alternativas de la comunidad."

## Clarifications

### Session 2026-08-20

- Q: ¿El envío de una alternativa en `/submit` requiere que el creador cree una cuenta con contraseña o puede enviar directamente con su correo de contacto y verificación anti-spam? → A: Envío directo con email de contacto y protección anti-spam (honeypot + validación de URLs seguras), recibiendo confirmación inmediata en pantalla.
- Q: ¿Las alternativas comunitarias aparecen inmediatamente en el sitio público o requieren moderación? → A: Requieren moderación (estado `pending` por defecto en Supabase) para prevenir spam, malware, phishing y enlaces maliciosos. Solo se muestran públicamente las alternativas con estado `approved`.
- Q: ¿Dónde y cómo se visualizan las alternativas en la página de detalle (`/entries/[slug]`)? → A: En el header/resumen de la app se muestra el contador `"X community alternatives"`, y en la columna lateral derecha (aprovechando el amplio espacio en desktop) se muestra la lista ordenada de alternativas con logo pequeño, nombre, descripción corta de 1 línea y enlace seguro.
- Q: ¿Qué pasa si una app enviada no reemplaza a ninguna de las 7 aplicaciones del directorio? → A: El formulario `/submit` permite seleccionar `"None / Independent Tool"`, en cuyo caso `target_slug` es `null` o `'general'`. Estas alternativas aparecen en el directorio global `/alternatives`.
- Q: ¿Cómo se protegen los enlaces contra spam y redirects maliciosos? → A: Validación estricta de protocolo (`https://` / `http://`), sanitización de URLs (bloqueo de `javascript:`, `data:`, `vbscript:`), todos los enlaces externos renderizados con `target="_blank"` y `rel="noopener noreferrer nofollow"`, y moderación previa antes de publicación.
- Q: ¿Cómo se destacan las alternativas verificadas/pagadas? → A: Campo `is_verified: boolean` / `is_featured: boolean`. Las alternativas verificadas aparecen de primeras en las listas con una insignia distintiva de verificación en color violeta (`--brand-500`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enviar una alternativa comunitaria a través de `/submit` (Priority: P1)

Un creador o desarrollador visita `/submit` (o hace clic en "Submit an alternative" desde `/entries/wikipedia`). En el formulario selecciona la app que desafía (ej. "Wikipedia") o marca "None / Independent Tool". Ingresa el nombre de su app, URL válida, logo opcional, descripción corta y su correo. Al enviar, la alternativa queda guardada en Supabase con estado `pending` y el creador recibe confirmación inmediata en pantalla.

**Why this priority**: Es el motor principal de adquisición de alternativas de la comunidad y la base del contenido generado por usuarios.

**Independent Test**: Acceder a `/submit`, llenar el formulario con datos válidos y verificar que el registro se almacena en `community_alternatives` con `status = 'pending'`, mostrando mensaje de éxito en la UI.

**Acceptance Scenarios**:

1. **Given** un visitante en `/submit`, **When** selecciona una app listada (o "Independent Tool"), ingresa nombre, URL https válida, descripción corta y correo, y envía, **Then** el sistema guarda la alternativa con estado `pending` y muestra confirmación de recepción.
2. **Given** un visitante en `/entries/wikipedia`, **When** hace clic en "Submit alternative", **Then** navega a `/submit?target=wikipedia` con Wikipedia preseleccionada.
3. **Given** un intento de enviar una URL maliciosa (ej. `javascript:alert(1)` o data URI) o dejar campos requeridos vacíos, **When** intenta enviar, **Then** el sistema bloquea el envío con mensajes de validación comprensibles.

---

### User Story 2 - Ver la lista de alternativas en el lateral derecho de `/entries/[slug]` (Priority: P1)

Un visitante entra a la página de detalle de una app (ej. `/entries/wikipedia`). En la parte superior ve el badge del contador (`"X community alternatives"`). En el panel derecho de la página (layout de 2 columnas en desktop), ve la lista de alternativas comunitarias aprobadas para esa app, mostrando logo, nombre, descripción corta y botón de visita, con las alternativas verificadas en primer lugar.

**Why this priority**: Brinda máxima visibilidad a las alternativas directamente donde los builders están analizando el moat de cada incumbente.

**Independent Test**: Abrir `/entries/wikipedia` con alternativas aprobadas en la base de datos y verificar que se renderizan en el panel lateral derecho con sus logos, nombres, descripciones y enlaces seguros.

**Acceptance Scenarios**:

1. **Given** una app con alternativas aprobadas en Supabase, **When** el usuario visita `/entries/[slug]`, **Then** ve el contador de alternativas en el resumen y la lista detallada en la columna derecha.
2. **Given** alternativas marcadas como `is_verified = true`, **When** se listan en el lateral derecho, **Then** se ordenan en primer lugar con una insignia de verificación.
3. **Given** una app sin alternativas comunitarias aprobadas, **When** el usuario visita la página, **Then** ve un estado limpio con botón directo `+ Submit the first alternative`.

---

### User Story 3 - Explorar el directorio global en `/alternatives` (Priority: P1)

Un visitante hace clic en "Alternatives" en la barra de navegación y llega a `/alternatives`. Allí encuentra el catálogo completo de todas las herramientas y alternativas enviadas por la comunidad, indicando claramente a qué empresa desafían (ej. *"Alternative to Goodreads"*) o si son herramientas independientes (*"Community Tool"*), con enlaces directos seguros y las verificadas destacadas al inicio.

**Why this priority**: Cumple con el nuevo destino de la barra de navegación (`/alternatives`), transformando el sitio en un directorio vivo de soluciones alternativas de IA.

**Independent Test**: Navegar a `/alternatives` y verificar que lista todas las alternativas aprobadas con filtros y buscador rápido por nombre o app desafiada.

**Acceptance Scenarios**:

1. **Given** alternativas aprobadas en la base de datos, **When** un usuario visita `/alternatives`, **Then** ve la cuadrícula/lista global con logo, nombre, app desafiada, descripción corta y enlace.
2. **Given** el Navbar del sitio, **When** se hace clic en `Alternatives`, **Then** navega directamente a `/alternatives`.

---

### User Story 4 - Resiliencia y Fallback sin JavaScript (Priority: P2)

Si Supabase no está configurado o sufre interrupciones de red, todas las páginas (`/`, `/entries/[slug]`, `/alternatives`, `/submit`) deben seguir cargando al 100% sin romper la experiencia del usuario.

**Acceptance Scenarios**:

1. **Given** falla de red en Supabase, **When** un usuario carga `/entries/wikipedia` o `/alternatives`, **Then** la página se renderiza completamente mostrando un estado no intrusivo ("Community alternatives temporarily unavailable").
2. **Given** JavaScript deshabilitado en el navegador, **When** un usuario carga `/alternatives` o `/entries/[slug]`, **Then** el contenido HTML se lee perfectamente.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST proveer la ruta pública `/submit` con el formulario de envío de alternativas comunitarias.
- **FR-002**: El formulario de `/submit` MUST permitir seleccionar una app del directorio (Wikipedia, Goodreads, Reddit, Stack Overflow, Pinterest, IMDb, Chess.com) o la opción `"None / Independent Tool"`.
- **FR-003**: Si se proporciona el parámetro `?target={slug}` en `/submit`, la app correspondiente MUST estar preseleccionada por defecto.
- **FR-004**: El formulario de envío MUST validar y recopilar:
  - `target_slug`: Slug de la app o `'general'` / `null`.
  - `name`: Nombre de la alternativa (1 a 60 caracteres).
  - `url`: URL válida que inicie estrictamente con `https://` o `http://`.
  - `icon_url` o `icon_emoji`: Logo o icono (opcional).
  - `description`: Descripción corta (máximo 160 caracteres).
  - `creator_email`: Correo de contacto del creador (privado, nunca público).
  - `is_verified_request`: Booleano indicando si solicita verificación destacada.
- **FR-005**: Las alternativas enviadas MUST guardarse en la tabla `community_alternatives` de Supabase con `status = 'pending'`.
- **FR-006**: La página de detalle `/entries/[slug]` MUST incluir en el lateral derecho el módulo `"Community Alternatives"` con la lista de alternativas aprobadas para esa app.
- **FR-007**: La página `/entries/[slug]` MUST mostrar en el encabezado un contador dinámico de alternativas comunitarias disponibles.
- **FR-008**: El sistema MUST proveer la ruta pública `/alternatives` que liste todas las alternativas aprobadas de la comunidad.
- **FR-009**: Las alternativas marcadas con `is_verified = true` MUST ordenarse en primer lugar tanto en `/entries/[slug]` como en `/alternatives`.
- **FR-010**: Todos los enlaces externos a webs de alternativas MUST incluir `target="_blank"` y `rel="noopener noreferrer nofollow"`.
- **FR-011**: El formulario MUST incluir protección anti-spam (campo honeypot oculto y validación de sintaxis).
- **FR-012**: El Navbar MUST enlazar `Alternatives` a `/alternatives` y `Submit` a `/submit`.

### Key Entities

- **CommunityAlternative**:
  - `id`: UUID (Primary Key).
  - `target_slug`: String (slug de la app o 'general').
  - `name`: String (nombre de la alternativa).
  - `url`: String (URL segura).
  - `icon`: String (emoji o URL de icono).
  - `description`: String (descripción corta, máx 160 chars).
  - `creator_email`: String (email privado del creador).
  - `status`: String (`'pending' | 'approved' | 'rejected'`).
  - `is_verified`: Boolean (default `false`).
  - `created_at`: Timestamp with time zone.
  - `updated_at`: Timestamp with time zone.

## Success Criteria *(mandatory)*

- **SC-001**: Un creador puede enviar su alternativa en `/submit` en menos de 90 segundos.
- **SC-002**: El 100% de las alternativas en estado `pending` quedan ocultas del acceso público general mediante Row Level Security.
- **SC-003**: La lista lateral en `/entries/[slug]` y el directorio `/alternatives` cargan en menos de 1 segundo.
- **SC-004**: 0 correos de creadores son expuestos en las respuestas públicas de Supabase o API.
- **SC-005**: 100% de los tests unitarios y E2E pasan con éxito.
