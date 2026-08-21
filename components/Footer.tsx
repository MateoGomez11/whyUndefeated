import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        padding: 'var(--space-8) var(--page-gutter)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
        flexWrap: 'wrap',
        color: 'var(--fg-tertiary)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 'var(--text-xs)',
      }}
    >
      <span>whyundefeated.com — tracking the gap between AI and the platforms it might replace.</span>

      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
        <Link href="/terms" style={{ color: 'var(--fg-tertiary)', textDecoration: 'none' }}>
          Terms
        </Link>
        <span>·</span>
        <Link href="/privacy" style={{ color: 'var(--fg-tertiary)', textDecoration: 'none' }}>
          Privacy
        </Link>
        <span>·</span>
        <Link href="/methodology" style={{ color: 'var(--fg-tertiary)', textDecoration: 'none' }}>
          Methodology
        </Link>
        <span>·</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
