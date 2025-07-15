import { RegisterRequest, RegisterResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    throw new Error(data.message || 'ユーザー登録に失敗しました');
  }

  return data;
}