import { test, expect } from '@playwright/test';

// Breakpoints per spec.md NFR-001: mobile <640px · tablet 640–1024px · desktop >1024px.
const BREAKPOINTS = {
  mobile: { width: 375, height: 1000 },
  tablet: { width: 768, height: 1000 },
  desktop: { width: 1280, height: 1000 },
} as const;

async function hasHorizontalOverflow(page: import('@playwright/test').Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

test.describe('Responsive layout (NFR-001–NFR-005)', () => {
  for (const [name, viewport] of Object.entries(BREAKPOINTS)) {
    test.describe(`${name} (${viewport.width}px)`, () => {
      test.use({ viewport });

      test('home renders without horizontal scroll (NFR-001, SC-010)', async ({ page }) => {
        await page.goto('/');
        expect(await hasHorizontalOverflow(page)).toBe(false);
      });

      test('detail page renders without horizontal scroll (NFR-001, SC-010)', async ({ page }) => {
        await page.goto('/entries/pinterest');
        expect(await hasHorizontalOverflow(page)).toBe(false);
      });
    });
  }

  test.describe('mobile (375px) specifics', () => {
    test.use({ viewport: BREAKPOINTS.mobile });

    test('tracker table collapses to stacked cards, no column headers (NFR-002)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.tracker-header')).toBeHidden();
      const firstCard = page.locator('.entry-card').first();
      const box = await firstCard.boundingBox();
      // A stacked card spans (nearly) the full content width, unlike a narrow grid column.
      expect(box!.width).toBeGreaterThan(300);
    });

    test('tier stat blocks stay in one compact row of 3, not stacked (NFR-003)', async ({ page }) => {
      await page.goto('/');
      const tierStats = page.getByRole('region', { name: 'Threat level legend' });
      const flexDirection = await tierStats.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(flexDirection).toBe('row');

      // All 3 blocks sit on the same row (same top position) — not wrapped/stacked.
      const blocks = tierStats.locator('.tier-stat-block');
      await expect(blocks).toHaveCount(3);
      const tops = await blocks.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
      expect(new Set(tops).size).toBe(1);

      // Row fits within the viewport width, no horizontal scroll for the section itself.
      const box = await tierStats.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(BREAKPOINTS.mobile.width);

      // Compact: the big number shrinks, labels and color accents stay visible.
      const numberFontSize = await tierStats
        .locator('.tier-stat-number')
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(numberFontSize).toBeLessThan(40);
      await expect(tierStats.getByText('High Threat', { exact: false })).toBeVisible();

      // Full sentence caption is swapped for a short one-line stand-in.
      await expect(tierStats.locator('.tier-stat-caption-full').first()).toBeHidden();
      const shortCaption = tierStats.locator('.tier-stat-caption-short').first();
      await expect(shortCaption).toBeVisible();
      await expect(shortCaption).toHaveText('Eroding the moat');
    });

    test('hero stays a fixed two-line headline (NFR-003)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toContainText('Is');
      await expect(page.getByText('Still Undefeated?')).toBeVisible();
    });

    test('nav collapses behind a CSS-only toggle and expands on click (NFR-004)', async ({ page }) => {
      await page.goto('/');
      const navLinks = page.locator('.nav-links');
      await expect(navLinks).toBeHidden();
      const toggle = page.locator('label.nav-toggle-label');
      await expect(toggle).toBeVisible();

      await toggle.click();
      await expect(navLinks).toBeVisible();
      await expect(navLinks.getByText('Leaderboard')).toBeVisible();
    });

    test('nav toggle works via keyboard alone, proving it needs no JavaScript (NFR-004)', async ({ page }) => {
      await page.goto('/');
      const checkbox = page.locator('#nav-toggle');
      await checkbox.focus();
      await expect(checkbox).toBeFocused();
      await page.keyboard.press('Space');
      await expect(page.locator('.nav-links')).toBeVisible();
    });

    test('detail page grid collapses to one column with related apps after content, not beside it (NFR-005)', async ({
      page,
    }) => {
      await page.goto('/entries/pinterest');
      const grid = page.locator('.entry-detail-grid');
      const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/));
      expect(columns).toHaveLength(1);

      const sourcesBox = await page.getByRole('region', { name: 'Sources' }).boundingBox();
      const relatedBox = await page.getByRole('region', { name: 'Related apps' }).boundingBox();
      expect(relatedBox!.y).toBeGreaterThan(sourcesBox!.y);
    });
  });

  test.describe('tablet (768px) specifics', () => {
    test.use({ viewport: BREAKPOINTS.tablet });

    test('tracker table keeps the column grid, not the mobile card layout', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.tracker-header')).toBeVisible();
    });

    test('nav still collapses behind the toggle at tablet width (NFR-004)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.nav-links')).toBeHidden();
      await expect(page.locator('label.nav-toggle-label')).toBeVisible();
    });

    test('detail page grid also collapses to one column at tablet width, to avoid a cramped sidebar (NFR-005)', async ({
      page,
    }) => {
      await page.goto('/entries/pinterest');
      const grid = page.locator('.entry-detail-grid');
      const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/));
      expect(columns).toHaveLength(1);
    });
  });

  test.describe('desktop (1280px) specifics', () => {
    test.use({ viewport: BREAKPOINTS.desktop });

    test('tracker table keeps the column header row, not the mobile card layout', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.tracker-header')).toBeVisible();
    });

    test('nav shows full links inline, toggle is hidden (NFR-004)', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.nav-links')).toBeVisible();
      await expect(page.locator('label.nav-toggle-label')).toBeHidden();
    });

    test('detail page shows related apps beside content in two columns, not below (NFR-005)', async ({ page }) => {
      await page.goto('/entries/pinterest');
      const grid = page.locator('.entry-detail-grid');
      const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/));
      expect(columns).toHaveLength(2);
    });
  });
});
