import type { Tally } from '@/lib/content/tally';

function TickerItem({ value, label }: { value: number; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
      <span style={{ color: 'var(--brand-300)', fontWeight: 700 }}>{value.toLocaleString('en-US')}</span>
      {label}
    </span>
  );
}

function Dot() {
  return <span style={{ color: 'var(--border-strong)' }}>·</span>;
}

/**
 * Homepage aggregate ticker. Values are derived at build from entry data and
 * rendered statically in server HTML (readable without JS); never an editorial
 * score (FR-021, SC-008). Labels stay accurate to the underlying data: source
 * citations = sum of sources; community votes = 0 until the voting feature ships.
 */
export function HomeStats({ tally }: { tally: Tally }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: 14,
        flexWrap: 'wrap',
        margin: '28px 0 0',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 12,
        letterSpacing: '0.06em',
        color: 'var(--fg-tertiary)',
        textTransform: 'uppercase',
      }}
    >
      <TickerItem value={tally.totalApps} label="Apps Tracked" />
      <Dot />
      <TickerItem value={tally.totalCitations} label="Source Citations Documented" />
      <Dot />
      <TickerItem value={tally.totalVotes} label="Community Votes Cast" />
    </div>
  );
}
