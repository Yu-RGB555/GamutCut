import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/auth';
import { Work } from '@/types/work';
import { Preset } from '@/types/preset';


// 環境に応じたAPI URLの取得
const getApiBaseUrl = (): string => {
  // Vercelの環境変数を優先
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 開発環境
  return 'http://localhost:3002';
};

const API_BASE_URL = getApiBaseUrl();

// ⚠️デバッグ用（MVPで削除）
// console.log('API_BASE_URL:', API_BASE_URL);

// ⚠️Next.js側で実行するテスト用コード（MVPで削除）
// export async function testApiConnection() {
//   try {
//     // 基本的なヘルスチェック
//     const healthResponse = await fetch(`${API_BASE_URL}/health`);
//     const healthData = await healthResponse.json();
//     console.log('Health check:', healthData);

//     // 詳細なヘルスチェック
//     const detailedResponse = await fetch(`${API_BASE_URL}/health/detailed`);
//     const detailedData = await detailedResponse.json();
//     console.log('Detailed health check:', detailedData);

//   } catch (error) {
//     console.error('API connection failed:', error);
//   }
// };

// 新規登録用
export async function registerUser(userData: RegisterRequest): Promise<RegisterResponse> {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/users/sign_up`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
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
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/api/users/sign_in`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
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

  if(!response.ok) {
    throw new Error('作品の削除に失敗しました')
  }
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