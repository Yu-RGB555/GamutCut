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
const getCommonHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept-Language': navigator.language || 'ja',
  };

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

  if(!response.ok) {
    // エラーレスポンスの構造に合わせて修正
    const errorMessage = data.errors ? JSON.stringify({ errors: data.errors }) : data.message || 'ログインに失敗しました';
    throw new Error(errorMessage);
  }

  return data;
}

// 作品一覧取得
export async function getWorks(): Promise<Work[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ⚠️ JSONをパースせずにテキストで受け取る
  const text = await response.text();
  // console.log('APIレスポンス（text）:', text);

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
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('作品の表示に失敗しました');
  }

  return response.json();
}

// 作品投稿
export async function postWork(formData: FormData) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/v1/works`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('作品の投稿に失敗しました');
  }

  return response.json();
};

// 作品更新
export async function updateWork(submitData: FormData, workId: number) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: submitData
  });

  if(!response.ok) {
    throw new Error('投稿作品の更新に失敗しました');
  }
}

// 作品削除
export async function deleteWork(workId: number): Promise<void>{
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('作品の削除に失敗しました');
  }
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

// プリセット保存
export async function maskSave(presetData: Preset) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/v1/presets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(presetData)
  });

  if (!response.ok) {
    throw new Error('プリセットの保存に失敗しました');
  }

  return response.json();
}

// プリセット一覧取得
export async function getPresets(): Promise<Preset[]> {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/v1/presets`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error('プリセット一覧の取得に失敗しました');
  }

  try {
    const data = JSON.parse(text);
    return data.presets;
  } catch (error) {
    throw new Error('APIレスポンスがJSONではありません');
  }
}