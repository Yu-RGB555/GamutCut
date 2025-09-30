'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

interface BackButtonProps {
  className?: string;
  iconSize?: string;
  buttonSize?: string;
}

export function BackButton({
  className = "",
  iconSize = "!h-8 !w-8",
  buttonSize = "h-14 w-14"
}: BackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = () => {
    const fromParams = searchParams?.get('from');

    if (fromParams) {
      try {
        // デバッグ: エンコードされた値とデコードされた値を確認
        console.log('fromParams (encoded):', fromParams);
        const decodedParams = decodeURIComponent(fromParams);
        console.log('decodedParams (decoded):', decodedParams);

        // パラメータに基づいて戻り先を判定
        if (decodedParams.includes('mypage')) {
          // マイページ系の場合
          router.push(`/${decodedParams}`);
        } else {
          // 作品一覧の場合
          router.push(`/work?${decodedParams}`);
        }
      } catch (error) {
        console.error('URLパラメータのデコードに失敗:', error);
        // デコードに失敗した場合はブラウザの戻る機能を使用
        router.back();
      }
    } else {
      // fromパラメータがない場合はブラウザの戻る機能を使用
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`${buttonSize} p-0 flex items-center justify-center text-label hover:bg-muted rounded-full transition-all duration-200 hover:scale-105 ${className}`}
    >
      <ArrowLeftIcon className={`${iconSize}`} />
    </Button>
  );
}