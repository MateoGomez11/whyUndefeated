import { fetchVoteCounts, castVote } from '@/lib/votes/client';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('fetchVoteCounts', () => {
  it('returns aggregated counts when rows exist for both options', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [
              { choice: 'agree', votes: 12 },
              { choice: 'disagree', votes: 4 },
            ],
            error: null,
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchVoteCounts(mockSupabase, 'pinterest');

    expect(mockSupabase.from).toHaveBeenCalledWith('vote_counts');
    expect(result).toEqual({ agree: 12, disagree: 4 });
  });

  it('treats missing choice rows as 0 votes', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [{ choice: 'agree', votes: 5 }],
            error: null,
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchVoteCounts(mockSupabase, 'twitter-x');

    expect(result).toEqual({ agree: 5, disagree: 0 });
  });

  it('returns { agree: 0, disagree: 0 } when no rows exist (empty array)', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchVoteCounts(mockSupabase, 'reddit');

    expect(result).toEqual({ agree: 0, disagree: 0 });
  });

  it('returns null on database query error', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection timeout', code: '500' },
          }),
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchVoteCounts(mockSupabase, 'pinterest');

    expect(result).toBeNull();
  });

  it('returns null on unhandled thrown exception', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockRejectedValue(new Error('Network error')),
        }),
      }),
    } as unknown as SupabaseClient;

    const result = await fetchVoteCounts(mockSupabase, 'pinterest');

    expect(result).toBeNull();
  });
});

describe('castVote', () => {
  it('calls upsert on votes table with correct payload and onConflict key and returns true', async () => {
    const upsertMock = jest.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        upsert: upsertMock,
      }),
    } as unknown as SupabaseClient;

    const success = await castVote(
      mockSupabase,
      'pinterest',
      '123e4567-e89b-12d3-a456-426614174000',
      'agree'
    );

    expect(mockSupabase.from).toHaveBeenCalledWith('votes');
    expect(upsertMock).toHaveBeenCalledWith(
      {
        entry_slug: 'pinterest',
        voter_id: '123e4567-e89b-12d3-a456-426614174000',
        choice: 'agree',
      },
      { onConflict: 'entry_slug,voter_id' }
    );
    expect(success).toBe(true);
  });

  it('returns false when upsert returns an error', async () => {
    const upsertMock = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'RLS policy violation' },
    });

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        upsert: upsertMock,
      }),
    } as unknown as SupabaseClient;

    const success = await castVote(
      mockSupabase,
      'pinterest',
      '123e4567-e89b-12d3-a456-426614174000',
      'disagree'
    );

    expect(success).toBe(false);
  });

  it('returns false when upsert throws an exception', async () => {
    const upsertMock = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        upsert: upsertMock,
      }),
    } as unknown as SupabaseClient;

    const success = await castVote(
      mockSupabase,
      'pinterest',
      '123e4567-e89b-12d3-a456-426614174000',
      'agree'
    );

    expect(success).toBe(false);
  });
});
