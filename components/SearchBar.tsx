// Aesthetic search bar — mirrors design-reference SearchInput.jsx (size="lg",
// prefix=">"). It is a real, focusable <input> with a native cursor and placeholder,
// and works without JavaScript (Server Component, no "use client").
//
// TODO: interactive filtering is intentionally NOT wired here. It was deferred to a
// future feature by the /speckit-clarify decision for 001-entries-directory
// ("solo orden estático, sin filtros interactivos"). Typing does not filter results yet.
export function SearchBar() {
  return (
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
    </div>
  );
}
