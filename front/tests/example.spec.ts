import { expect, test } from '@playwright/test';

test('login page', async ({ page }) => {
  await page.goto('/auth/login');
  await expect(page.getByTestId('login-submit')).toBeVisible();
});