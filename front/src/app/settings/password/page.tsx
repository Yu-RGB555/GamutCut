'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BackButton } from '@/components/BackButton';
import { passwordResets } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function PasswordChangePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setErrors(['ユーザー情報の取得に失敗しました']);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      await passwordResets(user.email);
      setSuccess(true);
    } catch (error) {
      setErrors(['パスワードリセットメールの送信に失敗しました']);
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

  // パスワードリセットメール送信完了後
  if (success) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                パスワードリセットメール送信完了
              </h2>
              <p className="text-green-600 mb-4">
                登録されているメールアドレス（{user?.email}）にパスワードリセットの手順をお送りしました
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/settings')} className="w-full">
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
        <CardHeader className="mb-8">
          <CardTitle className="text-3xl font-bold text-label">
            パスワード変更
          </CardTitle>
          <CardDescription className="text-label">
            アカウントのパスワードを変更できます<br />
          </CardDescription>
        </CardHeader>

        {/* エラー表示 */}
        {errors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <CardContent className="space-y-12">
          <div className="max-w-xl bg-green-200 border border-green-800 rounded-lg p-4">
            <p className="font-semibold text-green-800 mb-2">現在のメールアドレス</p>
            <p className="text-green-800 pl-4">{user?.email}</p>
          </div>
          <div className="grid gap-10">
            <p className="flex justify-center text-label text-sm">
              上記のメールアドレスにパスワードリセットの手順を送信します。<br />
              メール内のリンクをクリックして新しいパスワードを設定してください。
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handlePasswordReset}
                disabled={isLoading}
                className="w-2/3"
              >
                {isLoading ? 'メール送信中...' : 'パスワードリセットメールを送信'}
              </Button>
            </div>
          </div>

          {/* 注意事項 */}
          <Alert className="mt-6">
            <AlertDescription className="text-label">
              <strong>⚠️ 注意：</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• パスワードリセットリンクの有効期限は1時間です</li>
                <li>• リンクは一度のみ使用可能です</li>
                <li>• メールが届かない場合は、迷惑メールフォルダをご確認ください</li>
                <li>• メールアドレスを変更したい場合は、メールアドレス変更から行ってください</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}