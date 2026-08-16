import type { ThreatCounts } from '@/lib/content/tally';
import type { ThreatLevel } from '@/lib/content/schema';

const TIERS: {
  level: ThreatLevel;
  label: string;
  caption: string;
  color: string;
  glow: string;
}[] = [
  {
    level: 'high',
    label: 'High Threat',
    caption: 'Named challengers are actively eroding the moat',
    color: 'var(--threat-high)',
    glow: 'var(--threat-high-glow)',
  },
  {
    level: 'medium',
    label: 'Medium Threat',
    caption: 'Credible pressure exists, but the moat still holds',
    color: 'var(--threat-medium)',
    glow: 'var(--threat-medium-glow)',
  },
  {
    level: 'low',
    label: 'Low Threat / Safe',
    caption: 'The moat is durable — no near-term path to replacement',
    color: 'var(--threat-low)',
    glow: 'var(--threat-low-glow)',
  },
];

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
            <span className="ds-label" style={{ color: 'var(--fg-tertiary)' }}>
              {t.label}
            </span>
          </div>
          <div
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
        </div>
      ))}
    </section>
  );
}
