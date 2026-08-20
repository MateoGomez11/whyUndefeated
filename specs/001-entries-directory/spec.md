# Feature Specification: Directorio de Entradas y Páginas de Detalle

**Feature Branch**: `001-entries-directory`

**Created**: 2026-08-12

**Status**: Draft

**Input**: User description: "Construir el directorio de entradas y las páginas de detalle para WhyUndefeated — página principal con tarjetas y páginas de detalle por entrada, contenido leído desde archivos versionados en el repo, con fuentes visibles y validación en build."

## Clarifications

### Session 2026-08-12

- Q: ¿La página principal incluye controles interactivos de orden/filtro en esta feature, o solo el
  orden por defecto (alto→bajo) estático? → A: Solo orden estático (sin controles interactivos; orden
  fijo alto→bajo, filtros/orden interactivo diferidos a una feature futura).
- Q: ¿Debe cada entrada tener al menos un retador nombrado (con fuente) como campo obligatorio que
  bloquee la publicación si falta? → A: No, retador opcional (los campos obligatorios son nivel de
  amenaza, explicación del moat y al menos una fuente; una entrada puede no tener retadores).
- Q: ¿Cómo se comunica el nivel de amenaza en el badge para accesibilidad: color + etiqueta de texto, o
  solo color? → A: Color + etiqueta de texto (el badge muestra el nivel también como texto, no solo por
  color).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explorar el directorio de entradas (Priority: P1)

Un visitante público llega a la página principal y ve todas las entradas listadas como tarjetas.
Las tarjetas están ordenadas por nivel de amenaza (de alto a bajo) por defecto. Una leyenda visible
explica qué significa cada nivel (bajo / medio / alto). Cada tarjeta muestra el nombre de la app, un
badge de nivel de amenaza con código de color, y un resumen de una línea. Al hacer clic en una tarjeta,
el visitante navega a la página de detalle de esa entrada.

**Why this priority**: Es la puerta de entrada del producto y el canal principal de descubrimiento (SEO).
Sin el directorio no hay forma de encontrar ni navegar el contenido; entrega valor por sí sola aunque el
detalle aún no exista (las tarjetas ya comunican el índice de amenaza).

**Independent Test**: Se puede probar completamente cargando "/" y verificando que aparecen las 7 tarjetas
semilla, ordenadas de alto a bajo nivel de amenaza, con leyenda visible y que cada tarjeta enlaza a su
detalle.

**Acceptance Scenarios**:

1. **Given** las 7 entradas semilla existen como contenido válido, **When** el visitante abre "/",
   **Then** ve exactamente 7 tarjetas, cada una con nombre de app, badge de nivel de amenaza con color y
   resumen de una línea.
2. **Given** las entradas tienen niveles de amenaza mezclados, **When** se carga "/", **Then** las
   tarjetas aparecen ordenadas de nivel alto a bajo por defecto.
3. **Given** la página principal está cargada, **When** el visitante la observa, **Then** existe una
   leyenda visible que explica el significado de bajo / medio / alto.
4. **Given** una tarjeta de entrada, **When** el visitante hace clic en ella, **Then** navega a
   "/entries/{slug}" de esa entrada.
5. **Given** JavaScript desactivado en el navegador, **When** se carga "/", **Then** el listado, los
   badges, la leyenda y los enlaces siguen siendo legibles y funcionales.

---

### User Story 2 - Ver el detalle completo de una entrada (Priority: P1)

Un visitante abre la página de detalle de una entrada (p. ej. "/entries/pinterest") y ve la información
completa: nombre de la app, nivel de amenaza, la lista de retadores nombrados (cada uno con nombre,
resumen de evidencia de una línea y enlace a su fuente), un párrafo de explicación del "moat", y una
sección de "fuentes" que lista cada cita usada en la página. Toda afirmación sobre un retador o el moat
muestra su fuente como una cita visible y clickeable.

