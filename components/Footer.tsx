// Static footer — mirrors design-reference Footer.jsx. No client JS.
export function Footer() {
  return (
    <footer
      style={{
        padding: 'var(--space-8) var(--page-gutter)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        flexWrap: 'wrap',
        color: 'var(--fg-tertiary)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 'var(--text-xs)',
      }}
    >
      <span>whyundefeated.dev — tracking the gap between AI and the platforms it might replace.</span>
      <span>© 2026</span>
    </footer>
  );
}
