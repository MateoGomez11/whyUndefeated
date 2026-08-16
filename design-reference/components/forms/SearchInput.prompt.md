Search field with a mono prefix glyph instead of an icon.

```jsx
<SearchInput value={q} onChange={setQ} />
<SearchInput value={q} onChange={setQ} size="lg" prefix=">" placeholder="Search tracked apps…" />
```

Use `size="lg"` + `prefix=">"` for a hero-level search; default `md` + `/` for compact table filter bars.
