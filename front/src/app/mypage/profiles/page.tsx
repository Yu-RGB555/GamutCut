'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, User, X } from 'lucide-react';
import { getProfile, updateProfile } from '@/lib/api';
import { User as UserType } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

interface FormErrors {
  name?: string;
  bio?: string;
  x_account_url?: string;
}

export default function ProfilesPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({}); // フォームバリデーションエラー
  const fileInputRef = useRef<HTMLInputElement>(null);

  // フォームの状態管理
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    x_account_url: ''
  });

  // X（旧Twitter）URLから余分な部分を取り除く関数
  const cleanXAccountUrl = (url: string): string => {
    if (!url) return '';

    // https://x.com/、https://twitter.com/、http://x.com/、http://twitter.com/ を削除
    const cleanedUrl = url
      .replace(/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//i, '')
      .replace(/^@/, ''); // @マークも削除

    return cleanedUrl;
  };

  // プロフィール情報の初期化
  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const profileData = await getProfile();
          setProfileUser(profileData);
          setFormData({
            name: profileData.name || '',
            bio: profileData.bio || '',
            x_account_url: cleanXAccountUrl(profileData.x_account_url || '')
          });
          // アバター画像がある場合は設定
          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url);
          }
        } catch (error) {
          console.error('プロフィール取得エラー:', error);
          setMessage({
            type: 'error',
            text: 'プロフィール情報の取得に失敗しました'
          });
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  // アバター画像のプレビュー処理
  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarRemove = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    // x_account_url項目は自動的にクリーンアップ（cleanXAccountUrl）を実行
    const cleanedValue = field === 'x_account_url' ? cleanXAccountUrl(value) : value;
    setFormData(prev => ({ ...prev, [field]: cleanedValue }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'ハンドルネームは必須です';
    } else if (formData.name.length > 20) {
      newErrors.name = 'ハンドルネームは20文字以内で入力してください';
    }

    if (formData.bio.length > 300) {
      newErrors.bio = '自己紹介は300文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // プロフィール更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileUser || !validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const submitData = new FormData();
      submitData.append('user[name]', formData.name);
      submitData.append('user[bio]', formData.bio);
      // X アカウント URL は空でない場合のみ追加し、必ず https://x.com/ を前に付ける
      const cleanedXUrl = cleanXAccountUrl(formData.x_account_url);
      submitData.append('user[x_account_url]', cleanedXUrl ? `https://x.com/${cleanedXUrl}` : '');

      if (avatarFile) {
        submitData.append('user[avatar]', avatarFile);
      }

      const response = await updateProfile(submitData);

      setMessage({ type: 'success', text: response.message });
      setProfileUser(response.user);

      // AuthContextのユーザー情報も更新
      updateUser(response.user);

      // 3秒後にメッセージを消す
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'プロフィールの更新に失敗しました'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 認証状態の初期化中またはプロフィール読み込み中はローディング表示
  if (authLoading || !profileUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <div className="bg-background shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <BackButton />
            <h1 className="text-xl font-semibold text-label">プロフィール設定</h1>
            {/* スペーサー */}
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* フォーム */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          {/* ヘッダー画像エリア */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-card bg-opacity-20"></div>
            <div className="absolute bottom-4 right-6">
              <div className="text-white text-sm opacity-75"></div>
            </div>
          </div>

          {/* プロフィール画像 */}
          <div className="relative px-6 pb-6">
            <div className="flex items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="プロフィール画像"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* アバター編集ボタン */}
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-muted border-white border-2 hover:bg-gradient-to-br hover:cursor-pointer from-gray-200 to-gray-300 text-primary-foreground rounded-full p-2 shadow-lg transition-colors duration-200"
                >
                  <Camera className="text-gray-400 h-4 w-4" />
                </button>

                {/* アバター削除ボタン */}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white rounded-full p-1 shadow-lg transition-colors duration-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* メッセージ表示 */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* ハンドルネーム */}
              <div className="grid gap-2">
                <Label className="text-label font-semibold">
                  ハンドルネーム
                  <Label className="bg-destructive p-1 rounded-xs">必須</Label>
                </Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* 自己紹介 */}
              <div className="grid gap-2">
                <Label  className="text-label font-semibold">
                  自己紹介
                </Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="自己紹介を入力してください"
                  rows={4}
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                )}
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {formData.bio.length} / 300
                </div>
              </div>

              {/* X（旧Twitter）アカウント */}
              <div className="grid gap-2">
                <Label className="text-label font-semibold">
                  X（旧Twitter）アカウント
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">https://x.com/</span>
                  </div>
                  <Input
                    type="text"
                    value={formData.x_account_url}
                    onChange={(e) => handleInputChange('x_account_url', e.target.value)}
                    className="w-full pl-25 pr-4 py-3"
                  />
                </div>
                {errors.x_account_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.x_account_url}</p>
                )}
              </div>

              {/* 更新ボタン */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      更新中...
                    </>
                  ) : (
                    <>
                      {/* <Save className="h-4 w-4 mr-2" /> */}
                      更新
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
