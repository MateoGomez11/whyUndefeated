import type { SponsorOverviewMetrics } from '@/lib/sponsor/types';

export function SponsorHero({ metrics }: { metrics: SponsorOverviewMetrics }) {
  return (
    <section
      style={{
        textAlign: 'center',
        padding: 'var(--space-10) 0 var(--space-8) 0',
        maxWidth: 860,
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-sans), sans-serif',
          fontSize: 'clamp(36px, 6vw, 60px)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-tight)',
          color: 'var(--fg-primary)',
          margin: '0 0 var(--space-4) 0',
          lineHeight: 1.1,
        }}
      >
        Sponsor why<span style={{ color: 'var(--brand-500)' }}>undefeated</span>.
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 'var(--text-body-lg)',
          color: 'var(--fg-secondary)',
          maxWidth: 680,
          margin: '0 auto var(--space-8) auto',
          lineHeight: 1.6,
        }}
      >
        Five fixed shelf slots across the platform, read by builders and developers evaluating AI
        defensibility. Transparent metrics, cookieless telemetry, no rotating banners.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-4)',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Metric 1: Telemetry */}
        <div
          style={{
            padding: 'var(--space-4)',
            background: 'var(--bg-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'clamp(24px, 3.5vw, 32px)',
              fontWeight: 700,
              color: 'var(--brand-400)',
              lineHeight: 1.2,
            }}
          >
            {metrics.monthlyViews}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginTop: '4px',
            }}
          >
            Real-time analytics
          </div>
        </div>

        {/* Metric 2: Real Apps on the list */}
        <div
          style={{
            padding: 'var(--space-4)',
            background: 'var(--bg-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'clamp(24px, 3.5vw, 32px)',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              lineHeight: 1.2,
            }}
          >
            {metrics.appsCount}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginTop: '4px',
            }}
          >
            Tracked entries
          </div>
        </div>

        {/* Metric 3: Audience Tag */}
        <div
          style={{
            padding: 'var(--space-4)',
            background: 'var(--bg-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'clamp(24px, 3.5vw, 32px)',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              lineHeight: 1.2,
            }}
          >
            {metrics.audienceTag}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginTop: '4px',
            }}
          >
            Evaluating AI defensibility
          </div>
        </div>

        {/* Metric 4: Slots Available */}
        <div
          style={{
            padding: 'var(--space-4)',
            background: 'var(--threat-low-bg)',
            border: '1px solid var(--threat-low-border)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'clamp(24px, 3.5vw, 32px)',
              fontWeight: 700,
              color: 'var(--threat-low)',
              lineHeight: 1.2,
            }}
          >
            {metrics.slotsTakenText}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--threat-low)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
              marginTop: '4px',
              opacity: 0.9,
            }}
          >
            Be the first sponsor
          </div>
        </div>
      </div>
    </section>
  );
}
