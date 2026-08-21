export const VOTER_ID_KEY = 'whyundefeated_voter_id';

/**
 * Generates a random UUID v4 string.
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves an existing voter ID from the provided Storage,
 * or generates and persists a new UUID v4.
 */
export function getOrCreateVoterId(storage: Storage): string {
  const existing = storage.getItem(VOTER_ID_KEY);
  if (existing && existing.trim() !== '') {
    return existing;
  }

  const newId = generateUUID();
  storage.setItem(VOTER_ID_KEY, newId);
  return newId;
}
