'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense } from 'react';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams?.get('token');
    const success = searchParams?.get('success');
    const error = searchParams?.get('error');

    const fetchUser = async (jwt: string) => {
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
      // エラーハンドリング
      console.error('Social login failed:', error);
      router.push('/login?error=' + error);
    }
  }, []);

  return <div>認証処理中...</div>;
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>認証処理中...</div>}>
      <AuthCallbackInner />
    </Suspense>
  );
}