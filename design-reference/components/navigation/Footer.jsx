import React from 'react';

export function Footer() {
  return (
    <div style={{
      padding: 'var(--space-8) var(--page-gutter)', borderTop: '1px solid var(--border-subtle)',
      display: 'flex', justifyContent: 'space-between', color: 'var(--fg-tertiary)',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
    }}>
      <span>whyundefeated.dev — tracking the gap between AI and the platforms it might replace.</span>
      <span>© 2026</span>
    </div>
  );
}