**Why this priority**: Es el núcleo del valor del producto — la respuesta basada en evidencia a "por qué
la IA aún no ha reemplazado esta app". La verificabilidad de cada afirmación es un requisito no negociable
de la constitución.

**Independent Test**: Se puede probar cargando "/entries/pinterest" y verificando que se muestran todos
los campos requeridos y que cada afirmación de retador/moat tiene un enlace de fuente clickeable listado
también en la sección de fuentes.

**Acceptance Scenarios**:

1. **Given** una entrada válida, **When** el visitante abre su página de detalle, **Then** ve el nombre de
   la app, el nivel de amenaza, la lista de retadores, el párrafo del moat y la sección de fuentes.
2. **Given** una entrada con varios retadores, **When** se muestra el detalle, **Then** cada retador
   aparece con su nombre, un resumen de evidencia de una línea y un enlace a su fuente clickeable.
3. **Given** cualquier afirmación sobre un retador o el moat, **When** el visitante la lee, **Then** puede
   ver y hacer clic en una cita de fuente asociada, y esa fuente también figura en la sección de fuentes.
4. **Given** todas las páginas de detalle, **When** se comparan entre sí, **Then** todas usan la misma
   plantilla y estructura visual (sin layouts únicos por entrada).
5. **Given** un slug que no corresponde a ninguna entrada semilla, **When** el visitante lo abre, **Then**
   ve una página de "no encontrado" clara en lugar de un error del sistema.
6. **Given** JavaScript desactivado, **When** se carga una página de detalle, **Then** todo el contenido y
   los enlaces de fuentes siguen siendo legibles y clickeables.

---

### User Story 3 - Bloquear entradas inválidas antes de producción (Priority: P2)

Un mantenedor/contribuidor añade o edita un archivo de contenido de una entrada. Si el archivo carece de
un campo obligatorio (nivel de amenaza, al menos una fuente, o explicación del moat), el proceso de
publicación falla con un error claro que nombra el campo faltante y el archivo afectado. Las entradas
inválidas nunca llegan a producción de forma silenciosa.

**Why this priority**: Protege el principio de integridad de contenido de la constitución. Es P2 porque el
valor de cara al usuario (P1) puede demostrarse con contenido válido, pero esta garantía es esencial antes
de aceptar contribuciones y de ir a producción.

**Independent Test**: Se puede probar introduciendo deliberadamente una entrada a la que le falta un campo
obligatorio y verificando que la publicación se detiene con un mensaje que identifica el campo y el archivo.

**Acceptance Scenarios**:

1. **Given** una entrada sin nivel de amenaza, **When** se intenta publicar, **Then** el proceso falla y
   el error nombra el campo "nivel de amenaza" y el archivo afectado.
2. **Given** una entrada sin ninguna fuente, **When** se intenta publicar, **Then** el proceso falla y el
   error nombra la ausencia de fuente y el archivo afectado.
3. **Given** una entrada sin explicación del moat, **When** se intenta publicar, **Then** el proceso falla
   y el error nombra el campo "moat" y el archivo afectado.
4. **Given** todas las entradas válidas, **When** se publica, **Then** el proceso completa sin errores de
   validación.

---

### Edge Cases

- **Empate en nivel de amenaza**: Cuando varias entradas comparten el mismo nivel, se ordenan
  alfabéticamente por nombre de app dentro de ese nivel (desempate determinista).
- **Retador sin fuente**: Un retador nombrado sin enlace de fuente cuenta como campo obligatorio faltante
  y bloquea la publicación (cada afirmación requiere fuente).
- **Entrada sin retadores**: Una entrada sin ningún retador nombrado es válida y no bloquea la publicación;
  la página de detalle omite la lista de retadores de forma limpia (los campos obligatorios siguen siendo
  nivel de amenaza, moat y al menos una fuente).
- **Slug inexistente**: Una URL "/entries/{slug}" que no corresponde a ninguna entrada muestra una página
  de "no encontrado" legible, no un error crudo.
