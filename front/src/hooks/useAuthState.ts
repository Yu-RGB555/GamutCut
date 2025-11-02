'use client';

import { useAuth } from '@/contexts/AuthContext';

/* =====================================================
  * ヘッダーなどのUI表示用の認証状態フック
  * 未承認時にリダイレクトするフックはuseAuthRedirectで管理
  ======================================================
*/
export const useAuthState = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // ローディング中はfalseを返してSSRとの整合性を保つ
  const safeIsAuthenticated = isLoading ? false : isAuthenticated;

  return {
    isAuthenticated: safeIsAuthenticated,
    isLoading,
    user
  };
};