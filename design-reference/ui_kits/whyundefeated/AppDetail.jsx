// Source JSX for the AppDetail screen (kept for reference/portability — see
// screens-runtime.js for the plain-JS mirror actually loaded by index.html).
function AppDetail({ app, onBack }) {
  const { NavBar, Footer, Badge, ThreatBadge, StatCounter, VoteWidget, Card } = window.DS;
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <NavBar active="Home" />
      <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: 'var(--space-10) var(--page-gutter)' }}>
        <div onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--brand-400)', fontFamily: 'var(--font-mono)', fontSize: 13, cursor: 'pointer', marginBottom: 'var(--space-6)' }}>
          &larr; back to tracker
        </div>

        <div className="ds-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-8)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <Badge>{app.category}</Badge>
              <span style={{ color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Updated {app.updated}</span>
            </div>
            <h1 style={{ font: '700 40px/1.1 var(--font-sans)', color: 'var(--fg-primary)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>{app.name}</h1>
            <p style={{ font: '400 17px/1.55 var(--font-sans)', color: 'var(--fg-secondary)', margin: '0 0 20px' }}>{app.verdict}</p>
            <ThreatBadge tier={app.tier} />
          </div>
          <StatCounter value={app.confidence} suffix="%" label="Confidence" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-8)' }}>
          <div>
            <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>Evidence</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {app.evidence.map((e, i) => (
                <Card key={i} interactive={false}>
                  <div className="ds-label" style={{ color: 'var(--brand-400)', marginBottom: 6 }}>{e.type}</div>
                  <div style={{ color: 'var(--fg-primary)', fontSize: 14, lineHeight: 1.5 }}>{e.text}</div>
                </Card>
              ))}
            </div>

            <div className="ds-label" style={{ color: 'var(--fg-tertiary)', margin: 'var(--space-8) 0 var(--space-3)' }}>Does the community agree?</div>
            <VoteWidget agree={app.agree} disagree={app.disagree} />
          </div>

          <div>
            <div className="ds-label" style={{ color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' }}>Related apps</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {app.related.map(r => (
                <Card key={r.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--fg-primary)', fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                    <ThreatBadge tier={r.tier} size="sm" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
