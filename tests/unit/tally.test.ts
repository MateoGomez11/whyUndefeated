import { computeTally, computeThreatCounts } from '@/lib/content/tally';
import type { Entry, ThreatLevel } from '@/lib/content/schema';

function entry(slug: string, sourceCount: number, threatLevel: ThreatLevel = 'medium'): Entry {
  return {
    slug,
    appName: slug,
    threatLevel,
    category: 'Social',
    summary: 's',
    moat: 'm',
    moatSourceIds: ['s1'],
    challengers: [],
    sources: Array.from({ length: sourceCount }, (_, i) => ({
      id: `s${i + 1}`,
      label: `l${i + 1}`,
      url: 'https://example.com',
    })),
  };
}

describe('computeTally (FR-021, SC-008)', () => {
  it('totalApps equals the number of entries', () => {
    const tally = computeTally([entry('a', 1), entry('b', 2), entry('c', 3)]);
    expect(tally.totalApps).toBe(3);
  });

  it('totalCitations equals the sum of sources across all entries', () => {
    const tally = computeTally([entry('a', 1), entry('b', 2), entry('c', 3)]);
    expect(tally.totalCitations).toBe(6);
  });

  it('totalVotes is 0 until the voting feature exists', () => {
    const tally = computeTally([entry('a', 1)]);
    expect(tally.totalVotes).toBe(0);
  });

  it('handles an empty set as all zeros', () => {
    const tally = computeTally([]);
    expect(tally).toEqual({ totalApps: 0, totalCitations: 0, totalVotes: 0 });
  });
});

describe('computeThreatCounts (FR-003)', () => {
  it('counts entries per threat level', () => {
    const counts = computeThreatCounts([
      entry('a', 1, 'high'),
      entry('b', 1, 'high'),
      entry('c', 1, 'medium'),
      entry('d', 1, 'low'),
    ]);
    expect(counts).toEqual({ high: 2, medium: 1, low: 1 });
  });

  it('returns zeros for an empty set', () => {
    expect(computeThreatCounts([])).toEqual({ high: 0, medium: 0, low: 0 });
  });
});
