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
import { registerUser } from '@/lib/api';
import { RegisterRequest } from "@/types/auth";
import { loginUser } from '@/lib/api';
import { LoginRequest } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';
import { useLocale, useTranslations } from 'next-intl';

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const [errors, setErrors] = useState<string[]>([]);
  const [isCheck, setIsCheck] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const t = useTranslations('SignUp');
  const locale = useLocale();

  // フォーム入力値
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // チェックボックス
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheck(e.target.checked);
  }

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
    } else if (formData.password.length < 8) {
      newErrors.push('パスワードは8文字以上で入力してください');
    } else if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(formData.password)) {
      newErrors.push('パスワードは半角英数字と記号で入力してください');
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.push('パスワードが一致しません');
    }

    if (!isCheck) {
      newErrors.push('利用規約とプライバシーポリシーへの同意が必要です')
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
      // 新規登録後、自動ログイン処理を実行する
      await registerUser(formData);

      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password
      };

      const loginResult = await loginUser(loginData);

      if (loginResult.token && loginResult.user) {
        login(loginResult.user, loginResult.token);
        showAlert(loginResult.message);

        // ログイン後のページ遷移先をlocalStorageから取得
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin'); // 使用後は削除
        router.push(redirectUrl);
      } else {
        throw new Error('ログイン情報が不正です');
      }
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
    <div className="mt-8">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="flex flex-col items-center mb-4">
          <CardTitle className="flex justify-center w-full">
            <img src='/app_logo.svg' className="w-3/4 h-auto" alt="GamutCut" />
          </CardTitle>
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
                <Label htmlFor="name">{t('display_name')}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t('placeholder_1')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('e_mail')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder={t('placeholder_2')}
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
                  autoComplete="new-password"
                  placeholder={t('placeholder_3')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t('confirm_password')}</Label>
                </div>
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  placeholder={t('placeholder_4')}
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-center my-2">
              <input
                id="legal"
                name="legal"
                type="checkbox"
                className="mr-2"
                checked={isCheck}
                onChange={handleCheckboxChange}
                required
              ></input>
              {locale === 'ja' ? (
                <Label htmlFor="legal" className="text-sm leading-tight">
                  <a
                    href={`/${locale}/legal/terms_of_service`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    利用規約
                  </a>
                  <span>、</span>
                  <a
                    href={`/${locale}/legal/privacy_policy`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    プライバシーポリシー
                  </a>
                  <span>に同意する</span>
                </Label>
              ) : (
                <Label htmlFor="legal" className="text-sm leading-tight line-clamp-2 space-x-2">
                  <span>I agree to the</span>
                  <a
                    href={`/${locale}/legal/terms_of_service`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    Terms of Service
                  </a>
                  <span>and</span>
                  <a
                    href={`/${locale}/legal/privacy_policy`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </Label>
              )}
            </div>
            <CardFooter className="flex-col gap-2 my-8">
              <Button type="submit" className="w-full py-5">
                {t('sign_up')}
              </Button>
              <div>
                <span className="text-sm mr-2">{t('have_account?')}</span>
                <Link
                  href="/auth/login"
                  className="ml-auto inline-block text-foreground text-sm underline-offset-4 hover:underline"
                >
                  {t('login')}
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
        </CardContent>
      </Card>
    </div>
  )
}
