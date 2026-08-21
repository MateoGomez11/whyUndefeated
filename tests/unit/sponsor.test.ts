import {
  SPONSOR_SLOTS,
  SPONSOR_METRICS,
  SPONSOR_BENEFITS,
} from '@/lib/sponsor/data';

describe('Sponsor Data Model & Integrity', () => {
  test('contains exactly 5 sponsor slots', () => {
    expect(SPONSOR_SLOTS).toHaveLength(5);
  });

  test('slots are numbered S1 through S5 with icons and descriptions', () => {
    expect(SPONSOR_SLOTS.map((s) => s.id)).toEqual(['S1', 'S2', 'S3', 'S4', 'S5']);
    for (const slot of SPONSOR_SLOTS) {
      expect(slot.icon).toBeTruthy();
      expect(slot.description).toBeTruthy();
    }
  });

  test('all slots have valid status and required fields', () => {
    const validStatuses = ['TAKEN', 'SPONSOR DECIDING', 'OPEN'];

    for (const slot of SPONSOR_SLOTS) {
      expect(validStatuses).toContain(slot.status);
      expect(slot.name).toBeTruthy();
      expect(slot.slotNumber).toBeGreaterThanOrEqual(1);
      expect(slot.slotNumber).toBeLessThanOrEqual(5);

      if (slot.status === 'TAKEN') {
        expect(slot.url).toMatch(/^https?:\/\//);
      }
    }
  });

  test('metrics are complete, honest, and defined', () => {
    expect(SPONSOR_METRICS.monthlyViews).toBeTruthy();
    expect(SPONSOR_METRICS.appsCount).toBeGreaterThan(0);
    expect(SPONSOR_METRICS.slotsTakenText).toBe('5 Available');
    expect(SPONSOR_METRICS.priceWeeklyUsd).toBe(49);
  });

  test('benefits are non-empty and well structured', () => {
    expect(SPONSOR_BENEFITS.length).toBeGreaterThanOrEqual(3);
    for (const b of SPONSOR_BENEFITS) {
      expect(b.title.length).toBeGreaterThan(5);
      expect(b.description.length).toBeGreaterThan(15);
    }
  });
});
