'use client';

import { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  isLand?: boolean;
}

// Approximate timezone to coordinates mapping for real user ping
function getUserCoordinates(): { lat: number; lon: number; label: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Bogota') || tz.includes('Lima') || tz.includes('Quito')) {
      return { lat: 4.71, lon: -74.07, label: 'Colombia / Andean Region' };
    }
    if (tz.includes('Mexico') || tz.includes('Cancun') || tz.includes('Monterrey')) {
      return { lat: 19.43, lon: -99.13, label: 'Mexico' };
    }
    if (tz.includes('New_York') || tz.includes('Toronto') || tz.includes('Montreal') || tz.includes('Detroit')) {
      return { lat: 40.71, lon: -74.0, label: 'North America (East)' };
    }
    if (tz.includes('Chicago') || tz.includes('Winnipeg') || tz.includes('Texas')) {
      return { lat: 41.87, lon: -87.62, label: 'North America (Central)' };
    }
    if (tz.includes('Los_Angeles') || tz.includes('Vancouver') || tz.includes('San_Francisco') || tz.includes('Seattle')) {
      return { lat: 37.77, lon: -122.41, label: 'North America (West)' };
    }
    if (tz.includes('Buenos_Aires') || tz.includes('Santiago') || tz.includes('Montevideo')) {
      return { lat: -34.6, lon: -58.38, label: 'South America (South)' };
    }
    if (tz.includes('Sao_Paulo') || tz.includes('Rio')) {
      return { lat: -23.55, lon: -46.63, label: 'Brazil' };
    }
    if (tz.includes('Madrid') || tz.includes('Paris') || tz.includes('Berlin') || tz.includes('Rome')) {
      return { lat: 48.85, lon: 2.35, label: 'Europe (Central)' };
    }
    if (tz.includes('London') || tz.includes('Dublin') || tz.includes('Lisbon')) {
      return { lat: 51.5, lon: -0.12, label: 'Western Europe / UK' };
    }
    if (tz.includes('Tokyo') || tz.includes('Seoul')) {
      return { lat: 35.67, lon: 139.65, label: 'East Asia' };
    }
    if (tz.includes('Kolkata') || tz.includes('Delhi') || tz.includes('India')) {
      return { lat: 28.61, lon: 77.2, label: 'India' };
    }
    if (tz.includes('Sydney') || tz.includes('Melbourne')) {
      return { lat: -33.86, lon: 151.2, label: 'Australia' };
    }

    // Default estimate based on timezone offset
    const offsetHours = -new Date().getTimezoneOffset() / 60;
    const estimatedLon = offsetHours * 15;
    return { lat: 20, lon: estimatedLon, label: 'Your Location' };
  } catch {
    return { lat: 4.71, lon: -74.07, label: 'Your Location' };
  }
}

// Simplified continent checker for landmass vs ocean
function isLandCoordinate(lat: number, lon: number): boolean {
  // North America
  if (lat >= 15 && lat <= 70 && lon >= -140 && lon <= -55) return true;
  // Central America
  if (lat >= 8 && lat <= 20 && lon >= -105 && lon <= -75) return true;
  // South America
  if (lat >= -55 && lat <= 12 && lon >= -80 && lon <= -35) return true;
  // Europe
  if (lat >= 36 && lat <= 70 && lon >= -10 && lon <= 45) return true;
  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) return true;
  // Asia
  if (lat >= 10 && lat <= 75 && lon >= 45 && lon <= 145) return true;
  // India subcontinent
  if (lat >= 8 && lat <= 35 && lon >= 68 && lon <= 90) return true;
  // Japan / East Asia islands
  if (lat >= 30 && lat <= 45 && lon >= 128 && lon <= 145) return true;
  // Australia
  if (lat >= -44 && lat <= -10 && lon >= 113 && lon <= 154) return true;
  // New Zealand / Indonesia
  if (lat >= -10 && lat <= 6 && lon >= 95 && lon <= 140) return true;

  return false;
}

