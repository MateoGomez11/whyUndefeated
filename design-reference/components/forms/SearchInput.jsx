import React from 'react';

export function SearchInput({ placeholder = 'Search tracked apps…', value, onChange, size = 'md', prefix = '/' }) {
  const lg = size === 'lg';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: lg ? 12 : 8,
      background: 'var(--bg-1)', border: `1px solid ${lg ? 'var(--brand-600)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-sm)', padding: lg ? '18px 22px' : '9px 12px',
      boxShadow: lg ? '0 0 0 1px var(--brand-tint-08), 0 0 32px var(--brand-glow-soft)' : 'none',
    }}>
      <span style={{ color: 'var(--brand-400)', fontFamily: 'var(--font-mono)', fontSize: lg ? 'var(--text-h3)' : 'var(--text-body)', fontWeight: 700 }}>{prefix}</span>
      <input
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: 'var(--fg-primary)', fontFamily: lg ? 'var(--font-mono)' : 'var(--font-sans)',
          fontSize: lg ? 'var(--text-body-lg)' : 'var(--text-body)',
        }}
      />
    </div>
  );
}
