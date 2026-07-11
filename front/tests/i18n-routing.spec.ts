import { expect, test } from '@playwright/test';

/**
 * i18nルーティングのスモークテスト（フロントのみで完結）
 * src/i18n/routing.ts: locales ['en', 'ja'] / defaultLocale 'en' / localePrefix 'always'
 */
test.describe('i18nルーティング', () => {
  test('ルートパスはデフォルトロケール /en にリダイレクトされる', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('/ja 配下は日本語ロケールで表示される', async ({ page }) => {
    await page.goto('/ja/mask');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  });

  test('/en 配下は英語ロケールで表示される', async ({ page }) => {
    await page.goto('/en/mask');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
