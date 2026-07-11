import { expect, test } from '@playwright/test';

/**
 * メンテナンスモードガードのテスト
 * front/.env の NEXT_PUBLIC_MAINTENANCE_MODE=true（常時メンテモード）前提。
 * API依存セグメント（auth / users / comments / settings / mypage / work）は
 * 各セグメントの layout.tsx の MaintenanceGuard により MaintenancePage が表示される。
 * 見出し文言: messages/en.json の Maintenance.page_unavailable_title
 */
const guardedRoutes = [
  '/en/work',
  '/en/work/new',
  // work/[id] はサーバーページだが、レイアウトガードにより描画されず
  // ページ内の redirect('/') も発火しない（他ルートと同じ MaintenancePage 表示になる）
  '/en/work/1',
  '/en/auth/login',
  '/en/auth/register',
  '/en/settings',
  '/en/settings/password',
  '/en/mypage',
  '/en/users/1',
  '/en/comments/1',
];

test.describe('メンテナンスモードガード', () => {
  for (const route of guardedRoutes) {
    test(`${route} はメンテナンスページを表示する`, async ({ page }) => {
      await page.goto(route);
      await expect(
        page.getByRole('heading', { name: 'Feature Temporarily Unavailable' })
      ).toBeVisible();
    });
  }

  test('/en/mask はメンテナンス中も利用できる', async ({ page }) => {
    await page.goto('/en/mask');
    await expect(
      page.getByRole('heading', { name: 'Feature Temporarily Unavailable' })
    ).toHaveCount(0);
    await expect(page.locator('canvas').first()).toBeVisible();
  });
});
