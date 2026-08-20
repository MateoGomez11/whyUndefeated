import { test, expect } from '@playwright/test';

const BREAKPOINTS = {
  mobile: { width: 375, height: 1200 },
  tablet: { width: 768, height: 1200 },
  desktop: { width: 1280, height: 1200 },
} as const;

async function hasHorizontalOverflow(page: import('@playwright/test').Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

test.describe('Methodology page (US1)', () => {
  test('shows the 4 sections in order: Threat Tiers, Evidence Types, Content Integrity Rule, Related Apps Grouping', async ({
    page,
  }) => {
    const response = await page.goto('/methodology');
    expect(response?.status()).toBe(200);

    const regions = page.locator('main [aria-label]');
    const labels = await regions.evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')));
    expect(labels).toEqual([
      'Threat Tiers',
      'Evidence Types',
      'Content Integrity Rule',
      'Related Apps Grouping',
    ]);
  });

  test('Threat Tiers section shows the same label and caption as the home legend, for all 3 levels (SC-002)', async ({
    page,
  }) => {
    await page.goto('/');
    const homeLabels = await page
      .locator('.tier-stats .tier-stat-label')
      .evaluateAll((els) => els.map((el) => el.textContent?.trim()));
    const homeCaptions = await page
      .locator('.tier-stats .tier-stat-caption-full')
      .evaluateAll((els) => els.map((el) => el.textContent?.trim()));

    await page.goto('/methodology');
    const tierSection = page.getByRole('region', { name: 'Threat Tiers' });
    const pageLabels = await tierSection
      .locator('[data-tier-label]')
      .evaluateAll((els) => els.map((el) => el.textContent?.trim()));
    const pageCaptions = await tierSection
      .locator('[data-tier-caption]')
      .evaluateAll((els) => els.map((el) => el.textContent?.trim()));

    expect(pageLabels).toEqual(homeLabels);
    expect(pageCaptions).toEqual(homeCaptions);
  });

  test('Evidence Types section defines all 3 accepted evidence types with no citations to real entries', async ({
    page,
  }) => {
    await page.goto('/methodology');
    const evidenceSection = page.getByRole('region', { name: 'Evidence Types' });
    await expect(evidenceSection.getByText('Traffic/usage stats', { exact: false })).toBeVisible();
    await expect(evidenceSection.getByText('AI capability benchmark', { exact: false })).toBeVisible();
    await expect(evidenceSection.getByText('User migration signal', { exact: false })).toBeVisible();

    // No links out to real entry detail pages — this section is purely definitional.
    const entryLinks = await evidenceSection.locator('a[href^="/entries/"]').count();
    expect(entryLinks).toBe(0);
  });

  test('Content Integrity Rule section explains the real source requirement', async ({ page }) => {
    await page.goto('/methodology');
    const integritySection = page.getByRole('region', { name: 'Content Integrity Rule' });
    await expect(integritySection).toBeVisible();
    await expect(integritySection.getByText(/source/i).first()).toBeVisible();
  });

  test('Related Apps Grouping section explains grouping by category', async ({ page }) => {
    await page.goto('/methodology');
    const relatedSection = page.getByRole('region', { name: 'Related Apps Grouping' });
    await expect(relatedSection.getByText(/category/i).first()).toBeVisible();
  });

  for (const [name, viewport] of Object.entries(BREAKPOINTS)) {
    test(`renders without horizontal scroll at ${name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/methodology');
      expect(await hasHorizontalOverflow(page)).toBe(false);
    });
  }
});

test.describe('Methodology page reachable from the nav (US2)', () => {
  test('clicking "Methodology" in the header from home navigates to /methodology (no 404)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Methodology' }).click();
    await expect(page).toHaveURL(/\/methodology$/);
    // A real 404 would render app/not-found.tsx instead of this region — proves it's not a dead link.
    await expect(page.getByRole('region', { name: 'Threat Tiers' })).toBeVisible();
    await expect(page.getByText('Entry not found')).toHaveCount(0);
  });

  test('clicking "Methodology" in the header from an entry detail page navigates to /methodology', async ({
    page,
  }) => {
    await page.goto('/entries/pinterest');
    await page.getByRole('link', { name: 'Methodology' }).click();
    await expect(page).toHaveURL(/\/methodology$/);
  });
});
