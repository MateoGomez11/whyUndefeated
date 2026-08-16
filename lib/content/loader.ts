import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { validateEntry, ContentValidationError, type Entry } from './schema';
import { assertUniqueSlugs } from './slug';
import { sortEntries } from './sort';

const CONTENT_DIR = join(process.cwd(), 'content', 'entries');

/**
 * Read, parse, and validate every entry file, then return them sorted for the
 * directory (high -> low threat, alphabetical tie-break). Throws a
 * ContentValidationError naming the field and file on any invalid entry, which
 * fails `next build` so bad content never reaches production (FR-013, SC-004).
 */
export function loadAllEntries(): Entry[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'));

  const entries = files.map((file) => {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(join(CONTENT_DIR, file), 'utf8'));
    } catch {
      throw new ContentValidationError(file, 'root', 'JSON inválido o ilegible');
    }
    return validateEntry(raw, file);
  });

  assertUniqueSlugs(entries.map((e) => e.slug));

  return sortEntries(entries);
}

/** Look up a single entry by slug, or `undefined` if none matches (FR-015). */
export function getEntryBySlug(slug: string): Entry | undefined {
  return loadAllEntries().find((e) => e.slug === slug);
}
