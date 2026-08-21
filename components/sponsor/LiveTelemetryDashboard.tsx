'use client';

import { GlobeCanvas } from './GlobeCanvas';
import { LiveActivityTicker } from './LiveActivityTicker';
import type { TelemetryEvent, CountryVisitorStat } from '@/lib/sponsor/types';

export function LiveTelemetryDashboard({
  initialEvents = [],
  countryStats = [],
}: {
  initialEvents?: TelemetryEvent[];
  countryStats?: CountryVisitorStat[];
}) {
  return (
    <section
      style={{
        margin: 'var(--space-8) 0',
        background: 'var(--bg-1)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-xs)',
        padding: 'var(--space-6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
      aria-label="Live site telemetry and visitor map"
    >
      {/* Top telemetry bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          paddingBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-label)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--threat-low)', fontWeight: 700 }}>LIVE</span>
          <span style={{ color: 'var(--fg-tertiary)' }}>·</span>
          <span style={{ color: 'var(--fg-secondary)' }}>REAL-TIME VISITOR TELEMETRY</span>
          <span style={{ color: 'var(--fg-tertiary)' }}>·</span>
          <span style={{ color: 'var(--brand-400)' }}>100% COOKIELESS</span>
        </div>

        <div style={{ color: 'var(--fg-tertiary)', textTransform: 'lowercase' }}>
          zero personal data collected · privacy first
        </div>
      </div>

      {/* Main interactive telemetry area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'center',
          padding: 'var(--space-6) 0',
        }}
      >
        {/* Left: 3D Canvas Globe Radar */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <GlobeCanvas />
        </div>

        {/* Right: Live visitor count & feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <LiveActivityTicker initialEvents={initialEvents} />

          {/* Visitors by country */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-label)',
                marginBottom: 'var(--space-3)',
              }}
            >
              VISITOR TELEMETRY BY COUNTRY
            </div>

            {countryStats.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {countryStats.map((stat) => (
                  <div
                    key={stat.countryCode}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      background: 'var(--bg-2)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--fg-secondary)',
                    }}
                  >
                    <span>{stat.flagEmoji}</span>
                    <span style={{ fontWeight: 600, color: 'var(--fg-primary)' }}>
                      {stat.countryCode}
                    </span>
                    <span>{stat.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--bg-2)',
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                  borderColor: 'var(--border-default)',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--threat-low)',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span>Live visitor telemetry stream active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
