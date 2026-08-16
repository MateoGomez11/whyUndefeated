import React from 'react';

export function FilterPill({ children, active = false, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
      padding: '6px 12px', borderRadius: 'var(--radius-pill)',
      background: active ? 'var(--brand-tint-15)' : 'transparent',
      border: `1px solid ${active ? 'var(--brand-500)' : 'var(--border-default)'}`,
      color: active ? 'var(--brand-300)' : 'var(--fg-secondary)',
      cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-standard)',
    }}>{children}</button>
  );
}
