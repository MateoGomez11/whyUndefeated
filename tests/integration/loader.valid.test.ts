import { loadAllEntries } from '@/lib/content/loader';
import { CATEGORIES, THREAT_LEVELS } from '@/lib/content/schema';

const EXPECTED_SLUGS = [
  'goodreads',
  'linkedin',
  'pinterest',
  'reddit',
  'tiktok',
  'twitter-x',
  'wikipedia',
];

describe('loadAllEntries over the real seed content (FR-012, SC-009)', () => {
  const entries = loadAllEntries();

  it('loads exactly the 7 seed entries', () => {
    const slugs = entries.map((e) => e.slug).sort();
    expect(slugs).toEqual(EXPECTED_SLUGS);
  });

  it('gives every entry a valid category and threat level', () => {
    for (const entry of entries) {
      expect(CATEGORIES).toContain(entry.category);
      expect(THREAT_LEVELS).toContain(entry.threatLevel);
    }
  });

  it('returns entries ordered by threat level high -> low', () => {
    const weight = { high: 3, medium: 2, low: 1 } as const;
    const weights = entries.map((e) => weight[e.threatLevel]);
    const sorted = [...weights].sort((a, b) => b - a);
    expect(weights).toEqual(sorted);
  });

  it('ensures every challenger and moat citation references an existing source', () => {
    for (const entry of entries) {
      const ids = new Set(entry.sources.map((s) => s.id));
      for (const c of entry.challengers) expect(ids.has(c.sourceId)).toBe(true);
      for (const id of entry.moatSourceIds) expect(ids.has(id)).toBe(true);
    }
  });
});
