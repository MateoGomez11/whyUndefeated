# Feature Specification: Página de Metodología

**Feature Branch**: `002-methodology-page`

**Created**: 2026-08-17

**Status**: Draft

**Input**: User description: "Create a new "Methodology" static page for WhyUndefeated at /methodology,
explaining how threat-level verdicts are determined. What: A single static content page (no
interactivity) explaining: the 3 threat tiers and what each means (reusing existing tier descriptions for
consistency, not new wording); the 3 accepted evidence types (traffic/usage stats, AI capability
benchmarks, user migration signals); the content integrity rule that every claim requires a verifiable
source and the build blocks any entry missing one; and a short note on how "related apps" grouping works
(same category). Where: "/methodology", linked from the header nav (already exists, currently pointing
nowhere). Constraints: Must reuse the same header/footer/design system as the rest of the site — no new
components beyond what's needed for static text layout. Content must accurately reflect what the code
actually enforces (Zod schema rules) — no aspirational claims about validation that isn't real.
Non-functional: Same responsive/no-JS requirements as the rest of the site (NFR-001 to NFR-005)."

## Clarifications

### Session 2026-08-17

- Q: ¿La sección de tipos de evidencia debe incluir ejemplos reales tomados de las entradas existentes, o
  solo definiciones abstractas de cada tipo? → A: Solo definiciones — texto puramente definicional y
  estático, sin leer `content/entries/`; la página no se acopla al pipeline de contenido.
- Q: ¿El texto de los tres niveles de amenaza debe extraerse a un módulo compartido que importen tanto
  `TierStats.tsx` como la página nueva, o basta con copiar el texto literal aceptando el riesgo de
  desincronización? → A: Extraer a un módulo compartido — una sola fuente de verdad; un cambio futuro de
  copy se propaga automáticamente a ambos lugares, eliminando el riesgo estructuralmente.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender cómo se determina un veredicto de amenaza (Priority: P1)

Un visitante quiere saber cómo WhyUndefeated decide que una app está en nivel de amenaza alto, medio o
bajo, y qué tipo de evidencia respalda esas afirmaciones. Abre "/methodology" y encuentra una explicación
clara de los tres niveles de amenaza (con la misma descripción que ya ve en la leyenda de la home, no una
redacción distinta) y de los tipos de evidencia que alimentan cada veredicto.

**Why this priority**: Es el propósito central de la página — sin esta explicación, la página no cumple
ninguna función. Refuerza la credibilidad del sitio (Principio I de la constitución: integridad de
contenido basada en evidencia) mostrando el método, no solo el resultado.

**Independent Test**: Se puede probar completamente cargando "/methodology" y verificando que los tres
niveles de amenaza aparecen con la misma etiqueta y descripción que en la leyenda de la home, y que se
listan los tres tipos de evidencia aceptados.

**Acceptance Scenarios**:

1. **Given** un visitante en "/methodology", **When** lee la sección de niveles de amenaza, **Then** ve
   los tres niveles (alto/medio/bajo) cada uno con la misma etiqueta y el mismo texto descriptivo que ya
   se usa en la leyenda de la home (sin redacción nueva ni divergente).
2. **Given** un visitante en "/methodology", **When** lee la sección de evidencia, **Then** ve los tres
   tipos de evidencia aceptados (estadísticas de tráfico/uso, benchmarks de capacidad de IA, señales de
   migración de usuarios) con una definición de cada uno — sin ejemplos citados de entradas reales.
3. **Given** un visitante en "/methodology", **When** lee la sección de integridad de contenido, **Then**
   ve una explicación de que toda afirmación requiere una fuente verificable y que el proceso de
   publicación bloquea cualquier entrada a la que le falte una fuente — descripción que coincide con la
   regla de validación real implementada en el esquema de contenido.
4. **Given** un visitante en "/methodology", **When** lee la sección de "related apps", **Then** entiende
   que las apps relacionadas mostradas en el detalle de una entrada son las demás entradas que comparten
   su misma categoría.

---

### User Story 2 - Llegar a la metodología desde cualquier página (Priority: P2)

Un visitante en la home o en una página de detalle quiere entender el método detrás del sitio. Hace clic
en "Methodology" en la navegación del header y llega a "/methodology".

