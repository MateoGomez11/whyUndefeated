export type SponsorSlotStatus = 'TAKEN' | 'SPONSOR DECIDING' | 'OPEN';

export interface SponsorSlot {
  id: string;
  slotNumber: number;
  name: string;
  description?: string;
  takenUntil?: string;
  status: SponsorSlotStatus;
  url?: string;
  icon?: string;
}

export interface TelemetryEvent {
  id: string;
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  actionText: string;
  timeAgo: string;
  coordinates?: [number, number];
}

export interface CountryVisitorStat {
  countryCode: string;
  flagEmoji: string;
  count: number;
}

export interface SponsorBenefit {
  title: string;
  description: string;
}

export interface SponsorOverviewMetrics {
  monthlyViews: string;
  appsCount: number;
  audienceTag: string;
  slotsTakenText: string;
  monthName: string;
  priceWeeklyUsd: number;
}
