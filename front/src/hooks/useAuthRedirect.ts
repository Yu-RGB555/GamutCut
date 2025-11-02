'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/* =====================================================
  * 認証が必要なページで使用するカスタムフック
  * 未認証の場合、現在のURLを保存してログインページにリダイレクト
  ======================================================
*/
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証状態の初期化中は実行しない
    if (isLoading) return;

    if (!isAuthenticated) {
      // 現在のURLをlocalStorageに保存し、ログイン画面へ
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // 認証状態とローディング状態(falseのみ)を返す
  return { isAuthenticated, isLoading };
};