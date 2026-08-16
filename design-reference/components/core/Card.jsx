import React from 'react';

export function Card({ children, interactive = true, style }) {
  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
        transition: 'border-color var(--duration-normal) var(--ease-standard), box-shadow var(--duration-normal) var(--ease-standard)',
        ...style,
      }}
      onMouseEnter={e => { if (interactive) { e.currentTarget.style.borderColor = 'var(--brand-500)'; e.currentTarget.style.boxShadow = 'var(--glow-hover)'; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {children}
    </div>
  );
}
