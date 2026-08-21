import { loadAllEntries } from '@/lib/content/loader';
import { CATEGORIES, THREAT_LEVELS } from '@/lib/content/schema';

const EXPECTED_SLUGS = [
  'airbnb',
  'airtable',
  'behance',
  'calendly',
  'canva',
  'coursera',
  'deviantart',
  'discord',
  'duolingo',
  'ebay',
  'etsy',
  'facebook',
  'figma',
  'github',
  'goodreads',
  'google-maps',
  'gumroad',
  'hacker-news',
  'instagram',
  'linear',
  'linkedin',
  'loom',
  'mailchimp',
  'medium',
  'miro',
  'notion',
  'patreon',
  'pinterest',
  'product-hunt',
  'quora',
  'raycast',
  'reddit',
  'slack',
  'spotify',
  'stack-overflow',
  'substack',
  'superhuman',
  'telegram',
  'tiktok',
  'trello',
  'tripadvisor',
  'twitch',
  'twitter-x',
  'typeform',
  'uber',
  'udemy',
  'whatsapp',
  'wikipedia',
  'wordpress',
  'yelp',
  'youtube',
  'zoom',
];

describe('loadAllEntries over the real seed content (FR-012, SC-009)', () => {
  const entries = loadAllEntries();

  it('loads all entries correctly', () => {
    const slugs = entries.map((e) => e.slug).sort();
    expect(slugs).toEqual(EXPECTED_SLUGS);
    expect(slugs.length).toBe(52);
  });

  it('gives every entry a valid category and threat level', () => {
    for (const entry of entries) {
      expect(CATEGORIES).toContain(entry.category);
      expect(THREAT_LEVELS).toContain(entry.threatLevel);
    }
  });

  it('returns entries alternating across threat levels (high -> medium -> low)', () => {
    const levels = entries.map((e) => e.threatLevel);
    expect(levels.slice(0, 3)).toEqual(['high', 'medium', 'low']);
  });

  it('ensures every challenger and moat citation references an existing source', () => {
    for (const entry of entries) {
      const ids = new Set(entry.sources.map((s) => s.id));
      for (const c of entry.challengers) expect(ids.has(c.sourceId)).toBe(true);
      for (const id of entry.moatSourceIds) expect(ids.has(id)).toBe(true);
    }
  });
});
