import { getOrCreateVoterId, VOTER_ID_KEY } from '@/lib/votes/voterId';

describe('getOrCreateVoterId', () => {
  class MockStorage implements Storage {
    private store: Record<string, string> = {};

    get length(): number {
      return Object.keys(this.store).length;
    }

    clear(): void {
      this.store = {};
    }

    getItem(key: string): string | null {
      return this.store[key] ?? null;
    }

    key(index: number): string | null {
      return Object.keys(this.store)[index] ?? null;
    }

    removeItem(key: string): void {
      delete this.store[key];
    }

    setItem(key: string, value: string): void {
      this.store[key] = value;
    }
  }

  it('generates a new valid UUID and persists it if storage is empty', () => {
    const storage = new MockStorage();
    const id = getOrCreateVoterId(storage);

    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(storage.getItem(VOTER_ID_KEY)).toBe(id);
  });

  it('reuses existing voterId from storage without generating a new one', () => {
    const storage = new MockStorage();
    const existingId = '123e4567-e89b-12d3-a456-426614174000';
    storage.setItem(VOTER_ID_KEY, existingId);

    const id = getOrCreateVoterId(storage);

    expect(id).toBe(existingId);
    expect(storage.getItem(VOTER_ID_KEY)).toBe(existingId);
  });
});
