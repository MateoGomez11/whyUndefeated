import type { Source } from '@/lib/content/schema';

/**
 * Deduplicated list of every source cited on the page (FR-008). Real anchors —
 * clickable and readable without JS.
 */
export function SourcesList({ sources }: { sources: Source[] }) {
  const seen = new Map<string, Source>();
  for (const s of sources) {
    if (!seen.has(s.id)) seen.set(s.id, s);
  }
  const unique = [...seen.values()];

  return (
    <section aria-label="Sources">
      <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-3)' }}>
        Sources
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {unique.map((source) => (
          <li key={source.id}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--brand-400)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}
            >
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
