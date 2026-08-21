import type { SponsorBenefit } from '@/lib/sponsor/types';

export function SponsorPricingSection({
  priceWeeklyUsd = 49,
  benefits,
}: {
  priceWeeklyUsd?: number;
  benefits: SponsorBenefit[];
}) {
  return (
    <section
      style={{
        margin: 'var(--space-10) 0',
        padding: 'var(--space-8) 0',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Title & Subtitle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: 'var(--fg-primary)',
            margin: 0,
          }}
        >
          Sponsorship Details
        </h2>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-secondary)',
          }}
        >
          10 fixed slots · weekly booking · no rotating ads
        </div>
      </div>

      {/* Price block */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-3)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-8)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'clamp(44px, 7vw, 64px)',
            fontWeight: 700,
            color: 'var(--fg-primary)',
            lineHeight: 1,
          }}
        >
          ${priceWeeklyUsd}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-h3)',
            color: 'var(--brand-400)',
            fontWeight: 600,
          }}
        >
          / week
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-secondary)',
            marginLeft: 'var(--space-2)',
          }}
        >
          (7 days) · introductory rate locked for active sponsors
        </div>
      </div>

      {/* Benefits grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {benefits.map((b, idx) => (
          <div
            key={idx}
            style={{
              padding: 'var(--space-6)',
              background: 'var(--bg-1)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-sans), sans-serif',
                fontSize: 'var(--text-body-lg)',
                fontWeight: 600,
                color: 'var(--fg-primary)',
              }}
            >
              {b.title}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {b.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
