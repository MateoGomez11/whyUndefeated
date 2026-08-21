import { test, expect } from '@playwright/test';

test.describe('Global Alternatives Directory & Detail Integration', () => {
  test('navigates to /alternatives from NavBar and displays header & search', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Alternatives' }).first().click();

    await expect(page).toHaveURL(/\/alternatives/);
    await expect(page.getByRole('heading', { name: /Challenger Apps & Alternatives/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Search alternatives, tools/i)).toBeVisible();
  });

  test('detail page /entries/wikipedia renders Community Alternatives rail on the right', async ({ page }) => {
    await page.goto('/entries/wikipedia');

    // Header counter badge
    await expect(page.getByText(/\d+ Community Alternative/i)).toBeVisible();

    // Right sidebar rail
    await expect(page.getByRole('heading', { name: 'Community Alternatives' })).toBeVisible();
    await expect(page.getByText(/Tools & challengers built to compete with Wikipedia/i)).toBeVisible();

    // Submit alternative CTA link
    const cta = page.getByRole('link', { name: /\+ Submit/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /submit\?target=wikipedia/);
  });
});
