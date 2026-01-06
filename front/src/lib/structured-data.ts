type GenerateJsonLdParams = {
  description: string;
  inLanguage: string;
  keywords: string;
}

// localeを取得するために動的なJsonLdを採用（layout.tsxで呼び出し）
export const generateJsonLd = ({ description, inLanguage, keywords }: GenerateJsonLdParams) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'datePublished': '2025-11-08T00:00:00+09:00',
    'dateModified': new Date().toISOString(),
    name: 'GamutCut',
    description: description,
    url: process.env.FRONTEND_URL,
    applicationCategory: 'DesignApplication',
    applicationSubCategory: 'Digital Art Tool',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    creator: {
      '@type': 'Organization',
      name: 'GamutCut',
    },
    inLanguage: inLanguage,
    keywords: keywords,
    featureList: [
      'ガマットマスク作成',
      'PNG形式エクスポート',
      'ログイン不要',
      'HSV色相環モデル',
      '作品投稿機能',
      'シェア機能',
      'プリセット保存'
    ],
    screenshot: `${process.env.FRONTEND_URL}/opengraph-image.png`,
  }
}