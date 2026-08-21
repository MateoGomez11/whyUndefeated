import type {
  SponsorSlot,
  TelemetryEvent,
  CountryVisitorStat,
  SponsorBenefit,
  SponsorOverviewMetrics,
} from './types';

export const SPONSOR_METRICS: SponsorOverviewMetrics = {
  monthlyViews: 'Live',
  appsCount: 7,
  audienceTag: 'builders',
  slotsTakenText: '5 Available',
  monthName: 'Weekly',
  priceWeeklyUsd: 49,
};

export const SPONSOR_SLOTS: SponsorSlot[] = [
  {
    id: 'S1',
    slotNumber: 1,
    name: 'Available Slot 01',
    description: 'Promote your developer or AI product here.',
    status: 'OPEN',
    icon: '⚡',
  },
  {
    id: 'S2',
    slotNumber: 2,
    name: 'Available Slot 02',
    description: 'High visibility across all directory pages.',
    status: 'OPEN',
    icon: '🛠️',
  },
  {
    id: 'S3',
    slotNumber: 3,
    name: 'Available Slot 03',
    description: 'Reach founders and software engineers daily.',
    status: 'OPEN',
    icon: '🚀',
  },
  {
    id: 'S4',
    slotNumber: 4,
    name: 'Available Slot 04',
    description: 'Lock in early rate for future traffic growth.',
    status: 'OPEN',
    icon: '🛡️',
  },
  {
    id: 'S5',
    slotNumber: 5,
    name: 'Available Slot 05',
    description: 'Direct outbound link to your tool or landing page.',
    status: 'OPEN',
    icon: '✨',
  },
];

export const SPONSOR_BENEFITS: SponsorBenefit[] = [
  {
    title: 'Fixed, Permanent Shelf Space',
    description:
      'Only 5 slots exist across the entire platform. No rotating ad networks, no algorithmic dilution, no banner blindness.',
  },
  {
    title: 'Weekly Flexibility & Low Risk',
    description:
      'Book week-by-week ($49/week) to promote product launches, updates, or test builder acquisition with zero long-term commitment.',
  },
  {
    title: 'Transparent Cookieless Analytics',
    description:
      'All traffic, active sessions, and referrers are open publicly via Umami Analytics. Real audience data, 100% verified.',
  },
];

export const TELEMETRY_INITIAL_EVENTS: TelemetryEvent[] = [];
export const COUNTRY_VISITOR_STATS: CountryVisitorStat[] = [];
