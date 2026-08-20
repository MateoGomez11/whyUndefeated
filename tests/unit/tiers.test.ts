import { TIERS } from '@/lib/content/tiers';
import { THREAT_LEVELS } from '@/lib/content/schema';

describe('TIERS (shared source of truth for tier copy, FR-002)', () => {
  it('exports exactly 3 tiers, one per ThreatLevel', () => {
    expect(TIERS).toHaveLength(3);
    expect(TIERS.map((t) => t.level).sort()).toEqual([...THREAT_LEVELS].sort());
  });

  it('orders tiers high -> low, matching the home/legend display order', () => {
    expect(TIERS.map((t) => t.level)).toEqual(['high', 'medium', 'low']);
  });

  it('every tier has a non-empty label, caption, shortCaption, color, and glow', () => {
    for (const tier of TIERS) {
      expect(tier.label.length).toBeGreaterThan(0);
      expect(tier.caption.length).toBeGreaterThan(0);
      expect(tier.shortCaption.length).toBeGreaterThan(0);
      expect(tier.color.length).toBeGreaterThan(0);
      expect(tier.glow.length).toBeGreaterThan(0);
    }
  });

  it('uses the exact existing copy (no wording drift) for labels and captions', () => {
    const high = TIERS.find((t) => t.level === 'high')!;
    const medium = TIERS.find((t) => t.level === 'medium')!;
    const low = TIERS.find((t) => t.level === 'low')!;

    expect(high.label).toBe('High Threat');
    expect(high.caption).toBe('Named challengers are actively eroding the moat');
    expect(medium.label).toBe('Medium Threat');
    expect(medium.caption).toBe('Credible pressure exists, but the moat still holds');
    expect(low.label).toBe('Low Threat / Safe');
    expect(low.caption).toBe('The moat is durable — no near-term path to replacement');
  });
});
