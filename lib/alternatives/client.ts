import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  CommunityAlternative,
  SubmissionPayload,
  SubmissionResult,
  AlternativeVoteResult,
} from './types';
import { validateSubmission } from './validation';
import { evaluateSubmissionSafety } from './safety';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.trim() === '' || supabaseAnonKey.trim() === '') {
    return null;
  }

  cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

import { sortAlternatives } from './sort';

/**
 * Fetches approved alternatives for a specific incumbent slug (e.g. 'wikipedia').
 * Sorted by: Priority (Gold $29) > Verified (Purple $19) > Free, then upvotes DESC.
 */
export async function fetchAlternativesForSlug(
  targetSlug: string,
): Promise<CommunityAlternative[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('community_alternatives')
      .select(
        'id, target_slug, name, url, icon, description, verification_tier, is_verified, upvotes_count, created_at',
      )
      .eq('target_slug', targetSlug)
      .eq('status', 'approved');

    if (error || !data) {
      return [];
    }

    return sortAlternatives(data as CommunityAlternative[]);
  } catch {
    return [];
  }
}

/**
 * Fetches all approved alternatives across the entire directory for `/alternatives`.
 * Sorted by: Priority (Gold $29) > Verified (Purple $19) > Free, then upvotes DESC.
 */
export async function fetchAllAlternatives(): Promise<CommunityAlternative[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase
      .from('community_alternatives')
      .select(
        'id, target_slug, name, url, icon, description, verification_tier, is_verified, upvotes_count, created_at',
      )
      .eq('status', 'approved');

    if (error || !data) {
      return [];
    }

    return sortAlternatives(data as CommunityAlternative[]);
  } catch {
    return [];
  }
}

/**
 * Submits a new community alternative.
 * Runs automated safety checks and immediately approves & publishes if safe.
 */
export async function submitAlternative(
  rawPayload: Partial<SubmissionPayload>,
): Promise<SubmissionResult> {
  const validation = validateSubmission(rawPayload);
  if (!validation.isValid || !validation.sanitized) {
    return {
      success: false,
      message: 'Validation failed. Please review the form fields.',
      errors: validation.errors,
    };
  }

  // Run automated safety verification
  const safety = evaluateSubmissionSafety({
    name: validation.sanitized.name,
    url: validation.sanitized.url,
    description: validation.sanitized.description,
    creator_email: validation.sanitized.creator_email,
  });

  if (!safety.isSafe) {
    return {
      success: false,
      message: safety.reason || 'Submission did not pass automated safety checks.',
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: 'Submission service is temporarily offline. Please try again later.',
    };
  }

  const generatedId = crypto.randomUUID();
  const tier = validation.sanitized.verification_tier || 'none';
  const isVerified = tier === 'verified' || tier === 'priority';

  try {
    const { error } = await supabase
      .from('community_alternatives')
      .insert({
        id: generatedId,
        target_slug: validation.sanitized.target_slug,
        name: validation.sanitized.name,
        url: validation.sanitized.url,
        icon: validation.sanitized.icon,
        description: validation.sanitized.description,
        creator_email: validation.sanitized.creator_email,
        verification_tier: tier,
        status: 'approved', // Auto-approved upon passing automated safety filter
        is_verified: isVerified,
        upvotes_count: 0,
      });

    if (error) {
      console.error('Supabase alternative insert error:', error);
      return {
        success: false,
        message: error.message || 'Could not save alternative.',
      };
    }

    return {
      success: true,
      message: 'Alternative verified and published live immediately!',
      id: generatedId,
    };
  } catch (err: unknown) {
    console.error('Submit alternative exception:', err);
    return {
      success: false,
      message: 'An unexpected error occurred while saving your submission.',
    };
  }
}

/**
 * Toggles an upvote on an approved alternative.
 * Uses atomic RPC function in PostgreSQL.
 */
export async function toggleAlternativeVote(
  alternativeId: string,
  voterId: string,
): Promise<AlternativeVoteResult> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, voted: false, upvotes: 0, message: 'Database not available' };
    }

    const { data, error } = await supabase.rpc('toggle_alternative_vote', {
      alt_id: alternativeId,
      v_id: voterId,
    });

    if (error || !data) {
      return { success: false, voted: false, upvotes: 0, message: error?.message || 'Vote failed' };
    }

    return {
      success: true,
      voted: Boolean(data.voted),
      upvotes: Number(data.upvotes) || 0,
    };
  } catch {
    return { success: false, voted: false, upvotes: 0, message: 'Network exception' };
  }
}
