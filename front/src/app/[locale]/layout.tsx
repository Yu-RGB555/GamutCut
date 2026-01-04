import type { Metadata } from 'next'
import '../globals.css'
import { ClientLayout } from './client-layout'
import { jsonLd } from '@/lib/structured-data'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

export const metadata: Metadata = {
  title: 'GamutCut - ガマットマスク制作サイト',
  description: 'GamutCut（ガマットカット）は、統一感を生み出せる着彩法『ガマットマッピング』で用いる『ガマットマスク』をログインせずに作成できるツールサイトです。デジタルイラストに適したHSV色相環モデルを扱っているため、幅広いグラフィックペイントソフトでお使いいただけます。',
  alternates: {
    canonical: `${process.env.FRONTEND_URL}/`,
  },
  keywords: [
    'ガマットマッピング',
    'ガマットマスク',
    'ガマットマスク ツール',
    'Gamut Mask',
    'Gamut Mask Tool',
    'GamutCut',
    'デジタルイラスト',
    '着彩',
    '色相環',
    'HSV',
    'イラスト制作',
    'カラーパレット',
    'デジタルアート',
    '配色',
    'Digital Art Tool'
  ],
  openGraph: {
    title: 'GamutCut - ガマットマスク制作サイト',
    description: 'デジタルイラストの着彩に統一感を生み出すガマットマスク制作ツール。ログイン不要で今すぐ使える！',
    siteName: 'GamutCut',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'GamutCut - ガマットマスク制作サイト',
      },
    ],
    url: process.env.FRONTEND_URL,
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GamutCut - ガマットマスク制作サイト',
    description: 'デジタルイラストの着彩に統一感を生み出すガマットマスク制作ツール',
    images: ['/opengraph-image.png'],
    creator: '@GamutCut',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  authors: [{ name: 'GamutCut' }],
  creator: 'GamutCut',
  publisher: 'GamutCut',
  category: 'Technology',
  classification: 'Digital Art Tool',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/app_logo.svg',
  },
  manifest: '/manifest.json',
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  // paramsから 'ja' or 'en' を取得
  const { locale } = await params;

  // 言語ファイルを読み込み
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Google Analytics スニペット */}
        {process.env.NEXT_PUBLIC_GA_ID && process.env.NODE_ENV === 'production' && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background">
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}