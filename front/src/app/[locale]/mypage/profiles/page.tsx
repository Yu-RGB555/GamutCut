'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useAlert } from '@/contexts/AlertContext';
import { getProfile, getAvatarBlob , updateProfile } from '@/lib/api';
import { User as UserType } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useLoad } from '@/contexts/LoadingContext';
import { DropZone } from '@/components/ui/dropzone';

// バリデーション対象のフォーム項目
interface FormErrors {
  name?: string;
  bio?: string;
  x_account_url?: string;
  avatar?: string;
}

// 保存済みのアバター画像を取得し、プレビュー表示用のためにFileオブジェクトに変換
const createAvatarFile = async (): Promise<File | null> => {
  try{
    const avatarData = await getAvatarBlob();

    // アバター未設定の場合
    if (!avatarData) {
      return null;
    }

    const { blob, filename } = avatarData;
    return new File([blob], filename, {
      type: blob.type,
      lastModified: Date.now()
    });
  } catch(error) {
    throw error;
  }
}

export default function ProfilesPage() {
  const router = useRouter();
  const { setIsLoadingOverlay } = useLoad();
  const { updateUser } = useAuth();
  const { showAlert } = useAlert();
  const { isAuthenticated } = useAuthRedirect();
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false); // アバター画像削除フラグ
  const [errors, setErrors] = useState<FormErrors>({}); // フォームバリデーションエラー

  // フォームの状態管理
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    x_account_url: ''
  });

  // X（旧Twitter）URLから余分な部分を取り除く関数
  const cleanXAccountUrl = (url: string): string => {
    if (!url) return '';

    // https://x.com/、https://twitter.com/、http://x.com/、http://twitter.com/ を削除（@マークも削除）
    const cleanedUrl = url
      .replace(/^https?:\/\/(www\.)?(x\.com|twitter\.com)\//i, '')
      .replace(/^@/, '');

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
            setIsLoadingAvatar(true);
            try {
              const file = await createAvatarFile();
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(profileData.avatar_url);
                setIsAvatarRemoved(false);
              }
            } catch(error) {
              console.error('アバター画像を読み込めません:', error);
              // エラー時もavatar_urlがあればプレビュー表示
              setAvatarPreview(profileData.avatar_url);
            } finally {
              setIsLoadingAvatar(false);
            }
          }
        } catch (error) {
          console.error('プロフィール取得エラー:', error);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  // アバター画像の表示制御
  useEffect(() => {
    // ファイル読み込み中は何もしない
    if (isLoadingAvatar) return;

    // 画像削除時
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }

    // 変更前の画像のままの場合（HTTPから始まるURL）
    if (avatarPreview && avatarPreview.startsWith('http')) {
      // ObjectURLを新規作成（新規画像選択時）
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }

    // 新規画像選択時
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [avatarFile, isLoadingAvatar]);

  // ファイル選択
  const handleFileSelect = (file: File | null) => {
    setAvatarFile(file);
    if (!file) {
      setAvatarPreview(null);
      setIsAvatarRemoved(true);
    } else {
      setIsAvatarRemoved(false);
    }

    // 別アバター画像を選択時、既存のバリデーションエラーがあればクリアする
    if (errors.avatar) {
      setErrors(prev => ({ ...prev, avatar: undefined }));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    // x_account_url項目は自動的にクリーンアップ（cleanXAccountUrl）を実行
    const cleanedValue = field === 'x_account_url' ? cleanXAccountUrl(value) : value;
    setFormData(prev => ({ ...prev, [field]: cleanedValue }));
    // 再入力中は、既存のバリデーションエラーをクリアする
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // バリデーションエラー
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // アバター画像のバリデーション
    if (avatarFile) {
      const maxSize = 5 * 1024 * 1024;
      if (avatarFile.size > maxSize) {
        newErrors.avatar = `画像サイズは5MB以下にしてください`;
      }

      // 画像形式のチェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(avatarFile.type)) {
        newErrors.avatar = '画像形式はJPEG、PNG、GIF、WebPのみ対応しています';
      }
    }

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

    setIsLoadingOverlay(true);

    try {
      const submitData = new FormData();
      submitData.append('user[name]', formData.name);
      submitData.append('user[bio]', formData.bio);
      // X アカウント URL は空でない場合のみ追加し、必ず https://x.com/ を前に付ける
      const cleanedXUrl = cleanXAccountUrl(formData.x_account_url);
      submitData.append('user[x_account_url]', cleanedXUrl ? `https://x.com/${cleanedXUrl}` : '');

      // アバター画像の処理
      if (isAvatarRemoved && !avatarFile) {
        // 削除フラグが立っていて、新しいファイルもない場合は削除
        submitData.append('user[remove_avatar]', 'true');
      } else if (avatarFile) {
        // 新しいファイルがある場合はアップロード
        submitData.append('user[avatar]', avatarFile);
      }

      const response = await updateProfile(submitData);

      showAlert(response.message);

      // AuthContextのユーザー情報も更新
      setProfileUser(response.user);
      updateUser(response.user);

      router.push('/mypage');

    } catch (error) {
      console.error('プロフィール更新エラー:', error);
    } finally {
      setIsLoadingOverlay(false);
    }
  };

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          <CardHeader className="h-4 relative p-0">
            <div className="absolute inset-0"></div>
            <div className="absolute bottom-4 right-6">
              <div className="text-white text-sm opacity-75"></div>
            </div>
          </CardHeader>

          <CardContent className="relative px-6 pb-6">
            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-end mt-2 mb-6">
                <DropZone
                  onFileSelect={handleFileSelect}
                  accept='image/*'
                  isAvatarImage={true}
                  previewUrl={avatarPreview}
                />
                <div className="flex flex-col space-y-1">
                  {avatarFile && (
                    <span className="text-xs text-muted-foreground ml-2">選択中： {avatarFile.name} ({(avatarFile.size / 1024 /1024).toFixed(2)}MB)</span>
                  )}
                  <p className="text-xs text-muted-foreground ml-2">※アバター画像の最大容量は<span className="text-primary text-md font-semibold"> 5MBまで </span>です</p>
                  {errors.avatar && (
                    <p className="text-sm text-red-600 ml-2">{errors.avatar}</p>
                  )}
                </div>
              </div>

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
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {formData.name.length} / 20
                </div>
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
                  variant="secondary"
                  className="transition-all duration-200 transform disabled:scale-100 shadow-lg hover:shadow-xl"
                >
                  更新
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
