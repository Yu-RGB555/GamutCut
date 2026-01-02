
// shape_typeから翻訳された図形名を取得する関数
export const getShapeDisplayName = (shapeType: string, t: any): string => {
  if (!shapeType) return t('shapes.unknown');
  return t(`shapes.${shapeType}`);
};

// マスクデータから図形名を取得する関数
export const getMaskDisplayName = (mask: { shape_type?: string }, index: number, t: any): string => {
  // shape_typeがある場合は翻訳
  if (mask.shape_type) {
    return getShapeDisplayName(mask.shape_type, t);
  }

  // フォールバック
  return t('mask_default_name', { index: index + 1 });
};