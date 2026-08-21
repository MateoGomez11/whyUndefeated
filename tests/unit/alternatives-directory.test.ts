import type { CommunityAlternative } from '@/lib/alternatives/types';

describe('Global Alternatives Directory (US3)', () => {
  const sampleAlternatives: CommunityAlternative[] = [
    {
      id: '1',
      target_slug: 'wikipedia',
      name: 'Alpha Search',
      url: 'https://alpha.org',
      description: 'First AI search tool',
      is_verified: false,
      upvotes_count: 5,
      created_at: '2026-08-10T12:00:00Z',
    },
    {
      id: '2',
      target_slug: null,
      name: 'Independent Helper',
      url: 'https://helper.ai',
      description: 'General productivity tool',
      is_verified: true,
      upvotes_count: 10,
      created_at: '2026-08-11T12:00:00Z',
    },
    {
      id: '3',
      target_slug: 'reddit',
      name: 'Discourse AI',
      url: 'https://discourse.ai',
      description: 'Community AI forum',
      is_verified: false,
      upvotes_count: 25,
      created_at: '2026-08-12T12:00:00Z',
    },
  ];

  test('verified alternatives are prioritized at index 0', () => {
    const sorted = [...sampleAlternatives].sort((a, b) => {
      if (a.is_verified === b.is_verified) {
        return b.upvotes_count - a.upvotes_count;
      }
      return a.is_verified ? -1 : 1;
    });

    expect(sorted[0].name).toBe('Independent Helper');
    expect(sorted[0].is_verified).toBe(true);
  });

  test('non-verified alternatives are sorted by upvotes', () => {
    const nonVerified = sampleAlternatives.filter((a) => !a.is_verified);
    const sorted = [...nonVerified].sort((a, b) => b.upvotes_count - a.upvotes_count);

    expect(sorted[0].name).toBe('Discourse AI');
    expect(sorted[0].upvotes_count).toBe(25);
    expect(sorted[1].name).toBe('Alpha Search');
    expect(sorted[1].upvotes_count).toBe(5);
  });

  test('filters by target incumbent correctly', () => {
    const forWikipedia = sampleAlternatives.filter((a) => a.target_slug === 'wikipedia');
    expect(forWikipedia.length).toBe(1);
    expect(forWikipedia[0].name).toBe('Alpha Search');

    const generalTools = sampleAlternatives.filter((a) => !a.target_slug);
    expect(generalTools.length).toBe(1);
    expect(generalTools[0].name).toBe('Independent Helper');
  });
});
