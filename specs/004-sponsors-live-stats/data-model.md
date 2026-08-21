# Data Model: Sponsor Board & Live Telemetry (`/sponsor`)

**Feature**: 004-sponsors-live-stats | **Date**: 2026-08-20

El modelo de datos de esta feature vive como código tipado en TypeScript (`lib/sponsor/types.ts` y `lib/sponsor/data.ts`), conforme al **Principio II** (Contenido como Código) y el diseño sin backend pesado para sponsors del MVP.

---

## Tipos e Interfaces

### 1. `SponsorSlot`

Representa uno de los 10 espacios fijos mensuales de patrocinio.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Código de slot (ej. `'L1'`, `'L2'`, `'L3'`, `'L4'`, `'L5'`, `'R1'`, `'R2'`, `'R3'`, `'R4'`, `'R5'`) |
| `rail` | `'left' \| 'right'` | Sí | Ubicación del riel en la página |
| `slotNumber` | `number` | Sí | Número de 1 a 5 dentro del riel |
| `name` | `string` | Sí | Nombre de la marca patrocinadora (ej. `'WishKit'`, `'Gojiberry AI'`, `'Postiz'`) o `'Available Slot'` |
| `takenUntil` | `string` | Sí | Texto de vigencia (ej. `'Aug 31'`, `'Sep 1'`) |
| `status` | `'TAKEN' \| 'SPONSOR DECIDING' \| 'OPEN'` | Sí | Estado FOMO del espacio |
| `url` | `string` | No | Enlace al sitio del patrocinador (usado si `status === 'TAKEN'`) |
| `icon` | `string` | No | Emoji o ícono opcional (ej. `'💥'`) |

---

### 2. `TelemetryEvent`

Representa una acción de lectura en vivo registrada en el sitio.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | Sí | Identificador único del evento |
| `countryCode` | `string` | Sí | Código ISO de 2 letras (ej. `'CA'`, `'US'`, `'TR'`, `'DE'`, `'IN'`, `'CN'`) |
| `countryName` | `string` | Sí | Nombre del país (ej. `'Canada'`, `'United States'`, `'Germany'`) |
| `flagEmoji` | `string` | Sí | Bandera emoji correspondiente |
| `actionText` | `string` | Sí | Descripción de la acción (ej. `'reading /pinterest'`, `'read /wikipedia'`, `'copied the prompt'`) |
| `timeAgo` | `string` | Sí | Timestamp relativo legible (ej. `'30s ago'`, `'1m ago'`, `'2m ago'`) |
| `coordinates` | `[number, number]` | No | Coordenadas aproximadas de latitud/longitud para el ping en el globo 3D |

---

### 3. `CountryVisitorStat`

Estadística agregada de visitantes de los últimos 7 días por país.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `countryCode` | `string` | Sí | Código de país ISO (ej. `'TR'`, `'US'`, `'CN'`, `'IN'`, `'DE'`) |
| `flagEmoji` | `string` | Sí | Bandera del país |
| `count` | `number` | Sí | Número de visitas registradas en el período |

---

### 4. `SponsorTestimonial`

Testimonio y métricas de ROI de anunciantes.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `quote` | `string` | Sí | Cita textual del fundador/marketer |
| `authorName` | `string` | Sí | Nombre del autor |
| `authorRole` | `string` | Sí | Cargo y empresa (ej. `'co-founder, Gojiberry AI'`) |
| `avatarUrl` | `string` | No | Imagen de avatar o iniciales |

---

### 5. `SponsorOverviewMetrics`

Métricas generales de audiencia mostradas en el hero.

| Campo | Tipo | Valor por Defecto | Descripción |
|---|---|---|---|
| `monthlyViews` | `string` | `'300,000+'` | Vistas de página mensuales estimadas |
| `appsCount` | `number` | `1093` | Total de aplicaciones en el índice |
| `audienceTag` | `string` | `'builders'` | Audiencia objetivo del sitio |
| `slotsTakenText` | `string` | `'10/10'` | Conteo de slots tomados en el mes actual |
| `monthName` | `string` | `'September'` | Mes actual de facturación |
| `priceUsd` | `number` | `2500` | Tarifa fija mensual |

---

## Variables de Entorno (Opcionales)

```bash
# Configuración opcional para Umami Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=             # ID del sitio en Umami
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
NEXT_PUBLIC_UMAMI_PUBLIC_URL=https://cloud.umami.is/share/tu-id/whyundefeated
```
