import type { CSSProperties } from 'react';
import type { SponsorSlot } from '@/lib/sponsor/types';

export function SponsorSlotsGrid({
  slots,
  priceWeeklyUsd = 49,
}: {
  slots: SponsorSlot[];
  priceWeeklyUsd?: number;
}) {
  return (
    <section style={{ margin: 'var(--space-10) 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--fg-primary)',
            margin: 0,
          }}
        >
          The slots
        </h2>
        <div
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-secondary)',
          }}
        >
          ${priceWeeklyUsd} flat / week · your rate is locked while you stay
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {slots.map((slot) => {
          const isTaken = slot.status === 'TAKEN';
          const isDeciding = slot.status === 'SPONSOR DECIDING';
          const isOpen = slot.status === 'OPEN';

          const href = isTaken && slot.url
            ? slot.url
            : `mailto:sponsors@whyundefeated.com?subject=Sponsor%20Slot%20Inquiry%20-%20Slot%20${slot.id}`;

          const target = isTaken ? '_blank' : undefined;
          const rel = isTaken ? 'noopener noreferrer' : undefined;

          let badgeColor = 'var(--brand-400)';
          let badgeText = 'AVAILABLE · OPEN';

          if (isTaken) {
            badgeColor = 'var(--threat-low)';
            badgeText = 'CURRENTLY TAKEN';
          } else if (isDeciding) {
            badgeColor = 'var(--threat-medium)';
            badgeText = 'DECIDING';
          }

          const cardStyle: CSSProperties = {
            display: 'block',
            padding: 'var(--space-5)',
            background: 'var(--bg-1)',
            borderWidth: '1px',
            borderStyle: isOpen ? 'dashed' : 'solid',
            borderColor: isOpen ? 'var(--border-default)' : 'var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            transition:
              'border-color var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)',
            textDecoration: 'none',
          };

          return (
            <a
              key={slot.id}
              href={href}
              target={target}
              rel={rel}
              style={cardStyle}
              className="entry-card"
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-label)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                SLOT {slot.id} · FEATURED SHELF
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-sans), sans-serif',
                  fontSize: 'var(--text-h3)',
                  fontWeight: 700,
                  color: isOpen ? 'var(--fg-secondary)' : 'var(--fg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '4px',
                }}
              >
                {slot.icon && <span>{slot.icon}</span>}
                <span>{slot.name}</span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg-tertiary)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                {slot.description || (isOpen ? 'Open for immediate booking' : 'Active sponsorship')}
              </div>

              <div
                style={{
                  borderTop: '1px dashed var(--border-default)',
                  paddingTop: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    letterSpacing: 'var(--tracking-label)',
                    color: badgeColor,
                    textTransform: 'uppercase',
                  }}
                >
                  {badgeText}
                </span>

                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--brand-400)',
                    fontWeight: 600,
                  }}
                >
                  {isTaken ? 'visit ↗' : 'claim slot →'}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
