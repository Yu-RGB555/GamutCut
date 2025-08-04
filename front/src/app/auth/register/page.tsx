'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import SocialLoginButtons from '@/components/ui/socialLoginButtons';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from '@/lib/api';
import { RegisterRequest } from "@/types/auth";

export default function Register() {
  // ルーティング設定
  const router = useRouter();

  // 送信フォームデータ
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // バリデーションエラー
  const [errors, setErrors] = useState<string[]>([]);

  // フォーム入力値
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // バリデーションエラー
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('ハンドルネームを入力してください');
    } else if (formData.name.length > 20) {
      newErrors.push('ハンドルネームは20文字以内で入力してください');
    }

    if (!formData.email.trim()) {
      newErrors.push('メールアドレスを入力してください');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.push('無効なメールアドレスです');
    }

    if (!formData.password) {
      newErrors.push('パスワードを入力してください');
    } else if (formData.password.length < 6) {
      newErrors.push('パスワードは6文字以上で入力してください');
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.password)) {
      newErrors.push('パスワードは半角英数字で入力してください');
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.push('パスワードが一致しません');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()){
      return;
    }

    setErrors([]);

    try{
      const response = await registerUser(formData);
      alert(response.message);
      router.push('/auth/login');
    } catch(error) {
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
            <div className="px-6">
              {errors.map((error, index) => (
                <p key={index} className="text-error text-sm">・{error}</p>
              ))}
            </div>
          )}
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">ハンドルネーム</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="最大20文字まで"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード（確認用）</Label>
                </div>
                <Input
                  id="password"
                  name="password_confirmation"
                  type="password"
                  placeholder="半角英数字6文字以上"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-center my-1">
              <input type="checkbox" id="legal" className="mr-2" defaultChecked={false}></input>
              <Link
                href="#"
                className="text-foreground inline-block text-sm underline-offset-4 hover:underline"
              >
                利用規約
              </Link>
              <span>、</span>
              <Link
                href="#"
                className="text-foreground inline-block text-sm underline-offset-4 hover:underline"
              >
                プライバシーポリシー
              </Link>
              <span className="card-foreground text-sm ml-1">に同意する</span>
            </div>
            <CardFooter className="flex-col gap-2 mt-6">
              <Button type="submit" className="w-full py-5">
                新規登録
              </Button>
              <div>
                <span className="text-sm mr-2">すでにアカウントをお持ちですか?</span>
                <Link
                  href="/auth/login"
                  className="ml-auto inline-block text-foreground text-sm underline-offset-4 hover:underline"
                >
                  ログイン
                </Link>
              </div>
            </CardFooter>
          </form>
          <div className="flex justify-between items-center w-full my-8">
            <hr className="w-1/3 border-gray-300" />
            <span className="text-gray-300 text-sm">または</span>
            <hr className="w-1/3 border-gray-300" />
          </div>
          <SocialLoginButtons></SocialLoginButtons>
        </CardContent>
      </Card>
    </div>
  )
}
