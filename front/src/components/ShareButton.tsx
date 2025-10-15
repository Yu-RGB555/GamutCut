'use client';

import React, { useState } from "react";
import { PiShareFatLight, PiLinkBold } from "react-icons/pi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/contexts/AlertContext";

interface ShareButtonProps {
  workId: number;
  workTitle: string;
  workDescription?: string;
  userName: string;
}

export function ShareButton({ workId, workTitle, workDescription, userName }: ShareButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showAlert } = useAlert();

  // 現在のページのURLを取得
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}/work/${workId}`;
  };

  // URLをクリップボードにコピーする関数
  const handleCopyUrl = async () => {
    try {
      const currentUrl = getCurrentUrl();
      await navigator.clipboard.writeText(currentUrl);
      showAlert('URLをコピーしました');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('URLコピーエラー:', error);
      showAlert('URLのコピーに失敗しました');
    }
  };

  // Xでシェアする関数
  const handleShareToX = () => {
    const currentUrl = getCurrentUrl();
    const text = workDescription
      ? `${workTitle} by ${userName}\n\n${workDescription}`
      : `${workTitle} by ${userName}`;

    // Xのシェア用URLを構築
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;

    // 新しいタブでXを開く
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    setIsDialogOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center gap-1 p-2 hover:cursor-pointer hover:bg-muted rounded-lg transition-colors"
        title="シェア"
      >
        <PiShareFatLight className="text-label w-6 h-6 stroke-2" />
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-label gap-2">
              作品をシェア
            </DialogTitle>
            <DialogDescription>
              この作品をシェアする方法を選択してください
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* URLコピーボタン */}
            <Button
              variant="outline"
              onClick={handleCopyUrl}
              className="w-full justify-start gap-3 p-4 h-auto"
            >
              <PiLinkBold className="text-label w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">URLをコピー</div>
                <div className="text-sm text-muted-foreground">
                  作品のURLをクリップボードにコピー
                </div>
              </div>
            </Button>

            {/* Xシェアボタン */}
            <Button
              variant="outline"
              onClick={handleShareToX}
              className="w-full justify-start gap-3 p-4 h-auto"
            >
              <img src="/X_logo.svg" alt="X" className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Xでシェア</div>
                <div className="text-sm text-muted-foreground">
                  作品の情報をXに投稿
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}