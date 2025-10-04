export interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

export interface CommentDetail extends Comment {
  work: {
    id: number;
    title: string;
    illustration_image_url?: string;
    user: {
      id: number;
      name: string;
      avatar_url?: string;
    };
  };
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateCommentResponse {
  message: string;
  comment: Comment;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentResponse {
  message: string;
  comment: Comment;
}

export interface DeleteCommentResponse {
  message: string;
}