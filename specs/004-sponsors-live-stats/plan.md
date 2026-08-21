# Implementation Plan: Sponsor Board & Live Telemetry (`/sponsor`)

**Branch**: `004-sponsors-live-stats` | **Date**: 2026-08-20 | **Spec**: [/specs/004-sponsors-live-stats/spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-sponsors-live-stats/spec.md`

---

## Summary

Implementar la página comercial y de prueba social en `/sponsor` inspirada en el modelo de *canivibecodeit*: 10 slots fijos de patrocinio con estados de FOMO, precios transparentes, timeline de reserva, testimonios, panel de telemetría con globo interactivo de matriz de puntos Canvas 2D (<8 KB, 60fps), feed en vivo de lecturas de entradas, desglose de visitantes por país y soporte para auditoría pública transparente con Umami Analytics; además de actualizar la barra de navegación del sitio (sustituyendo "Leaderboard" por "Alternatives" y agregando "Sponsors").

---

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js 15 (App Router)
**Primary Dependencies**: React 19, `@supabase/supabase-js` (existente). Sin dependencias 3D pesadas (Canvas 2D nativo para el globo).
**Storage**: Configuración estática y tipada en `lib/sponsor/data.ts` (Principio II: Contenido como Código).
**Testing**: Jest para validación de datos/lógica de slots (`tests/unit/sponsor.test.ts`) y Playwright para E2E (`e2e/sponsor.spec.ts`).
**Target Platform**: Web moderna (SSG/ISR en Vercel, compatible con móviles desde 375px y modo `no-js`).
**Project Type**: Web application (Next.js App Router).
**Performance Goals**: First Load JS de `/sponsor` bajo control, 60 FPS en rotación de canvas, Lighthouse Performance ≥ 90.
**Constraints**: Legible sin JS (Principio III), sin recopilación de PII (Principio VI), diseño consistente con tokens existentes.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [X] **Principio I (Integridad de Contenido)**: No altera las entradas ni las fuentes de investigación. Los datos de patrocinadores son comerciales y explícitamente delimitados.
- [X] **Principio II (Contenido como Código)**: Los slots y configuraciones residen en `lib/sponsor/data.ts` versionados en el repositorio.
- [X] **Principio III (Rendimiento & Server-First)**: `/sponsor/page.tsx` es un Server Component; solo el canvas del globo y el ticker de telemetría usan `"use client"`. El contenido es 100% legible sin JS.
- [X] **Principio IV (Pruebas Primero)**: Incluye pruebas unitarias en Jest y pruebas E2E en Playwright (verificando tanto `chromium` como `no-js`).
- [X] **Principio V (Consistencia Visual e Idioma)**: Utiliza los mismos tokens de color, fuentes mono/sans y diseño oscuro minimalista en inglés.
- [X] **Principio VI (Seguridad & Privacidad)**: La telemetría solo maneja países y slugs públicos. Umami opera en modo cookieless. Sin PII ni almacenamiento de IPs.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-sponsors-live-stats/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación y decisiones técnicas (Decisiones 1–5)
├── data-model.md        # Estructuras de datos (SponsorSlot, TelemetryEvent, CountryVisitorStat)
├── quickstart.md        # Escenarios de validación manual y automatizada
├── contracts/
│   └── sponsor-ui.md    # Contrato de componentes y rutas
└── tasks.md             # Tareas ejecutables de implementación
```

### Source Code

```text
app/
├── sponsor/
│   └── page.tsx         # Página Server Component /sponsor
components/
├── NavBar.tsx           # NavBar actualizado (Alternatives, Sponsors)
├── Footer.tsx           # Footer con enlace a /sponsor
└── sponsor/
    ├── SponsorHero.tsx            # Cabecera comercial con 4 stat cards
    ├── SponsorSlotsGrid.tsx        # Cuadrícula de 10 slots fijos con enlaces interactivos
    ├── SponsorPricingSection.tsx   # Sección de precio, timeline y testimonios
    ├── SponsorAudienceGuide.tsx    # Guía Presence vs Signup buyers
    ├── LiveTelemetryDashboard.tsx  # Panel contenedor de telemetría (Client Component)
    ├── GlobeCanvas.tsx             # Globo 3D en matriz de puntos Canvas 2D
    └── LiveActivityTicker.tsx      # Contador en vivo y feed de lecturas recientes
lib/
└── sponsor/
    ├── types.ts         # Tipos TypeScript para slots y telemetría
    └── data.ts          # Datos de los 10 slots, métricas, testimonios y países
tests/
├── unit/
│   └── sponsor.test.ts  # Pruebas unitarias de integridad de datos de slots
e2e/
└── sponsor.spec.ts      # Pruebas E2E de /sponsor, navegación y modo no-js
```

---

## Complexity Tracking

*No se detectan violaciones a la constitución. El uso de Canvas 2D nativo evita agregar dependencias externas y preserva los objetivos de rendimiento.*
