import type { Metadata } from 'next';
import { fetchAllAlternatives } from '@/lib/alternatives/client';
import { AlternativesGrid } from '@/components/alternatives/AlternativesGrid';

export const metadata: Metadata = {
  title: 'Community Alternatives & AI Challengers — WhyUndefeated',
  description:
    'Discover challenger tools and modern alternatives built by the community to compete with entrenched tech incumbents.',
};

export default async function AlternativesPage() {
  const alternatives = await fetchAllAlternatives();

  return (
    <main className="page" style={{ padding: 'var(--space-10) var(--space-4)' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto var(--space-10) auto' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--brand-400)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Community Ecosystem
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            color: 'var(--fg-primary)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Challenger Apps &amp; Alternatives
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-body)',
            color: 'var(--fg-secondary)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Independent tools, AI products, and developer projects built to disrupt or alternative-source
          legacy platforms. Verified projects receive priority placement.
        </p>
      </div>

      <AlternativesGrid initialAlternatives={alternatives} />
    </main>
  );
}
