export interface Tag {
  id: number;
  name: string;
  works_count?: number; // タグが付けられた作品数
  created_at: string;
  updated_at: string;
}
