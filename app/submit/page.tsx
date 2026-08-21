import type { Metadata } from 'next';
import { SubmitAlternativeForm } from '@/components/alternatives/SubmitAlternativeForm';

export const metadata: Metadata = {
  title: 'Submit Community Alternative — WhyUndefeated',
  description:
    'Submit your challenger tool or AI alternative to an established incumbent. Reach builders and get listed in our community directory.',
};

export default async function SubmitPage(props: {
  searchParams?: Promise<{ target?: string }>;
}) {
  const resolvedParams = props.searchParams ? await props.searchParams : {};
  const initialTarget = resolvedParams.target || 'general';

  return (
    <main className="page" style={{ padding: 'var(--space-10) var(--space-4)' }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto var(--space-8) auto' }}>
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
          Community Submissions
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
          Submit a Challenger or Alternative
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
          Have you built an AI tool or platform that competes with an established incumbent? Submit
          your project below to be listed across our index and app directory.
        </p>
      </div>

      <SubmitAlternativeForm initialTargetSlug={initialTarget} />
    </main>
  );
}
