import createMiddleware from 'next-intl/middleware';
import {routing} from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // ルートパスと言語プレフィックス付きのパスに対してミドルウェアを適用
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};