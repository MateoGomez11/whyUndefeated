import { test, expect } from '@playwright/test';

// Runs under the `no-js` project (javaScriptEnabled: false) — FR-011, SC-005.
test.describe('Home is readable and usable without JavaScript', () => {
  test('lists all 7 cards, legend, badges, counter, and working links with JS disabled', async ({
    page,
  }) => {
    await page.goto('/');

    // Content renders from server HTML.
    await expect(page.locator('.entry-card')).toHaveCount(7);
    await expect(page.getByRole('region', { name: 'Threat level legend' })).toBeVisible();
    await expect(page.getByText('HIGH THREAT').first()).toBeVisible();
    await expect(page.getByText('Apps Tracked')).toBeVisible();

    // Hero headline reads as a complete sentence without JS (typewriter falls back
    // to the first name, server-rendered).
    await expect(page.getByText('Still Undefeated?')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Is');

    // Card links are real anchors that work without JS.
    const href = await page.locator('.entry-card').first().getAttribute('href');
    expect(href).toMatch(/^\/entries\/[a-z0-9-]+$/);
  });
});
