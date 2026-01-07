import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// 利用可能な言語とデフォルト言語を設定
export const routing = defineRouting({
  locales: ['en', 'ja'],
  defaultLocale: 'en',
  // 常にロケールプレフィックスを表示（例. /work ではなく /en/work）
  localePrefix: 'always'
});

// ロケール対応のナビゲーションヘルパーをエクスポート
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);