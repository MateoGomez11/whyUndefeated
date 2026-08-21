import { test, expect } from '@playwright/test';

test.describe('Community Alternatives Submit Flow (/submit)', () => {
  test('navigates to /submit from NavBar and renders all form controls', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Submit' }).first().click();

    await expect(page).toHaveURL(/\/submit/);
    await expect(page.getByRole('heading', { name: /Submit a Challenger/i })).toBeVisible();

    // Form inputs
    await expect(page.getByLabel(/Which company or app does it challenge/i)).toBeVisible();
    await expect(page.getByLabel(/Alternative App Name/i)).toBeVisible();
    await expect(page.getByLabel(/Website \/ Repository URL/i)).toBeVisible();
    await expect(page.getByLabel(/Short Description/i)).toBeVisible();
    await expect(page.getByLabel(/Founder \/ Contact Email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit Alternative for Review/i })).toBeVisible();
  });

  test('pre-selects target app if ?target=wikipedia is in URL', async ({ page }) => {
    await page.goto('/submit?target=wikipedia');
    const select = page.getByLabel(/Which company or app does it challenge/i);
    await expect(select).toHaveValue('wikipedia');
  });

  test('validates required fields before submitting', async ({ page }) => {
    await page.goto('/submit');
    await page.getByRole('button', { name: /Submit Alternative for Review/i }).click();

    await expect(page.getByText('App name is required.')).toBeVisible();
  });
});