export function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; label: string } | null>(null);

  useEffect(() => {
    const loc = getUserCoordinates();
    setUserLocation(loc);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;
    let isDragging = false;
    let lastMouseX = 0;

    // Generate real landmass-aware globe points
    const points: Point3D[] = [];
    const numLatSteps = 36; // Every 5 degrees
    const numLonSteps = 72; // Every 5 degrees

    for (let i = 0; i < numLatSteps; i++) {
      const lat = -85 + (i / (numLatSteps - 1)) * 170;
      const phi = (90 - lat) * (Math.PI / 180);
      const radius = Math.sin(phi);
      const y = Math.cos(phi);

      for (let j = 0; j < numLonSteps; j++) {
        const lon = -180 + (j / numLonSteps) * 360;
        const theta = (lon + 180) * (Math.PI / 180);
        const isLand = isLandCoordinate(lat, lon);

        // Include all land points, and sparse ocean points for volume
        if (isLand || (i % 2 === 0 && j % 2 === 0)) {
          const x = -(radius * Math.cos(theta));
          const z = radius * Math.sin(theta);
          points.push({ x, y, z, isLand });
        }
      }
    }

    function latLonToPoint(lat: number, lon: number): Point3D {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -(Math.sin(phi) * Math.cos(theta)),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
      };
    }

    function handleMouseDown(e: MouseEvent) {
      isDragging = true;
      lastMouseX = e.clientX;
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      const deltaX = e.clientX - lastMouseX;
      rotationAngle += deltaX * 0.005;
      lastMouseX = e.clientX;
    }

    function handleMouseUp() {
      isDragging = false;
    }

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    function render() {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const globeRadius = Math.min(width, height) * 0.42;

      ctx.clearRect(0, 0, width, height);

      // Smooth auto-rotation
      if (!isDragging) {
        rotationAngle += 0.003;
      }

      const cosRot = Math.cos(rotationAngle);
      const sinRot = Math.sin(rotationAngle);

      // Render Earth points
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // Rotate around Y axis
        const rotX = pt.x * cosRot - pt.z * sinRot;
        const rotZ = pt.x * sinRot + pt.z * cosRot;
        const rotY = pt.y;

        // Project onto 2D canvas
        const screenX = centerX + rotX * globeRadius;
        const screenY = centerY - rotY * globeRadius;

        const depth = (rotZ + 1) / 2; // 0 (back) to 1 (front)

        if (pt.isLand) {
          // Continents: prominent glowing green/cyan
          const dotRadius = rotZ > 0 ? 1.4 + depth * 0.6 : 0.9;
          const alpha = rotZ > 0 ? 0.3 + depth * 0.7 : 0.08 + depth * 0.12;
          ctx.beginPath();
          ctx.arc(screenX, screenY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(53, 214, 142, ${alpha})`;
          ctx.fill();
        } else {
          // Oceans: subtle grid dots
          if (rotZ > 0.2) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(163, 161, 184, 0.12)`;
            ctx.fill();
          }
        }
      }

      // Render ONE REAL active user ping based on detected session
      if (loc) {
        const basePt = latLonToPoint(loc.lat, loc.lon);
        const rotX = basePt.x * cosRot - basePt.z * sinRot;
        const rotZ = basePt.x * sinRot + basePt.z * cosRot;
        const rotY = basePt.y;

        if (rotZ > 0.05) {
          const screenX = centerX + rotX * globeRadius;
          const screenY = centerY - rotY * globeRadius;
          const now = performance.now() * 0.0025;
          const pulse = (Math.sin(now) + 1) / 2;

          // Outer glowing radar wave
          ctx.beginPath();
          ctx.arc(screenX, screenY, 4 + pulse * 9, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(53, 214, 142, ${0.4 * (1 - pulse)})`;
          ctx.fill();

          // Inner active green point
          ctx.beginPath();
          ctx.arc(screenX, screenY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#35d68e';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: 320,
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        width={380}
        height={380}
        style={{
          width: '100%',
          maxWidth: '360px',
          height: 'auto',
          aspectRatio: '1/1',
          cursor: 'grab',
          touchAction: 'none',
        }}
        aria-label="Interactive 3D real continent dot-matrix Earth globe"
      />
      {userLocation && (
        <div
          style={{
            marginTop: '8px',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--threat-low)',
              display: 'inline-block',
            }}
          />
          <span>Active session: <strong>{userLocation.label}</strong></span>
        </div>
      )}
    </div>
  );
}
