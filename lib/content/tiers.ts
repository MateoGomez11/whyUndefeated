import type { ThreatLevel } from './schema';

export interface Tier {
  level: ThreatLevel;
  label: string;
  /** Full one-line description of what this threat level means. */
  caption: string;
  /** Compact stand-in for `caption` at mobile widths (NFR-003) — used only by
   * TierStats; the methodology page always shows the full `caption`. */
  shortCaption: string;
  color: string;
  glow: string;
}

/**
 * Single source of truth for threat-tier copy (label/caption), shared by the
 * homepage legend (`components/TierStats.tsx`) and the methodology page
 * (`app/methodology/page.tsx`) — FR-002, spec.md 002-methodology-page
 * Clarifications. Never duplicate this text as an independent constant
 * elsewhere; both consumers MUST import this array.
 */
export const TIERS: Tier[] = [
  {
    level: 'high',
    label: 'High Threat',
    caption: 'Named challengers are actively eroding the moat',
    shortCaption: 'Eroding the moat',
    color: 'var(--threat-high)',
    glow: 'var(--threat-high-glow)',
  },
  {
    level: 'medium',
    label: 'Medium Threat',
    caption: 'Credible pressure exists, but the moat still holds',
    shortCaption: 'Moat still holds',
    color: 'var(--threat-medium)',
    glow: 'var(--threat-medium-glow)',
  },
  {
    level: 'low',
    label: 'Low Threat / Safe',
    caption: 'The moat is durable — no near-term path to replacement',
    shortCaption: 'Moat is durable',
    color: 'var(--threat-low)',
    glow: 'var(--threat-low-glow)',
  },
];
