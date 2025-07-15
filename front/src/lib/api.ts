import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 新規登録用
export async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/sign_up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userData }),
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