**Why this priority**: El enlace de navegación ya existe visualmente en el header pero hoy no lleva a
ningún lado ("#"); sin esta conexión la página nueva sería inalcanzable para un visitante que no conozca
la URL de memoria.

**Independent Test**: Se puede probar haciendo clic en "Methodology" en el header desde "/" o desde
cualquier "/entries/{slug}" y verificando que la URL resultante es "/methodology".

**Acceptance Scenarios**:

1. **Given** un visitante en cualquier página del sitio, **When** hace clic en "Methodology" en el header,
   **Then** navega a "/methodology".
2. **Given** JavaScript desactivado, **When** el visitante hace clic en "Methodology", **Then** la
   navegación funciona igual (enlace real, no manejador de clic de cliente).

---

### Edge Cases

- **Acceso directo por URL**: un visitante que entra directamente a "/methodology" (sin pasar por el
  header) ve la página completa igual que si hubiera navegado desde el header — es una ruta estática fija,
  no una plantilla con parámetro que pueda fallar por "slug" inexistente.
- **Ancho de viewport angosto**: en móvil (`<640px`) el texto de la página se reacomoda sin scroll
  horizontal ni recorte, igual que el resto del sitio (ver Non-Functional Requirements).
- **Desajuste de contenido**: resuelto estructuralmente por FR-002 — al provenir ambas páginas del mismo
  módulo compartido, un cambio futuro en la descripción de un nivel de amenaza se refleja automáticamente
  aquí y en la home; no depende de que alguien recuerde actualizar dos lugares.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST servir una página estática en la ruta "/methodology" que explique cómo se
  determinan los veredictos de nivel de amenaza.
- **FR-002**: La página MUST presentar los tres niveles de amenaza (alto/medio/bajo) usando la misma
  etiqueta y el mismo texto descriptivo que ya se muestra en la leyenda de nivel de amenaza de la home. Esta
  etiqueta y texto MUST provenir de una única fuente de verdad compartida (un módulo común importado tanto
  por `components/TierStats.tsx` como por la página de metodología) — no se acepta duplicar el texto como
  constantes independientes en cada lugar, precisamente para que un cambio futuro de copy se propague a
  ambos sin quedar desincronizado.
