'use client';

import { useState, useEffect } from 'react';
import { getOrCreateVoterId } from '@/lib/votes/voterId';

export function AlternativeVoteButton({
  alternativeId,
  initialUpvotes = 0,
}: {
  alternativeId: string;
  initialUpvotes?: number;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(`whyundefeated_alt_voted_${alternativeId}`);
        if (stored === 'true') {
          setHasVoted(true);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [alternativeId]);

  async function handleToggleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    let voterId = '';
    try {
      voterId = getOrCreateVoterId(window.localStorage);
    } catch {
      voterId = 'anonymous-voter';
    }

    const previousVoted = hasVoted;
    const previousUpvotes = upvotes;

    // Optimistic update
    const nextVoted = !previousVoted;
    const nextUpvotes = nextVoted ? previousUpvotes + 1 : Math.max(0, previousUpvotes - 1);

    setHasVoted(nextVoted);
    setUpvotes(nextUpvotes);
    setIsLoading(true);

    try {
      if (nextVoted) {
        window.localStorage.setItem(`whyundefeated_alt_voted_${alternativeId}`, 'true');
      } else {
        window.localStorage.removeItem(`whyundefeated_alt_voted_${alternativeId}`);
      }
    } catch {
      // Ignore storage error
    }

    try {
      const res = await fetch('/api/alternatives/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alternative_id: alternativeId, voter_id: voterId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Rollback
        setHasVoted(previousVoted);
        setUpvotes(previousUpvotes);
      } else {
        setUpvotes(data.upvotes);
        setHasVoted(data.voted);
      }
    } catch {
      // Rollback
      setHasVoted(previousVoted);
      setUpvotes(previousUpvotes);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggleVote}
      disabled={isLoading}
      title={hasVoted ? 'Remove your upvote' : 'Upvote this alternative'}
      aria-label={`${upvotes} upvotes. Click to ${hasVoted ? 'remove upvote' : 'upvote'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        background: hasVoted ? 'rgba(139, 92, 246, 0.25)' : 'var(--bg-2)',
        border: `1px solid ${hasVoted ? 'var(--brand-500)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-xs)',
        color: hasVoted ? 'var(--brand-400)' : 'var(--fg-secondary)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '11px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all var(--duration-fast)',
      }}
    >
      <span style={{ fontSize: '10px' }}>▲</span>
      <span>{upvotes}</span>
    </button>
  );
}
