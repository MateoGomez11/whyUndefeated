import React from 'react';

export function Button({ variant = 'primary', size = 'md', disabled, children, onClick, style, ...rest }) {
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 'var(--text-xs)' },
    md: { padding: '10px 18px', fontSize: 'var(--text-sm)' },
  };
  const variants = {
    primary: {
      background: disabled ? 'var(--bg-3)' : 'var(--brand-500)',
      color: disabled ? 'var(--fg-disabled)' : '#050508',
      border: '1px solid transparent',
    },
    secondary: {
      background: 'transparent',
      color: disabled ? 'var(--fg-disabled)' : 'var(--fg-primary)',
      border: `1px solid ${disabled ? 'var(--border-subtle)' : 'var(--border-strong)'}`,
    },
    ghost: {
      background: 'transparent',
      color: disabled ? 'var(--fg-disabled)' : 'var(--brand-400)',
      border: '1px solid transparent',
    },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.boxShadow = 'var(--glow-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
      style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: 'var(--tracking-wide)',
        borderRadius: 'var(--radius-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--duration-fast) var(--ease-standard)',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
