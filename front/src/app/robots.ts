import { MetadataRoute } from 'next'
import { isMaintenanceMode } from '@/lib/maintenance'

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    '/api/',
    '/settings/',
    '/mypage/',
    '/auth/',
    '/_next/',
    '/tmp/',
    '/private/',
  ]

  // メンテナンスモード中はバックエンド依存のパスをクロール対象外にする
  if (isMaintenanceMode()) {
    disallow.push('/work/', '/users/')
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow,
    },
    sitemap: 'https://www.gamutcut.com/sitemap.xml',
  }
}