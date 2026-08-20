import { relatedEntries } from '@/lib/content/related';
import type { Entry, Category, ThreatLevel } from '@/lib/content/schema';

function entry(slug: string, category: Category, threatLevel: ThreatLevel = 'medium'): Entry {
  return {
    slug,
    appName: slug,
    threatLevel,
    category,
    summary: 's',
    moat: 'm',
    moatSourceIds: ['s1'],
    challengers: [],
    sources: [{ id: 's1', label: 'l', url: 'https://example.com' }],
  };
}

describe('relatedEntries (FR-020, SC-009)', () => {
  it('returns other entries sharing the same category', () => {
    const social = entry('twitter-x', 'Social');
    const linkedin = entry('linkedin', 'Social');
    const pinterest = entry('pinterest', 'Content');
    const all = [social, linkedin, pinterest];

    expect(relatedEntries(social, all)).toEqual([linkedin]);
  });

  it('excludes the entry itself even when compared by slug/appName equality', () => {
    const a = entry('reddit', 'Community');
    const b = entry('goodreads', 'Community');
    const all = [a, b];

    const related = relatedEntries(a, all);
    expect(related.every((e) => e.slug !== a.slug)).toBe(true);
    expect(related).toEqual([b]);
  });

  it('omits the section (empty array) when the entry is the only one in its category', () => {
    const wikipedia = entry('wikipedia', 'Knowledge');
    const pinterest = entry('pinterest', 'Content');
    const all = [wikipedia, pinterest];

    expect(relatedEntries(wikipedia, all)).toEqual([]);
  });

  it('orders results using the same criterion as sort.ts (threat weight desc, then appName asc)', () => {
    const target = entry('a-target', 'Social', 'low');
    const low = entry('z-low', 'Social', 'low');
    const high = entry('m-high', 'Social', 'high');
    const medium = entry('b-medium', 'Social', 'medium');
    const all = [target, low, high, medium];

    expect(relatedEntries(target, all).map((e) => e.slug)).toEqual(['m-high', 'b-medium', 'z-low']);
  });

  it('returns an empty array when given an empty entry list', () => {
    const target = entry('solo', 'Social');
    expect(relatedEntries(target, [])).toEqual([]);
  });
});
