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

// Runs under the `no-js` project (javaScriptEnabled: false) — FR-011, SC-005, US2 esc. 6.
test.describe('Entry detail is readable and usable without JavaScript', () => {
  test('renders content, related apps, and clickable source links with JS disabled', async ({ page }) => {
    await page.goto('/entries/pinterest');

    await expect(page.locator('h1')).toHaveText('Pinterest');
    await expect(page.getByText('LOW THREAT').first()).toBeVisible();
    await expect(page.getByRole('region', { name: 'Moat' })).toBeVisible();

    // Source links are real anchors, clickable without JS.
    const sourceHref = await page
      .getByRole('region', { name: 'Sources' })
      .locator('a')
      .first()
      .getAttribute('href');
    expect(sourceHref).toMatch(/^https?:\/\//);

    // Related apps render server-side, with real links.
    const related = page.getByRole('region', { name: 'Related apps' });
    await expect(related).toBeVisible();
    const relatedHref = await related.locator('a').first().getAttribute('href');
    expect(relatedHref).toMatch(/^\/entries\/[a-z0-9-]+$/);
  });
});

// Runs under the `no-js` project at a mobile viewport — proves the responsive
// layout (NFR-001–NFR-005) needs no JavaScript: the nav toggle is a native
// checkbox/label, and the stacked-card/single-column layouts are pure CSS.
test.describe('Responsive layout works without JavaScript (NFR-001–NFR-004)', () => {
  test.use({ viewport: { width: 375, height: 1000 } });

  test('mobile nav toggle opens via a real click on the checkbox label, no script required', async ({ page }) => {
    await page.goto('/');

    const navLinks = page.locator('.nav-links');
    await expect(navLinks).toBeHidden();

    await page.locator('label.nav-toggle-label').click();
    await expect(navLinks).toBeVisible();
    await expect(navLinks.getByText('Leaderboard')).toBeVisible();
  });

  test('home tracker table renders as stacked cards at mobile width, still readable and linked', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('.tracker-header')).toBeHidden();
    await expect(page.locator('.entry-card')).toHaveCount(7);
    const href = await page.locator('.entry-card').first().getAttribute('href');
    expect(href).toMatch(/^\/entries\/[a-z0-9-]+$/);
  });
});

// Runs under the `no-js` project (javaScriptEnabled: false) — FR-007, FR-009.
test.describe('Methodology page is readable without JavaScript', () => {
  test('all 4 sections are present and readable with JS disabled', async ({ page }) => {
    await page.goto('/methodology');

    await expect(page.getByRole('region', { name: 'Threat Tiers' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Evidence Types' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Content Integrity Rule' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Related Apps Grouping' })).toBeVisible();
  });

  test('the "Methodology" nav link is a real anchor pointing to /methodology, no click handler required', async ({
    page,
  }) => {
    await page.goto('/');
    const href = await page.getByRole('link', { name: 'Methodology' }).getAttribute('href');
    expect(href).toBe('/methodology');
  });
});
