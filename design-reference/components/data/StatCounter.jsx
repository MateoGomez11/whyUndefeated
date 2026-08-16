import React, { useEffect, useRef, useState } from 'react';

export function StatCounter({ value = 0, label, suffix = '', duration = 900, size = 'md', numberColor = 'var(--fg-primary)' }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div key={display} style={{
        fontFamily: 'var(--font-mono)', fontWeight: 700,
        fontSize: size === 'lg' ? '72px' : 'var(--text-display)', color: numberColor,
        animation: 'ds-digit-flip 180ms var(--ease-standard)',
      }}>{display}{suffix}</div>
      {label ? <div className="ds-label" style={{ color: 'var(--fg-tertiary)' }}>{label}</div> : null}
    </div>
  );
}
