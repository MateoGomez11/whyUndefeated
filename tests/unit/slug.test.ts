import { slugFromFileName, isValidSlug, assertUniqueSlugs } from '@/lib/content/slug';

describe('slugFromFileName', () => {
  it('strips the .json extension', () => {
    expect(slugFromFileName('pinterest.json')).toBe('pinterest');
    expect(slugFromFileName('twitter-x.json')).toBe('twitter-x');
  });
});

describe('isValidSlug', () => {
  it('accepts kebab-case', () => {
    expect(isValidSlug('pinterest')).toBe(true);
    expect(isValidSlug('twitter-x')).toBe(true);
  });

  it('rejects uppercase, spaces, and leading/trailing dashes', () => {
    expect(isValidSlug('Pinterest')).toBe(false);
    expect(isValidSlug('twitter x')).toBe(false);
    expect(isValidSlug('-x')).toBe(false);
    expect(isValidSlug('x-')).toBe(false);
    expect(isValidSlug('twitter/x')).toBe(false);
  });
});

describe('assertUniqueSlugs', () => {
  it('passes when all slugs are unique', () => {
    expect(() => assertUniqueSlugs(['a', 'b', 'c'])).not.toThrow();
  });

  it('throws naming the duplicated slug', () => {
    expect(() => assertUniqueSlugs(['a', 'b', 'a'])).toThrow(/a/);
  });
});
