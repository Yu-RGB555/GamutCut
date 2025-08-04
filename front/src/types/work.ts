import { MaskData } from "./mask";

export interface Work{
  id: number;
  title: string;
  description: string;
  illustration_image_url?: string;
  filename: string;
  filesize: number;
  set_mask_data: MaskData;
  is_public: string;
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  message?: string;
  created_at: string;
  updated_at: string;
}