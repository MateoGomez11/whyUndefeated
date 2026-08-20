import Link from 'next/link';

// Static nav — mirrors design-reference NavBar.jsx. Only "Home" routes today;
// the other destinations don't exist yet, so they point to "#" (no active routing
// logic). No client JS: the mobile menu is a pure-CSS checkbox/label toggle
// (NFR-004) — the checkbox is visually hidden but stays keyboard-focusable
// (see .nav-toggle-checkbox in globals.css), so it works identically with or
// without JavaScript.
const LINKS: { label: string; href: string }[] = [
  { label: 'Home', href: '/' },
  { label: 'Leaderboard', href: '#' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Submit', href: '#' },
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
