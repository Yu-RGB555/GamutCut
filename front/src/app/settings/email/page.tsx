'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BackButton } from '@/components/BackButton';

export default function EmailChangePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    currentEmail: '',
    newEmail: '',
    password: ''
  });

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

    setLoading(true);
    setErrors([]);

    try {
      // 仮の処理
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        router.push('/settings');
      }, 2000);

    } catch (error) {
      setErrors(['メールアドレスの変更に失敗しました']);
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
                メールアドレス変更完了
              </h2>
              <p className="text-green-600 mb-4">
                新しいメールアドレスに確認メールを送信しました
              </p>
              <Button onClick={() => router.push('/settings')}>
                設定画面に戻る
              </Button>
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
          <CardTitle className="text-3xl font-bold text-label mb-2">メールアドレス変更</CardTitle>
          <CardDescription className="text-label">
            登録されているメールアドレスを変更できます
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
        <CardContent>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">現在のパスワード</Label>
              <Input
                id="current-password"
                name="current-password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="現在のパスワードを入力"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                disabled={loading}
                className=" w-16"
              >
                {loading ? '変更中...' : '変更'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2 text-sm font-light transition-colors"
                onClick={() => router.push('/settings')}
              >
                キャンセル
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