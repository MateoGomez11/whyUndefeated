'use client';

import { useState } from 'react';
import type { CommunityAlternative } from '@/lib/alternatives/types';

interface ExtendedAlternative extends CommunityAlternative {
  creator_email?: string;
  status?: string;
}

export function AdminDashboard({
  initialAlternatives = [],
  isAuthenticated = false,
}: {
  initialAlternatives: ExtendedAlternative[];
  isAuthenticated: boolean;
}) {
  const [isAuth, setIsAuth] = useState(isAuthenticated);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<ExtendedAlternative[]>(initialAlternatives);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Invalid password');
      } else {
        setIsAuth(true);
        window.location.reload();
      }
    } catch {
      setErrorMsg('Login network error');
    }
  }

  async function handleAction(id: string, action: 'toggle_verified' | 'update_tier' | 'delete', extra?: Record<string, unknown>) {
    setBusyId(id);

    try {
      const res = await fetch('/api/admin/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, ...extra }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (action === 'delete') {
          setAlternatives((prev) => prev.filter((a) => a.id !== id));
        } else if (action === 'toggle_verified') {
          setAlternatives((prev) =>
            prev.map((a) => (a.id === id ? { ...a, is_verified: Boolean(extra?.is_verified) } : a)),
          );
        } else if (action === 'update_tier') {
          setAlternatives((prev) =>
            prev.map((a) =>
              a.id === id
                ? {
                    ...a,
                    verification_tier: extra?.tier as 'none' | 'verified' | 'priority',
                    is_verified: extra?.tier === 'verified' || extra?.tier === 'priority',
                  }
                : a,
            ),
          );
        }
      } else {
        alert(data.message || 'Action failed');
      }
    } catch {
      alert('Network error');
    } finally {
      setBusyId(null);
    }
  }

  if (!isAuth) {
    return (
      <div
        style={{
          maxWidth: '400px',
          margin: '60px auto',
          padding: 'var(--space-8)',
          background: 'var(--bg-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xs)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🔒</div>
        <h2
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'var(--text-h3)',
            color: 'var(--fg-primary)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Admin Console
        </h2>

        {errorMsg && (
          <div
            style={{
              padding: '8px',
              background: 'rgba(240, 98, 146, 0.15)',
              border: '1px solid var(--threat-high)',
              color: 'var(--threat-high)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono), monospace',
              marginBottom: '12px',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            placeholder="Enter master password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px 14px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-body)',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              background: 'var(--brand-500)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Unlock Console &rarr;
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-h2)',
              color: 'var(--fg-primary)',
              margin: 0,
            }}
          >
            Community Alternatives Management
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-secondary)',
              margin: '4px 0 0 0',
            }}
          >
            Total submissions: {alternatives.length} · Auto-approved safe listings
          </p>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border-default)' }}>
              <th style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'var(--fg-tertiary)' }}>APP</th>
              <th style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'var(--fg-tertiary)' }}>TARGET</th>
              <th style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'var(--fg-tertiary)' }}>TIER</th>
              <th style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'var(--fg-tertiary)' }}>STATUS</th>
              <th style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'var(--fg-tertiary)' }}>VOTES</th>
              <th style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'var(--fg-tertiary)' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alt) => (
              <tr key={alt.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-1)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{alt.icon || '⚡'}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--fg-primary)', fontSize: '13px' }}>{alt.name}</div>
                      <a href={alt.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-400)', fontSize: '11px' }}>
                        {alt.url.slice(0, 30)}...
                      </a>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: 'var(--fg-secondary)' }}>
                  {alt.target_slug || 'General'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono), monospace',
                      fontWeight: 700,
                      background:
                        alt.verification_tier === 'priority'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : alt.is_verified
                          ? 'rgba(139, 92, 246, 0.2)'
                          : 'var(--bg-2)',
                      color:
                        alt.verification_tier === 'priority'
                          ? 'var(--threat-medium)'
                          : alt.is_verified
                          ? 'var(--brand-400)'
                          : 'var(--fg-tertiary)',
                    }}
                  >
                    {alt.verification_tier === 'priority'
                      ? '🚀 PRIORITY $29'
                      : alt.is_verified
                      ? '⚡ VERIFIED $19'
                      : 'FREE'}
                  </span>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '11px', color: 'var(--threat-low)' }}>
                  APPROVED
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: 'var(--fg-primary)', fontWeight: 700 }}>
                  ▲ {alt.upvotes_count || 0}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      disabled={busyId === alt.id}
                      onClick={() => handleAction(alt.id, 'toggle_verified', { is_verified: !alt.is_verified })}
                      style={{
                        padding: '4px 8px',
                        background: alt.is_verified ? 'transparent' : 'var(--brand-500)',
                        border: `1px solid var(--brand-500)`,
                        color: alt.is_verified ? 'var(--brand-400)' : '#ffffff',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono), monospace',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {alt.is_verified ? 'Unverify' : '⚡ Verify'}
                    </button>

                    <button
                      type="button"
                      disabled={busyId === alt.id}
                      onClick={() =>
                        handleAction(alt.id, 'update_tier', {
                          tier: alt.verification_tier === 'priority' ? 'none' : 'priority',
                        })
                      }
                      style={{
                        padding: '4px 8px',
                        background: 'transparent',
                        border: '1px solid var(--threat-medium)',
                        color: 'var(--threat-medium)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono), monospace',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {alt.verification_tier === 'priority' ? 'Remove #1' : '🚀 Boost #1'}
                    </button>

                    <button
                      type="button"
                      disabled={busyId === alt.id}
                      onClick={() => {
                        if (confirm(`Delete alternative "${alt.name}" permanently?`)) {
                          handleAction(alt.id, 'delete');
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        background: 'transparent',
                        border: '1px solid var(--threat-high)',
                        color: 'var(--threat-high)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono), monospace',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
