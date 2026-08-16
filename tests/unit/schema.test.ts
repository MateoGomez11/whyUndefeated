import { validateEntry, ContentValidationError } from '@/lib/content/schema';

function validRaw() {
  return {
    slug: 'pinterest',
    appName: 'Pinterest',
    threatLevel: 'low',
    category: 'Content',
    summary: 'Visual discovery engine whose taste graph resists generic AI feeds.',
    moat: 'Pinterest is anchored by a human-curated taste graph and purchase intent data.',
    moatSourceIds: ['s1'],
    challengers: [{ name: 'Example AI Boards', evidence: 'Raised $20M in 2025', sourceId: 's2' }],
    sources: [
      { id: 's1', label: 'Pinterest shareholder letter', url: 'https://example.com/a' },
      { id: 's2', label: 'Funding report', url: 'https://example.com/b' },
    ],
  };
}

describe('validateEntry', () => {
  it('accepts a fully valid entry and returns typed data', () => {
    const entry = validateEntry(validRaw(), 'pinterest.json');
    expect(entry.slug).toBe('pinterest');
    expect(entry.threatLevel).toBe('low');
    expect(entry.category).toBe('Content');
    expect(entry.sources).toHaveLength(2);
  });

  it('accepts an entry with zero challengers (FR-018)', () => {
    const raw = validRaw();
    raw.challengers = [];
    expect(() => validateEntry(raw, 'pinterest.json')).not.toThrow();
  });

  it('fails when threatLevel is missing (FR-013/FR-014)', () => {
    const raw: Record<string, unknown> = validRaw();
    delete raw.threatLevel;
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(ContentValidationError);
    try {
      validateEntry(raw, 'pinterest.json');
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('threatLevel');
      expect(err.file).toBe('pinterest.json');
    }
  });

  it('fails when threatLevel is outside the enum', () => {
    const raw = validRaw();
    (raw as Record<string, unknown>).threatLevel = 'critical';
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(/threatLevel/);
  });

  it('fails when category is missing or invalid (FR-019)', () => {
    const raw = validRaw();
    (raw as Record<string, unknown>).category = 'Nonsense';
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(/category/);
  });

  it('fails when there are no sources (FR-013)', () => {
    const raw = validRaw();
    raw.sources = [];
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(/sources/);
  });

  it('fails when moat is empty (FR-013)', () => {
    const raw = validRaw();
    raw.moat = '';
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(/moat/);
  });

  it('fails when moat cites no source (moatSourceIds empty) (FR-007/FR-013)', () => {
    const raw = validRaw();
    raw.moatSourceIds = [];
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(/moatSourceIds/);
  });

  it('fails when a source url is not a valid URL', () => {
    const raw = validRaw();
    raw.sources[0].url = 'not-a-url';
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(/url/);
  });

  it('fails when a challenger references a non-existent source (referential integrity)', () => {
    const raw = validRaw();
    raw.challengers[0].sourceId = 'ghost';
    try {
      validateEntry(raw, 'pinterest.json');
      throw new Error('should have thrown');
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('sourceId');
      expect(err.reason).toContain('ghost');
    }
  });

  it('fails when moatSourceIds references a non-existent source', () => {
    const raw = validRaw();
    raw.moatSourceIds = ['ghost'];
    expect(() => validateEntry(raw, 'pinterest.json')).toThrow(/moatSourceIds/);
  });

  it('fails when slug does not match the file name', () => {
    const raw = validRaw();
    expect(() => validateEntry(raw, 'reddit.json')).toThrow(/slug/);
  });
});
