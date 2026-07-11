'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import { useLoad } from '@/contexts/LoadingContext';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { setIsLoadingOverlay } = useLoad();

  useEffect(() => {
    const token = searchParams?.get('token');
    const success = searchParams?.get('success');
    const error = searchParams?.get('error');

    const fetchUser = async (jwt: string) => {
      setIsLoadingOverlay(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });

        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました')
        }

        const data = await response.json();
        login(data.user, jwt);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingOverlay(false);
      }
    };

    if (success === 'true' && token) {
      fetchUser(token as string).then(() => {
        // ログイン後のページ遷移先をlocalStorageから取得し、履歴を残さず遷移
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin'); // 使用後は削除
        router.replace(redirectUrl);
      });
    } else if (success === 'false') {
      console.error('Social login failed:', error);
      router.push('/login?error=' + error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ローディング画面（LoadingOverlay）を表示
  return null;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackInner />
    </Suspense>
  );
}