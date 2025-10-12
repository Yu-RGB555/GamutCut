'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ArrowLeft, UserX, AlertTriangle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export default function DeleteAccountPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    setErrors([]);

    try {
      // TODO: アカウント削除API呼び出し
      console.log('アカウント削除:', { password, user: user?.email });

      // 仮の処理
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 削除成功後はログアウトしてトップページへ
      router.push('/');

    } catch (error) {
      setErrors(['アカウントの削除に失敗しました']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      {/* ヘッダー */}
      <div className="mb-8">
        <Link href="/settings" className="inline-flex items-center text-sm text-label hover:bg-muted mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          設定に戻る
        </Link>
        <h1 className="text-3xl font-bold text-label mb-2">アカウント削除</h1>
        <p className="text-muted-foreground">アカウントを完全に削除します</p>
      </div>

      {/* 警告 */}
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>警告：この操作は取り消せません</strong>
        </AlertDescription>
      </Alert>

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
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <UserX className="h-5 w-5" />
            アカウント削除の確認
          </CardTitle>
          <CardDescription>
            以下の内容をご確認の上、削除手続きを進めてください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 削除される内容 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-3">削除される内容</h3>
            <ul className="text-red-700 space-y-1 text-sm">
              <li>• プロフィール情報（名前、メールアドレス、アバター等）</li>
              <li>• 投稿した作品とその関連データ</li>
              <li>• いいね、ブックマーク履歴</li>
              <li>• コメント履歴</li>
              <li>• 保存したマスク（Myマスク）</li>
              <li>• その他すべてのアカウント関連データ</li>
            </ul>
          </div>

          {/* フォーム */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmText">
                確認テキスト（「{requiredText}」と入力してください）
              </Label>
              <Input
                id="confirmText"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={requiredText}
                className={confirmationText === requiredText ? 'border-green-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">現在のパスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="現在のパスワードを入力"
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
          </div>

          {/* ボタン */}
          <div className="flex gap-4">
            <Button
              onClick={handleDeleteAccount}
              disabled={loading || !agreedToDelete || confirmationText !== requiredText || !password}
              variant="destructive"
              className="flex-1"
            >
              {loading ? '削除中...' : 'アカウントを削除する'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/settings')}
              className="flex-1"
            >
              キャンセル
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 代替案の提示 */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>アカウント削除以外の選択肢：</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• 一時的に利用を停止したい場合は、ログアウトのみで十分です</li>
            <li>• プライバシー設定の変更で、作品の公開範囲を調整できます</li>
            <li>• 何かお困りのことがあれば、サポートにお問い合わせください</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}