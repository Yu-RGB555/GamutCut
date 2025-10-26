'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BsExclamationCircle } from "react-icons/bs";
import { MdOutlineCheckCircle } from "react-icons/md";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { changeEmail } from '@/lib/api';

export default function EmailChangePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newEmail: '',
    password: ''
  });

  // SNS認証ユーザーは非表示
  if (!authLoading && isAuthenticated && user?.has_social_accounts) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.newEmail.trim()) {
      newErrors.push('新しいメールアドレスを入力してください');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
      newErrors.push('有効なメールアドレスを入力してください');
    }

    if (!formData.password) {
      newErrors.push('現在のパスワードを入力してください');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // メールアドレス変更申請
      const response = await changeEmail({
        email: formData.newEmail,
        password: formData.password
      });

      // 成功時は戻ってきた user でローカルの状態を更新
      if (response?.user) {
        updateUser(response.user);
      }

      setSuccess(true);
    } catch (e) {
      if (Array.isArray(e)) {
        // バリデーションエラーの場合（配列）
        setErrors(e);
      } else if (e instanceof Error) {
        // Errorオブジェクトの場合
        setErrors([e.message]);
      } else {
        // その他
        setErrors(['予期しないエラーが発生しました']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 認証状態の初期化中はローディング表示
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring"></div>
      </div>
    );
  }

  // メールアドレス変更確認メール送信後
  if (success) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <Card>
          <CardContent className="px-8 pt-6">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full mb-4">
                <MdOutlineCheckCircle className="h-20 w-20 text-primary" />
              </div>
              <p className="text-3xl font-semibold text-label m-2">
                メールアドレスの変更が<br />
                完了しました
              </p>
              <div className="space-y-2 m-16">
                <Button
                  variant="secondary"
                  className="w-2/3 font-normal"
                  onClick={() => router.push('/settings')}
                >
                  設定画面に戻る
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <BackButton />

      {/* フォーム */}
      <Card>
        <CardHeader className="mb-2">
          <CardTitle className="text-3xl font-bold text-label mb-2">メールアドレス変更</CardTitle>
          <CardDescription className="text-label">
            登録されているメールアドレスを変更できます
          </CardDescription>

            {/* エラー表示 */}
            {errors.length > 0 && (
              <Alert className="mb-2 border-red-200 bg-red-50">
                <BsExclamationCircle className="!text-red-800"/>
                <AlertDescription className="text-red-800">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </AlertDescription>
              </Alert>
            )}

        </CardHeader>
        <CardContent>
          <div className="max-w-xl bg-blue-200 border border-blue-200 rounded-lg p-4 mb-10">
            <p className="font-semibold text-blue-800 mb-2">現在のメールアドレス</p>
            <p className="text-blue-800 pl-4">{user?.email}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 mb-12">
            <div className="space-y-2">
              <Label htmlFor="newEmail">新しいメールアドレス</Label>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                value={formData.newEmail}
                onChange={handleInputChange}
                placeholder="new@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">現在のパスワード</Label>
              <Input
                id="current-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="現在のパスワードを入力"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className=" w-16"
              >
                {isLoading ? '変更中...' : '変更'}
              </Button>
            </div>
          </form>

          {/* 注意事項 */}
          <Alert className="mt-2 mb-4">
            <AlertDescription className="text-label">
              <strong>⚠️ 注意：</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 新しいメールアドレスに確認メールが送信されます</li>
                <li>• 確認が完了するまで、元のメールアドレスが有効です</li>
                <li>• 変更後は新しいメールアドレスでログインしてください</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}