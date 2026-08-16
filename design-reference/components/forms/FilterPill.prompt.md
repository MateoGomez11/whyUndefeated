Toggleable pill for the homepage filter row — threat tier and category filters both use this.

```jsx
<FilterPill active={tier === 'high'} onClick={() => setTier('high')}>High</FilterPill>
```
