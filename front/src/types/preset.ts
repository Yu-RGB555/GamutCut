export interface Preset {
  name: string;
  mask_data: {
    value: number;
    masks: Array<{
      originalPoints: Array<{ x: number; y: number }>;
      scale: number;
    }>;
  };
}