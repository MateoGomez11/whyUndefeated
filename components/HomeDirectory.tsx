'use client';

import { useState, useMemo } from 'react';
import type { Entry } from '@/lib/content/schema';
import { EntryCard } from './EntryCard';

export function HomeDirectory({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesCategory =
        selectedCategory === 'all' || entry.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesQuery =
        !q ||
        entry.appName.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.threatLevel.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [entries, query, selectedCategory]);

  return (
    <div>
      {/* Search Input */}
      <div style={{ maxWidth: 560, margin: 'var(--space-8) auto 0' }}>
        <div
          className="search-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--bg-1)',
            border: '1px solid var(--brand-600)',
            borderRadius: 'var(--radius-sm)',
            padding: '18px 22px',
            boxShadow: '0 0 0 1px var(--brand-tint-08), 0 0 32px var(--brand-glow-soft)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              color: 'var(--brand-400)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-h3)',
              fontWeight: 700,
            }}
          >
            {'>'}
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search a platform…"
            aria-label="Search platforms"
            className="search-bar-input"
            style={{
              flex: 1,
              minWidth: 0,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-body-lg)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--fg-tertiary)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          margin: 'var(--space-6) 0 var(--space-8) 0',
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 'var(--radius-xs)',
            border: `1px solid ${selectedCategory === 'all' ? 'var(--brand-500)' : 'var(--border-subtle)'}`,
            background: selectedCategory === 'all' ? 'var(--brand-500)' : 'var(--bg-2)',
            color: selectedCategory === 'all' ? '#ffffff' : 'var(--fg-secondary)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-label)',
          }}
        >
          {`All (${entries.length})`}
        </button>

        {categories.map((cat) => {
          const count = entries.filter((e) => e.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                border: `1px solid ${isSelected ? 'var(--brand-500)' : 'var(--border-subtle)'}`,
                background: isSelected ? 'var(--brand-500)' : 'var(--bg-2)',
                color: isSelected ? '#ffffff' : 'var(--fg-secondary)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-label)',
              }}
            >
              {`${cat} (${count})`}
            </button>
          );
        })}
      </div>

      {/* Tracker Table */}
      <section
        aria-label="Tracked apps"
        style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
      >
        <div
          className="ds-label tracker-header"
          style={{
            gap: 'var(--space-4)',
            padding: '10px var(--space-5)',
            background: 'var(--bg-1)',
            borderBottom: '1px solid var(--border-subtle)',
            color: 'var(--fg-tertiary)',
          }}
        >
          <span>App</span>
          <span>Category</span>
          <span>Verdict summary</span>
          <span>Threat level</span>
        </div>

        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => <EntryCard key={entry.slug} entry={entry} />)
        ) : (
          <div
            style={{
              padding: 'var(--space-8)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-tertiary)',
              background: 'var(--bg-1)',
            }}
          >
            No platforms found matching &quot;{query}&quot;.
          </div>
        )}
      </section>
    </div>
  );
}
