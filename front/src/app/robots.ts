import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/settings/',
        '/mypage/',
        '/auth/',
        '/_next/',
        '/tmp/',
        '/private/',
      ],
    },
    sitemap: 'https://www.gamutcut.com/sitemap.xml',
  }
}