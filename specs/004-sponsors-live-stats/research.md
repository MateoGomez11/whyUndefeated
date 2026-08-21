# Research: Sponsor Board & Live Telemetry (`/sponsor`)

**Feature**: 004-sponsors-live-stats | **Date**: 2026-08-20

## Context & Key Challenges

Esta feature añade el módulo comercial y de prueba social en `/sponsor`, inspirado en el modelo de *canivibecodeit*:
1. **Tablero de Patrocinio con FOMO**: 10 slots fijos mensuales, precio plano ($2,500/mes), timeline de reserva y estados (`TAKEN`, `SPONSOR DECIDING`, `OPEN`).
2. **Telemetría en Vivo & Prueba Social**: Globo terráqueo interactivo en matriz de puntos, conteo de personas en el sitio, feed de lecturas en tiempo real y desglose de visitantes de los últimos 7 días por país.
3. **Analítica Transparente con Umami**: Integración con Umami Analytics (cookieless y privacy-friendly) y enlace público `FULL DASHBOARD ->` para que los anunciantes auditen el tráfico real.
4. **Navegación**: Actualizar NavBar (`Alternatives` reemplaza a `Leaderboard`, se añade `Sponsors`) y Footer.

---

## Decisiones Técnicas

### Decisión 1: Renderizado del Globo 3D en Matriz de Puntos
- **Decisión**: Implementar un componente Canvas 2D nativo ultra-liviano (`GlobeCanvas.tsx`), proyectando matemáticamente puntos en una esfera 3D rotatoria con sombreado de profundidad y pulsos de pings luminosos.
- **Razón**: Evita agregar dependencias gigantes como Three.js o Cesium (>600 KB), manteniendo el bundle JS agregado por debajo de 8 KB, con renderizado fluido a 60 FPS y carga instantánea.
- **Alternativas descartadas**:
  - *Three.js / React Three Fiber*: Rechazado por inflar el bundle de JS (>500KB) violando el Principio III (rendimiento y JS mínimo).
  - *SVG estático*: Rechazado porque no ofrece la interactividad ni la rotación continua con pings en vivo del diseño de referencia.

### Decisión 2: Arquitectura Server vs. Client Components (Principio III)
- **Decisión**: La página `/sponsor/page.tsx` es un **React Server Component (RSC)** estático con generación SSG/ISR. Las secciones interactivas (`SponsorGlobe.tsx` con el canvas y `LiveActivityTicker.tsx` para el pulso de feed) se encapsulan como Client Components aislados.
- **Razón**: Permite que todo el contenido crítico para SEO (título, propuesta de valor, precios, slots, testimonios, países) se renderice en el servidor y sea 100% legible sin JavaScript.
- **Alternativas descartadas**:
  - *Hacer toda la página `"use client"`*: Violación directa del Principio III y de la arquitectura del repo.

### Decisión 3: Integración de Analítica Transparente (Umami Analytics)
- **Decisión**: Incluir el script de Umami de forma asíncrona mediante variables de entorno opcionales (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_PUBLIC_URL`). El enlace `FULL DASHBOARD ->` en la cabecera del panel de telemetría redirige a la URL pública compartida de Umami.
- **Razón**: Proporciona analítica real y auditable para los patrocinadores sin cookies ni recolección de PII (Principio VI). Si las variables no están configuradas, el panel de telemetría opera de forma autónoma con datos tipados base sin romper la interfaz.
- **Alternativas descartadas**:
  - *Google Analytics / Scripts pesados*: Rechazado por invasión de privacidad y ralentización del tiempo de carga.

### Decisión 4: Comportamiento Interactivo de las Tarjetas de Slots
- **Decisión**:
  - Slots `TAKEN`: El clic abre la URL externa del patrocinador en una nueva pestaña (`target="_blank" rel="noopener noreferrer"`).
  - Slots `OPEN` o `SPONSOR DECIDING`: El clic abre el cliente de correo (`mailto:sponsors@whyundefeated.com?subject=Sponsor%20Slot%20Inquiry%20-%20[SlotID]`) para iniciar el proceso de reserva directa.
- **Razón**: Resuelve de forma intuitiva el doble propósito de las tarjetas: generar tráfico de salida para los patrocinadores existentes y capturar demanda de nuevos anunciantes.

### Decisión 5: Actualización del NavBar y Footer
- **Decisión**: En `components/NavBar.tsx`, actualizar la lista de links a:
  - `Home` (`/`)
  - `Alternatives` (`#` o `/alternatives`)
  - `Methodology` (`/methodology`)
  - `Sponsors` (`/sponsor`)
  - `Submit` (`#` o `/submit`)
  Mantener la navegación móvil 100% CSS-only mediante el checkbox toggle existente.
- **Razón**: Cumple con las preferencias del usuario y la evolución del producto hacia alternativas comunitarias.
