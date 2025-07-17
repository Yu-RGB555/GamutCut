import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';

// 環境に応じたAPI URLの取得
const getApiBaseUrl = (): string => {
  // Vercelの環境変数を優先
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // フォールバック（開発環境）
  return 'http://localhost:3002';
};

const API_BASE_URL = getApiBaseUrl();

// ⚠️デバッグ用（本番では削除推奨）
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

// 新規登録用
export async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/sign_up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userData }),
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

// ログイン用
export async function loginUser(userData: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/sign_in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ user: userData }),
  });

  const data = await response.json();

  if(!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

// ログアウト用
export async function logoutUser(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/sign_out`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if(!response.ok){
    throw new Error('ログアウトに失敗しました');
  }
}