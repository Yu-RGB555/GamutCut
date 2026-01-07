import { Metadata } from 'next';

// hreflangタグとcanonicalタグを生成するヘルパー関数
export function generateAlternates(pathname: string, locale: string): Metadata['alternates'] {
  const baseUrl = process.env.FRONTEND_URL || 'https://www.gamutcut.com';

  // パスの正規化（先頭にスラッシュがない場合は追加、空文字の場合はそのまま）
  const normalizedPath = pathname === '' ? '' : pathname.startsWith('/') ? pathname : `/${pathname}`;

  return {
    canonical: `${baseUrl}/${locale}${normalizedPath}`,
    languages: {
      'en': `${baseUrl}/en${normalizedPath}`,
      'ja': `${baseUrl}/ja${normalizedPath}`,
      'x-default': `${baseUrl}/en${normalizedPath}`, // デフォルトはen
    },
  };
}
