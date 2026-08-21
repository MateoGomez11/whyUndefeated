import { test, expect } from '@playwright/test';

test.describe('Verdict voting widget (US1)', () => {
  test('visitor can vote Agree on an entry and see the count update (SC-001, FR-001, FR-003)', async ({ page }) => {
    let voteStore = { agree: 0, disagree: 0 };

    await page.route('**/rest/v1/vote_counts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { choice: 'agree', votes: voteStore.agree },
          { choice: 'disagree', votes: voteStore.disagree },
        ]),
      });
    });

    await page.route('**/rest/v1/votes*', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        if (postData?.choice === 'agree') {
          voteStore.agree += 1;
        } else if (postData?.choice === 'disagree') {
          voteStore.disagree += 1;
        }
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/entries/pinterest');

    const widget = page.getByRole('region', { name: /community verdict reaction|verdict votes|vote/i });
    await expect(widget).toBeVisible();

    const agreeButton = widget.getByRole('button', { name: /^agree/i });
    const disagreeButton = widget.getByRole('button', { name: /^disagree/i });

    await expect(agreeButton).toBeVisible();
    await expect(disagreeButton).toBeVisible();

    // Initial state: 0 votes
    await expect(agreeButton).toContainText('0');
    await expect(disagreeButton).toContainText('0');

    // Click Agree
    await agreeButton.click();

    // Count updates to 1 and indicates current choice
    await expect(agreeButton).toContainText('1');
    await expect(agreeButton).toHaveAttribute('aria-pressed', 'true');
    await expect(disagreeButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('visitor can change vote from Agree to Disagree and count moves (FR-002, FR-003)', async ({ page }) => {
    let voteStore = { agree: 0, disagree: 0 };
    let currentVoterChoice: string | null = null;

    await page.route('**/rest/v1/vote_counts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { choice: 'agree', votes: voteStore.agree },
          { choice: 'disagree', votes: voteStore.disagree },
        ]),
      });
    });

    await page.route('**/rest/v1/votes*', async (route) => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        if (currentVoterChoice === 'agree' && postData?.choice === 'disagree') {
          voteStore.agree = Math.max(0, voteStore.agree - 1);
          voteStore.disagree += 1;
        } else if (currentVoterChoice === 'disagree' && postData?.choice === 'agree') {
          voteStore.disagree = Math.max(0, voteStore.disagree - 1);
          voteStore.agree += 1;
        } else if (!currentVoterChoice) {
          if (postData?.choice === 'agree') voteStore.agree += 1;
          if (postData?.choice === 'disagree') voteStore.disagree += 1;
        }
        currentVoterChoice = postData?.choice;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/entries/pinterest');

    const widget = page.getByRole('region', { name: /community verdict reaction|verdict votes|vote/i });
    const agreeButton = widget.getByRole('button', { name: /^agree/i });
    const disagreeButton = widget.getByRole('button', { name: /^disagree/i });

    // Vote Agree first
    await agreeButton.click();
    await expect(agreeButton).toContainText('1');
    await expect(disagreeButton).toContainText('0');
    await expect(agreeButton).toHaveAttribute('aria-pressed', 'true');

    // Switch to Disagree
    await disagreeButton.click();
    await expect(agreeButton).toContainText('0');
    await expect(disagreeButton).toContainText('1');
    await expect(agreeButton).toHaveAttribute('aria-pressed', 'false');
    await expect(disagreeButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('vote choice is remembered across page reloads with same localStorage (FR-004)', async ({ page }) => {
    let voteStore = { agree: 1, disagree: 0 };

    await page.route('**/rest/v1/vote_counts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { choice: 'agree', votes: voteStore.agree },
          { choice: 'disagree', votes: voteStore.disagree },
        ]),
      });
    });

    await page.route('**/rest/v1/votes*', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/entries/pinterest');

    const widget = page.getByRole('region', { name: /community verdict reaction|verdict votes|vote/i });
    const agreeButton = widget.getByRole('button', { name: /^agree/i });

    await agreeButton.click();
    await expect(agreeButton).toHaveAttribute('aria-pressed', 'true');

    // Reload page
    await page.reload();

    const reloadedWidget = page.getByRole('region', { name: /community verdict reaction|verdict votes|vote/i });
    const reloadedAgreeButton = reloadedWidget.getByRole('button', { name: /^agree/i });
    await expect(reloadedAgreeButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('buttons are disabled while vote request is in flight to prevent multi-clicks (FR-010)', async ({ page }) => {
    let resolveVotePromise: () => void;
    const votePromise = new Promise<void>((resolve) => {
      resolveVotePromise = resolve;
    });

    await page.route('**/rest/v1/vote_counts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { choice: 'agree', votes: 0 },
          { choice: 'disagree', votes: 0 },
        ]),
      });
    });

    await page.route('**/rest/v1/votes*', async (route) => {
      await votePromise;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/entries/pinterest');

    const widget = page.getByRole('region', { name: /community verdict reaction|verdict votes|vote/i });
    const agreeButton = widget.getByRole('button', { name: /^agree/i });
    const disagreeButton = widget.getByRole('button', { name: /^disagree/i });

    await agreeButton.click({ noWaitAfter: true });

    // Buttons should be disabled during flight
    await expect(agreeButton).toBeDisabled();
    await expect(disagreeButton).toBeDisabled();

    // Resolve flight
    resolveVotePromise!();

    await expect(agreeButton).toBeEnabled();
    await expect(disagreeButton).toBeEnabled();
  });
});

test.describe('Graceful degradation when Supabase is unavailable (US2)', () => {
  test('detail page renders completely when Supabase returns 500 error (SC-002, FR-007)', async ({ page }) => {
    await page.route('**/rest/v1/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await page.goto('/entries/pinterest');

    // Main content remains intact
    await expect(page.locator('h1')).toHaveText('Pinterest');
    await expect(page.getByText('LOW THREAT').first()).toBeVisible();
    await expect(page.getByRole('region', { name: 'Moat' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Sources' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Related apps' })).toBeVisible();

    // Widget shows unavailable state gracefully
    const widget = page.getByRole('region', { name: /community verdict reaction|verdict votes|vote/i });
    await expect(widget).toBeVisible();
    await expect(widget).toContainText(/voting unavailable/i);
  });

  test('write failure shows non-intrusive message and rolls back optimistic count (FR-008)', async ({ page }) => {
    await page.route('**/rest/v1/vote_counts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { choice: 'agree', votes: 3 },
          { choice: 'disagree', votes: 1 },
        ]),
      });
    });

    await page.route('**/rest/v1/votes*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Database write error' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/entries/pinterest');

    const widget = page.getByRole('region', { name: /community verdict reaction|verdict votes|vote/i });
    const agreeButton = widget.getByRole('button', { name: /^agree/i });

    await expect(agreeButton).toContainText('3');

    // Click agree
    await agreeButton.click();

    // Error alert is displayed
    const alert = widget.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/could not be recorded/i);

    // Count is rolled back to original 3
    await expect(agreeButton).toContainText('3');
    await expect(agreeButton).toHaveAttribute('aria-pressed', 'false');

    // Rest of the page remains intact
    await expect(page.locator('h1')).toHaveText('Pinterest');
    await expect(page.getByRole('region', { name: 'Moat' })).toBeVisible();
  });
});
