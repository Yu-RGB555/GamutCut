import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from './client-layout'

export const metadata: Metadata = {
  title: 'GamutCut - ガマットマスク制作サイト',
  description: '着彩に悩むイラストレーターへ',
  openGraph: {
    title: 'GamutCut - ガマットマスク制作サイト',
    description: '着彩に悩むイラストレーターへ',
    siteName: 'GamutCut',
    images: [
      {
        url: '/og-image.png', // 1200x630の専用OG画像を推奨
        width: 1200,
        height: 630,
        alt: 'GamutCut - ガマットマスク制作サイト',
      },
    ],
    url: process.env.FRONTEND_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GamutCut - ガマットマスク制作サイト',
    description: '着彩に悩むイラストレーターへ',
    images: ['/og-image.png'], // 同じ画像を使用
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: 'GamutCut' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-screen bg-background">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}