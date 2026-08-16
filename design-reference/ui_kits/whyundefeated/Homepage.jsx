// Source JSX for the Homepage screen (kept for reference/portability — see
// screens-runtime.js for the plain-JS mirror actually loaded by index.html).
function Homepage({ onSelect }) {
  const { NavBar, Footer, Badge, FilterPill, SearchInput, StatCounter, ThreatBadge } = window.DS;
  const [tier, setTier] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const apps = window.WU_DATA;
  const categories = [...new Set(apps.map(a => a.category))];
  const tally = {
    high: apps.filter(a => a.tier === 'high').length,
    medium: apps.filter(a => a.tier === 'medium').length,
    low: apps.filter(a => a.tier === 'low').length,
  };
  const filtered = apps.filter(a =>
    (tier === 'all' || a.tier === tier) &&
    (category === 'all' || a.category === category) &&
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <NavBar active="Home" />
      <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: 'var(--space-10) var(--page-gutter)' }}>
        <div className="ds-fade-in" style={{ marginBottom: 'var(--space-10)' }}>
          <div className="ds-label" style={{ color: 'var(--brand-400)', marginBottom: 8 }}>AI Replacement Tracker</div>
          <h1 style={{ font: '700 44px/1.1 var(--font-sans)', color: 'var(--fg-primary)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            How close is AI to replacing the internet you use every day<span className="ds-cursor"></span>
          </h1>
          <p style={{ font: '400 17px/1.55 var(--font-sans)', color: 'var(--fg-secondary)', maxWidth: 640, margin: 0 }}>
            We track capability, usage, and migration signals for the platforms AI is most likely to disrupt — and issue a verdict, with evidence.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-10)', marginTop: 'var(--space-8)' }}>
            <StatCounter value={tally.high} label="High threat" />
            <StatCounter value={tally.medium} label="Medium threat" />
            <StatCounter value={tally.low} label="Low threat / safe" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px' }}><SearchInput value={query} onChange={setQuery} /></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <FilterPill active={tier === 'all'} onClick={() => setTier('all')}>All tiers</FilterPill>
            <FilterPill active={tier === 'high'} onClick={() => setTier('high')}>High</FilterPill>
            <FilterPill active={tier === 'medium'} onClick={() => setTier('medium')}>Medium</FilterPill>
            <FilterPill active={tier === 'low'} onClick={() => setTier('low')}>Low</FilterPill>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <FilterPill active={category === 'all'} onClick={() => setCategory('all')}>All categories</FilterPill>
            {categories.map(c => (
              <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</FilterPill>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div className="ds-label" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2.4fr 1.2fr 0.8fr', padding: '10px var(--space-5)', background: 'var(--bg-1)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--fg-tertiary)' }}>
            <span>App</span><span>Category</span><span>Verdict summary</span><span>Threat level</span><span>Updated</span>
          </div>
          {filtered.map((a, i) => (
            <div key={a.name} onClick={() => onSelect(a)}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 2.4fr 1.2fr 0.8fr', alignItems: 'center',
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                background: 'var(--bg-2)', cursor: 'pointer', transition: 'background var(--duration-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-2)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--bg-1)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-secondary)', fontSize: 13 }}>{a.name[0]}</div>
                <span style={{ color: 'var(--fg-primary)', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-sans)' }}>{a.name}</span>
              </div>
              <div><Badge>{a.category}</Badge></div>
              <div style={{ color: 'var(--fg-secondary)', fontSize: 13, paddingRight: 12 }}>{a.summary}</div>
              <div><ThreatBadge tier={a.tier} size="sm" /></div>
              <div style={{ color: 'var(--fg-tertiary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{a.updated}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>No apps match these filters.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
