'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/auth';

// AuthContextの型定義
interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: User) => void; // プロフィール更新
  isAuthenticated: boolean;             // 認証結果
  isLoading: boolean;                   // 認証状態の初期化中フラグ
}

// 認証情報を保持するAuthContextオプジェクト
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ログアウト処理
  const logout = useCallback(() => {
    // localStorageからトークンとユーザー情報を削除
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Cookieからもトークンを削除
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

    setUser(null);
  }, []);

  // JWTトークンの有効性をチェックする関数
  const checkTokenValidity = useCallback(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      // JWTトークンをデコードして期限をチェック
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        // トークンが期限切れの場合はログアウト
        logout();
        return false;
      }
      return true;
    } catch (error) {
      // トークンが不正な場合はログアウト
      logout();
      return false;
    }
  }, [logout]);

  useEffect(() => {
    // ページリロード時に、localStorageからユーザー情報を読み込む
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // トークンの有効性チェック
      if (checkTokenValidity()) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false); // 初期化完了
  }, [checkTokenValidity]);

  useEffect(() => {
    // 定期的にトークンの有効性をチェック（1分間隔）
    const tokenCheckInterval = setInterval(() => {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        checkTokenValidity();
      }
    }, 60000);

    // ページがフォーカスされた時にトークンをチェック
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          checkTokenValidity();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // クリーンアップ
    return () => {
      clearInterval(tokenCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkTokenValidity]);

  // レスポンスで返されたuserをlocalStorageと状態userにセット
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // JWTトークンをlocalStorageとCookieの両方に保存
    localStorage.setItem('authToken', token);
    document.cookie = `authToken=${token}; path=/; secure; samesite=lax; max-age=86400`;
  };

  // ユーザー情報を更新（プロフィール更新時等に使用）
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // userがnullまたはundefinedならfalseを返す
  const isAuthenticated = !!user;

  // 子コンポーネントにAuthContextの値を渡せる状態にする
  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// AuthContextの値を使用しようとするコンポーネントがAuthProviderの提供範囲なら参照できるようにする
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}