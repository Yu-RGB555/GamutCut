'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useLoad } from '@/contexts/LoadingContext';

/* =====================================================
  * 認証が必要なページで使用するカスタムフック
  * 未認証の場合、現在のURLを保存してログインページにリダイレクト
  ======================================================
*/
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { setIsLoadingOverlay } = useLoad();
  const router = useRouter();

  useEffect(() => {
    // 認証状態の初期化中はローディング表示
    if (isLoading) {
      setIsLoadingOverlay(true);
    } else {
      // 認証チェック完了後、ローディングを非表示
      setIsLoadingOverlay(false);

      // 未認証の場合はリダイレクト
      if (!isAuthenticated) {
        // 現在のURLをlocalStorageに保存し、ログイン画面へ
        const redirectPath = window.location.pathname.replace(/^\/(en|ja)/, '');
        localStorage.setItem('redirectAfterLogin', redirectPath);
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router, setIsLoadingOverlay]);

  // 認証状態とローディング状態(falseのみ)を返す
  return { isAuthenticated, isLoading };
};