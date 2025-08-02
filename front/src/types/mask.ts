export interface MaskData {
  value: number;
  masks: Array<{
    originalPoints: Array<{ x: number; y: number }>;
    scale: number;
  }>;
}