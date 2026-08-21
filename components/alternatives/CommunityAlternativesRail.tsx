'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CommunityAlternative } from '@/lib/alternatives/types';
import { AlternativeVoteButton } from './AlternativeVoteButton';
import { sortAlternatives } from '@/lib/alternatives/sort';
import { fetchAlternativesForSlug } from '@/lib/alternatives/client';

export function CommunityAlternativesRail({
  targetSlug,
  targetAppName,
  alternatives: initialAlternatives = [],
}: {
  targetSlug: string;
  targetAppName: string;
  alternatives: CommunityAlternative[];
}) {
  const [altList, setAltList] = useState<CommunityAlternative[]>(initialAlternatives);

  useEffect(() => {
    fetchAlternativesForSlug(targetSlug).then((data) => {
      if (data) setAltList(data);
    });
  }, [targetSlug]);

  const sortedAlternatives = sortAlternatives(altList);
  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        background: 'var(--bg-1)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-xs)',
        padding: 'var(--space-6)',
      }}
      aria-label={`Community alternatives to ${targetAppName}`}
    >
      {/* Header */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '4px',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-body-lg)',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              margin: 0,
            }}
          >
            Community Alternatives
          </h3>
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              color: 'var(--brand-400)',
              fontWeight: 700,
              padding: '2px 6px',
              background: 'rgba(139, 92, 246, 0.15)',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            {altList.length}
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-tertiary)',
            margin: 0,
          }}
        >
          Tools & challengers built to compete with {targetAppName}
        </p>
      </div>

      {/* Alternatives List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {sortedAlternatives.length > 0 ? (
          sortedAlternatives.map((alt) => {
            const isPriority = alt.verification_tier === 'priority';
            const isVerified = alt.verification_tier === 'verified' || (alt.is_verified && !isPriority);

            return (
              <div
                key={alt.id}
                style={{
                  display: 'block',
                  padding: 'var(--space-3) var(--space-4)',
                  background: isPriority
                    ? 'rgba(245, 158, 11, 0.08)'
                    : isVerified
                    ? 'rgba(139, 92, 246, 0.08)'
                    : 'var(--bg-2)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isPriority
                    ? 'var(--threat-medium)'
                    : isVerified
                    ? 'var(--brand-500)'
                    : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                }}
                className="alternative-item"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    marginBottom: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    {alt.icon && (alt.icon.startsWith('data:image/') || alt.icon.startsWith('http')) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={alt.icon}
                        alt=""
                        style={{ width: 18, height: 18, borderRadius: 3, objectFit: 'contain', flexShrink: 0 }}
                      />
                    ) : (
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{alt.icon || '⚡'}</span>
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--font-sans), sans-serif',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: 'var(--fg-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {alt.name}
                    </span>
                  </div>

                  {isPriority ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#ffffff',
                        background: 'var(--threat-medium)',
                        padding: '1px 5px',
                        borderRadius: 'var(--radius-xs)',
                        textTransform: 'uppercase',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(245, 158, 11, 0.4)',
                      }}
                    >
                      PRIORITY #1
                    </span>
                  ) : isVerified ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: 'var(--brand-400)',
                        background: 'rgba(139, 92, 246, 0.2)',
                        padding: '1px 5px',
                        borderRadius: 'var(--radius-xs)',
                        textTransform: 'uppercase',
                        flexShrink: 0,
                      }}
                    >
                      VERIFIED
                    </span>
                  ) : null}
                </div>

              <p
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '11px',
                  color: 'var(--fg-secondary)',
                  lineHeight: 1.4,
                  margin: '4px 0 8px 0',
                }}
              >
                {alt.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '6px',
                }}
              >
                <AlternativeVoteButton
                  alternativeId={alt.id}
                  initialUpvotes={alt.upvotes_count || 0}
                />

                <a
                  href={alt.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '11px',
                    color: 'var(--brand-400)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  visit ↗
                </a>
              </div>
            </div>
          );
        })
        ) : (
          <div
            style={{
              padding: 'var(--space-4)',
              background: 'var(--bg-2)',
              borderWidth: '1px',
              borderStyle: 'dashed',
              borderColor: 'var(--border-default)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-tertiary)',
                margin: '0 0 var(--space-3) 0',
              }}
            >
              No community alternatives approved yet for {targetAppName}.
            </p>
            <Link
              href={`/submit?target=${targetSlug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                background: 'var(--brand-500)',
                color: '#ffffff',
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              + Submit the first alternative
            </Link>
          </div>
        )}
      </div>

      {/* CTA Button */}
      {altList.length > 0 && (
        <Link
          href={`/submit?target=${targetSlug}`}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '8px 12px',
            background: 'transparent',
            border: '1px dashed var(--brand-500)',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--brand-400)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'none',
            marginTop: 'var(--space-2)',
          }}
        >
          + Submit an alternative to {targetAppName}
        </Link>
      )}
    </aside>
  );
}
