<!--
INFORME DE IMPACTO DE SINCRONIZACIÓN
====================================
Cambio de versión: 1.1.0 → 1.2.0
Justificación: Se añade una nueva sección ("Roadmap Futuro (no implementado)") documentando 3 ideas
evaluadas y diferidas más allá del MVP, lo que constituye un incremento MENOR según versionado semántico
(nueva sección / guía materialmente ampliada, sin redefinir ni eliminar ningún principio existente).

Principios modificados: ninguno (I–VI sin cambios)

Secciones añadidas:
  - Roadmap Futuro (no implementado) — Community Alternatives, Sponsors, Live Stats

Secciones eliminadas: ninguna

TODOs pendientes: ninguno

Plantillas / archivos a revisar para alineación:
  - Ninguno requiere cambio inmediato — la nueva sección es puramente informativa/de gobernanza; no
    modifica ninguna puerta de Constitution Check existente en plan-template.md, spec-template.md ni
    tasks-template.md. Cuando cualquiera de las 3 ideas se priorice, su propio /speckit-plan deberá
    re-evaluar el Constitution Check contra los principios vigentes en ese momento.
-->

# Constitución de WhyUndefeated

## Principios Fundamentales

### I. Integridad de Contenido Basada en Evidencia (NO NEGOCIABLE)

Cada entrada responde "por qué la IA aún no ha reemplazado esta app/plataforma" como un índice de nivel
de amenaza basado en evidencia, nunca como opinión. Cada entrada DEBE incluir: un nivel de amenaza `bajo`,
`medio` o `alto`; retadores reales identificados por nombre con evidencia concreta (financiamiento,
ranking, tracción — nunca inventados); una explicación concreta del "moat" que protege a la app original;
y una fuente/referencia verificable para cada dato. Ninguna entrada se publica sin al menos una fuente
verificable y comprobable. Los datos especulativos están prohibidos bajo cualquier circunstancia. Cuando
una afirmación no puede respaldarse con una fuente, se elimina — no se suaviza.

Justificación: Todo el valor del producto es su confiabilidad. Una sola afirmación fabricada o sin fuente
destruye la credibilidad del índice, por lo que la verificabilidad es una puerta de publicación, no un
lujo opcional.

### II. Contenido como Código

El contenido principal se guarda como archivos Markdown/JSON versionados en el repositorio, estructurados
para que la comunidad pueda contribuir vía pull request más adelante. La base de datos (PostgreSQL vía
Supabase) se usa ÚNICAMENTE para contadores de voto/reacción y NO DEBE albergar contenido principal. La
estructura del contenido DEBE ser validable por máquina: cada archivo de entrada se verifica en busca de
los campos obligatorios (nivel de amenaza, retadores nombrados con evidencia, moat y al menos una fuente)
antes de considerarse válido.

Justificación: Mantener el contenido en el repositorio lo hace revisable, comparable por diffs y
contribuible por PR, y mantiene la fuente de verdad auditable de forma independiente de cualquier servicio
en tiempo de ejecución.

### III. Rendimiento y SEO con Prioridad en Servidor

Las páginas de contenido DEBEN renderizar rápido y ser totalmente indexables — el SEO es el canal
principal de adquisición de tráfico. Las páginas usan React Server Components por defecto; `"use client"`
se usa SOLO para islas interactivas genuinas (botón de voto, filtros, búsqueda). Se usa generación
estática / ISR para que las páginas de entrada carguen rápido y se actualicen sin un rebuild completo. El
JavaScript DEBE ser mínimo y NO DEBE bloquear el renderizado. El sitio DEBE seguir siendo legible con
JavaScript desactivado.

Justificación: El descubrimiento depende de páginas rápidas, rastreables y resilientes; la interactividad
es una capa de mejora, nunca un requisito para leer el contenido.

### IV. Pruebas Primero para Lógica Crítica (NO NEGOCIABLE)

La lógica crítica — conteo de votos, carga de contenido y generación de páginas — DEBE tener pruebas antes
de darse por terminada. Jest cubre las pruebas unitarias y de integración (carga de contenido, conteo de
votos, validación de estructura de entradas). Playwright cubre las pruebas end-to-end (navegación entre
entradas, comportamiento del botón de voto, y que las páginas carguen y sigan siendo legibles con
JavaScript desactivado). Ninguna funcionalidad crítica (votación, generación de páginas, validación de
contenido) se marca como completa sin sus pruebas correspondientes en Jest o Playwright.

Justificación: Estos flujos cargan las garantías de corrección e integridad del producto; la lógica
crítica sin pruebas se trata como trabajo sin terminar.

### V. Plantilla de Entrada Consistente y Contenido en Inglés

Cada página de entrada sigue la misma estructura y plantilla visual — sin layouts únicos por entrada. Todo
el contenido de cara al usuario (copys, entradas, UI) se escribe en inglés. Los cambios son pequeños y
revisables; los bloques grandes sin revisión se rechazan a favor de diffs incrementales e inspeccionables.

Justificación: Una plantilla uniforme mantiene el índice legible y escalable entre categorías, y un solo
idioma de contenido mantiene el MVP enfocado y revisable.

### VI. Requisitos de Seguridad

Ningún secreto (claves de Supabase, tokens de API u otras credenciales) se compromete NUNCA al
repositorio — todos los secretos se gestionan mediante variables de entorno. No se recopila ninguna
información de identificación personal (PII) de los votantes; votar NO requiere autenticación ni datos
personales. Todo el tráfico se sirve sobre HTTPS (vía el TLS por defecto de Vercel).

