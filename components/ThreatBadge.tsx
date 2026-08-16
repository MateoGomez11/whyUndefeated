import type { CSSProperties } from 'react';
import type { ThreatLevel } from '@/lib/content/schema';

const TIERS: Record<ThreatLevel, { label: string; color: string; bg: string; border: string; glow: string }> = {
  high: {
    label: 'HIGH THREAT',
    color: 'var(--threat-high)',
    bg: 'var(--threat-high-bg)',
    border: 'var(--threat-high-border)',
    glow: 'var(--threat-high-glow)',
  },
  medium: {
    label: 'MEDIUM THREAT',
    color: 'var(--threat-medium)',
    bg: 'var(--threat-medium-bg)',
    border: 'var(--threat-medium-border)',
    glow: 'var(--threat-medium-glow)',
  },
  low: {
    label: 'LOW THREAT',
    color: 'var(--threat-low)',
    bg: 'var(--threat-low-bg)',
    border: 'var(--threat-low-border)',
    glow: 'var(--threat-low-glow)',
  },
};

/**
 * Threat-level badge. Communicates the level with BOTH color and a text label
 * (FR-017) so it is never color-only. Server-rendered — readable without JS.
 */
export function ThreatBadge({ level, size = 'md' }: { level: ThreatLevel; size?: 'sm' | 'md' }) {
  const t = TIERS[level];
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: size === 'sm' ? '3px 8px' : '5px 12px',
    borderRadius: 'var(--radius-xs)',
    background: t.bg,
    border: `1px solid ${t.border}`,
    color: t.color,
    fontFamily: 'var(--font-mono), monospace',
    fontWeight: 700,
    fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase',
    boxShadow: `0 0 12px ${t.glow}`,
    whiteSpace: 'nowrap',
  };
  return (
    <span style={style} data-threat={level}>
      <span
        aria-hidden="true"
        style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }}
      />
      {t.label}
    </span>
  );
}
