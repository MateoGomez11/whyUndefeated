import React from 'react';

const TIERS = {
  high: { label: 'HIGH THREAT', color: 'var(--threat-high)', bg: 'var(--threat-high-bg)', border: 'var(--threat-high-border)', glow: 'var(--threat-high-glow)' },
  medium: { label: 'MEDIUM THREAT', color: 'var(--threat-medium)', bg: 'var(--threat-medium-bg)', border: 'var(--threat-medium-border)', glow: 'var(--threat-medium-glow)' },
  low: { label: 'LOW THREAT', color: 'var(--threat-low)', bg: 'var(--threat-low-bg)', border: 'var(--threat-low-border)', glow: 'var(--threat-low-glow)' },
};

export function ThreatBadge({ tier = 'medium', size = 'md' }) {
  const t = TIERS[tier] || TIERS.medium;
  const pad = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: pad, borderRadius: 'var(--radius-xs)',
      background: t.bg, border: `1px solid ${t.border}`, color: t.color,
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize,
      letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
      boxShadow: `0 0 12px ${t.glow}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
      {t.label}
    </span>
  );
}
