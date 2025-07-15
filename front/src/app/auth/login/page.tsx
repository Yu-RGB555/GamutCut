'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { loginUser } from '@/lib/api';
import { LoginRequest } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const[formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email.trim()) {
      newErrors.push('メールアドレスを入力してください');
    }

    if (!formData.password) {
      newErrors.push('パスワードを入力してください');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors([]);

    try {
      const response = await loginUser(formData);

      // ユーザー情報をlocalStorageに保存（⭐️Context APIやZustandなどの使用も検討）
      if (response.user) {
        // AuthContext経由でユーザー情報を保存
        login(response.user);
        alert(response.message);
        router.push('/');
      }
    } catch (error) {
      // エラー時の処理
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
    }
  };

  return (
    <div className="my-8">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>GamutCut</CardTitle>
        </CardHeader>
        {errors.length > 0 && (
          <div className="flex flex-col gap-6">
            {errors.map((error, index) => (
              <p key={index} className="text-error text-sm">{error}</p>
            ))}
          </div>
        )}
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="メールアドレス"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="半角英数字6文字以上"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full py-5 mt-4">
                ログイン
              </Button>
              <div>
                <a
                  href="#"
                  className="ml-auto inline-block text-foreground text-sm underline-offset-4 hover:underline"
                >
                  パスワードをお忘れですか?
                </a>
              </div>
              <div>
                はじめてGamutCutをご利用ですか？{' '}
                <Link
                  href="/auth/register"
                  className="ml-auto inline-block text-foreground text-sm underline-offset-4 hover:underline"
                >
                  アカウントを作成
                </Link>
              </div>
              <Button className="text-foreground border bg-muted w-full py-5 m-4">
                Googleアカウントでログイン
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
