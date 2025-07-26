// 新規登録用
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
  };
  errors?: string[];
}

// ログイン用
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
  };
  errors?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}