import type { CommunityAlternative } from '@/lib/alternatives/types';
import { AlternativeVoteButton } from './AlternativeVoteButton';

export function AlternativeCard({ alternative }: { alternative: CommunityAlternative }) {
  const targetLabel = alternative.target_slug
    ? `Alternative to ${alternative.target_slug}`
    : 'Community Tool';

  const isPriority = alternative.verification_tier === 'priority';
  const isVerified = alternative.verification_tier === 'verified' || (alternative.is_verified && !isPriority);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--space-5)',
        background: isPriority
          ? 'rgba(245, 158, 11, 0.08)'
          : isVerified
          ? 'rgba(139, 92, 246, 0.08)'
          : 'var(--bg-1)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isPriority
          ? 'var(--threat-medium)'
          : isVerified
          ? 'var(--brand-500)'
          : 'var(--border-default)',
        borderRadius: 'var(--radius-xs)',
        minHeight: '170px',
        position: 'relative',
        boxShadow: isPriority
          ? '0 4px 20px rgba(245, 158, 11, 0.15)'
          : isVerified
          ? '0 4px 20px rgba(139, 92, 246, 0.15)'
          : 'none',
      }}
      className="alternative-card"
    >
      <div>
        {/* Top bar: Target Badge + Verified / Priority Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: 'var(--space-3)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              color: 'var(--brand-400)',
              background: 'var(--bg-2)',
              padding: '2px 8px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-label)',
            }}
          >
            {targetLabel}
          </span>

          {isPriority ? (
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                fontWeight: 700,
                color: '#ffffff',
                background: 'var(--threat-medium)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
              }}
            >
              🚀 PRIORITY #1
            </span>
          ) : isVerified ? (
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                fontWeight: 700,
                color: '#ffffff',
                background: 'var(--brand-500)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-xs)',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(139, 92, 246, 0.4)',
              }}
            >
              ⚡ VERIFIED
            </span>
          ) : null}
        </div>

        {/* Title + Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '6px',
          }}
        >
          {alternative.icon && (alternative.icon.startsWith('data:image/') || alternative.icon.startsWith('http')) ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={alternative.icon}
              alt=""
              style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'contain', flexShrink: 0 }}
            />
          ) : (
            <span style={{ fontSize: '18px', flexShrink: 0 }}>{alternative.icon || '⚡'}</span>
          )}
          <h3
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-h3)',
              fontWeight: 700,
              color: 'var(--fg-primary)',
              margin: 0,
            }}
          >
            {alternative.name}
          </h3>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-secondary)',
            lineHeight: 1.5,
            margin: '0 0 var(--space-4) 0',
          }}
        >
          {alternative.description}
        </p>
      </div>

      {/* Bottom Bar: Upvote Button + Outbound link */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 'var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AlternativeVoteButton
          alternativeId={alternative.id}
          initialUpvotes={alternative.upvotes_count || 0}
        />

        <a
          href={alternative.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-xs)',
            color: 'var(--brand-400)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          visit project ↗
        </a>
      </div>
    </div>
  );
}
