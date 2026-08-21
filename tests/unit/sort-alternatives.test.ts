import { sortAlternatives, getTierScore } from '@/lib/alternatives/sort';
import type { CommunityAlternative } from '@/lib/alternatives/types';

describe('Tier Hierarchy & Alternative Sorting (US3)', () => {
  const goldPriorityZeroVotes: CommunityAlternative = {
    id: 'gold-1',
    target_slug: 'wikipedia',
    name: 'Gold Sponsor Tool',
    url: 'https://gold.com',
    description: 'Gold $29 Priority tool',
    verification_tier: 'priority',
    is_verified: true,
    upvotes_count: 0,
    created_at: '2026-08-20T12:00:00Z',
  };

  const purpleVerifiedManyVotes: CommunityAlternative = {
    id: 'purple-1',
    target_slug: 'wikipedia',
    name: 'Purple Verified Tool',
    url: 'https://purple.com',
    description: 'Purple $19 Verified tool with many votes',
    verification_tier: 'verified',
    is_verified: true,
    upvotes_count: 999,
    created_at: '2026-08-10T12:00:00Z',
  };

  const freePopularTool: CommunityAlternative = {
    id: 'free-1',
    target_slug: 'wikipedia',
    name: 'Free Popular Tool',
    url: 'https://free.com',
    description: 'Free tool with massive upvotes',
    verification_tier: 'none',
    is_verified: false,
    upvotes_count: 5000,
    created_at: '2026-08-01T12:00:00Z',
  };

  const freeNewTool: CommunityAlternative = {
    id: 'free-2',
    target_slug: 'wikipedia',
    name: 'Free New Tool',
    url: 'https://freenew.com',
    description: 'Free tool with 0 upvotes',
    verification_tier: 'none',
    is_verified: false,
    upvotes_count: 0,
    created_at: '2026-08-20T14:00:00Z',
  };

  test('priority gold tier has score 2, verified purple has 1, free has 0', () => {
    expect(getTierScore(goldPriorityZeroVotes)).toBe(2);
    expect(getTierScore(purpleVerifiedManyVotes)).toBe(1);
    expect(getTierScore(freePopularTool)).toBe(0);
  });

  test('gold priority tier ($29) ALWAYS ranks before purple verified ($19) even with 0 upvotes', () => {
    const list = [purpleVerifiedManyVotes, goldPriorityZeroVotes, freePopularTool];
    const sorted = sortAlternatives(list);

    expect(sorted[0].id).toBe('gold-1'); // Gold 1st
    expect(sorted[1].id).toBe('purple-1'); // Purple 2nd
    expect(sorted[2].id).toBe('free-1'); // Free 3rd
  });

  test('purple verified tier ($19) ALWAYS ranks before free unverified even with fewer upvotes', () => {
    const purpleZeroVotes: CommunityAlternative = {
      ...purpleVerifiedManyVotes,
      id: 'purple-0',
      upvotes_count: 0,
    };
    const list = [freePopularTool, purpleZeroVotes];
    const sorted = sortAlternatives(list);

    expect(sorted[0].id).toBe('purple-0');
    expect(sorted[1].id).toBe('free-1');
  });

  test('within same tier, items are sorted by upvotes DESC', () => {
    const list = [freeNewTool, freePopularTool];
    const sorted = sortAlternatives(list);

    expect(sorted[0].id).toBe('free-1'); // 5000 upvotes
    expect(sorted[1].id).toBe('free-2'); // 0 upvotes
  });
});
