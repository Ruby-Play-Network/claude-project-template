import { expect, test } from '@playwright/test';

test('shows the app name fetched from the API', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Welcome to Acrux' })).toBeVisible();
});
