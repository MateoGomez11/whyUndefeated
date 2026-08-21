import { test, expect } from '@playwright/test';

const SEED_COUNT = 37;

test.describe('Home directory (US1)', () => {
  test('shows exactly the seed cards with name, badge text, and summary', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.entry-card');
    await expect(cards).toHaveCount(SEED_COUNT);

    // Badge conveys the level as text (FR-017), not color alone.
    await expect(page.getByText('HIGH THREAT').first()).toBeVisible();
  });

  test('alternates cards across threat levels (high -> medium -> low)', async ({ page }) => {
    await page.goto('/');
    const levels = await page.locator('.entry-card [data-threat]').evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-threat')),
    );
    // The first 3 cards should represent high, medium, and low
    expect(levels.slice(0, 3)).toEqual(['high', 'medium', 'low']);
  });

  test('shows the tier stat blocks as an accessible legend (FR-003)', async ({ page }) => {
    await page.goto('/');
    const legend = page.getByRole('region', { name: 'Threat level legend' });
    await expect(legend).toBeVisible();
    // Each tier: label + a short explanatory caption (not just a count).
    await expect(legend.getByText('High Threat', { exact: true })).toBeVisible();
    await expect(legend.getByText('Medium Threat', { exact: true })).toBeVisible();
    await expect(legend.getByText('Low Threat / Safe', { exact: true })).toBeVisible();
    await expect(legend.getByText('Named challengers are actively eroding the moat')).toBeVisible();
    // Counts are derived from the 7 seed entries and sum to 7.
    const numbers = await legend.locator('div').evaluateAll((els) =>
      els
        .map((el) => el.textContent?.trim() ?? '')
        .filter((t) => /^\d+$/.test(t))
        .map(Number),
    );
    expect(numbers.reduce((a, b) => a + b, 0)).toBe(SEED_COUNT);
  });

  test('shows the derived aggregate counter (FR-021)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Apps Tracked')).toBeVisible();
    await expect(page.getByText('Source Citations Documented')).toBeVisible();
    await expect(page.getByText('Community Votes Cast')).toBeVisible();
  });

  test('renders the two-line hero headline with a single caret only in the hero', async ({ page }) => {
    await page.goto('/');
    // Line 1 "Is ..." and line 2 "Still Undefeated?" are both present.
    await expect(page.locator('h1')).toContainText('Is');
    await expect(page.getByText('Still Undefeated?')).toBeVisible();
    // The blinking caret exists exactly once — in the hero, never in the header.
    await expect(page.locator('.ds-cursor')).toHaveCount(1);
    await expect(page.locator('h1 .ds-cursor')).toHaveCount(1);
  });

  test('renders the kit chrome: nav, static links, search input, and footer', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav.getByText('whyundefeated')).toBeVisible();
    for (const label of ['Home', 'Alternatives', 'Methodology', 'Sponsors', 'Submit']) {
      await expect(nav.getByText(label, { exact: true })).toBeVisible();
    }
    // Real, focusable search input (aesthetic only — no filtering yet).
    const search = page.getByPlaceholder('search a platform…');
    await expect(search).toBeVisible();
    await search.click();
    await expect(search).toBeFocused();
    await search.fill('reddit');
    await expect(page.locator('.entry-card')).toHaveCount(1); // typing filters to matched platform

    await expect(page.getByText('whyundefeated.com', { exact: false })).toBeVisible();
  });

  test('clicking a card navigates to its detail route (FR-004, SC-001)', async ({ page }) => {
    await page.goto('/');
    await page.locator('.entry-card').first().click();
    await expect(page).toHaveURL(/\/entries\/[a-z0-9-]+$/);
  });
});
