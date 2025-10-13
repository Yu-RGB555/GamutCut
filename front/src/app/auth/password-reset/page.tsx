'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordUpdate } from '@/lib/api';
import { PasswordUpdateRequest } from '@/types/auth';
import { useAlert } from '@/contexts/AlertContext';

function PasswordResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<PasswordUpdateRequest>({
    password: '',
    password_confirmation: ''
  });

  // URLからトークンを取得
  useEffect(() => {
    const tokenParam = searchParams?.get('token');
    if (!tokenParam) {
      setErrors(['無効なリセットリンクです。']);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.password) {
      newErrors.push('新しいパスワードを入力してください');
    } else if (formData.password.length < 6) {
      newErrors.push('パスワードは6文字以上で入力してください');
    }

    if (!formData.password_confirmation) {
      newErrors.push('パスワード確認を入力してください');
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.push('パスワードが一致しません');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors(['無効なリセットリンクです。']);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const response = await passwordUpdate(token, formData);
      showAlert(response.message || 'パスワードが正常に変更されました。');
      router.push('/auth/login');
    } catch (error) {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          setErrors(errorData.errors || [errorData.message]);
        } catch {
          setErrors([error.message]);
        }
      } else {
        setErrors(['予期しないエラーが発生しました']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && errors.length === 0) {
    return (
      <div className="my-8">
        <Card className="w-full max-w-sm mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">リンクを確認しています...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-8">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>パスワードリセット</CardTitle>
          <p className="text-sm text-muted-foreground">
            新しいパスワードを設定してください
          </p>
        </CardHeader>
        {errors.length > 0 && (
          <CardContent className="pt-0">
            <div className="flex flex-col gap-2">
              {errors.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
              ))}
            </div>
          </CardContent>
        )}
        <CardContent className={errors.length > 0 ? 'pt-4' : ''}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">新しいパスワード</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="新しいパスワード（6文字以上）"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={!token || isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">パスワード確認</Label>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  placeholder="パスワードを再度入力"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  disabled={!token || isLoading}
                  required
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-4 my-8 px-0">
              <Button
                type="submit"
                className="w-full py-5"
                disabled={!token || isLoading}
              >
                {isLoading ? 'パスワード変更中...' : 'パスワードを変更'}
              </Button>
              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  ログイン画面に戻る
                </Link>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PasswordReset() {
  return (
    <Suspense fallback={
      <div className="my-8">
        <Card className="w-full max-w-sm mx-auto">
          <CardContent className="pt-6">
            <p className="text-center">読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PasswordResetForm />
    </Suspense>
  );
}