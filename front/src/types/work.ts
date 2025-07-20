export interface Work{
  id: number;
  title: string;
  description: string;
  illustration_image_url?: string;
  set_mask_data?: any;
  is_public: string;
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}