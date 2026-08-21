'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CommunityAlternative } from '@/lib/alternatives/types';
import { AlternativeCard } from './AlternativeCard';

import { sortAlternatives } from '@/lib/alternatives/sort';

export function AlternativesGrid({
  initialAlternatives = [],
}: {
  initialAlternatives: CommunityAlternative[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Extract unique targets
  const targetFilterOptions = useMemo(() => {
    const targets = new Set<string>();
    initialAlternatives.forEach((alt) => {
      if (alt.target_slug) targets.add(alt.target_slug);
      else targets.add('general');
    });
    return ['all', ...Array.from(targets)];
  }, [initialAlternatives]);

  const filteredAlternatives = useMemo(() => {
    const filtered = initialAlternatives.filter((alt) => {
      const matchesSearch =
        searchQuery === '' ||
        alt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alt.target_slug && alt.target_slug.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'general' && !alt.target_slug) ||
        alt.target_slug === selectedFilter;

      return matchesSearch && matchesFilter;
    });

    return sortAlternatives(filtered);
  }, [initialAlternatives, searchQuery, selectedFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          background: 'var(--bg-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xs)',
          padding: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search alternatives, tools, or challenged apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '10px 14px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--fg-primary)',
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-body)',
            }}
          />
          <Link
            href="/submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 18px',
              background: 'var(--brand-500)',
              color: '#ffffff',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: 'var(--tracking-label)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            + Submit Alternative
          </Link>
        </div>

        {/* Filter Pills */}
        {targetFilterOptions.length > 2 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '11px',
                color: 'var(--fg-tertiary)',
                textTransform: 'uppercase',
              }}
            >
              Filter by:
            </span>
            {targetFilterOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedFilter(opt)}
                style={{
                  padding: '4px 10px',
                  background: selectedFilter === opt ? 'var(--brand-500)' : 'var(--bg-2)',
                  color: selectedFilter === opt ? '#ffffff' : 'var(--fg-secondary)',
                  border: `1px solid ${selectedFilter === opt ? 'var(--brand-500)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Cards */}
      {filteredAlternatives.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {filteredAlternatives.map((alt) => (
            <AlternativeCard key={alt.id} alternative={alt} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)',
            background: 'var(--bg-1)',
            border: '1px dashed var(--border-default)',
            borderRadius: 'var(--radius-xs)',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>🔍</div>
          <h3
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontSize: 'var(--text-h3)',
              color: 'var(--fg-primary)',
              margin: '0 0 var(--space-2) 0',
            }}
          >
            No alternatives found
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-secondary)',
              maxWidth: '420px',
              margin: '0 auto var(--space-6) auto',
            }}
          >
            {searchQuery
              ? `No tools matched your search query "${searchQuery}".`
              : 'Be the first creator to submit an alternative to the community directory!'}
          </p>
          <Link
            href="/submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              background: 'var(--brand-500)',
              color: '#ffffff',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            + Submit your tool now &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
