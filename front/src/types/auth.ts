// === 新規登録用 ===
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
  };
  errors?: string[];
}

// === ログイン用 ===
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
  };
  errors?: string[];
}

// AuthContext・プロフィール情報取得用
export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  x_account_url?: string;
  has_social_accounts?: boolean; // SNS認証アカウントかどうか（アクセス制限用）
}

// === プロフィール更新用 ===
export interface UpdateProfileRequest {
  name?: string;
  avatar?: File;
  bio?: string;
  x_account_url?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
  errors?: string[];
}

// === パスワード変更 ===
export interface PasswordUpdateRequest {
  password: string;
  password_confirmation: string;
}

export interface PasswordUpdateResponse {
  message: string;
  errors?: string[];
}