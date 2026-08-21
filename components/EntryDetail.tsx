import Link from 'next/link';
import type { Entry } from '@/lib/content/schema';
import type { CommunityAlternative } from '@/lib/alternatives/types';
import { Badge } from './Badge';
import { ThreatBadge } from './ThreatBadge';
import { VoteWidget } from './VoteWidget';
import { ChallengerList } from './ChallengerList';
import { SourcesList } from './SourcesList';
import { RelatedApps } from './RelatedApps';
import { CommunityAlternativesRail } from './alternatives/CommunityAlternativesRail';

/**
 * Shared detail template for every entry page (FR-009) — no per-entry layouts.
 * Composes header (category + logo placeholder, name, summary, threat badge),
 * moat with clickable source citation(s) (FR-007), optional challengers
 * (FR-006, FR-018), deduplicated sources (FR-008), community alternatives rail,
 * and related apps (FR-020).
 */
export function EntryDetail({
  entry,
  related,
  alternatives = [],
}: {
  entry: Entry;
  related: Entry[];
  alternatives?: CommunityAlternative[];
}) {
  const sourceById = new Map(entry.sources.map((s) => [s.id, s]));
  const moatSources = entry.moatSourceIds
    .map((id) => sourceById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <main className="page">
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--brand-400)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 13,
          marginBottom: 'var(--space-6)',
        }}
      >
        ← back to tracker
      </Link>

      <div
        className="ds-fade-in"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: 620 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <Badge>{entry.category}</Badge>
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
              }}
            >
              {entry.appName[0]}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                color: 'var(--brand-400)',
                padding: '2px 8px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {`${alternatives.length} Community Alternative${alternatives.length === 1 ? '' : 's'}`}
            </span>
          </div>
          <h1
            style={{
              font: '700 40px/1.1 var(--font-sans), sans-serif',
              color: 'var(--fg-primary)',
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
            }}
          >
            {entry.appName}
          </h1>
          <p style={{ font: '400 17px/1.55 var(--font-sans), sans-serif', color: 'var(--fg-secondary)', margin: '0 0 20px' }}>
            {entry.summary}
          </p>
          <ThreatBadge level={entry.threatLevel} />
          <VoteWidget slug={entry.slug} />
        </div>
      </div>

      <div className="entry-detail-grid" style={{ gap: 'var(--space-8)' }}>
        {/* Main Content Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <section aria-label="Moat">
            <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-3)' }}>
              Moat
            </div>
            <p style={{ margin: '0 0 12px', color: 'var(--fg-primary)', fontSize: 15, lineHeight: 1.6 }}>
              {entry.moat}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {moatSources.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="citation"
                  style={{ color: 'var(--brand-400)', fontSize: 'var(--text-sm)', textDecoration: 'underline' }}
                >
                  {source.label}
                </a>
              ))}
            </div>
          </section>

          {entry.challengers.length > 0 && (
            <ChallengerList challengers={entry.challengers} sources={entry.sources} />
          )}

          <SourcesList sources={entry.sources} />
        </div>

        {/* Right Sidebar Column: Community Alternatives + Related Apps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <CommunityAlternativesRail
            targetSlug={entry.slug}
            targetAppName={entry.appName}
            alternatives={alternatives}
          />
          <RelatedApps related={related} />
        </div>
      </div>
    </main>
  );
}
