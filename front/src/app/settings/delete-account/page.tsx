'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { BackButton } from '@/components/BackButton';

export default function DeleteAccountPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmationText, setConfirmationText] = useState('');
  const [agreedToDelete, setAgreedToDelete] = useState(false);
  const [password, setPassword] = useState('');

  const requiredText = '退会します';

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (confirmationText !== requiredText) {
      newErrors.push(`確認テキストに「${requiredText}」と正確に入力してください`);
    }

    if (!password) {
      newErrors.push('現在のパスワードを入力してください');
    }

    if (!agreedToDelete) {
      newErrors.push('退会に関する注意事項に同意してください');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleDeleteAccount = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      // 仮の処理
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 削除成功後はログアウトしてトップページへ
      router.push('/');

    } catch (error) {
      setErrors(['アカウントの削除に失敗しました']);
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

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <BackButton />

      {/* フォーム*/}
      <Card>
        <CardHeader className="mb-4">
          <CardTitle className="text-3xl font-bold text-destructive">
            アカウント削除
          </CardTitle>
          <CardDescription className="text-label">
            アカウントを完全に削除します。<br />
            以下の内容をご確認の上、削除手続きを進めてください。
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

        <CardContent className="space-y-10">
          {/* 削除される内容 */}
          <div className="bg-red-200 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-3">削除される内容</h3>
            <ul className="text-red-800 space-y-1 text-sm">
              <li>• プロフィール情報（名前、メールアドレス、アバター等）</li>
              <li>• 投稿した作品とその関連データ</li>
              <li>• いいね、ブックマーク履歴</li>
              <li>• コメント履歴</li>
              <li>• 保存したマスク（Myマスク）</li>
              <li>• その他すべてのアカウント関連データ</li>
            </ul>
          </div>

          {/* フォーム */}
          <form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmText">
                確認テキスト（「{requiredText}」と入力してください）
              </Label>
              <Input
                id="confirmText"
                name="confirmText"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={requiredText}
                autoComplete="off"
                className={confirmationText === requiredText ? 'border-green-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">現在のパスワード</Label>
              <Input
                id="current-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="現在のパスワードを入力"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreedToDelete}
                onChange={(e) => setAgreedToDelete(e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="agree" className="text-sm leading-5">
                上記の内容を理解し、アカウントを完全に削除することに同意します。
                この操作は取り消すことができないことを理解しています。
              </Label>
            </div>

            {/* 削除ボタン */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading || !agreedToDelete || confirmationText !== requiredText || !password}
                variant="destructive"
                className="w-2/3"
              >
                {isLoading ? '削除中...' : 'アカウントを削除する'}
              </Button>
            </div>
          </form>

          {/* 代替案 */}
          <Alert className="mt-6">
            <AlertDescription className="text-label">
              <strong>⚠️ アカウント削除以外の選択肢</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 一時的に利用を停止したい場合は、ログアウトのみで十分です</li>
                <li>• 公開中の作品を非公開にしたい場合は、作品編集画面より公開範囲を調整できます</li>
                <li>• 何かお困りのことがあれば、サポートにお問い合わせください</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}