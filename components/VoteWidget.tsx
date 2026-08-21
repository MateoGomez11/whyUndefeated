'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import {
  getSupabaseClient,
  fetchVoteCounts,
  castVote,
  type VoteChoice,
  type VoteCounts,
} from '@/lib/votes/client';
import { getOrCreateVoterId } from '@/lib/votes/voterId';

export interface VoteWidgetProps {
  slug: string;
}

type WidgetStatus = 'loading' | 'ready' | 'voting' | 'unavailable';

export function VoteWidget({ slug }: VoteWidgetProps) {
  const [counts, setCounts] = useState<VoteCounts | null>(null);
  const [userChoice, setUserChoice] = useState<VoteChoice | null>(null);
  const [status, setStatus] = useState<WidgetStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        setStatus('unavailable');
        return;
      }

      const id = getOrCreateVoterId(window.localStorage);
      setVoterId(id);

      const storedChoice = window.localStorage.getItem(`whyundefeated_vote_${slug}`) as VoteChoice | null;
      if (storedChoice === 'agree' || storedChoice === 'disagree') {
        setUserChoice(storedChoice);
      }

      const client = getSupabaseClient();
      if (!client) {
        setStatus('unavailable');
        return;
      }

      fetchVoteCounts(client, slug).then((res) => {
        if (!isMounted) return;
        if (res === null) {
          setStatus('unavailable');
        } else {
          setCounts(res);
          setStatus('ready');
        }
      });
    } catch {
      if (isMounted) {
        setStatus('unavailable');
      }
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  async function handleVote(choice: VoteChoice) {
    if (status === 'voting' || status === 'unavailable' || !voterId) {
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setStatus('unavailable');
      return;
    }

    const prevCounts = counts ?? { agree: 0, disagree: 0 };
    const prevChoice = userChoice;

    if (prevChoice === choice) {
      return;
    }

    // Optimistic counter calculation
    const nextCounts: VoteCounts = { ...prevCounts };
    if (prevChoice === 'agree') {
      nextCounts.agree = Math.max(0, nextCounts.agree - 1);
    } else if (prevChoice === 'disagree') {
      nextCounts.disagree = Math.max(0, nextCounts.disagree - 1);
    }

    if (choice === 'agree') {
      nextCounts.agree += 1;
    } else if (choice === 'disagree') {
      nextCounts.disagree += 1;
    }

    setCounts(nextCounts);
    setUserChoice(choice);
    setStatus('voting');
    setErrorMessage(null);

    const success = await castVote(client, slug, voterId, choice);

    if (success) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`whyundefeated_vote_${slug}`, choice);
      }
      setStatus('ready');
    } else {
      // Rollback optimistic update
      setCounts(prevCounts);
      setUserChoice(prevChoice);
      setStatus('ready');
      setErrorMessage('Vote could not be recorded. Please try again.');
    }
  }

  if (status === 'unavailable') {
    return (
      <div
        role="region"
        aria-label="Community verdict reaction"
        style={{
          marginTop: 'var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--fg-tertiary)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono), monospace',
        }}
      >
        <span>Voting unavailable</span>
      </div>
    );
  }

  const agreeCount = counts?.agree ?? 0;
  const disagreeCount = counts?.disagree ?? 0;
  const isPending = status === 'loading' || status === 'voting';

  const baseButtonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: 'var(--radius-xs)',
    fontFamily: 'var(--font-mono), monospace',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    cursor: isPending ? 'not-allowed' : 'pointer',
    transition: 'all var(--duration-fast) var(--ease-standard)',
    background: 'var(--bg-1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    color: 'var(--fg-secondary)',
    opacity: isPending ? 0.7 : 1,
  };

  const activeAgreeStyle: CSSProperties = {
    ...baseButtonStyle,
    borderColor: 'var(--threat-low)',
    background: 'var(--threat-low-bg)',
    color: 'var(--threat-low)',
  };

  const activeDisagreeStyle: CSSProperties = {
    ...baseButtonStyle,
    borderColor: 'var(--threat-high)',
    background: 'var(--threat-high-bg)',
    color: 'var(--threat-high)',
  };

  return (
    <div
      role="region"
      aria-label="Community verdict reaction"
      style={{
        marginTop: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
          }}
        >
          React:
        </span>
        <button
          type="button"
          aria-pressed={userChoice === 'agree'}
          disabled={isPending}
          onClick={() => handleVote('agree')}
          style={userChoice === 'agree' ? activeAgreeStyle : baseButtonStyle}
        >
          <span>Agree</span>
          <span style={{ opacity: 0.85 }}>({agreeCount})</span>
        </button>
        <button
          type="button"
          aria-pressed={userChoice === 'disagree'}
          disabled={isPending}
          onClick={() => handleVote('disagree')}
          style={userChoice === 'disagree' ? activeDisagreeStyle : baseButtonStyle}
        >
          <span>Disagree</span>
          <span style={{ opacity: 0.85 }}>({disagreeCount})</span>
        </button>
      </div>
      {errorMessage && (
        <span
          role="alert"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--threat-high)',
            fontFamily: 'var(--font-mono), monospace',
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
