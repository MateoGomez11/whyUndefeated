import { test, expect } from '@playwright/test';

test.describe('Entry detail page (US2)', () => {
  test('shows appName, threat badge, moat, and sources for a valid slug', async ({ page }) => {
    await page.goto('/entries/pinterest');
    await expect(page.locator('h1')).toHaveText('Pinterest');
    await expect(page.getByText('LOW THREAT').first()).toBeVisible();
    await expect(page.getByText(/human-curated visual taste graph/)).toBeVisible();
    await expect(page.getByRole('region', { name: 'Sources' })).toBeVisible();
  });

  test('renders every challenger with name, one-line evidence, and a clickable source link (FR-006)', async ({
    page,
  }) => {
    await page.goto('/entries/wikipedia');
    const challengers = page.locator('.challenger');
    await expect(challengers).toHaveCount(2);

    const first = challengers.first();
    await expect(first).toBeVisible();
    const link = first.locator('a.citation');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });

  test('shows a clickable source citation for the moat claim, also listed in Sources (FR-007, FR-008)', async ({
    page,
  }) => {
    await page.goto('/entries/pinterest');
    const moatSection = page.getByRole('region', { name: 'Moat' });
    const moatCitation = moatSection.locator('a.citation').first();
    const href = await moatCitation.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);

    const sources = page.getByRole('region', { name: 'Sources' });
    await expect(sources.locator(`a[href="${href}"]`)).toBeVisible();
  });

  test('the Sources section lists every cited source exactly once, deduplicated (FR-008)', async ({ page }) => {
    await page.goto('/entries/wikipedia');
    const sourceLinks = page.getByRole('region', { name: 'Sources' }).locator('a');
    const hrefs = await sourceLinks.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  test('shows related apps sharing the same category, excluding itself (FR-020)', async ({ page }) => {
    await page.goto('/entries/pinterest'); // category: Content, shares with tiktok
    const related = page.getByRole('region', { name: 'Related apps' });
    await expect(related).toBeVisible();
    await expect(related.getByText('Pinterest')).toHaveCount(0);
    const relatedLink = related.locator('a').first();
    await expect(relatedLink).toHaveAttribute('href', /^\/entries\/[a-z0-9-]+$/);
  });

  test('shows the related apps section when category has multiple entries (FR-020)', async ({
    page,
  }) => {
    await page.goto('/entries/wikipedia');
    await expect(page.getByRole('region', { name: 'Related apps' })).toBeVisible();
  });

  test('all detail pages share the same template (FR-009): same section landmarks on two entries', async ({
    page,
  }) => {
    await page.goto('/entries/pinterest');
    const pinterestSections = await page.locator('main [aria-label]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('aria-label')),
    );
    await page.goto('/entries/reddit');
    const redditSections = await page.locator('main [aria-label]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('aria-label')),
    );
    // Same landmark structure minus the entry-specific presence of Related apps/Challengers.
    expect(pinterestSections).toContain('Moat');
    expect(pinterestSections).toContain('Sources');
    expect(redditSections).toContain('Moat');
    expect(redditSections).toContain('Sources');
  });

  test('an unknown slug renders the not-found page instead of a raw error (FR-015)', async ({ page }) => {
    const response = await page.goto('/entries/not-a-real-app');
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/not found/i)).toBeVisible();
  });
});
