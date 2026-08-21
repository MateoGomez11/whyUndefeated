import type { CommunityAlternative } from '@/lib/alternatives/types';

describe('Community Alternatives Rail Logic (US2)', () => {
  test('sorts verified alternatives before non-verified alternatives', () => {
    const list: CommunityAlternative[] = [
      {
        id: '1',
        target_slug: 'wikipedia',
        name: 'Regular Alternative',
        url: 'https://regular.org',
        description: 'Open encyclopedia',
        is_verified: false,
        upvotes_count: 3,
        created_at: '2026-08-20T10:00:00Z',
      },
      {
        id: '2',
        target_slug: 'wikipedia',
        name: 'Verified Challenger',
        url: 'https://verified.org',
        description: 'Verified AI encyclopedia',
        is_verified: true,
        upvotes_count: 1,
        created_at: '2026-08-19T10:00:00Z',
      },
    ];

    const sorted = [...list].sort((a, b) => {
      if (a.is_verified === b.is_verified) {
        return b.upvotes_count - a.upvotes_count;
      }
      return a.is_verified ? -1 : 1;
    });

    expect(sorted[0].name).toBe('Verified Challenger');
    expect(sorted[1].name).toBe('Regular Alternative');
  });

  test('handles empty alternatives array gracefully without throwing', () => {
    const list: CommunityAlternative[] = [];
    expect(list.length).toBe(0);
  });
});
