import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type VoteChoice = 'agree' | 'disagree';

export interface VoteCounts {
  agree: number;
  disagree: number;
}

let cachedClient: SupabaseClient | null = null;

/**
 * Creates or returns the cached Supabase client if environment variables are defined.
 * Returns null if NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.
 */
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

/**
 * Fetches the aggregated vote counts for a specific entry slug from the `vote_counts` view.
 * Returns { agree: number, disagree: number } on success, or null on error.
 */
export async function fetchVoteCounts(
  supabase: SupabaseClient,
  slug: string
): Promise<VoteCounts | null> {
  try {
    const { data, error } = await supabase
      .from('vote_counts')
      .select('choice, votes')
      .eq('entry_slug', slug);

    if (error || !data) {
      return null;
    }

    let agree = 0;
    let disagree = 0;

    for (const row of data as Array<{ choice: string; votes: number | string }>) {
      const count = typeof row.votes === 'number' ? row.votes : parseInt(String(row.votes), 10) || 0;
      if (row.choice === 'agree') {
        agree = count;
      } else if (row.choice === 'disagree') {
        disagree = count;
      }
    }

    return { agree, disagree };
  } catch {
    return null;
  }
}

/**
 * Casts or updates a visitor's vote for an entry using atomic upsert.
 * Returns true if successful, false otherwise.
 */
export async function castVote(
  supabase: SupabaseClient,
  slug: string,
  voterId: string,
  choice: VoteChoice
): Promise<boolean> {
  try {
    const { error } = await supabase.from('votes').upsert(
      {
        entry_slug: slug,
        voter_id: voterId,
        choice,
      },
      {
        onConflict: 'entry_slug,voter_id',
      }
    );

    return !error;
  } catch {
    return false;
  }
}
