// Plain-JS (no JSX) versions of the Homepage and AppDetail screens for the
// WhyUndefeated UI kit preview. Source of truth for structure/props is
// Homepage.jsx / AppDetail.jsx in this directory — kept 1:1 in sync by hand
// since this environment can't run Babel at request time.
(function () {
  var h = React.createElement;

  function useCountUp(value, duration) {
    var state = React.useState(0), display = state[0], setDisplay = state[1];
    React.useEffect(function () {
      var start = performance.now(); var raf;
      function tick(now) {
        var p = Math.min(1, (now - start) / (duration || 900));
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      return function () { cancelAnimationFrame(raf); };
    }, [value, duration]);
    return display;
  }

  function useTypewriter(words) {
    var state = React.useState(''), text = state[0], setText = state[1];
    React.useEffect(function () {
      var wordIndex = 0, charIndex = 0, deleting = false, timeoutId;
      var typeSpeed = 70, deleteSpeed = 35, holdTime = 1200, pauseTime = 300;
      function step() {
        var word = words[wordIndex % words.length];
        if (!deleting) {
          charIndex++;
          setText(word.slice(0, charIndex));
          if (charIndex === word.length) { deleting = true; timeoutId = setTimeout(step, holdTime); return; }
          timeoutId = setTimeout(step, typeSpeed);
        } else {
          charIndex--;
          setText(word.slice(0, charIndex));
          if (charIndex === 0) { deleting = false; wordIndex++; timeoutId = setTimeout(step, pauseTime); return; }
          timeoutId = setTimeout(step, deleteSpeed);
        }
      }
      timeoutId = setTimeout(step, typeSpeed);
      return function () { clearTimeout(timeoutId); };
    }, []);
    return text;
  }

  function TickerItem(props) {
    var d = useCountUp(props.value, 900);
    return h('span', { style: { display: 'inline-flex', alignItems: 'baseline', gap: 6 } },
      h('span', { key: d, style: { color: 'var(--brand-300)', fontWeight: 700, display: 'inline-block', animation: 'ds-digit-flip 160ms var(--ease-standard)' } }, d),
      props.label
    );
  }

  var TIER_COLOR = { high: 'var(--threat-high)', medium: 'var(--threat-medium)', low: 'var(--threat-low)' };
  var TIER_GLOW = { high: 'var(--threat-high-glow)', medium: 'var(--threat-medium-glow)', low: 'var(--threat-low-glow)' };

  function TierBlock(props) {
    var active = props.tier === props.activeTier;
    var color = TIER_COLOR[props.tier], glow = TIER_GLOW[props.tier];
    return h('div', {
      onClick: props.onClick,
      style: { display: 'flex', flexDirection: 'column', gap: 12, padding: '2px 0 2px 22px', borderLeft: '3px solid ' + (active ? color : 'var(--border-default)'), cursor: 'pointer', transition: 'border-color var(--duration-normal) var(--ease-standard)' },
      onMouseEnter: function (e) { e.currentTarget.style.borderLeftColor = color; },
      onMouseLeave: function (e) { if (!active) e.currentTarget.style.borderLeftColor = 'var(--border-default)'; },
    },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        h('span', { style: { width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: '0 0 10px ' + glow, flexShrink: 0 } }),
        h('span', { className: 'ds-label', style: { color: 'var(--fg-tertiary)' } }, props.label)
      ),
      h(window.DS.StatCounter, { value: props.value, size: 'lg' })
    );
  }

  function Homepage(props) {
    var onSelect = props.onSelect;
    var DSc = window.DS;
    var tierState = React.useState('all'), tier = tierState[0], setTier = tierState[1];
    var catState = React.useState('all'), category = catState[0], setCategory = catState[1];
    var qState = React.useState(''), query = qState[0], setQuery = qState[1];
    var apps = window.WU_DATA;
    var categories = Array.from(new Set(apps.map(function (a) { return a.category; })));
    var tally = {
      high: apps.filter(function (a) { return a.tier === 'high'; }).length,
      medium: apps.filter(function (a) { return a.tier === 'medium'; }).length,
      low: apps.filter(function (a) { return a.tier === 'low'; }).length,
    };
    var evidencePoints = apps.reduce(function (s, a) { return s + a.evidence.length; }, 0);
    var communityVerdicts = apps.reduce(function (s, a) { return s + a.agree + a.disagree; }, 0);
    var filtered = apps.filter(function (a) {
      return (tier === 'all' || a.tier === tier) &&
        (category === 'all' || a.category === category) &&
        a.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    var cyclingName = useTypewriter(apps.map(function (a) { return a.name; }));
    function toggleTier(t) { setTier(tier === t ? 'all' : t); }

    return h('div', { style: { minHeight: '100vh', background: 'var(--bg-0)' } },
      h(DSc.NavBar, { active: 'Home' }),
      h('div', { style: { maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: 'var(--space-12) var(--page-gutter) var(--space-10)' } },
        h('div', { className: 'ds-fade-in', style: { textAlign: 'center', marginBottom: 'var(--space-6)' } },
          h('div', { className: 'ds-label', style: { color: 'var(--brand-400)', marginBottom: 16 } }, 'AI Replacement Tracker'),
          h('h1', { style: { font: '700 clamp(32px, 5vw, 64px)/1.15 var(--font-sans)', color: 'var(--fg-primary)', margin: '0 auto 16px', letterSpacing: '-0.02em', maxWidth: 880 } },
            h('div', { style: { whiteSpace: 'nowrap' } },
              'Is ',
              h('span', { style: { color: 'var(--brand-400)', borderBottom: '2px solid var(--brand-600)' } }, cyclingName || ' '),
              h('span', { className: 'ds-cursor' })
            ),
            h('div', null, 'Still Undefeated?')
          ),
          h('p', { style: { font: '400 17px/1.55 var(--font-sans)', color: 'var(--fg-secondary)', maxWidth: 520, margin: '0 auto' } },
            'We track capability, usage, and migration signals for the platforms AI is most likely to disrupt — and issue a verdict, with evidence.'
          ),
          h('div', { style: { maxWidth: 560, margin: 'var(--space-8) auto 0' } },
            h(DSc.SearchInput, { value: query, onChange: setQuery, size: 'lg', prefix: '>', placeholder: 'search a platform…' })
          ),
          h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', margin: '28px 0 0', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--fg-tertiary)', textTransform: 'uppercase' } },
            h(TickerItem, { value: apps.length, label: 'Apps Tracked' }),
            h('span', { style: { color: 'var(--border-strong)' } }, '·'),
            h(TickerItem, { value: evidencePoints, label: 'Evidence Points Documented' }),
            h('span', { style: { color: 'var(--border-strong)' } }, '·'),
            h(TickerItem, { value: communityVerdicts, label: 'Community Verdicts Cast' })
          )
        ),
        h('div', { style: { display: 'flex', justifyContent: 'center', gap: 'var(--space-12)', flexWrap: 'wrap', margin: 'var(--space-10) 0 var(--space-10)' } },
          h(TierBlock, { tier: 'high', value: tally.high, label: 'High Threat', activeTier: tier, onClick: function () { toggleTier('high'); } }),
          h(TierBlock, { tier: 'medium', value: tally.medium, label: 'Medium Threat', activeTier: tier, onClick: function () { toggleTier('medium'); } }),
          h(TierBlock, { tier: 'low', value: tally.low, label: 'Low Threat / Safe', activeTier: tier, onClick: function () { toggleTier('low'); } })
        ),
        h('div', { style: { display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap' } },
          h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
            h(DSc.FilterPill, { active: tier === 'all', onClick: function () { setTier('all'); } }, 'All tiers'),
            h(DSc.FilterPill, { active: tier === 'high', onClick: function () { setTier('high'); } }, 'High'),
            h(DSc.FilterPill, { active: tier === 'medium', onClick: function () { setTier('medium'); } }, 'Medium'),
            h(DSc.FilterPill, { active: tier === 'low', onClick: function () { setTier('low'); } }, 'Low')
          ),
          h('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
            h(DSc.FilterPill, { active: category === 'all', onClick: function () { setCategory('all'); } }, 'All categories'),
            categories.map(function (c) {
              return h(DSc.FilterPill, { key: c, active: category === c, onClick: function () { setCategory(c); } }, c);
            })
          )
        ),
        h('div', { style: { border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' } },
          h('div', { className: 'ds-label', style: { display: 'grid', gridTemplateColumns: '2fr 1fr 2.4fr 1.2fr 0.8fr', padding: '10px var(--space-5)', background: 'var(--bg-1)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--fg-tertiary)' } },
            h('span', null, 'App'), h('span', null, 'Category'), h('span', null, 'Verdict summary'), h('span', null, 'Threat level'), h('span', null, 'Updated')
          ),
          filtered.map(function (a, i) {
            return h('div', {
              key: a.name, onClick: function () { onSelect(a); },
              style: { display: 'grid', gridTemplateColumns: '2fr 1fr 2.4fr 1.2fr 0.8fr', alignItems: 'center', padding: 'var(--space-4) var(--space-5)', borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none', background: 'var(--bg-2)', cursor: 'pointer', transition: 'background var(--duration-fast)' },
              onMouseEnter: function (e) { e.currentTarget.style.background = 'var(--bg-3)'; },
              onMouseLeave: function (e) { e.currentTarget.style.background = 'var(--bg-2)'; },
            },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
                h('div', { style: { width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--bg-1)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg-secondary)', fontSize: 13 } }, a.name[0]),
                h('span', { style: { color: 'var(--fg-primary)', fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-sans)' } }, a.name)
              ),
              h('div', null, h(DSc.Badge, null, a.category)),
              h('div', { style: { color: 'var(--fg-secondary)', fontSize: 13, paddingRight: 12 } }, a.summary),
              h('div', null, h(DSc.ThreatBadge, { tier: a.tier, size: 'sm' })),
              h('div', { style: { color: 'var(--fg-tertiary)', fontSize: 12, fontFamily: 'var(--font-mono)' } }, a.updated)
            );
          }),
          filtered.length === 0 ? h('div', { style: { padding: 'var(--space-8)', textAlign: 'center', color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 13 } }, 'No apps match these filters.') : null
        )
      ),
      h(DSc.Footer)
    );
  }

  function slugify(name) { return name.toLowerCase().replace(/[^a-z0-9]/g, '-'); }

  function AppDetail(props) {
    var app = props.app, onBack = props.onBack;
    var DSc = window.DS;
    var slotId = 'logo-' + slugify(app.name);
    return h('div', { style: { minHeight: '100vh', background: 'var(--bg-0)' } },
      h(DSc.NavBar, { active: 'Home' }),
      h('div', { style: { maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: 'var(--space-10) var(--page-gutter)' } },
        h('div', { onClick: onBack, style: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--brand-400)', fontFamily: 'var(--font-mono)', fontSize: 13, cursor: 'pointer', marginBottom: 'var(--space-8)' } }, '← back to tracker'),
        h('div', { className: 'ds-fade-in', style: { display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginBottom: 'var(--space-10)', flexWrap: 'wrap' } },
          h('div', { style: { position: 'relative', width: 88, height: 88, flexShrink: 0 } },
            h('div', { style: { position: 'absolute', inset: -14, borderRadius: 'var(--radius-md)', background: 'var(--brand-glow-soft)', filter: 'blur(18px)' } }),
            h('image-slot', { id: slotId, shape: 'rounded', radius: '12', placeholder: app.name + ' logo', style: { position: 'relative', width: '88px', height: '88px', border: '1px solid var(--border-default)' } })
          ),
          h('div', { style: { maxWidth: 620 } },
            h('div', { style: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 } },
              h(DSc.Badge, null, app.category),
              h(DSc.ThreatBadge, { tier: app.tier, size: 'sm' })
            ),
            h('h1', { style: { font: '700 52px/1.05 var(--font-sans)', color: 'var(--fg-primary)', margin: '0 0 18px', letterSpacing: '-0.02em' } }, app.name),
            h('p', { style: { font: '400 17px/1.55 var(--font-sans)', color: 'var(--fg-secondary)', margin: 0, maxWidth: 580 } }, app.verdict)
          )
        ),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--space-8)' } },
          h('div', null,
            h('div', { className: 'ds-label', style: { color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' } }, 'Evidence'),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
              app.evidence.map(function (e, i) {
                return h(DSc.Card, { key: i, interactive: false },
                  h('div', { className: 'ds-label', style: { color: 'var(--brand-400)', marginBottom: 6 } }, e.type),
                  h('div', { style: { color: 'var(--fg-primary)', fontSize: 14, lineHeight: 1.5 } }, e.text)
                );
              })
            ),
            h('div', { className: 'ds-label', style: { color: 'var(--fg-tertiary)', margin: 'var(--space-8) 0 var(--space-3)' } }, 'Does the community agree?'),
            h(DSc.VoteWidget, { agree: app.agree, disagree: app.disagree })
          ),
          h('div', null,
            h('div', { className: 'ds-label', style: { color: 'var(--fg-tertiary)', marginBottom: 'var(--space-4)' } }, 'Related apps'),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
              app.related.map(function (r) {
                return h(DSc.Card, { key: r.name },
                  h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 } },
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 } },
                      h('image-slot', { id: 'logo-' + slugify(r.name), shape: 'rounded', radius: '7', placeholder: r.name[0], style: { width: '28px', height: '28px', border: '1px solid var(--border-default)', flexShrink: 0 } }),
                      h('span', { style: { color: 'var(--fg-primary)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, r.name)
                    ),
                    h(DSc.ThreatBadge, { tier: r.tier, size: 'sm' })
                  )
                );
              })
            )
          )
        )
      ),
      h(DSc.Footer)
    );
  }

  window.Homepage = Homepage;
  window.AppDetail = AppDetail;
})();
