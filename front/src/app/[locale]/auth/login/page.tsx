'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
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
import { loginUser } from '@/lib/api';
import { LoginRequest } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';
import { useLocale, useTranslations } from 'next-intl';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [errors, setErrors] = useState<string[]>([]);
  const[formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const t = useTranslations('Login');
  const locale = useLocale();

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

      if (response.user && response.token) {
        login(response.user, response.token);
        showAlert(response.message);

        // ログイン後のページ遷移先をlocalStorageから取得
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin'); // 使用後は削除
        router.push(redirectUrl);
      }
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
    }
  };

  return (
    <div className="my-8">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="flex flex-col items-center mb-4">
          <CardTitle className="flex justify-center w-full">
            <img src='/app_logo.svg' className="w-3/4 h-auto" alt="App Logo" />
          </CardTitle>
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
                <Label htmlFor="email">{t('e_mail')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={t('e_mail')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('password')}</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={t('password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <CardFooter className="flex-col gap-2 my-8">
              <Button
                data-testid="login-submit"
                type="submit"
                className="w-full py-5"
              >
                {t('login')}
              </Button>
              <div>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-foreground text-sm underline-offset-4 hover:underline"
                >
                  {t('forgot_password?')}
                </Link>
              </div>
            </CardFooter>
          </form>
          <div className="flex justify-between items-center w-full py-4">
            <hr className="w-1/3 border-gray-300" />
            <span className="text-gray-300 text-sm">{t('or')}</span>
            <hr className="w-1/3 border-gray-300" />
          </div>
          <SocialLoginButtons></SocialLoginButtons>
          <div className="text-center">
            <span className="text-sm mr-2">{t('is_this_first?')}</span>
            <Link
              href="/auth/register"
              className="inline-block text-foreground text-sm underline-offset-4 hover:underline"
            >
              {t('sign_up')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
