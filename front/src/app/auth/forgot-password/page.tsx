'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
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
import { passwordResets } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPassword() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!email.trim()) {
      newErrors.push('メールアドレスを入力してください');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push('有効なメールアドレスを入力してください');
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
    setIsLoading(true);

    try {
      const response = await passwordResets(email);
      setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <div className="my-8">
        <Card className="w-full max-w-xl mx-auto space-y-6">
          <CardHeader>
            <CardTitle className="text-3xl justify-items-center">メール送信完了</CardTitle>
            <CardDescription className="text-sm text-label">
              パスワードリセット用のメールを <strong>{email}</strong> に送信しました。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {/* 手順 */}
              <div className="bg-green-200 border border-green-800 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">次の手順</h3>
                <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                  <li>受信したメールを確認してください</li>
                  <li>メール内のリンクをクリックしてください</li>
                  <li>新しいパスワードを設定してください</li>
                </ol>
              </div>

              {/* 注意事項 */}
              <Alert className="bg-background border-none">
                <AlertDescription className="text-label">
                  <p className="text-sm">
                    <strong>⚠️ 注意：</strong> リンクの有効期限は<strong> １時間 </strong>です。<br />
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>

          {/* ボタン */}
          <CardFooter className="flex flex-col space-y-2">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              variant="secondary"
              className="w-2/3 font-normal"
            >
              別のメールアドレスで送信
            </Button>
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              <p>ログイン画面に戻る</p>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-8">
      <Card className="w-full max-w-sm sm:max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">パスワードをお忘れですか？</CardTitle>
          <p className="text-xs text-label">
            登録済みのメールアドレスにパスワードリセット用のリンクを送信します
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
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="登録済みのメールアドレス"
                value={email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <CardFooter className="flex-col space-y-2 my-8">
              <Button
                type="submit"
                className="w-2/3 py-5"
                disabled={isLoading}
              >
                {isLoading ? 'メール送信中...' : 'パスワードリセットメールを送信'}
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