- **Fuente duplicada**: Si la misma fuente se cita en varias afirmaciones, aparece una sola vez en la
  sección de "fuentes" pero sigue siendo clickeable en cada afirmación.
- **Nombre de app con caracteres especiales** (p. ej. "Twitter/X"): el slug se normaliza a una forma
  segura para URL de manera consistente y estable.
- **Categoría con una sola entrada**: si una entrada es la única de su `category`, la sección de "related
  apps" del detalle se omite de forma limpia (sin sección vacía rota).
- **Contador con votos inexistentes**: mientras no exista la feature de votación, el total de votos de la
  comunidad es exactamente 0 (derivado de la ausencia de datos de voto), nunca un placeholder inventado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar en "/" una tarjeta por cada entrada publicada, con nombre de la app,
  badge de nivel de amenaza y un resumen de una línea.
- **FR-002**: El sistema MUST ordenar las tarjetas de la página principal por nivel de amenaza de alto a
  bajo, con desempate alfabético por nombre de app. En esta feature el orden es fijo: NO hay controles
  interactivos de orden ni de filtro (se difieren a una feature futura).
- **FR-017**: Cada badge de nivel de amenaza MUST comunicar el nivel mediante una etiqueta de texto
  visible (p. ej. "High") además del color; el nivel NO puede transmitirse solo por color.
- **FR-003**: El sistema MUST mostrar en la página principal una leyenda visible que explique el
  significado de los niveles bajo, medio y alto.
- **FR-004**: Cada tarjeta MUST enlazar a la página de detalle de su entrada en la ruta "/entries/{slug}".
- **FR-005**: El sistema MUST servir una página de detalle por entrada en "/entries/{slug}" que muestre:
  nombre de la app, nivel de amenaza, lista de retadores, explicación del moat y sección de fuentes.
- **FR-006**: Cada retador listado MUST mostrar su nombre, un resumen de evidencia de una línea y un
  enlace a su fuente clickeable.
- **FR-007**: Toda afirmación sobre un retador o el moat MUST mostrar una cita de fuente visible y
  clickeable en la página (requisito no negociable de integridad de contenido).
- **FR-008**: Cada página de detalle MUST incluir una sección de "fuentes" que liste cada cita usada en la
  página; las fuentes duplicadas aparecen una sola vez.
- **FR-009**: Todas las páginas de entrada MUST reutilizar la misma plantilla y estructura visual
  compartida; no se permiten layouts únicos por entrada.
- **FR-010**: El contenido de las entradas MUST leerse desde archivos versionados en el repositorio (uno
  por entrada), no desde una base de datos ni desde servicios externos en tiempo de ejecución.
- **FR-011**: Las páginas de contenido MUST generarse de forma estática (sin obtención de datos del lado
  del cliente para mostrar el contenido) y MUST permanecer legibles con JavaScript desactivado.
- **FR-012**: El sistema MUST publicar exactamente las 7 entradas semilla: Pinterest, Wikipedia, Reddit,
  Twitter/X, TikTok, Goodreads y LinkedIn.
- **FR-013**: El proceso de publicación MUST fallar cuando un archivo de contenido carezca de un campo
  obligatorio (nivel de amenaza, categoría, al menos una fuente, explicación del moat, o al menos una
  fuente citada por el moat), con un mensaje de error que nombre el campo faltante y el archivo afectado.
  La validación también MUST fallar ante una referencia de fuente colgante: cualquier `sourceId` de un
  retador o cualquier id en `moatSourceIds` que no exista en las fuentes de la entrada bloquea la
  publicación (integridad referencial).
- **FR-014**: El nivel de amenaza de cada entrada MUST ser uno de tres valores válidos. El valor almacenado
  (canónico, en los archivos de contenido) es el enum en inglés `"low" | "medium" | "high"`; la etiqueta
  mostrada al usuario es "Low" / "Medium" / "High" (badge en mayúsculas). Los términos en español
  bajo/medio/alto son solo descriptivos en este documento, no valores almacenados.
