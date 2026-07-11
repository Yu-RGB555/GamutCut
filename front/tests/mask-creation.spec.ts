import { expect, test } from '@playwright/test';

/**
 * ガマットマスク作成ページのテスト（フロントのみで完結）
 *
 * このページの中核機能（色相環描画・マスク追加/削除・PNGエクスポート）は
 * Canvas API ベースでバックエンドに依存しない。
 * API依存の機能（Myマスク保存・プリセット一覧）はここではテストしない。
 *
 * 文言は messages/en.json の CreateMask セクションに対応。
 */
test.describe('ガマットマスク作成', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/mask');
  });

  test('色相環キャンバスと基本操作UIが表示される', async ({ page }) => {
    await expect(page.locator('canvas').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Value' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Rotation' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Mask' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
  });

  test('マスクを追加すると操作UIが現れ、削除で消える', async ({ page }) => {
    // 「Add Mask」→ 図形選択ダイアログ → Triangle を選択
    await page.getByRole('button', { name: 'Add Mask' }).click();
    await expect(page.getByRole('dialog')).toContainText('Select Gamut Mask');
    await page.getByRole('button', { name: 'Triangle' }).click();

    // ダイアログが閉じ、マスク名（図形名）・拡縮スライダー・削除ボタンが表示される
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Triangle' })).toBeVisible();
    await expect(page.getByText('Zoom In/Out')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Mask' })).toBeVisible();

    // 削除するとマスク関連UIが消える
    await page.getByRole('button', { name: 'Delete Mask' }).click();
    await expect(page.getByRole('button', { name: 'Triangle' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Delete Mask' })).toBeHidden();
  });

  test('マスクは3つまで追加でき、4つ目はアラートが表示される', async ({ page }) => {
    // 図形名がマスク名になるため、3種類を1つずつ追加して名前を一意にする
    for (const shape of ['Triangle', 'Square', 'Circle']) {
      await page.getByRole('button', { name: 'Add Mask' }).click();
      await page.getByRole('dialog').getByRole('button', { name: shape }).click();
      await expect(page.getByRole('button', { name: shape })).toBeVisible();
    }

    // 4つ目の追加はアラートで拒否される（alert_max_masks）
    await page.getByRole('button', { name: 'Add Mask' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Triangle' }).click();
    await expect(page.getByText('You can add up to 3 masks.')).toBeVisible();

    // ダイアログを閉じ、Triangle のマスクが増えていない（1つのまま）ことを確認
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Triangle' })).toHaveCount(1);
  });

  test('DownloadボタンでマスクつきPNGがダウンロードされる', async ({ page }) => {
    // Canvasのエクスポートはフロント完結（canvas.toBlob → aタグクリック）
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('masked-color-wheel.png');
  });
});
