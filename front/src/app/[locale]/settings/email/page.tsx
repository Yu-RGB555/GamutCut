'use client'

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BsExclamationCircle } from "react-icons/bs";
import { MdOutlineCheckCircle } from "react-icons/md";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { changeEmail } from '@/lib/api';
import { useLoad } from '@/contexts/LoadingContext';
import { useTranslations } from 'next-intl';

export default function EmailChangePage() {
  useAuthRedirect();
  const router = useRouter();
  const { setIsLoadingOverlay } = useLoad();
  const { user, updateUser } = useAuth();
  const t = useTranslations('EmailChange');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newEmail: '',
    password: ''
  });

  // SNS認証ユーザーは非表示
  if (user?.has_social_accounts) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-center font-semibold">
          {t('sns_user_restriction')}
        </div>
      </div>
    );
  }

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
      newErrors.push(t('validation.email_required'));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
      newErrors.push(t('validation.email_invalid'));
    }

    if (!formData.password) {
      newErrors.push(t('validation.password_required'));
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoadingOverlay(true);
    setErrors([]);

    try {
      // メールアドレス変更申請
      const response = await changeEmail({
        email: formData.newEmail,
        password: formData.password
      });

      // 成功時は戻ってきた user でローカルの状態を更新
      if (response?.user) {
        updateUser(response.user);
      }

      setSuccess(true);
    } catch (e) {
      if (Array.isArray(e)) {
        // バリデーションエラーの場合（配列）
        setErrors(e);
      } else if (e instanceof Error) {
        // Errorオブジェクトの場合
        setErrors([e.message]);
      } else {
        // その他
        setErrors([t('validation.unexpected_error')]);
      }
    } finally {
      setIsLoadingOverlay(false);
    }
  };

  // メールアドレス変更確認メール送信後
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
                {t('success_title')}
              </p>
              <div className="space-y-2 m-16">
                <Button
                  variant="secondary"
                  className="w-2/3 font-normal"
                  onClick={() => router.push('/settings')}
                >
                  {t('back_to_settings')}
                </Button>
              </div>
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
        <CardHeader className="mb-2">
          <CardTitle className="text-3xl font-bold text-label mb-2">{t('title')}</CardTitle>
          <CardDescription className="text-label">
            {t('description')}
          </CardDescription>

            {/* エラー表示 */}
            {errors.length > 0 && (
              <Alert className="mb-2 border-red-200 bg-red-50">
                <BsExclamationCircle className="!text-red-800"/>
                <AlertDescription className="text-red-800">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </AlertDescription>
              </Alert>
            )}

        </CardHeader>
        <CardContent>
          <div className="max-w-xl bg-blue-200 border border-blue-200 rounded-lg p-4 mb-10">
            <p className="font-semibold text-blue-800 mb-2">{t('current_email')}</p>
            <p className="text-blue-800 pl-4">{user?.email}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 mb-12">
            <div className="space-y-2">
              <Label htmlFor="newEmail">{t('new_email')}</Label>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                value={formData.newEmail}
                onChange={handleInputChange}
                placeholder={t('new_email_placeholder')}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-password">{t('current_password')}</Label>
              <Input
                id="current-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('current_password_placeholder')}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="submit"
                className=" w-16"
              >
                {t('change_button')}
              </Button>
            </div>
          </form>

          {/* 注意事項 */}
          <Alert className="mt-2 mb-4">
            <AlertDescription className="text-label">
              <strong>⚠️ {t('notice.title')}：</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• {t('notice.confirmation_email')}</li>
                <li>• {t('notice.old_email_valid')}</li>
                <li>• {t('notice.login_with_new')}</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}