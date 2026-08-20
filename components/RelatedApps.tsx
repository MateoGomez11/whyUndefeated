import Link from 'next/link';
import type { Entry } from '@/lib/content/schema';
import { ThreatBadge } from './ThreatBadge';

/**
 * Sidebar list of other entries sharing the same category (FR-020). Renders
 * nothing when `related` is empty — e.g. the entry is the only one in its
 * category — so no broken/empty section appears.
 */
export function RelatedApps({ related }: { related: Entry[] }) {
  if (related.length === 0) return null;

  return (
    <section aria-label="Related apps">
      <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>
        Related apps
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {related.map((entry) => (
          <Link
            key={entry.slug}
            href={`/entries/${entry.slug}`}
            className="related-app-card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--bg-2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'inherit',
            }}
          >
            <span style={{ color: 'var(--fg-primary)', fontWeight: 600, fontSize: 14 }}>{entry.appName}</span>
            <ThreatBadge level={entry.threatLevel} size="sm" />
          </Link>
        ))}
      </div>
    </section>
  );
}
