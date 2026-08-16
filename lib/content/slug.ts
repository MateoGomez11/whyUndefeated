const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Derive a slug from a content file name (`pinterest.json` -> `pinterest`). */
export function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.json$/, '');
}

/** True when a slug is well-formed kebab-case. */
export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

/** Throw naming the first duplicated slug found (Decisión 5). */
export function assertUniqueSlugs(slugs: readonly string[]): void {
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) {
      throw new Error(`slug duplicado '${slug}' entre las entradas`);
    }
    seen.add(slug);
  }
}
