export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GamutCut',
  description: 'デジタルイラストの着彩に統一感を生み出すガマットマスク制作ツール。ログイン不要で今すぐ使える！',
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
  inLanguage: 'ja',
  keywords: 'ガマットマスク, デジタルイラスト, 着彩, 色相環, HSV, イラスト制作',
  featureList: [
    'ガマットマスク作成',
    'PNG形式エクスポート',
    'ログイン不要',
    'HSV色相環モデル',
    '作品投稿機能',
    'シェア機能',
    'プリセット保存'
  ],
  screenshot: `${process.env.FRONTEND_URL}/og-image.png`,
}