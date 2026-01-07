import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

export default createMiddleware({
  ...routing,
  alternateLinks: false, // ミドルウェアによるHTTPヘッダーへのhreflangの追加をオフ
});

export const config = {
  // ルートパスと言語プレフィックス付きのパスに対してミドルウェアを適用
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};