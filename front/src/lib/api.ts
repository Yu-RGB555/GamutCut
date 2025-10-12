import { LoginRequest, LoginResponse, PasswordUpdateRequest, PasswordUpdateResponse, RegisterRequest, RegisterResponse, UpdateProfileResponse, User } from '@/types/auth';
import { Work } from '@/types/work';
import { Preset } from '@/types/preset';
import { Tag } from '@/types/tag';
import { Comment, CommentDetail, CreateCommentRequest, CreateCommentResponse, DeleteCommentResponse, UpdateCommentRequest, UpdateCommentResponse } from '@/types/comment';

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

  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
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
    headers: getCommonHeaders(true, false),
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

// 検索機能付き作品一覧取得
export async function getWorksWithSearch(searchQuery?: string, tagName?: string, sortTerm?: string): Promise<Work[]> {
  const params = new URLSearchParams();

  if (searchQuery && searchQuery.trim()) {
    const trimmedQuery = searchQuery.trim();

    // 複数キーワード検索に対応
    if (trimmedQuery.includes(' ') || trimmedQuery.includes('　')) {
      // スペースが含まれる場合は複合キーワードとして検索
      params.set('q[multi_keyword_search]', trimmedQuery);
    } else {
      // 単一キーワードの場合
      params.set('q[title_or_user_name_cont]', trimmedQuery);
    }
  }

  // タグフィルタリング
  if (tagName && tagName.trim()) {
    params.set('q[tags_name_eq]', tagName.trim());
  }

  // 並べ替え
  if (sortTerm) {
    params.set('q[sort_term_name_eq]', sortTerm);
  }

  const url = `${API_BASE_URL}/api/v1/works${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getCommonHeaders(true, false),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error('作品検索に失敗しました');
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
    headers: getCommonHeaders(true, true),
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

// Myマスク名更新
export async function updatePreset(presetId: number, name: string): Promise<{ message: string}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/presets/${presetId}`, {
    method: 'PATCH',
    headers: getCommonHeaders(true, true),
    body: JSON.stringify({ name })
  });

  if (!response.ok) {
    throw new Error('マスク名の更新に失敗しました');
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

// ブックマーク追加・削除
export async function toggleBookmark(workId: number, isBookmarked: boolean): Promise<{ bookmarked: boolean; message: string }> {
  const method = isBookmarked ? 'DELETE' : 'POST';

  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}/bookmark`, {
    method,
    headers: getCommonHeaders(true, true),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('ブックマーク処理に失敗しました');
  }

  return response.json();
}

// 人気タグ一覧取得
export async function getPopularTags(limit: number = 10): Promise<Tag[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/tags/popular?limit=${limit}`, {
    method: 'GET',
    headers: getCommonHeaders(false, false),
  });

  if (!response.ok) {
    throw new Error('人気タグの取得に失敗しました');
  }

  const data = await response.json();
  return data.tags || [];
}

// === コメント関連のAPI ===

// コメント一覧取得
export async function getComments(workId: number): Promise<Comment[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}/comments`, {
    method: 'GET',
    headers: getCommonHeaders(true, false),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('コメントの取得に失敗しました');
  }

  return response.json();
}

// コメント投稿
export async function createComment(workId: number, commentData: CreateCommentRequest): Promise<CreateCommentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}/comments`, {
    method: 'POST',
    headers: getCommonHeaders(true, true),
    body: JSON.stringify({ comment: commentData }),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'コメントの投稿に失敗しました');
  }

  return response.json();
}

// コメント更新
export async function updateComment(workId: number, commentId: number, commentData: UpdateCommentRequest): Promise<UpdateCommentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}/comments/${commentId}`, {
    method: 'PATCH',
    headers: getCommonHeaders(true, true),
    body: JSON.stringify({ comment: commentData }),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'コメントの更新に失敗しました');
  }

  return response.json();
}

// コメント削除
export async function deleteComment(workId: number, commentId: number): Promise<DeleteCommentResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/works/${workId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getCommonHeaders(true, true),
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'コメントの削除に失敗しました');
  }

  return response.json();
}

// 単体コメント詳細取得（通知機能用）
export async function getCommentDetail(commentId: number): Promise<CommentDetail> {
  const response = await fetch(`${API_BASE_URL}/api/v1/comments/${commentId}`, {
    method: 'GET',
    headers: getCommonHeaders(true, false),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('コメントの取得に失敗しました');
  }

  return response.json();
}

// プロフィール取得（認証済みユーザー自身のプロフィール）
export async function getProfile(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'GET',
    headers: getCommonHeaders(true, true),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('プロフィール情報の取得に失敗しました');
  }

  return response.json();
}

// プロフィール取得（特定ユーザーのプロフィール）
export async function getUserProfile(userId: number): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'GET',
    headers: getCommonHeaders(true, true),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('プロフィール情報の取得に失敗しました');
  }

  return response.json();
}

// プロフィール更新（認証済みユーザー自身のプロフィール）
export async function updateProfile(profileData: FormData): Promise<UpdateProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'PATCH',
    headers: getCommonHeaders(true, false),
    body: profileData,
    credentials: 'include',
  })

  if (!response.ok) {
    const data = await response.json();
    const errorMessage = data.errors ? JSON.stringify({ errors: data.errors }) : data.message || 'プロフィールの更新に失敗しました';
    throw new Error(errorMessage);
  }

  return response.json();
}

// パスワードリセット要求
export async function passwordResets(email: string): Promise<{message: string}> {
  const response = await fetch(`${API_BASE_URL}/api/password_resets`, {
    method: 'POST',
    headers: getCommonHeaders(false, true),
    body: JSON.stringify({ user: { email }})
  });

  // エラーメッセージなし

  return response.json();
}

// パスワード変更
export async function passwordUpdate(token: string, passwordData: PasswordUpdateRequest): Promise<PasswordUpdateResponse> {
  const response = await fetch(`${API_BASE_URL}/api/password_resets/${token}`, {
    method: 'PATCH',
    headers: getCommonHeaders(false, true),
    body: JSON.stringify({ user: passwordData })
  });

  if (!response.ok) {
    const data = await response.json();
    const errorMessage = data.errors ? JSON.stringify({ errors: data.errors }) : data.message || 'パスワードの変更に失敗しました';
    throw new Error(errorMessage);
  }

  return response.json();
}