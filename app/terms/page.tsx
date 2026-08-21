import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service, digital purchase conditions, and trademark disclaimers for WhyUndefeated.',
};

export default function TermsPage() {
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
          LEGAL &amp; COMPLIANCE
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'var(--text-h1)',
            fontWeight: 800,
            margin: '0 0 12px 0',
          }}
        >
          Terms of Service &amp; Conditions of Sale
        </h1>
        <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 'var(--text-xs)', color: 'var(--fg-tertiary)' }}>
          Last updated: August 2026 · Effective immediately
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 1.7, fontSize: 'var(--text-body)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            1. Service Description &amp; Independent Editorial Purpose
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            WhyUndefeated (<strong>&quot;whyundefeated.com&quot;</strong>, &quot;we&quot;, &quot;us&quot;) operates an analytical index and community-submitted directory evaluating tech platform defensibility against artificial intelligence. All verdicts and analysis represent independent editorial opinion supported by publicly cited evidence.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            2. Trademark &amp; Nominative Fair Use Disclaimer
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            All product names, logos, brands, and trademarks displayed on this site (including but not limited to <em>Wikipedia, Reddit, Goodreads, Notion, Spotify, Duolingo, Figma, Stack Overflow, LinkedIn, TikTok, Twitter/X</em>) are the property of their respective trademark holders. Reference to these brands is made strictly for identification, commentary, comparative criticism, and fair use under applicable law. WhyUndefeated is not affiliated, endorsed, or sponsored by any of the analyzed incumbents.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            3. Digital Goods, Verification Fees &amp; Strict No-Refund Policy
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            We offer optional paid digital visibility tiers for independent builders, including the <strong>Verified Creator Badge ($19 USD one-time)</strong>, the <strong>Priority Fast-Track Boost ($29 USD one-time)</strong>, and <strong>Weekly Sponsor Dock Slots ($49 USD/week)</strong>.
          </p>
          <ul style={{ color: 'var(--fg-secondary)', paddingLeft: '20px', marginTop: '8px' }}>
            <li><strong>Immediate Digital Delivery:</strong> Upon checkout confirmation or safety review, badges and placement privileges are published live to our global directory and edge network.</li>
            <li><strong>All Sales Are Final:</strong> Because digital promotional visibility and verification badges are delivered instantaneously upon activation, all purchases are non-refundable. Chargebacks initiated without prior contact will result in permanent removal and domain blacklisting.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            4. Prohibited Content &amp; Immediate Revocation
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            We maintain a zero-tolerance policy against malicious submissions. We reserve the absolute right to revoke, delist, and ban any submission without refund if the project or destination URL promotes:
          </p>
          <ul style={{ color: 'var(--fg-secondary)', paddingLeft: '20px', marginTop: '8px' }}>
            <li>Malware, spyware, phishing, exploits, or unverified executable downloads.</li>
            <li>Financial scams, fraudulent crypto token schemes, illegal gambling, or deceptive marketing.</li>
            <li>Defamatory, infringing, hateful, or unlawful materials.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            5. Limitation of Liability
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            In no event shall WhyUndefeated or its operators be liable for any indirect, incidental, special, or consequential damages resulting from the use of the platform, community voting results, or third-party links listed within the directory.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--brand-400)', marginBottom: '8px' }}>
            6. Contact &amp; Inquiries
          </h2>
          <p style={{ color: 'var(--fg-secondary)' }}>
            For legal inquiries, trademark questions, or sponsorship invoices, contact our administrative desk at{' '}
            <a href="mailto:legal@whyundefeated.com" style={{ color: 'var(--brand-400)', textDecoration: 'underline' }}>
              legal@whyundefeated.com
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
