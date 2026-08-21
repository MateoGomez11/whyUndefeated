export function SponsorAudienceGuide() {
  return (
    <section style={{ margin: 'var(--space-12) 0' }}>
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
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--fg-primary)',
            margin: 0,
          }}
        >
          Who sponsors here
        </h2>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-secondary)',
          }}
        >
          two kinds of sponsor do well on this page
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {/* Presence Buyers */}
        <div
          style={{
            padding: 'var(--space-6)',
            background: 'var(--bg-1)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              textTransform: 'lowercase',
              letterSpacing: 'var(--tracking-label)',
              margin: '0 0 var(--space-3) 0',
            }}
          >
            presence buyers
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-body)',
              color: 'var(--fg-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            You want builders to know your name. A fixed card on a page they keep coming back to; no
            funnel math, just being where your people already look.
          </p>
        </div>

        {/* Signup Buyers */}
        <div
          style={{
            padding: 'var(--space-6)',
            background: 'var(--bg-1)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              textTransform: 'lowercase',
              letterSpacing: 'var(--tracking-label)',
              margin: '0 0 var(--space-3) 0',
            }}
          >
            signup buyers
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-body)',
              color: 'var(--fg-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            You sell a tool builders buy for themselves: self-serve, priced for one person&apos;s card,
            value visible in the first session. They click, they try it, you see it.
          </p>
        </div>
      </div>

      {/* Recommended niches footer bar */}
      <div
        style={{
          padding: 'var(--space-4) var(--space-6)',
          background: 'var(--bg-1)',
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: 'var(--border-default)',
          borderRadius: 'var(--radius-xs)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 'var(--text-xs)',
          color: 'var(--fg-secondary)',
        }}
      >
        <strong style={{ color: 'var(--fg-primary)' }}>works best for:</strong> AI coding tools · infra
        & hosting · APIs & inference · payments for builders · growth & analytics
      </div>
    </section>
  );
}
