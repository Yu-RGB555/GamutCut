'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, AlertCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { passwordResets } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function PasswordChangePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setErrors(['ユーザー情報の取得に失敗しました']);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      await passwordResets(user.email);
      setSuccess(true);
    } catch (error) {
      setErrors(['パスワードリセットメールの送信に失敗しました']);
    } finally {
      setLoading(false);
    }
  };

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
      {/* ヘッダー */}
      <div className="mb-8">
        <Link href="/settings" className="inline-flex items-center text-sm text-label hover:bg-muted mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          設定に戻る
        </Link>
        <h1 className="text-3xl font-bold text-label mb-2">パスワード変更</h1>
        <p className="text-gray-600">アカウントのパスワードを変更できます</p>
      </div>

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

      {/* メインカード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            パスワードリセット
          </CardTitle>
          <CardDescription>
            セキュリティのため、パスワード変更はメール経由で行います
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">現在のメールアドレス</h3>
            <p className="text-blue-700">{user?.email}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">
              上記のメールアドレスにパスワードリセットの手順を送信します。
              メール内のリンクをクリックして新しいパスワードを設定してください。
            </p>

            <Button
              onClick={handlePasswordReset}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'メール送信中...' : 'パスワードリセットメールを送信'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/settings')}
              className="w-full"
            >
              キャンセル
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>ご注意：</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• パスワードリセットリンクの有効期限は24時間です</li>
            <li>• リンクは一度のみ使用可能です</li>
            <li>• メールが届かない場合は、迷惑メールフォルダをご確認ください</li>
            <li>• メールアドレスを変更したい場合は、メールアドレス変更から行ってください</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}