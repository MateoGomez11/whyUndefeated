import Link from 'next/link';
import type { Entry } from '@/lib/content/schema';
import { ThreatBadge } from './ThreatBadge';
import { Badge } from './Badge';

/**
 * A single tracker row: monospace-initial logo placeholder, app name, neutral
 * category label, one-line summary, and the threat badge. The whole row is a
 * link to the detail page (FR-001, FR-004). Renders as an <a> so it works
 * without JavaScript.
 */
export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/entries/${entry.slug}`}
      className="entry-card"
      style={{
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-4) var(--space-5)',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border-subtle)',
        color: 'inherit',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-1)',
            border: '1px solid var(--border-default)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono), monospace',
            fontWeight: 700,
            color: 'var(--fg-secondary)',
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {entry.appName[0]}
        </span>
        <span style={{ color: 'var(--fg-primary)', fontWeight: 600, fontSize: 'var(--text-body)' }}>
          {entry.appName}
        </span>
      </span>

      <span>
        <Badge>{entry.category}</Badge>
      </span>

      <span style={{ color: 'var(--fg-secondary)', fontSize: 'var(--text-sm)' }}>{entry.summary}</span>

      <span style={{ justifySelf: 'start' }}>
        <ThreatBadge level={entry.threatLevel} size="sm" />
      </span>
    </Link>
  );
}
