import { loadAllEntries } from '@/lib/content/loader';
import { computeTally, computeThreatCounts } from '@/lib/content/tally';
import { HomeStats } from '@/components/HomeStats';
import { HeroHeadline } from '@/components/HeroHeadline';
import { TierStats } from '@/components/TierStats';
import { HomeDirectory } from '@/components/HomeDirectory';

export const dynamic = 'force-static';

export default function HomePage() {
  const entries = loadAllEntries(); // already sorted high -> low (FR-002)
  const tally = computeTally(entries);
  const threatCounts = computeThreatCounts(entries);

  return (
    <main className="page">
      <header className="ds-fade-in" style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
        <div className="ds-label" style={{ color: 'var(--brand-400)', marginBottom: 16 }}>
          AI Replacement Tracker
        </div>
        <HeroHeadline names={entries.map((e) => e.appName)} />
        <p
          style={{
            font: '400 var(--text-body-lg)/1.55 var(--font-sans), sans-serif',
            color: 'var(--fg-secondary)',
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          We track named challengers, moats, and migration signals for the platforms AI is most likely to
          disrupt — and issue a verdict, with evidence.
        </p>
        <HomeStats tally={tally} />
      </header>

      <TierStats counts={threatCounts} />

      <HomeDirectory entries={entries} />
    </main>
  );
}
