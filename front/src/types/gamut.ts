export interface Point {
  x: number;
  y: number;
}

export interface ShapeTemplate {
  id: number;
  name: string;
  points: Point[];
}

export interface ColorInfo {
  coordinates: string;
  hue: string;
  saturation: string;
  value: string;
  rgb: string;
}

export interface MaskWithScale extends ShapeTemplate {
  scale: number;
  originalPoints: Point[];
}