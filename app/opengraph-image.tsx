import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WhyUndefeated — The AI Moat & Threat Tracker';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0f',
          padding: '80px',
          fontFamily: 'sans-serif',
          border: '12px solid #1e1b4b',
          position: 'relative',
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(10,10,15,0) 70%)',
          }}
        />

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              padding: '8px 16px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid #8b5cf6',
              borderRadius: '6px',
              fontSize: '18px',
              fontWeight: 700,
              color: '#c4b5fd',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            THE AI MOAT &amp; THREAT TRACKER
          </div>
        </div>

        {/* Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#f8fafc',
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: '-2px',
            }}
          >
            why<span style={{ color: '#8b5cf6' }}>undefeated</span>
          </h1>
          <p
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '860px',
            }}
          >
            Evidence-based index tracking why AI hasn’t replaced established tech platforms — and the
            community tools challenging them.
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #27272a',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px', fontSize: '20px', color: '#8b5cf6', fontWeight: 700 }}>
            <span>⚡ Threat Index</span>
            <span>🛡️ Moat Analysis</span>
            <span>🚀 Community Challengers</span>
          </div>

          <div style={{ fontSize: '20px', color: '#64748b', fontWeight: 600 }}>whyundefeated.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
