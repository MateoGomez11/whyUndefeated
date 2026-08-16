import type { Entry, ThreatLevel } from './schema';

const WEIGHT: Record<ThreatLevel, number> = { high: 3, medium: 2, low: 1 };

/** Numeric weight for a threat level so high > medium > low (FR-002). */
export function threatWeight(level: ThreatLevel): number {
  return WEIGHT[level];
}

/**
 * Order entries by threat level descending (high -> low), breaking ties
 * alphabetically by appName ascending. Pure; does not mutate the input.
 */
export function sortEntries(entries: readonly Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const byWeight = threatWeight(b.threatLevel) - threatWeight(a.threatLevel);
    if (byWeight !== 0) return byWeight;
    return a.appName.localeCompare(b.appName);
  });
}
