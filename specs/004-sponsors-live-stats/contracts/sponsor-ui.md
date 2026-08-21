# UI & Component Contracts: Sponsor Board & Live Telemetry

**Feature**: 004-sponsors-live-stats | **Date**: 2026-08-20

## 1. Ruta Pública: `/sponsor`

- **Tipo**: React Server Component (RSC)
- **Metadatos SEO**:
  - `title`: "Sponsor whyundefeated — 10 Fixed Slots for Builders"
  - `description`: "Ten fixed sponsor slots, read by builders deciding what to build and what to build on."
- **Estructura visual (orden de arriba a abajo)**:
  1. `NavBar` (con enlace activo en "Sponsors")
  2. `SponsorHero` (título principal, subtítulo y 4 stat cards)
  3. `LiveTelemetryDashboard` (globo 3D interactivo, contador en vivo, live reading feed, distribución por países y enlace `FULL DASHBOARD ->`)
  4. `SponsorPricingSection` (precio $2,500, timeline de fechas de reserva y testimonios)
  5. `SponsorAudienceGuide` (Presence buyers vs. Signup buyers)
  6. `SponsorSlotsGrid` (10 slots fijos L1–L5 y R1–R5 con badges de estado y enlaces interactivos)
  7. `Footer` (con enlace a `/sponsor`)

---

## 2. Componentes

### `SponsorSlotsGrid` (Server Component)
- **Props**: `{ slots: SponsorSlot[], currentMonth: string }`
- **Comportamiento**:
  - Grid de 2 columnas en desktop (`L1..L5` a la izquierda, `R1..R5` a la derecha), 1 columna en móvil.
  - Cada tarjeta de slot muestra:
    - Encabezado: `SLOT L1 · LEFT RAIL`
    - Título: Nombre de la marca o `"Available Slot"`
    - Subtítulo: `taken until Aug 31`
    - Línea divisoria punteada
    - Badge inferior: `SEP · TAKEN` (verde/blanco), `SEP · SPONSOR DECIDING` (ámbar), o `SEP · AVAILABLE` (verde brillante)
  - Clic en `TAKEN` → `<a href={slot.url} target="_blank" rel="noopener noreferrer">`
  - Clic en `OPEN` o `SPONSOR DECIDING` → `<a href="mailto:sponsors@whyundefeated.com?subject=Sponsor%20Slot%20Inquiry...">`

### `LiveTelemetryDashboard` (Client Component - Island)
- **Props**: `{ initialData: TelemetryData, publicDashboardUrl?: string }`
- **Subcomponentes**:
  - `GlobeCanvas`: Canvas 2D interactivo con esfera de puntos verdes giratoria, efecto de sombra 3D y marcadores amarillos pulsantes.
  - `LiveActivityTicker`: Conteo de usuarios activos y feed con animación fluida de nuevos eventos de lectura.
  - `CountryStats`: Píldoras con banderas y conteos de visitas de los últimos 7 días.
  - Botón `FULL DASHBOARD ->`: Enlace al dashboard público de Umami.

### `NavBar` (Server Component)
- **Links actualizados**:
  - `Home` (`/`)
  - `Alternatives` (`#`)
  - `Methodology` (`/methodology`)
  - `Sponsors` (`/sponsor`)
  - `Submit` (`#`)
