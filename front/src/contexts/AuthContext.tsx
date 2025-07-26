'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { logoutUser } from '@/lib/api';

// AuthContextの型定義
interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 認証情報を保持するAuthContextオプジェクト
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // ページリロード時（コンポーネントマウント時）に、localStorageからユーザー情報を読み込む
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // レスポンスで返されたuserをlocalStorageと状態userにセット
  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
  };

  // APIでログアウト処理
  const logout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
  };

  // userがnullまたはundefinedならfalseを返す
  const isAuthenticated = !!user;

  // 子コンポーネントにAuthContextの値を渡せる状態にする
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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