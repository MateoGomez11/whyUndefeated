import type { Entry, ThreatLevel } from './schema';

const WEIGHT: Record<ThreatLevel, number> = { high: 3, medium: 2, low: 1 };

/** Numeric weight for a threat level so high > medium > low (FR-002). */
export function threatWeight(level: ThreatLevel): number {
  return WEIGHT[level];
}

/**
 * Alternate entries between high, medium, and low threat levels in round-robin fashion,
 * sorting alphabetically within each tier to ensure deterministic output.
 * Pure; does not mutate the input.
 */
export function sortEntries(entries: readonly Entry[]): Entry[] {
  const highs = entries
    .filter((e) => e.threatLevel === 'high')
    .sort((a, b) => a.appName.localeCompare(b.appName));
  const mediums = entries
    .filter((e) => e.threatLevel === 'medium')
    .sort((a, b) => a.appName.localeCompare(b.appName));
  const lows = entries
    .filter((e) => e.threatLevel === 'low')
    .sort((a, b) => a.appName.localeCompare(b.appName));

  const result: Entry[] = [];
  const maxLen = Math.max(highs.length, mediums.length, lows.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < highs.length) result.push(highs[i]);
    if (i < mediums.length) result.push(mediums[i]);
    if (i < lows.length) result.push(lows[i]);
  }

  return result;
}

