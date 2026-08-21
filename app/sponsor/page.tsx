import type { Metadata } from 'next';
import { SponsorHero } from '@/components/sponsor/SponsorHero';
import { LiveTelemetryDashboard } from '@/components/sponsor/LiveTelemetryDashboard';
import { SponsorSlotsGrid } from '@/components/sponsor/SponsorSlotsGrid';
import { SponsorPricingSection } from '@/components/sponsor/SponsorPricingSection';
import { SponsorAudienceGuide } from '@/components/sponsor/SponsorAudienceGuide';
import { loadAllEntries } from '@/lib/content/loader';
import {
  SPONSOR_METRICS,
  SPONSOR_SLOTS,
  SPONSOR_BENEFITS,
  TELEMETRY_INITIAL_EVENTS,
  COUNTRY_VISITOR_STATS,
} from '@/lib/sponsor/data';

export const metadata: Metadata = {
  title: 'Sponsor whyundefeated — 10 Fixed Slots for Builders',
  description:
    'Ten fixed slots, read by builders deciding what to build and what to build on. Transparent metrics, cookieless telemetry, no rotating banners.',
};

export default function SponsorPage() {
  const realEntriesCount = loadAllEntries().length;
  const metrics = {
    ...SPONSOR_METRICS,
    appsCount: realEntriesCount,
  };

  return (
    <main className="page">
      <SponsorHero metrics={metrics} />

      <LiveTelemetryDashboard
        initialEvents={TELEMETRY_INITIAL_EVENTS}
        countryStats={COUNTRY_VISITOR_STATS}
      />

      <SponsorPricingSection
        priceWeeklyUsd={metrics.priceWeeklyUsd}
        benefits={SPONSOR_BENEFITS}
      />

      <SponsorAudienceGuide />

      <SponsorSlotsGrid
        slots={SPONSOR_SLOTS}
        priceWeeklyUsd={metrics.priceWeeklyUsd}
      />
    </main>
  );
}
