import Link from 'next/link';

const LINKS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Alternatives', href: '/alternatives' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Sponsors', href: '/sponsor' },
  { label: 'Submit', href: '/submit' },
];

export function NavBar({ active = 'Home' }: { active?: string }) {
  return (
    <nav
      className="navbar"
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
          textDecoration: 'none',
        }}
      >
        why<span style={{ color: 'var(--brand-500)' }}>undefeated</span>
      </Link>

      <input
        type="checkbox"
        id="nav-toggle"
        className="nav-toggle-checkbox"
        aria-label="Toggle navigation menu"
      />
      <label htmlFor="nav-toggle" className="nav-toggle-label">
        <span className="nav-toggle-bar" aria-hidden="true" />
        <span className="nav-toggle-bar" aria-hidden="true" />
        <span className="nav-toggle-bar" aria-hidden="true" />
      </label>

      <div className="nav-links" style={{ display: 'flex', gap: 'var(--space-6)' }}>
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              color: l.label === active ? 'var(--fg-primary)' : 'var(--fg-secondary)',
              textDecoration: 'none',
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
