import React, { useState } from 'react';

export function VoteWidget({ agree = 0, disagree = 0 }) {
  const [vote, setVote] = useState(null);
  const a = agree + (vote === 'agree' ? 1 : 0);
  const d = disagree + (vote === 'disagree' ? 1 : 0);
  const btn = active => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 10px', borderRadius: 'var(--radius-sm)',
    border: `1px solid ${active ? 'var(--brand-500)' : 'var(--border-default)'}`,
    background: active ? 'var(--brand-tint-15)' : 'transparent',
    color: active ? 'var(--brand-300)' : 'var(--fg-secondary)',
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', cursor: 'pointer',
  });
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button style={btn(vote === 'agree')} onClick={() => setVote(vote === 'agree' ? null : 'agree')}>▲ Agree · {a}</button>
      <button style={btn(vote === 'disagree')} onClick={() => setVote(vote === 'disagree' ? null : 'disagree')}>▼ Disagree · {d}</button>
    </div>
  );
}
