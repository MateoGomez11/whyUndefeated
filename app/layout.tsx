import type { Metadata } from 'next';
import Script from 'next/script';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { VerifiedStackDock } from '@/components/sponsor/VerifiedStackDock';
import { SPONSOR_SLOTS, SPONSOR_METRICS } from '@/lib/sponsor/data';

import { Analytics } from '@vercel/analytics/next';

// Self-hosted via next/font (no runtime @import) — plan.md design deviation.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['monospace'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://whyundefeated.com'),
  title: {
    default: 'WhyUndefeated — The AI Moat & Threat Tracker',
    template: '%s — WhyUndefeated',
  },
  description:
    'Evidence-based threat-level index of why AI has not yet replaced major tech incumbents — and the community tools challenging them.',
  keywords: [
    'AI replacement',
    'tech moats',
    'AI startups',
    'community alternatives',
    'indie hackers',
    'software defensibility',
  ],
  authors: [{ name: 'WhyUndefeated Team' }],
  openGraph: {
    title: 'WhyUndefeated — The AI Moat & Threat Tracker',
    description:
      'Evidence-based index tracking why AI hasn’t replaced established tech platforms — and the community tools challenging them.',
    url: 'https://whyundefeated.com',
    siteName: 'WhyUndefeated',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhyUndefeated — The AI Moat & Threat Tracker',
    description:
      'Evidence-based index tracking why AI hasn’t replaced established tech platforms.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';

  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="app-root-body">
        {umamiWebsiteId && (
          <Script
            src={umamiScriptUrl}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
        <NavBar active="Home" />
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
        <VerifiedStackDock
          slots={SPONSOR_SLOTS}
          priceWeeklyUsd={SPONSOR_METRICS.priceWeeklyUsd}
        />
        <Analytics />
      </body>
    </html>
  );
}
