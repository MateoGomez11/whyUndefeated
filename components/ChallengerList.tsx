import type { Challenger, Source } from '@/lib/content/schema';

/**
 * Named challengers, each with a one-line evidence summary and a clickable
 * source link (FR-006). Entries without challengers omit this section cleanly
 * (FR-018) — the caller only renders it when `challengers.length > 0`.
 */
export function ChallengerList({
  challengers,
  sources,
}: {
  challengers: Challenger[];
  sources: Source[];
}) {
  const sourceById = new Map(sources.map((s) => [s.id, s]));

  return (
    <section aria-label="Challengers">
      <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-3)' }}>
        Challengers
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {challengers.map((challenger) => {
          const source = sourceById.get(challenger.sourceId);
          return (
            <li
              key={challenger.name}
              className="challenger"
              style={{
                padding: 'var(--space-4)',
                background: 'var(--bg-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ color: 'var(--fg-primary)', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                {challenger.name}
              </div>
              <p style={{ margin: '0 0 8px', color: 'var(--fg-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                {challenger.evidence}
              </p>
              {source && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="citation"
                  style={{ color: 'var(--brand-400)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}
                >
                  {source.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
