// Plain-JS runtime mount for design-system previews (no JSX/Babel — avoids in-browser
// eval restrictions). Mirrors the components/*.jsx source 1:1. Source of truth for props
// and behavior is the .jsx + .d.ts + .prompt.md in each components/<group>/ directory;
// this file exists only so card/UI-kit previews render without a build step.
(function () {
  var h = React.createElement;

  function Button(props) {
    var variant = props.variant || 'primary', size = props.size || 'md', disabled = props.disabled;
    var sizes = { sm: { padding: '6px 12px', fontSize: 'var(--text-xs)' }, md: { padding: '10px 18px', fontSize: 'var(--text-sm)' } };
    var variants = {
      primary: { background: disabled ? 'var(--bg-3)' : 'var(--brand-500)', color: disabled ? 'var(--fg-disabled)' : '#050508', border: '1px solid transparent' },
      secondary: { background: 'transparent', color: disabled ? 'var(--fg-disabled)' : 'var(--fg-primary)', border: '1px solid ' + (disabled ? 'var(--border-subtle)' : 'var(--border-strong)') },
      ghost: { background: 'transparent', color: disabled ? 'var(--fg-disabled)' : 'var(--brand-400)', border: '1px solid transparent' },
    };
    var style = Object.assign({ fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: 'var(--tracking-wide)', borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all var(--duration-fast) var(--ease-standard)' }, sizes[size], variants[variant], props.style || {});
    return h('button', {
      disabled: disabled, onClick: props.onClick, style: style,
      onMouseEnter: function (e) { if (!disabled) e.currentTarget.style.boxShadow = 'var(--glow-hover)'; },
      onMouseLeave: function (e) { e.currentTarget.style.boxShadow = 'none'; },
    }, props.children);
  }

  function Badge(props) {
    var tones = {
      neutral: { background: 'var(--bg-2)', border: '1px solid var(--border-default)', color: 'var(--fg-secondary)' },
      brand: { background: 'var(--brand-tint-15)', border: '1px solid var(--brand-600)', color: 'var(--brand-300)' },
    };
    var style = Object.assign({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase' }, tones[props.tone || 'neutral']);
    return h('span', { style: style }, props.children);
  }

  function Card(props) {
    var interactive = props.interactive !== false;
    var style = Object.assign({ background: 'var(--bg-2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)', transition: 'border-color var(--duration-normal) var(--ease-standard), box-shadow var(--duration-normal) var(--ease-standard)' }, props.style || {});
    return h('div', {
      style: style,
      onMouseEnter: function (e) { if (interactive) { e.currentTarget.style.borderColor = 'var(--brand-500)'; e.currentTarget.style.boxShadow = 'var(--glow-hover)'; } },
      onMouseLeave: function (e) { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; },
    }, props.children);
  }

  var THREAT_TIERS = {
    high: { label: 'HIGH THREAT', color: 'var(--threat-high)', bg: 'var(--threat-high-bg)', border: 'var(--threat-high-border)', glow: 'var(--threat-high-glow)' },
    medium: { label: 'MEDIUM THREAT', color: 'var(--threat-medium)', bg: 'var(--threat-medium-bg)', border: 'var(--threat-medium-border)', glow: 'var(--threat-medium-glow)' },
    low: { label: 'LOW THREAT', color: 'var(--threat-low)', bg: 'var(--threat-low-bg)', border: 'var(--threat-low-border)', glow: 'var(--threat-low-glow)' },
  };

  function ThreatBadge(props) {
    var t = THREAT_TIERS[props.tier || 'medium'];
    var size = props.size || 'md';
    var pad = size === 'sm' ? '3px 8px' : '5px 12px';
    var fontSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';
    return h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: pad, borderRadius: 'var(--radius-xs)', background: t.bg, border: '1px solid ' + t.border, color: t.color, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: fontSize, letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', boxShadow: '0 0 12px ' + t.glow } },
      h('span', { style: { width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 } }),
      t.label
    );
  }

  function StatCounter(props) {
    var value = props.value || 0, duration = props.duration || 900;
    var fontSize = props.size === 'lg' ? '72px' : 'var(--text-display)';
    var numColor = props.numberColor || 'var(--fg-primary)';
    var state = React.useState(0), display = state[0], setDisplay = state[1];
    var raf = React.useRef();
    React.useEffect(function () {
      var start = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - start) / duration);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      }
      raf.current = requestAnimationFrame(tick);
      return function () { cancelAnimationFrame(raf.current); };
    }, [value, duration]);
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
      h('div', { key: display, style: { fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: fontSize, color: numColor, animation: 'ds-digit-flip 180ms var(--ease-standard)' } }, display + (props.suffix || '')),
      props.label ? h('div', { className: 'ds-label', style: { color: 'var(--fg-tertiary)' } }, props.label) : null
    );
  }

  function FilterPill(props) {
    var active = !!props.active;
    return h('button', {
      onClick: props.onClick,
      style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 'var(--radius-pill)', background: active ? 'var(--brand-tint-15)' : 'transparent', border: '1px solid ' + (active ? 'var(--brand-500)' : 'var(--border-default)'), color: active ? 'var(--brand-300)' : 'var(--fg-secondary)', cursor: 'pointer', transition: 'all var(--duration-fast) var(--ease-standard)' },
    }, props.children);
  }

  function SearchInput(props) {
    var lg = props.size === 'lg';
    var prefix = props.prefix || '/';
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: lg ? 12 : 8,
        background: 'var(--bg-1)', border: '1px solid ' + (lg ? 'var(--brand-600)' : 'var(--border-default)'),
        borderRadius: 'var(--radius-sm)', padding: lg ? '18px 22px' : '9px 12px',
        boxShadow: lg ? '0 0 0 1px var(--brand-tint-08), 0 0 32px var(--brand-glow-soft)' : 'none',
      } },
      h('span', { style: { color: 'var(--brand-400)', fontFamily: 'var(--font-mono)', fontSize: lg ? 'var(--text-h3)' : 'var(--text-body)', fontWeight: 700 } }, prefix),
      h('input', {
        value: props.value, placeholder: props.placeholder || 'Search tracked apps…',
        onChange: function (e) { if (props.onChange) props.onChange(e.target.value); },
        style: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--fg-primary)', fontFamily: lg ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: lg ? 'var(--text-body-lg)' : 'var(--text-body)' },
      })
    );
  }

  function VoteWidget(props) {
    var agree = props.agree || 0, disagree = props.disagree || 0;
    var state = React.useState(null), vote = state[0], setVote = state[1];
    var a = agree + (vote === 'agree' ? 1 : 0);
    var d = disagree + (vote === 'disagree' ? 1 : 0);
    function btn(active) {
      return { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid ' + (active ? 'var(--brand-500)' : 'var(--border-default)'), background: active ? 'var(--brand-tint-15)' : 'transparent', color: active ? 'var(--brand-300)' : 'var(--fg-secondary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', cursor: 'pointer' };
    }
    return h('div', { style: { display: 'flex', gap: 8 } },
      h('button', { style: btn(vote === 'agree'), onClick: function () { setVote(vote === 'agree' ? null : 'agree'); } }, '▲ Agree · ' + a),
      h('button', { style: btn(vote === 'disagree'), onClick: function () { setVote(vote === 'disagree' ? null : 'disagree'); } }, '▼ Disagree · ' + d)
    );
  }

  function NavBar(props) {
    var active = props.active || 'Home';
    var links = ['Home', 'Leaderboard', 'Methodology', 'Submit'];
    return h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px var(--page-gutter)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-0)' } },
      h('div', { style: { fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-h3)', color: 'var(--fg-primary)' } },
        'why', h('span', { style: { color: 'var(--brand-500)' } }, 'undefeated')
      ),
      h('div', { style: { display: 'flex', gap: 'var(--space-6)' } },
        links.map(function (l) { return h('span', { key: l, style: { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: l === active ? 'var(--brand-400)' : 'var(--fg-secondary)', cursor: 'pointer' } }, l); })
      )
    );
  }

  function Footer() {
    return h('div', { style: { padding: 'var(--space-8) var(--page-gutter)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' } },
      h('span', null, 'whyundefeated.dev — tracking the gap between AI and the platforms it might replace.'),
      h('span', null, '© 2026')
    );
  }

  window.DS = { Button: Button, Badge: Badge, Card: Card, ThreatBadge: ThreatBadge, StatCounter: StatCounter, FilterPill: FilterPill, SearchInput: SearchInput, VoteWidget: VoteWidget, NavBar: NavBar, Footer: Footer };
})();
