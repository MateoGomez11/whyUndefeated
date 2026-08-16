import type { CSSProperties, ReactNode } from 'react';

const TONES: Record<'neutral' | 'brand', CSSProperties> = {
  neutral: {
    background: 'var(--bg-2)',
    border: '1px solid var(--border-default)',
    color: 'var(--fg-secondary)',
  },
  brand: {
    background: 'var(--brand-tint-15, oklch(58% 0.24 293 / 0.15))',
    border: '1px solid var(--brand-600)',
    color: 'var(--brand-300)',
  },
};

/** Neutral (default) or brand mono pill — matches design-reference core/Badge. */
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: 'var(--radius-xs)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        ...TONES[tone],
      }}
    >
      {children}
    </span>
  );
}
