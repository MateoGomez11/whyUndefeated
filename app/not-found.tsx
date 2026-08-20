import Link from 'next/link';

// Readable 404 for unknown "/entries/{slug}" routes — no raw framework error
// (FR-015). Static, no JS required to read or navigate away.
export default function NotFound() {
  return (
    <main className="page" style={{ textAlign: 'center', padding: 'var(--space-24) var(--page-gutter)' }}>
      <div className="ds-label" style={{ color: 'var(--brand-400)', marginBottom: 16 }}>
        404
      </div>
      <h1 style={{ font: '700 32px/1.2 var(--font-sans), sans-serif', color: 'var(--fg-primary)', margin: '0 0 12px' }}>
        Entry not found
      </h1>
      <p style={{ color: 'var(--fg-secondary)', margin: '0 0 24px' }}>
        We don&apos;t track an entry at this URL.
      </p>
      <Link href="/" style={{ color: 'var(--brand-400)', fontFamily: 'var(--font-mono), monospace', fontSize: 14 }}>
        ← back to tracker
      </Link>
    </main>
  );
}
