import { sortEntries, threatWeight } from '@/lib/content/sort';
import type { Entry } from '@/lib/content/schema';

function entry(slug: string, appName: string, threatLevel: Entry['threatLevel']): Entry {
  return {
    slug,
    appName,
    threatLevel,
    category: 'Social',
    summary: 's',
    moat: 'm',
    moatSourceIds: ['s1'],
    challengers: [],
    sources: [{ id: 's1', label: 'l', url: 'https://example.com' }],
  };
}

describe('threatWeight', () => {
  it('ranks high > medium > low', () => {
    expect(threatWeight('high')).toBeGreaterThan(threatWeight('medium'));
    expect(threatWeight('medium')).toBeGreaterThan(threatWeight('low'));
  });
});

describe('sortEntries', () => {
  it('orders by threat level high -> low (FR-002)', () => {
    const sorted = sortEntries([
      entry('a', 'A', 'low'),
      entry('b', 'B', 'high'),
      entry('c', 'C', 'medium'),
    ]);
    expect(sorted.map((e) => e.threatLevel)).toEqual(['high', 'medium', 'low']);
  });

  it('breaks ties alphabetically by appName (ascending)', () => {
    const sorted = sortEntries([
      entry('zeta', 'Zeta', 'high'),
      entry('alpha', 'Alpha', 'high'),
      entry('mid', 'Mid', 'high'),
    ]);
    expect(sorted.map((e) => e.appName)).toEqual(['Alpha', 'Mid', 'Zeta']);
  });

  it('does not mutate the input array', () => {
    const input = [entry('a', 'A', 'low'), entry('b', 'B', 'high')];
    const copy = [...input];
    sortEntries(input);
    expect(input).toEqual(copy);
  });
});
