import React from 'react';

export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { background: 'var(--bg-2)', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)' },
    brand: { background: 'var(--brand-tint-15)', border: '1px solid var(--brand-600)', color: 'var(--brand-300)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 8px', borderRadius: 'var(--radius-xs)',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
      ...tones[tone],
    }}>{children}</span>
  );
}