- **FR-003**: La página MUST describir los tres tipos de evidencia que respaldan las afirmaciones del
  sitio: estadísticas de tráfico/uso ("traffic/usage stats"), benchmarks de capacidad de IA ("AI capability
  benchmarks"), y señales de migración de usuarios ("user migration signals"). Esta sección es **solo
  definicional**: texto estático que explica qué significa cada tipo, SIN citar ejemplos reales de
  `content/entries/` — la página no lee ni depende del loader de contenido para esta sección. Es contenido
  explicativo/informativo — el esquema de contenido actual (`lib/content/schema.ts`) NO clasifica ni valida
  el campo `evidence` de un retador por tipo; la página NO MUST implicar que existe una validación
  automática de tipo de evidencia que no existe en el código.
- **FR-004**: La página MUST explicar la regla de integridad de contenido tal como está implementada
  realmente: toda entrada requiere al menos una fuente (`sources`, mínimo 1), una explicación de moat con
  al menos una fuente citada (`moatSourceIds`, mínimo 1, cada id debe existir en `sources`), y cualquier
  retador presente debe citar una fuente existente (`challengers[].sourceId`); una entrada que incumpla
  cualquiera de estas reglas bloquea `next build` con un error que nombra el campo y el archivo. La página
  NO MUST afirmar ninguna regla de validación adicional que el esquema no implemente.
- **FR-005**: La página MUST explicar brevemente que la sección "related apps" de una página de detalle
  muestra las demás entradas que comparten la misma `category` que la entrada actual.
- **FR-006**: El enlace "Methodology" ya existente en la navegación del header (`components/NavBar.tsx`)
  MUST apuntar a "/methodology" (en vez de "#" como hoy) en todas las páginas del sitio.
- **FR-007**: La página MUST ser puramente estática (RSC, sin `"use client"`, sin fetching de datos del
  lado del cliente) y MUST permanecer legible y navegable con JavaScript desactivado, igual que el resto
  del sitio (FR-011 de `specs/001-entries-directory/spec.md`).
- **FR-008**: La página MUST reutilizar el `NavBar` y el `Footer` compartidos y los tokens de diseño
  existentes (`app/globals.css`) — no se introduce ningún sistema de diseño paralelo. Cualquier elemento de
  presentación nuevo se limita a lo necesario para maquetar texto estático (encabezados de sección,
  párrafos, listas) — no se agregan componentes interactivos.
- **FR-009**: La página MUST cumplir los mismos requisitos de responsive y de legibilidad sin JavaScript
  que el resto del sitio (NFR-001–NFR-005 de `specs/001-entries-directory/spec.md`) — ver Non-Functional
  Requirements.

### Non-Functional Requirements

Esta página se rige por los mismos NFR-001–NFR-005 ya definidos en
`specs/001-entries-directory/spec.md` (breakpoints móvil `<640px` / tablet `640–1024px` / desktop
`>1024px`); no se redefinen aquí, se heredan y se aplican a este contenido nuevo:

- El contenido de texto se reacomoda sin scroll horizontal ni recorte en los tres breakpoints (aplica el
  mismo principio que NFR-001/NFR-003 a un layout de texto en vez de tarjetas/grillas).
- El header/nav de esta página es el mismo componente compartido `NavBar`, por lo que hereda el colapso
  CSS-only ya implementado (NFR-004) sin cambios adicionales.
- La página no introduce ninguna grilla de dos columnas ni tabla, por lo que NFR-002 y NFR-005 no aplican
  contenido nuevo que colapsar — se listan solo por completitud de cobertura de breakpoints (SC-010).

### Key Entities

*No aplica* — esta feature no introduce ni modifica entidades de datos. El contenido de la página
(descripciones de nivel de amenaza, tipos de evidencia, regla de integridad, nota de "related apps") es
copy estático embebido en el componente de la página, no una entrada versionada en `content/entries/`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante puede llegar a "/methodology" desde cualquier página del sitio en un solo clic
  desde el header.
- **SC-002**: El 100% del texto descriptivo de los tres niveles de amenaza en "/methodology" coincide
  literalmente (mismo texto) con el que se muestra en la leyenda de la home — verificable comparando ambas
  fuentes de texto.
- **SC-003**: La página permanece completamente legible y navegable con JavaScript desactivado.
- **SC-004**: La página no presenta scroll horizontal ni contenido recortado en los tres breakpoints
  (móvil `<640px`, tablet `640–1024px`, desktop `>1024px`).
- **SC-005**: El 100% de las afirmaciones de la página sobre validación/integridad de contenido
  corresponde exactamente a una regla real implementada en `lib/content/schema.ts` — verificable por
  revisión cruzada contra `specs/001-entries-directory/contracts/entry.schema.md` (sin afirmaciones
  aspiracionales).

## Assumptions

- El texto exacto a reutilizar para los tres niveles de amenaza es el que hoy vive en
  `components/TierStats.tsx` (labels "High Threat" / "Medium Threat" / "Low Threat / Safe" y sus captions
  completas). Por la Clarification de esta sesión, ese texto se extrae a un módulo compartido (p. ej.
  `lib/content/tiers.ts` o similar — la ubicación exacta es decisión de `/speckit-plan`) del que ambos,
  `TierStats.tsx` y la página de metodología, importan; no se implementa como dos copias independientes.
- El framing de los tres tipos de evidencia ("Traffic/usage stats", "AI capability benchmark", "User
  migration signal") proviene del brief original del producto (`design-reference/readme.md`); se presenta
  en esta página como contenido explicativo sobre qué tipo de evidencia respalda las afirmaciones del
  sitio, no como un campo validado por el esquema — el esquema actual no clasifica `evidence` por tipo.
- Esta página no introduce filtros, búsqueda, votación ni ningún otro elemento interactivo — es contenido
  100% estático, consistente con el resto del sitio en esta fase.
- El estado "activo" de la navegación (resaltar "Methodology" en el header cuando se está en esa página)
  queda fuera de alcance de esta feature; el header sigue resaltando "Home" en todas las páginas como hoy,
  salvo que una feature futura introduzca resaltado por ruta.
- No se requiere ningún archivo de contenido nuevo en `content/entries/` ni cambio al esquema Zod — esta
  feature es puramente de presentación (una página + un enlace de nav corregido).
