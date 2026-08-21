# Quickstart & Validación: Sponsor Board & Live Telemetry (`/sponsor`)

**Feature**: 004-sponsors-live-stats | **Date**: 2026-08-20

Guía para ejecutar, probar y validar la feature de patrocinadores y telemetría de punta a punta.

---

## Comandos de Verificación

```bash
npm run dev                  # Iniciar servidor local en http://localhost:3000
npm run build                # Validar compilación SSG (debe generar /sponsor estáticamente)
npm test                     # Ejecutar suite de pruebas unitarias Jest (incluye tests de datos y slots)
npx playwright test          # Ejecutar pruebas E2E (incluye tests de /sponsor y navegación)
```

---

## Escenarios de Validación

### 1. Navegación al Tablero de Patrocinadores (US3, SC-001)
- **Acción**: Cargar la página de inicio `http://localhost:3000` y hacer clic en el enlace "Sponsors" del NavBar.
- **Esperado**: Navega sin recarga de página a `/sponsor`, con el enlace "Sponsors" resaltado como activo.

### 2. Visualización e Interacción de los 10 Slots (US1, SC-003)
- **Acción**: En `/sponsor`, hacer clic en un slot `TAKEN` y en un slot `OPEN`/`DECIDING`.
- **Esperado**: `TAKEN` abre la web externa del patrocinador; `OPEN`/`DECIDING` abre el cliente de correo para solicitar la reserva.

### 3. Telemetría en Vivo y Enlace a Umami (US2, SC-004)
- **Acción**: Observar el panel "LIVE · WHO'S ON THE SITE RIGHT NOW" y hacer clic en `FULL DASHBOARD ->`.
- **Esperado**: El globo de puntos rota fluidamente a 60 FPS con pings luminosos; `FULL DASHBOARD ->` abre el dashboard público de analíticas.

### 4. Resiliencia sin JavaScript (US3, SC-005)
- **Acción**: Abrir `/sponsor` con JavaScript desactivado en el navegador (`no-js`).
- **Esperado**: Todo el contenido comercial (hero, precios, timeline, testimonios, guía de audiencia, slots y estadísticas) es 100% legible y la página carga sin errores visuales.

### 5. Diseño Responsivo en Móviles (US1, US2)
- **Acción**: Redimensionar la ventana a 375px de ancho (viewport móvil).
- **Esperado**: Las tarjetas de slots se apilan verticalmente sin desbordamiento horizontal; el menú de navegación funciona mediante el toggle CSS sin JS.
