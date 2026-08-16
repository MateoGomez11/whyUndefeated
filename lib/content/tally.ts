import type { Entry, ThreatLevel } from './schema';

export type ThreatCounts = Record<ThreatLevel, number>;

/**
 * Count entries per threat level, derived from real data at build time
 * (never hardcoded) — feeds the homepage tier stat blocks (FR-003).
 */
export function computeThreatCounts(entries: readonly Entry[]): ThreatCounts {
  return {
    high: entries.filter((e) => e.threatLevel === 'high').length,
    medium: entries.filter((e) => e.threatLevel === 'medium').length,
    low: entries.filter((e) => e.threatLevel === 'low').length,
  };
}

export interface Tally {
  /** Number of apps/platforms tracked. */
  totalApps: number;
  /** Total documented source citations = sum of sources across all entries. */
  totalCitations: number;
  /** Community votes cast — always 0 until the voting feature exists (FR-021). */
  totalVotes: number;
}

/**
 * Compute the homepage aggregate counter directly from entry data. Every value
 * is derived — never an invented, editorial, or composite score (FR-021, SC-008).
 */
export function computeTally(entries: readonly Entry[]): Tally {
  return {
    totalApps: entries.length,
    totalCitations: entries.reduce((sum, e) => sum + e.sources.length, 0),
    totalVotes: 0,
  };
}
