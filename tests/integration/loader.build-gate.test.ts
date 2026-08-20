import { join } from 'node:path';
import { loadAllEntries } from '@/lib/content/loader';
import { ContentValidationError } from '@/lib/content/schema';

const FIXTURES_DIR = join(process.cwd(), 'tests', 'fixtures');

// Proves the same code path the build uses (loadAllEntries, called from
// generateStaticParams at build time) gates on content validity: valid
// content completes, invalid content throws and stops the build (US3 esc. 1-4).
describe('build gate (US3)', () => {
  it('completes without error when every entry file is valid', () => {
    expect(() => loadAllEntries(join(FIXTURES_DIR, 'build-gate-valid'))).not.toThrow();
    const entries = loadAllEntries(join(FIXTURES_DIR, 'build-gate-valid'));
    expect(entries).toHaveLength(1);
    expect(entries[0].slug).toBe('valid-entry');
  });

  it('throws a ContentValidationError naming the field and file when an entry is invalid', () => {
    const dir = join(FIXTURES_DIR, 'build-gate-invalid');
    expect(() => loadAllEntries(dir)).toThrow(ContentValidationError);
    try {
      loadAllEntries(dir);
    } catch (e) {
      const err = e as ContentValidationError;
      expect(err.file).toBe('broken-entry.json');
      expect(err.field).toContain('threatLevel');
    }
  });

  it('the real content/entries directory (default) completes without error', () => {
    expect(() => loadAllEntries()).not.toThrow();
    expect(loadAllEntries()).toHaveLength(7);
  });
});
