import Link from 'next/link';

// Static nav — mirrors design-reference NavBar.jsx. Only "Home" routes today;
// the other destinations don't exist yet, so they point to "#" (no active routing
// logic). No client JS.
const LINKS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Leaderboard', href: '#' },
  { label: 'Methodology', href: '#' },
  { label: 'Submit', href: '#' },
];

export function NavBar({ active = 'Home' }: { active?: string }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px var(--page-gutter)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-0)',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontWeight: 700,
          fontSize: 'var(--text-h3)',
          color: 'var(--fg-primary)',
        }}
      >
        why<span style={{ color: 'var(--brand-500)' }}>undefeated</span>
      </Link>
      <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              color: l.label === active ? 'var(--brand-400)' : 'var(--fg-secondary)',
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
