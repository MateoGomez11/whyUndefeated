import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy, GDPR compliance, and data protection practices for WhyUndefeated.',
};

export default function PrivacyPage() {
  return (
    <main
      style={{
        maxWidth: '840px',
        margin: '0 auto',
        padding: 'var(--space-10) var(--space-4)',
        color: 'var(--fg-primary)',
        fontFamily: 'var(--font-sans), sans-serif',
      }}
    >
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <div className="ds-label" style={{ color: 'var(--brand-400)', marginBottom: '8px' }}>
          PRIVACY & DATA PROTECTION
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'var(--text-h1)',
            fontWeight: 800,
            margin: '0 0 12px 0',
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 'var(--text-xs)', color: 'var(--fg-tertiary)' }}>
          Last updated: August 2026 · Compliant with GDPR & CCPA principles
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 1.7, fontSize: 'var(--text-body)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            1. Core Privacy Philosophy
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            WhyUndefeated is built with a <strong>privacy-first, data-minimization principle</strong>. We do not run invasive tracking scripts, sell personal profiles to data brokers, or use cross-site tracking cookies.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            2. What Data We Collect & Why
          </h2>
          <ul style={{ color: 'var(--fg-secondary)', paddingLeft: '20px' }}>
            <li>
              <strong>Founder Contact Emails:</strong> When you submit a community alternative or sponsor inquiry, your email is stored securely in our database solely for transaction status updates and listing verification. We never send unsolicited marketing emails or sell your email address.
            </li>
            <li>
              <strong>Anonymous Voter Identifiers:</strong> To ensure democratic voting integrity and prevent spam votes on platform verdicts and community tools, an anonymous random UUID is generated and stored locally in your browser’s <code>localStorage</code>. It contains zero personally identifiable information (PII).
            </li>
            <li>
              <strong>Public Listing Information:</strong> App names, URLs, icons, and descriptions submitted to our directory are published publicly for directory discovery.
            </li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            3. Payment Processing via Stripe Inc.
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            All financial transactions (including Verified Creator purchases and Sponsor bookings) are processed directly by <strong>Stripe, Inc.</strong>, a PCI Service Provider Level 1 certified gateway.
          </p>
          <p style={{ color: 'var(--fg-secondary)', marginTop: '8px' }}>
            <strong>WhyUndefeated never collects, processes, or stores your credit card number, CVV, or banking credentials.</strong> All payment data is handled securely under <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-400)', textDecoration: 'underline' }}>Stripe’s Privacy Policy</a>.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            4. Cookieless Privacy-Friendly Analytics
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            We utilize Umami Analytics for high-level aggregate traffic metrics (such as daily visitor counts and general country distribution). Umami does not use persistent tracking cookies, does not collect personal identifiers, and complies fully with GDPR, CCPA, and PECR.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            5. Your Rights (GDPR & CCPA Access / Deletion)
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            You have the absolute right to request an export of any contact information associated with your submitted project, or request the immediate and permanent deletion of your project and contact record from our servers. To exercise these rights, email{' '}
            <a href="mailto:privacy@whyundefeated.com" style={{ color: 'var(--brand-400)', textDecoration: 'underline' }}>
              privacy@whyundefeated.com
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
