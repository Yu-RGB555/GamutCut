import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';
import { Work } from '@/types/work';
import { Preset } from '@/types/preset';

// API_URLの取得
const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://localhost:3002';
};

const API_BASE_URL = getApiBaseUrl();

// 共通ヘッダーの設定
const getCommonHeaders = (includeAuth: boolean = true, includeContentType: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Accept-Language': navigator.language || 'ja',
  };

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// 新規登録用
export async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/sign_up`, {
    method: 'POST',
    headers: getCommonHeaders(false),
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
    headers: getCommonHeaders(false),
    credentials: 'include',
    body: JSON.stringify({ user: userData }),
  });

  const data = await response.json();
  console.log('data：', data);

  if(!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

// 作品一覧取得
export async function getWorks(): Promise<Work[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works`, {
    method: 'GET',
    headers: getCommonHeaders(true, true), // 認証ヘッダーを含める
  });

  // JSONをパースせずにテキストで受け取る
  const text = await response.text();

  if(!response.ok){
    throw new Error('作品一覧の取得に失敗しました');
  }

  try {
    const data = JSON.parse(text);
    return data.works;
  } catch (error) {
    throw new Error('APIレスポンスがJSONではありません');
  }
}

// 作品詳細
export async function showWork(workId: number): Promise<Work> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}`, {
    method: 'GET',
    headers: getCommonHeaders(true, true), // 認証ヘッダーを含める
  });

  if (!response.ok) {
    throw new Error('作品の表示に失敗しました');
  }

  return response.json();
}

// 作品投稿
export async function postWork(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/works`, {
    method: 'POST',
    headers: getCommonHeaders(true, false),
    body: formData,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.errors ? JSON.stringify({ errors: data.errors }) : data.message || '作品の投稿に失敗しました';
    throw new Error(errorMessage);
  }

  return data;
};

// 作品更新
export async function updateWork(submitData: FormData, workId: number): Promise<{ message: string}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}`, {
    method: 'PATCH',
    headers: getCommonHeaders(true, false),
    body: submitData
  });

  if (!response.ok) {
    const data = await response.json();
    const errorMessage = data.errors ? JSON.stringify({ errors: data.errors }) : data.message;
    throw new Error(errorMessage);
  }

  return response.json();
}

// 作品削除
export async function deleteWork(workId: number): Promise<{ message: string }>{
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}`, {
    method: 'DELETE',
    headers: getCommonHeaders(true, true),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('作品の削除に失敗しました');
  }

  return response.json();
}

// 作品の画像をBlobとして取得（バックエンド経由）
export async function getWorkImageBlob(workId: number): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}/image`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('画像の取得に失敗しました');
  }

  return response.blob();
}

// Myマスク保存
export async function maskSave(presetData: Preset): Promise<{ message: string}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/presets`, {
    method: 'POST',
    headers: getCommonHeaders(true, true),
    body: JSON.stringify(presetData)
  });

  if (!response.ok) {
    throw new Error('マスクの保存に失敗しました');
  }

  return response.json();
}

// Myマスク削除
export async function deletePreset(presetId: number): Promise<{ message: string}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/presets/${presetId}`, {
    method: 'DELETE',
    headers: getCommonHeaders(true, true),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('マスクの削除に失敗しました')
  }

  return response.json();
}

// Myマスク一覧取得
export async function getPresets(): Promise<Preset[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/presets`, {
    method: 'GET',
    headers: getCommonHeaders(true, true),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error('Myマスク一覧の取得に失敗しました');
  }

  try {
    const data = JSON.parse(text);
    return data.presets;
  } catch (error) {
    throw new Error('APIレスポンスがJSONではありません');
  }
}

// いいね追加・削除
export async function toggleLike(workId: number, isLiked: boolean): Promise<{ liked: boolean; likes_count: number; message: string }> {
  const method = isLiked ? 'DELETE' : 'POST';

  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}/like`, {
    method,
    headers: getCommonHeaders(true, true),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('いいね処理に失敗しました');
  }

  return response.json();
}