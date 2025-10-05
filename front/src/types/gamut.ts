export interface Point {
  x: number;
  y: number;
}

export interface ShapeTemplate {
  id: number;
  shape_type: string; // データ保存用（英語）
  points: Point[];
  // name は削除：shape_type から動的に翻訳する
}

export interface ColorInfo {
  coordinates: string;
  hue: string;
  saturation: string;
  value: string;
  rgb: string;
}

// 拡大・縮小したマスク情報
export interface MaskWithScale {
  id: number;
  originalPoints: Point[];
  scale: number;
  shape_type: string; // 図形タイプ（英語）
  // name は削除：shape_type から動的に翻訳する
}