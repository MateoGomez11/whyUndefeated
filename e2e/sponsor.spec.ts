import { test, expect } from '@playwright/test';

test.describe('Sponsor Board & Live Telemetry (/sponsor)', () => {
  test('navigates to /sponsor from NavBar and loads all sections', async ({ page }) => {
    await page.goto('/');

    // Click Sponsors in nav
    const sponsorLink = page.locator('nav').getByRole('link', { name: 'Sponsors' });
    await expect(sponsorLink).toBeVisible();
    await sponsorLink.click();

    await expect(page).toHaveURL('/sponsor');

    // Hero headline and metrics
    await expect(page.getByRole('heading', { name: /Sponsor whyundefeated/i })).toBeVisible();
    await expect(page.getByText('Live', { exact: true })).toBeVisible();
    await expect(page.getByText('37', { exact: true })).toBeVisible();
    await expect(page.getByText('builders', { exact: true })).toBeVisible();
    await expect(page.getByText('5 Available')).toBeVisible();

    // 5 Sponsor slots on /sponsor page
    await expect(page.getByRole('heading', { name: 'The slots' })).toBeVisible();
    const slots = page.locator('main .entry-card[href^="http"], main .entry-card[href^="mailto:"]');
    await expect(slots).toHaveCount(5);

    // Pricing & benefits
    await expect(page.getByRole('heading', { name: 'Sponsorship Details' })).toBeVisible();
    await expect(page.getByText('$49', { exact: true })).toBeVisible();
    await expect(page.getByText('Fixed, Permanent Shelf Space')).toBeVisible();

    // Audience guide
    await expect(page.getByRole('heading', { name: 'Who sponsors here' })).toBeVisible();
    await expect(page.getByText('presence buyers')).toBeVisible();
    await expect(page.getByText('signup buyers')).toBeVisible();

    // Only one nav and one footer present
    await expect(page.locator('nav')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
  });

  test('slot cards have mailto claim links for open slots', async ({ page }) => {
    await page.goto('/sponsor');

    const openCards = page.locator('main .entry-card[href^="mailto:sponsors@whyundefeated.com"]');
    await expect(openCards).toHaveCount(5);
    await expect(openCards.first()).toContainText('AVAILABLE · OPEN');
  });

  test('live telemetry dashboard renders visitor stats and live stream banner', async ({ page }) => {
    await page.goto('/sponsor');

    const telemetryRegion = page.getByLabel('Live site telemetry and visitor map');
    await expect(telemetryRegion).toBeVisible();
    await expect(page.getByText('REAL-TIME VISITOR TELEMETRY')).toBeVisible();
    await expect(page.getByText('VISITOR TELEMETRY BY COUNTRY')).toBeVisible();
  });

  test('renders complete and readable content with JavaScript disabled', async ({ page }) => {
    await page.goto('/sponsor');

    // Page content must be fully present in initial HTML payload
    await expect(page.getByRole('heading', { name: /Sponsor whyundefeated/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The slots' })).toBeVisible();
    await expect(page.getByText('Available Slot 01').first()).toBeVisible();
  });

  test('The Verified Stack dock is visible and displays 5 rich cards', async ({ page }) => {
    await page.goto('/');

    const dock = page.getByLabel('The Verified Stack — 5 Fixed Sponsor Slots');
    await expect(dock).toBeVisible();
    await expect(page.getByText('5 FEATURED BUILDER TOOLS')).toBeVisible();

    // 5 cards inside the dock
    const dockCards = dock.locator('.stack-card');
    await expect(dockCards).toHaveCount(5);
  });
});
