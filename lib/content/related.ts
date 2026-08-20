import type { Entry } from './schema';
import { sortEntries } from './sort';

/**
 * Other entries sharing the same category as `entry`, excluding itself, ordered
 * with the same criterion as the homepage (threat weight desc, appName asc).
 * Empty when the entry is the only one in its category (FR-020).
 */
export function relatedEntries(entry: Entry, all: readonly Entry[]): Entry[] {
  const sameCategory = all.filter((e) => e.category === entry.category && e.slug !== entry.slug);
  return sortEntries(sameCategory);
}
