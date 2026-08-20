import type { Metadata } from 'next';
import { TIERS } from '@/lib/content/tiers';

// Statically generated: pure static copy, no client fetching, no
// generateStaticParams (single fixed route, not a template) — FR-007, FR-009.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Methodology — WhyUndefeated',
  description:
    "How WhyUndefeated determines threat-level verdicts: the three threat tiers, the evidence that backs them, the content-integrity rule that blocks unsourced claims, and how related apps are grouped.",
};

const EVIDENCE_TYPES: { label: string; description: string }[] = [
  {
    label: 'Traffic/usage stats',
    description:
      "Measurable shifts in visits, sessions, or engagement that suggest people are relying on the platform more or less than before.",
  },
  {
    label: 'AI capability benchmarks',
    description:
      'A documented case where an AI tool matches or exceeds what the platform offers, judged against a public release, benchmark, or independent review.',
  },
  {
    label: 'User migration signals',
    description:
      'Public, verifiable indications that people are moving their activity elsewhere — reviews, creator statements, or reported usage shifts.',
  },
];

export default function MethodologyPage() {
  return (
    <main className="page">
      <header className="ds-fade-in" style={{ maxWidth: 720, margin: '0 auto var(--space-10)', textAlign: 'center' }}>
        <div className="ds-label" style={{ color: 'var(--brand-400)', marginBottom: 16 }}>
          Methodology
        </div>
        <h1
          style={{
            font: '700 40px/1.15 var(--font-sans), sans-serif',
            color: 'var(--fg-primary)',
            margin: '0 0 16px',
            letterSpacing: '-0.02em',
          }}
        >
          How we determine a verdict
        </h1>
        <p style={{ font: '400 var(--text-body-lg)/1.55 var(--font-sans), sans-serif', color: 'var(--fg-secondary)', margin: 0 }}>
          Every threat-level verdict on this site is a claim backed by evidence, not an opinion. Here&apos;s
          exactly how it works.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)', maxWidth: 720, margin: '0 auto' }}>
        <section aria-label="Threat Tiers">
          <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>
            Threat Tiers
          </div>
          <p style={{ color: 'var(--fg-secondary)', fontSize: 15, lineHeight: 1.6, margin: '0 0 20px' }}>
            Every entry gets exactly one of three threat levels. The label and description below are the
            same ones shown in the tracker legend on the home page — there is only one place this wording
            is written.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {TIERS.map((tier) => (
              <div
                key={tier.level}
                style={{ paddingLeft: 14, borderLeft: `3px solid ${tier.color}` }}
              >
                <div
                  className="ds-label"
                  data-tier-label
                  style={{ color: tier.color, marginBottom: 4 }}
                >
                  {tier.label}
                </div>
                <p data-tier-caption style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                  {tier.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Evidence Types">
          <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>
            Evidence Types
          </div>
          <p style={{ color: 'var(--fg-secondary)', fontSize: 15, lineHeight: 1.6, margin: '0 0 20px' }}>
            A verdict draws on three kinds of evidence. This section defines what each one means — it does
            not cite specific examples from any tracked app.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {EVIDENCE_TYPES.map((evidence) => (
              <div key={evidence.label}>
                <div style={{ fontWeight: 600, color: 'var(--fg-primary)', fontSize: 14, marginBottom: 4 }}>
                  {evidence.label}
                </div>
                <p style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: 14, lineHeight: 1.5 }}>
                  {evidence.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Content Integrity Rule">
          <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>
            Content Integrity Rule
          </div>
          <p style={{ color: 'var(--fg-secondary)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Every entry on this site must cite at least one verifiable source. The moat explanation must
            cite at least one of those sources, and any named challenger must cite a source for its
            evidence. If a source is missing, or a citation points to a source that doesn&apos;t exist, the
            site&apos;s build process fails and names the exact field and file responsible — the entry
            never reaches production.
          </p>
        </section>

        <section aria-label="Related Apps Grouping">
          <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>
            Related Apps Grouping
          </div>
          <p style={{ color: 'var(--fg-secondary)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Each entry&apos;s detail page lists &quot;related apps&quot; — the other tracked apps that
            share its category (Social, Content, Knowledge, or Community). If an entry is the only one in
            its category, this section is left out.
          </p>
        </section>
      </div>
    </main>
  );
}
