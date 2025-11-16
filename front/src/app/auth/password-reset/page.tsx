'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { MdOutlineCheckCircle } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordUpdate } from '@/lib/api';
import { PasswordUpdateRequest } from '@/types/auth';
import { useLoad } from '@/contexts/LoadingContext';

function PasswordResetForm() {
  const router = useRouter();
  const { setIsLoadingOverlay } = useLoad();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<PasswordUpdateRequest>({
    password: '',
    password_confirmation: ''
  });

  // URLからトークンを取得
  useEffect(() => {
    setIsLoadingOverlay(true);
    const tokenParam = searchParams?.get('token');
    if (!tokenParam) {
      setErrors(['無効なリセットリンクです。']);
    } else {
      setToken(tokenParam);
    }
    setIsLoadingOverlay(false);
  }, [searchParams, setIsLoadingOverlay]);

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
    setIsLoadingOverlay(true);

    try {
      await passwordUpdate(token, formData);
      setSuccess(true);
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
      setIsLoadingOverlay(false);
    }
  };

  // パスワードリセット完了後
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
                パスワードの変更が<br />
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

  // パスワードリセット画面
  return (
    <div className="my-8 text-center">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-label">パスワードリセット</CardTitle>
          <CardDescription className="text-label">
            新しいパスワードを設定してください。
          </CardDescription>

          {/* エラー表示 */}
          {errors.length > 0 && (
            <CardContent className="pt-0">
              <div className="flex flex-col gap-2">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">{error}</p>
                ))}
              </div>
            </CardContent>
          )}
        </CardHeader>

        {/* フォーム */}
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
                  disabled={!token}
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
                  disabled={!token}
                  required
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-4 my-8 px-0">
              <Button
                type="submit"
                className="w-full py-5"
                disabled={!token}
              >
                パスワードを変更
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PasswordReset() {
  return (
    <Suspense fallback={null}>
      <PasswordResetForm />
    </Suspense>
  );
}