import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Successful',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return (
    <main
      style={{
        maxWidth: '640px',
        margin: '60px auto',
        padding: 'var(--space-8)',
        background: 'var(--bg-1)',
        border: '1px solid var(--brand-500)',
        borderRadius: 'var(--radius-xs)',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🎉</div>
      <div
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '11px',
          color: 'var(--threat-low)',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: '8px',
          letterSpacing: 'var(--tracking-label)',
        }}
      >
        PAYMENT COMPLETED · VERIFICATION LIVE
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-sans), sans-serif',
          fontSize: 'var(--text-h2)',
          color: 'var(--fg-primary)',
          margin: '0 0 var(--space-4) 0',
        }}
      >
        You&apos;re Officially Verified!
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 'var(--text-sm)',
          color: 'var(--fg-secondary)',
          lineHeight: 1.6,
          margin: '0 auto var(--space-8) auto',
        }}
      >
        Thank you for backing independent builder defensibility. Your promotional badge and enhanced
        ranking position have been synchronized across our edge network.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/alternatives"
          style={{
            padding: '12px 24px',
            background: 'var(--brand-500)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xs)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
          }}
        >
          View in Alternatives Directory &rarr;
        </Link>
        <Link
          href="/"
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: '1px solid var(--border-default)',
            color: 'var(--fg-primary)',
            borderRadius: 'var(--radius-xs)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-sm)',
            textDecoration: 'none',
          }}
        >
          Back to Home Tracker
        </Link>
      </div>
    </main>
  );
}
