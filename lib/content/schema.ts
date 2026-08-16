import { z } from 'zod';

/** Canonical stored threat-level enum (FR-014). Display labels are "Low"/"Medium"/"High". */
export const THREAT_LEVELS = ['low', 'medium', 'high'] as const;
export type ThreatLevel = (typeof THREAT_LEVELS)[number];

/** Entry category enum (FR-019). Neutral metadata — never color-coded. */
export const CATEGORIES = ['Social', 'Content', 'Knowledge', 'Community'] as const;
export type Category = (typeof CATEGORIES)[number];

export const SourceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  url: z.string().url(),
});

export const ChallengerSchema = z.object({
  name: z.string().min(1),
  evidence: z.string().min(1),
  sourceId: z.string().min(1),
});

export const EntrySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  appName: z.string().min(1),
  threatLevel: z.enum(THREAT_LEVELS),
  category: z.enum(CATEGORIES),
  summary: z.string().min(1),
  moat: z.string().min(1),
  moatSourceIds: z.array(z.string().min(1)).min(1, 'moat must cite at least one source'),
  challengers: z.array(ChallengerSchema),
  sources: z.array(SourceSchema).min(1, 'at least one source is required'),
});

export type Source = z.infer<typeof SourceSchema>;
export type Challenger = z.infer<typeof ChallengerSchema>;
export type Entry = z.infer<typeof EntrySchema>;

/**
 * Raised when a content file fails validation. Carries the file, the offending
 * field path, and a human-readable reason so the build error names both (FR-013).
 */
export class ContentValidationError extends Error {
  readonly file: string;
  readonly field: string;
  readonly reason: string;

  constructor(file: string, field: string, reason: string) {
    super(`${file}: campo '${field}' — ${reason}`);
    this.name = 'ContentValidationError';
    this.file = file;
    this.field = field;
    this.reason = reason;
  }
}

/**
 * Validate a single raw content object against the schema plus cross-field rules
 * (slug↔file match, referential integrity). Returns the typed Entry or throws a
 * ContentValidationError naming the field and file.
 */
export function validateEntry(raw: unknown, fileName: string): Entry {
  const parsed = EntrySchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue.path.length > 0 ? issue.path.join('.') : 'root';
    throw new ContentValidationError(fileName, field, issue.message);
  }

  const entry = parsed.data;

  // slug must match the file name (Decisión 5).
  const expectedSlug = fileName.replace(/\.json$/, '');
  if (entry.slug !== expectedSlug) {
    throw new ContentValidationError(
      fileName,
      'slug',
      `no coincide con el nombre de archivo (esperado '${expectedSlug}')`,
    );
  }

  // Referential integrity: every referenced source id must exist (V5, V6).
  const sourceIds = new Set(entry.sources.map((s) => s.id));

  entry.challengers.forEach((challenger, i) => {
    if (!sourceIds.has(challenger.sourceId)) {
      throw new ContentValidationError(
        fileName,
        `challengers.${i}.sourceId`,
        `referencia a fuente inexistente '${challenger.sourceId}'`,
      );
    }
  });

  entry.moatSourceIds.forEach((id, j) => {
    if (!sourceIds.has(id)) {
      throw new ContentValidationError(
        fileName,
        `moatSourceIds.${j}`,
        `referencia a fuente inexistente '${id}'`,
      );
    }
  });

  return entry;
}
