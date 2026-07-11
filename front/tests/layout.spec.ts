import { expect, test } from '@playwright/test';

/**
 * 共通レイアウトのスモークテスト（フロントのみで完結）
 *
 * 注意: 開発環境は front/.env の NEXT_PUBLIC_MAINTENANCE_MODE=true で
 * 常時メンテナンスモード。ホーム（紹介ページ）や認証ページは表示されないため、
 * ここではメンテナンスモードでも表示される共通レイアウトのみを検証する。
 * ホーム・ログインのテストはメンテナンス解除後に追加すること。
 */
test.describe('共通レイアウト', () => {
  test('ヘッダーのロゴが表示される', async ({ page }) => {
    await page.goto('/en/mask');
    await expect(page.getByRole('link', { name: 'GamutCut' })).toBeVisible();
  });
});