Justificación: El sitio no necesita identidad ni datos personales para cumplir su función, por lo que no
recopilarlos elimina de raíz una clase entera de riesgo; mantener los secretos fuera del repositorio y
forzar HTTPS protege tanto la infraestructura como a los visitantes con el mínimo de superficie de ataque.

## Restricciones de Tecnología y Arquitectura

- **Framework**: Next.js (App Router) con TypeScript.
- **Renderizado**: Server Components por defecto; Client Components reservados estrictamente para islas
  interactivas (botón de voto, filtros, búsqueda). Generación estática / ISR para las páginas de entrada.
- **Almacenamiento de contenido**: Archivos Markdown/JSON versionados en el repositorio, listos para
  contribución por PR.
- **Base de datos**: PostgreSQL vía Supabase (tier gratuito), usada únicamente para contadores de
  voto/reacción — nunca para el contenido principal.
- **Autenticación**: Ninguna en el MVP.
- **Hosting**: Vercel (tier gratuito, integración nativa con Next.js).
- **Dominio**: Registrado vía el GitHub Student Developer Pack o comprado aparte.
- **Herramientas de prueba**: Jest (unitarias/integración) y Playwright (end-to-end).
- **Alcance inicial**: Apps de redes sociales y contenido (Pinterest, Wikipedia, Reddit, Twitter/X,
  TikTok, Goodreads, LinkedIn), diseñado para expandirse a otras categorías más adelante.
- **Explícitamente fuera de alcance para el MVP**: auto-registro de empresas, sistemas de pagos y soporte
  multi-idioma.

## Flujo de Desarrollo y Puertas de Calidad

- Los cambios DEBEN ser pequeños y revisables; nada de bloques grandes sin revisión.
- La lógica crítica (conteo de votos, carga de contenido, generación de páginas) DEBE incluir pruebas
  (Principio IV) antes de marcarse como terminada.
- Cada entrada de contenido DEBE pasar la validación de estructura (campos obligatorios, al menos una
  fuente verificable) antes de su publicación (Principios I y II).
- Cada página de entrada DEBE reutilizar la estructura/plantilla compartida (Principio V).
- Las expectativas de rendimiento/SEO (carga rápida, indexable, legible sin JS) se verifican — Playwright
  cubre la comprobación de legibilidad con JS desactivado (Principio III).

## Gobernanza

Esta constitución está por encima de la conveniencia. Si un atajo técnico entra en conflicto con la
integridad de contenido (ej. publicar sin fuente) o con los principios de rendimiento (ej. agregar
JavaScript pesado e innecesario), gana el principio y el enfoque DEBE revisarse.

Las enmiendas DEBEN documentarse en este archivo, con la versión incrementada según las reglas de
versionado semántico: MAYOR para eliminaciones o redefiniciones de principios incompatibles hacia atrás;
MENOR para un nuevo principio o guía materialmente ampliada; PARCHE para aclaraciones y refinamientos no
semánticos. Todos los pull requests y revisiones DEBEN verificar el cumplimiento de estos principios;
cualquier complejidad añadida DEBE justificarse frente a ellos. Los elementos listados como fuera de
alcance para el MVP permanecen excluidos hasta que una enmienda documentada los incluya.

## Roadmap Futuro (no implementado)

Las siguientes ideas fueron evaluadas y se difieren explícitamente más allá del MVP. **Ninguna está
implementada hoy.** Esta sección no es una promesa de roadmap con fecha — es un registro de ideas
evaluadas y el gate que cada una debe pasar antes de construirse, para que no se cuelen como trabajo
implícito.

### Community Alternatives (Alternativas de la Comunidad)

Los usuarios podrían sugerir apps/retadores alternativos vía un formulario público, con una cuota de
verificación opcional de bajo costo que otorgue prioridad de listado. **Requiere una estrategia de
moderación definida antes de construirse** — sin ella, el Principio I (Integridad de Contenido Basada en
Evidencia) queda expuesto a contenido no verificado o especulativo enviado por terceros.

### Sponsors (Patrocinadores)

Una sección dedicada de patrocinadores en la home, inspirada en el modelo de canivibecodeit. **Requiere un
mecanismo de pago/facturación** (probablemente manual/fuera del sitio en una primera fase, no
automatizado). El pago ya está explícitamente fuera de alcance del MVP (ver "Restricciones de Tecnología y
Arquitectura" → "Explícitamente fuera de alcance para el MVP"); esta idea no se activa sin una enmienda que
levante esa restricción.

### Live Stats (Estadísticas en Vivo)

Una página de analítica de visitantes agregada y no identificable (a nivel país, conteo de vistas),
pensada principalmente para respaldar la promoción de sponsors. **Requiere su propia revisión de
privacidad** frente al Principio VI (Requisitos de Seguridad — sin PII), incluso siendo datos agregados:
"no identificable" debe verificarse en el diseño concreto, no asumirse por defecto.

### Regla común para las tres

Ninguna de estas ideas se implementa sin su propio ciclo completo `/speckit-specify` → `/speckit-clarify`
→ `/speckit-plan` → `/speckit-tasks`, y sin volver a chequearse en ese momento contra los principios
vigentes de esta constitución — en particular, la prohibición de pagos en el MVP y el Principio VI (sin
PII).

**Versión**: 1.2.0 | **Ratificada**: 2026-08-12 | **Última Enmienda**: 2026-08-17
