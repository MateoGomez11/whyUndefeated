import type { ThreatCounts } from '@/lib/content/tally';
import { TIERS } from '@/lib/content/tiers';

/**
 * Homepage tier stat blocks (design-reference TierBlock style): a big number per
 * threat level accented with the tier color, plus a short one-line caption
 * explaining what the level means. Doubles as the accessible threat legend
 * (FR-003) — hence the region label and the captions. Counts are derived at build
 * from real data (computeThreatCounts); never hardcoded. Static / no interactivity
 * (the kit's click-to-filter is deferred per the /speckit-clarify decision).
 */
export function TierStats({ counts }: { counts: ThreatCounts }) {
  return (
    <section
      aria-label="Threat level legend"
      className="tier-stats"
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-12)',
        flexWrap: 'wrap',
        margin: 'var(--space-10) 0',
      }}
    >
      {TIERS.map((t) => (
        <div
          key={t.level}
          className="tier-stat-block"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '2px 0 2px 22px',
            borderLeft: `3px solid ${t.color}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: t.color,
                boxShadow: `0 0 10px ${t.glow}`,
                flexShrink: 0,
              }}
            />
            <span className="ds-label tier-stat-label" style={{ color: 'var(--fg-tertiary)' }}>
              {t.label}
            </span>
          </div>
          <div
            className="tier-stat-number"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: 700,
              fontSize: '72px',
              lineHeight: 1,
              color: t.color,
            }}
          >
            {counts[t.level]}
          </div>
          <p
            className="tier-stat-caption-full"
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.3,
              color: 'var(--fg-tertiary)',
              whiteSpace: 'nowrap',
            }}
          >
            {t.caption}
          </p>
          <p
            className="tier-stat-caption-short"
            style={{
              margin: 0,
              fontSize: 11,
              lineHeight: 1.3,
              color: 'var(--fg-tertiary)',
            }}
          >
            {t.shortCaption}
          </p>
        </div>
      ))}
    </section>
  );
}
