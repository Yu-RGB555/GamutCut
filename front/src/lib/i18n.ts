// 翻訳
export type Locale = 'ja' | 'en';

interface TranslationKeys {
  shapes: {
    triangle: string;
    square: string;
    rectangle: string;
    circle: string;
    pentagon: string;
    hexagon: string;
    diamond: string;
    star: string;
    unknown: string;
  };
  mask: {
    defaultName: string;
    noMasks: string;
  };
}

const translations: Record<Locale, TranslationKeys> = {
  ja: {
    shapes: {
      triangle: '三角形',
      square: '四角形',
      rectangle: '四角形',
      circle: '円形',
      pentagon: '五角形',
      hexagon: '六角形',
      diamond: 'ダイヤ形',
      star: '星形',
      unknown: '不明な図形'
    },
    mask: {
      defaultName: 'マスク{index}',
      noMasks: 'マスクなし'
    }
  },
  en: {
    shapes: {
      triangle: 'Triangle',
      square: 'Square',
      rectangle: 'Rectangle',
      circle: 'Circle',
      pentagon: 'Pentagon',
      hexagon: 'Hexagon',
      diamond: 'Diamond',
      star: 'Star',
      unknown: 'Unknown Shape'
    },
    mask: {
      defaultName: 'Mask {index}',
      noMasks: 'No Masks'
    }
  }
};

// 現在の言語（将来的にユーザー設定から取得）
let currentLocale: Locale = 'ja';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const getLocale = (): Locale => currentLocale;

// 翻訳関数
export const t = (key: string, params?: Record<string, any>): string => {
  const keys = key.split('.');
  let value: any = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // キーが見つからない場合はキーをそのまま返す
    }
  }

  if (typeof value === 'string' && params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return typeof value === 'string' ? value : key;
};