import { t } from './i18n';

// shape_typeから翻訳された図形名を取得する関数
export const getShapeDisplayName = (shapeType: string): string => {
  if (!shapeType) return t('shapes.unknown');
  return t(`shapes.${shapeType}`) || t('shapes.unknown');
};

// マスクデータから図形名を取得する関数
export const getMaskDisplayName = (mask: any, index: number): string => {
  // shape_typeがある場合は翻訳
  if (mask.shape_type) {
    return getShapeDisplayName(mask.shape_type);
  }

  // フォールバック
  return t('mask.defaultName', { index: index + 1 });
};