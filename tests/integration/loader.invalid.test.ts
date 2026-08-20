import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { validateEntry, ContentValidationError } from '@/lib/content/schema';

const FIXTURES_DIR = join(process.cwd(), 'tests', 'fixtures');

function loadFixture(file: string): unknown {
  return JSON.parse(readFileSync(join(FIXTURES_DIR, file), 'utf8'));
}

// Each fixture is invalid in exactly one way. For every one, the loader's
// validation MUST throw a ContentValidationError naming the offending field
// and the file (FR-013, SC-004; contract V1-V8/V1b).
describe('loader validation gate — invalid fixtures (FR-013, SC-004)', () => {
  it('rejects a fixture missing threatLevel, naming the field and file', () => {
    const file = 'missing-threat-level.json';
    expect(() => validateEntry(loadFixture(file), file)).toThrow(ContentValidationError);
    try {
      validateEntry(loadFixture(file), file);
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('threatLevel');
      expect(err.file).toBe(file);
    }
  });

  it('rejects a fixture missing moat, naming the field and file', () => {
    const file = 'missing-moat.json';
    try {
      validateEntry(loadFixture(file), file);
      throw new Error('should have thrown');
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('moat');
      expect(err.file).toBe(file);
    }
  });

  it('rejects a fixture with an empty sources array, naming the field and file', () => {
    const file = 'empty-sources.json';
    try {
      validateEntry(loadFixture(file), file);
      throw new Error('should have thrown');
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('sources');
      expect(err.file).toBe(file);
    }
  });

  it('rejects a fixture with a category outside the enum, naming the field and file', () => {
    const file = 'invalid-category.json';
    try {
      validateEntry(loadFixture(file), file);
      throw new Error('should have thrown');
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('category');
      expect(err.file).toBe(file);
    }
  });

  it('rejects a fixture with a dangling challenger sourceId, naming the field, file, and the bad id', () => {
    const file = 'dangling-source-id.json';
    try {
      validateEntry(loadFixture(file), file);
      throw new Error('should have thrown');
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('sourceId');
      expect(err.reason).toContain('ghost');
      expect(err.file).toBe(file);
    }
  });

  it('rejects a fixture whose challenger has no source at all, naming the field and file', () => {
    const file = 'challenger-without-source.json';
    try {
      validateEntry(loadFixture(file), file);
      throw new Error('should have thrown');
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.field).toContain('sourceId');
      expect(err.file).toBe(file);
    }
  });

  it('every error message names both the file and the field (contract format)', () => {
    const files = readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      try {
        validateEntry(loadFixture(file), file);
        throw new Error(`fixture ${file} should have thrown`);
      } catch (e) {
        const err = e as ContentValidationError;
        expect(err).toBeInstanceOf(ContentValidationError);
        expect(err.message).toContain(file);
        expect(err.message).toContain(err.field);
      }
    }
  });
});
