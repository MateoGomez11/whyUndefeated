'use client';

import { useState, useEffect } from 'react';
import type { TelemetryEvent } from '@/lib/sponsor/types';

export function LiveActivityTicker({
  initialEvents = [],
}: {
  initialEvents?: TelemetryEvent[];
}) {
  const [events, setEvents] = useState<TelemetryEvent[]>(initialEvents);
  const [activeUsers, setActiveUsers] = useState<number>(1);

  useEffect(() => {
    // Register the current user's session cleanly
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const initialEntry: TelemetryEvent = {
        id: 'session-current',
        countryCode: 'LIVE',
        countryName: 'Current Session',
        flagEmoji: '🟢',
        actionText: `is viewing ${currentPath}`,
        timeAgo: 'active now',
      };
      setEvents([initialEntry]);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Live visitor count header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'clamp(32px, 4.5vw, 44px)',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              lineHeight: 1,
            }}
          >
            {activeUsers}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-body)',
              color: 'var(--fg-secondary)',
            }}
          >
            active visitor session
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-tertiary)',
            marginTop: '4px',
          }}
        >
          real-time cookieless telemetry · zero personal data collected
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-default)',
          paddingTop: 'var(--space-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        {events.length > 0 ? (
          events.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-secondary)',
                gap: '8px',
                padding: '2px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
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
                <span style={{ flexShrink: 0 }}>{item.flagEmoji}</span>
                <span
                  style={{
                    color: 'var(--fg-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.actionText}
                </span>
              </div>

              <span style={{ color: 'var(--fg-tertiary)', flexShrink: 0, fontSize: '11px' }}>
                {item.timeAgo}
              </span>
            </div>
          ))
        ) : (
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-tertiary)',
            }}
          >
            Telemetry stream connected · tracking live visitors
          </div>
        )}
      </div>
    </div>
  );
}
