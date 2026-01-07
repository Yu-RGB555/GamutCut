import type { Metadata } from 'next'
import '../globals.css'
import { ClientLayout } from './client-layout'
import { generateJsonLd } from '@/lib/structured-data'
import { getMessages, getTranslations } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'ガマットマッピング',
      'ガマットマスク',
      'ガマットマスク ツール',
      'Gamut Mapping',
      'Gamut Mask',
      'Gamut Mask Tool',
      'GamutCut',
      'デジタルイラスト',
      '着彩',
      '色相環',
      'イラスト制作',
      'カラーパレット',
      'デジタルアート',
      '配色',
      'Digital Art Tool'
    ],
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      siteName: 'GamutCut',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: t('og_title'),
        },
      ],
      type: 'website',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitter_title'),
      description: t('twitter_description'),
      images: ['/opengraph-image.png'],
      creator: '@GamutCut',
    },
    metadataBase: new URL(process.env.FRONTEND_URL!),
    alternates: {
      canonical: './',
      languages: {
        'en': '/en',
        'ja': '/ja',
      },
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
  };
}

export default async function RootLayout({ children, params }: Props) {
  // paramsから 'ja' or 'en' を取得
  const { locale } = await params;

  // 言語ファイルを読み込み
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  // 構造化データを生成
  const keywords = locale === 'ja' ?
    'ガマットマスク, ガマットマッピング, デジタルイラスト, 着彩, 色相環, HSV, イラスト制作' :
    'Gamut Mask, Gamut Mapping, Digital Art, Coloring, Color Wheel, HSV, Illustration Tool';

  const structuredData = generateJsonLd({
    description: t('description'),
    inLanguage: locale,
    keywords: keywords
  });

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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