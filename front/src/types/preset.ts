import { MaskData } from "./mask";

export interface Preset {
  id: number;
  name: string; // Myマスクのタイトル名
  mask_data: MaskData;
  message?: string;
}