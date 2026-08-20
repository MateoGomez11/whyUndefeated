import { loadAllEntries } from '@/lib/content/loader';
import { computeTally, computeThreatCounts } from '@/lib/content/tally';
import { HomeStats } from '@/components/HomeStats';
import { HeroHeadline } from '@/components/HeroHeadline';
import { SearchBar } from '@/components/SearchBar';
import { TierStats } from '@/components/TierStats';
import { EntryCard } from '@/components/EntryCard';

// Statically generated: content is read from versioned files at build time,
// no client-side data fetching, fully readable without JS (FR-010, FR-011).
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
        <div style={{ maxWidth: 560, margin: 'var(--space-8) auto 0' }}>
          <SearchBar />
        </div>
        <HomeStats tally={tally} />
      </header>

      <TierStats counts={threatCounts} />

      <section
        aria-label="Tracked apps"
        style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
      >
        <div
          className="ds-label tracker-header"
          style={{
            gap: 'var(--space-4)',
            padding: '10px var(--space-5)',
            background: 'var(--bg-1)',
            borderBottom: '1px solid var(--border-subtle)',
            color: 'var(--fg-tertiary)',
          }}
        >
          <span>App</span>
          <span>Category</span>
          <span>Verdict summary</span>
          <span>Threat level</span>
        </div>
        {entries.map((entry) => (
          <EntryCard key={entry.slug} entry={entry} />
        ))}
      </section>
    </main>
  );
}