- **FR-018**: Los retadores nombrados son OPCIONALES a nivel de entrada: una entrada sin retadores es
  válida y NO bloquea la publicación. Sin embargo, cualquier retador que sí esté presente MUST incluir su
  fuente (ver FR-006 y el caso borde "Retador sin fuente"). La página de detalle MUST manejar con
  elegancia una entrada sin retadores (sin lista vacía rota).
- **FR-015**: El sistema MUST mostrar una página de "no encontrado" legible cuando se solicite un slug que
  no corresponde a ninguna entrada publicada.
- **FR-016**: La feature MUST ser accesible a visitantes públicos sin autenticación ni datos personales, y
  no introduce roles ni permisos.
- **FR-019**: Cada entrada MUST incluir un campo `category` obligatorio con uno de cuatro valores válidos:
  `Social`, `Content`, `Knowledge` o `Community`. La publicación MUST fallar (nombrando campo y archivo) si
  falta o el valor está fuera del enum. La categoría alimenta la sección de "related apps" del detalle y
  queda disponible como dato para futuros filtros de la home.
- **FR-020**: La página de detalle MUST mostrar una sección de "related apps" que liste las demás entradas
  que comparten la misma `category`, renderizada de forma estática en el servidor (sin JS). Si la entrada
  es la única de su categoría, la sección se omite de forma limpia.
- **FR-021**: La página principal MUST mostrar un contador agregado calculado en tiempo de build
  directamente a partir de los datos de las entradas, con tres totales reales: (a) total de apps rastreadas
  = número de entradas; (b) total de citas de fuente documentadas = suma de las fuentes de todas las
  entradas; (c) total de votos de la comunidad = 0 hasta que exista la feature de votación. Estos totales
  MUST ser derivados de los datos; NUNCA un valor inventado, editorial ni un puntaje compuesto.

### Non-Functional Requirements

**Breakpoints**: móvil `<640px` · tablet `640–1024px` · desktop `>1024px`.

- **NFR-001**: El sitio MUST ser completamente usable y legible en los tres breakpoints (móvil, tablet,
  desktop), incluyendo con JavaScript desactivado (ver Principio III de la constitución y FR-011).
- **NFR-002**: La tabla de tracker de la home MUST colapsar a un layout de tarjetas apiladas en móvil, sin
  scroll horizontal ni desbordamiento de columnas.
- **NFR-003**: El hero (titular, barra de búsqueda y stat blocks) MUST redimensionarse/apilarse
  verticalmente en móvil sin romper el patrón de titular fijo a dos líneas.
- **NFR-004**: La navegación del header MUST colapsar a un layout compacto apto para móvil. Se prefiere una
  solución puramente CSS (p. ej. toggle basado en checkbox/`<details>`) sobre un componente cliente, para
  preservar el principio de que el sitio no requiere JavaScript (Principio III).
- **NFR-005**: El layout de dos columnas de la página de detalle (contenido principal + sidebar de
  "related apps") MUST apilarse a una sola columna en móvil, con "related apps" apareciendo debajo del
  contenido principal en lugar de al lado.

### Key Entities *(include if feature involves data)*

- **Entrada (Entry)**: Representa una app/plataforma evaluada. Atributos: nombre de la app, slug (derivado
  de forma estable para la URL), nivel de amenaza (bajo/medio/alto), categoría (Social/Content/Knowledge/
  Community), resumen de una línea, explicación del moat, lista de retadores, y conjunto de fuentes citadas.
  Es la unidad de contenido versionada (un archivo por entrada).
- **Retador (Challenger)**: Un competidor real nombrado dentro de una entrada. Atributos: nombre, resumen
  de evidencia de una línea (financiamiento, ranking o tracción), y referencia a la fuente que respalda la
  evidencia.
- **Fuente (Source)**: Una referencia verificable citada por una afirmación. Atributos: etiqueta/título y
  URL clickeable. Puede ser referenciada por varias afirmaciones pero se lista una sola vez por página.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visitante puede ir desde la página principal hasta el detalle de cualquiera de las 7
  entradas en un solo clic.
