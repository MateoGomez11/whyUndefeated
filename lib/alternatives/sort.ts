import type { CommunityAlternative } from './types';

/**
 * Calculates numeric score for tier ranking:
 * 2: Priority Boost ($29 USD Dorado)
 * 1: Verified Badge ($19 USD Morado)
 * 0: Free / Unverified ($0 Normal)
 */
export function getTierScore(alt: CommunityAlternative): number {
  if (alt.verification_tier === 'priority') return 2;
  if (alt.verification_tier === 'verified' || alt.is_verified) return 1;
  return 0;
}

/**
 * Strict hierarchy sorting for alternatives:
 * 1. Tier: Priority (Dorado $29) > Verified (Morado $19) > Free / Unverified ($0)
 * 2. Community Upvotes: upvotes_count DESC (within same tier)
 * 3. Age / Date: created_at ASC (older submissions break tie)
 */
export function sortAlternatives(items: CommunityAlternative[]): CommunityAlternative[] {
  return [...items].sort((a, b) => {
    const scoreA = getTierScore(a);
    const scoreB = getTierScore(b);

    // 1. Tier takes absolute precedence
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // 2. Upvotes within the same tier
    const upvotesA = a.upvotes_count || 0;
    const upvotesB = b.upvotes_count || 0;
    if (upvotesA !== upvotesB) {
      return upvotesB - upvotesA;
    }

    // 3. Older submissions break ties
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}
