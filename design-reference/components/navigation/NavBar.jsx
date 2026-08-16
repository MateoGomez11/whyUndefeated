import React from 'react';

export function NavBar({ active = 'Home' }) {
  const links = ['Home', 'Leaderboard', 'Methodology', 'Submit'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px var(--page-gutter)', borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-0)',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-h3)', color: 'var(--fg-primary)' }}>
        why<span style={{ color: 'var(--brand-500)' }}>undefeated</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
        {links.map(l => (
          <span key={l} style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            color: l === active ? 'var(--brand-400)' : 'var(--fg-secondary)', cursor: 'pointer',
          }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