- **SC-002**: El 100% de las afirmaciones sobre retadores y sobre el moat en cada página de detalle tienen
  una fuente visible y clickeable.
- **SC-003**: El 100% de las páginas de entrada usan la misma plantilla compartida (verificable por
  ausencia de layouts únicos).
- **SC-004**: Cualquier entrada a la que le falte un campo obligatorio detiene la publicación el 100% de
  las veces, con un mensaje que identifica el campo y el archivo.
- **SC-005**: Todas las páginas de contenido permanecen completamente legibles y navegables con JavaScript
  desactivado.
- **SC-006**: La página principal muestra las 7 entradas semilla ordenadas de nivel de amenaza alto a bajo,
  con una leyenda visible de niveles.
- **SC-007**: Las páginas de contenido cargan de forma rápida y son indexables por motores de búsqueda (sin
  depender de ejecución de JavaScript para mostrar el contenido principal).
- **SC-008**: El contador agregado de la home coincide exactamente, el 100% de las veces, con los datos
  subyacentes: total de apps = número de entradas, total de citas = suma de fuentes de todas las entradas,
  total de votos = 0 (verificable de forma automatizada).
- **SC-009**: El 100% de las entradas tienen una categoría válida del enum, y cada sección de "related
  apps" lista únicamente entradas que comparten esa categoría.
- **SC-010**: En los tres breakpoints (móvil `<640px`, tablet `640–1024px`, desktop `>1024px`), la home y
  las páginas de detalle renderizan sin scroll horizontal ni desbordamiento de columnas, y permanecen
  legibles y navegables con JavaScript desactivado (NFR-001–NFR-005).

## Assumptions

- Cada entrada se almacena en un único archivo versionado en el repositorio (Markdown con frontmatter o
  JSON); la elección concreta del formato se define en la fase de planificación.
- El slug de cada entrada se deriva de forma estable a partir del nombre de la app (p. ej. "Twitter/X" →
  "twitter-x"); los slugs permanecen constantes entre publicaciones para preservar el SEO.
- El desempate del orden por nivel de amenaza es alfabético por nombre de app cuando dos entradas comparten
  nivel.
- No hay contadores de voto ni interacción en esta feature; los contadores de voto/reacción (que usan la
  base de datos) quedan fuera de alcance aquí y se abordan en una feature separada.
- El contenido de las 7 entradas semilla (retadores, evidencia, moat y fuentes) es provisto como parte de
  la implementación y debe cumplir el principio de integridad de contenido.
- No se recopila información personal de los visitantes; no hay autenticación en esta feature.
- Mapeo de categoría de las 7 entradas semilla (canónico para cuando se creen los archivos): Social →
  Twitter/X, LinkedIn; Content → Pinterest, TikTok; Knowledge → Wikipedia; Community → Reddit, Goodreads.
- Los **filtros/pills de categoría interactivos** de la home permanecen DIFERIDOS a una feature futura,
  consistente con la clarificación de "solo orden estático" (FR-002). El campo `category` se añade ahora
  solo como dato y para la sección estática de "related apps"; no introduce interactividad de cliente.
- El total de "citas de fuente documentadas" del contador se define como la suma del número de fuentes
  (`sources`) declaradas en todas las entradas (una fuente = una cita documentada).

## Alternativas Rechazadas

- **Puntaje de confianza / "confidence score"** (p. ej. "78% confidence" o cualquier índice compuesto o
  editorial): RECHAZADO explícitamente. No forma parte del modelo de datos y NO debe aparecer en el spec,
  el plan, el esquema ni la UI. Un puntaje así sería un dato especulativo/sin fuente y violaría el Principio
  I (Integridad de Contenido Basada en Evidencia) de la constitución. El único valor numérico agregado
  permitido es el contador de FR-021, que es 100% derivado de datos reales y verificables.
