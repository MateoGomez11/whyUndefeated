'use client';

import Link from 'next/link';
import type { SponsorSlot } from '@/lib/sponsor/types';

export function VerifiedStackDock({
  slots,
  priceWeeklyUsd = 49,
}: {
  slots: SponsorSlot[];
  priceWeeklyUsd?: number;
}) {
  return (
    <aside
      className="verified-stack-dock"
      aria-label="The Verified Stack — 5 Fixed Sponsor Slots"
    >
      <div className="verified-stack-inner">
        {/* Dock Header */}
        <div className="verified-stack-header">
          <div className="verified-stack-title-group">
            <span className="verified-stack-pulse-dot" />
            <span className="verified-stack-title-main">THE STACK</span>
            <span className="verified-stack-title-separator">·</span>
            <span className="verified-stack-title-sub">5 FEATURED BUILDER TOOLS &amp; SPONSORS</span>
            <span className="verified-stack-title-sub-mobile">(5 SPONSORS)</span>
          </div>

          <Link href="/sponsor" className="verified-stack-sponsor-link">
            BECOME A SPONSOR &rarr;
          </Link>
        </div>

        {/* 5 Rich Sponsor Cards + Seamless Mobile Clones */}
        <div className="verified-stack-marquee-wrapper">
          <div className="verified-stack-grid">
            {/* Primary 5 Cards */}
            {slots.map((slot, idx) => {
              const isTaken = slot.status === 'TAKEN';
              const href = isTaken && slot.url ? slot.url : `/sponsor`;
              const target = isTaken ? '_blank' : undefined;
              const rel = isTaken ? 'noopener noreferrer' : undefined;
              const slotNum = String(idx + 1).padStart(2, '0');

              return (
                <a
                  key={slot.id}
                  href={href}
                  target={target}
                  rel={rel}
                  className={`stack-card ${isTaken ? 'stack-card-taken' : 'stack-card-open'}`}
                >
                  {/* Top: Icon + Title */}
                  <div className="stack-card-top">
                    <div className="stack-card-name-row">
                      <span className="stack-card-icon">{slot.icon || '⚡'}</span>
                      <span className="stack-card-name">{slot.name}</span>
                    </div>

                    {/* Description */}
                    <p className="stack-card-desc">
                      {slot.description || 'Promote your developer product here.'}
                    </p>
                  </div>

                  {/* Bottom: Purple Claim Button / Visit Link */}
                  <div className="stack-card-bottom">
                    <span className="stack-card-slot-num">SLOT {slotNum}</span>
                    <span className="stack-card-badge">
                      {isTaken ? 'Visit ↗' : `Claim · $${priceWeeklyUsd}/wk`}
                    </span>
                  </div>
                </a>
              );
            })}

            {/* Seamless Duplicate Clones for Continuous Mobile Infinite Scroll */}
            {slots.map((slot, idx) => {
              const isTaken = slot.status === 'TAKEN';
              const href = isTaken && slot.url ? slot.url : `/sponsor`;
              const target = isTaken ? '_blank' : undefined;
              const rel = isTaken ? 'noopener noreferrer' : undefined;
              const slotNum = String(idx + 1).padStart(2, '0');

              return (
                <a
                  key={`clone-${slot.id}`}
                  href={href}
                  target={target}
                  rel={rel}
                  aria-hidden="true"
                  tabIndex={-1}
                  className={`stack-card-clone ${isTaken ? 'stack-card-taken' : 'stack-card-open'}`}
                >
                  {/* Top: Icon + Title */}
                  <div className="stack-card-top">
                    <div className="stack-card-name-row">
                      <span className="stack-card-icon">{slot.icon || '⚡'}</span>
                      <span className="stack-card-name">{slot.name}</span>
                    </div>

                    {/* Description */}
                    <p className="stack-card-desc">
                      {slot.description || 'Promote your developer product here.'}
                    </p>
                  </div>

                  {/* Bottom: Purple Claim Button / Visit Link */}
                  <div className="stack-card-bottom">
                    <span className="stack-card-slot-num">SLOT {slotNum}</span>
                    <span className="stack-card-badge">
                      {isTaken ? 'Visit ↗' : `Claim · $${priceWeeklyUsd}/wk`}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

