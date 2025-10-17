'use client';

import { useEffect, useState } from "react";
import { MaskMaking } from "@/components/MaskMaking";
import { useAuth } from "@/contexts/AuthContext";
import { getPresets } from "@/lib/api";
import { Preset } from "@/types/preset";
import { MyMaskList } from "@/components/MyMaskList";
import { MaskData } from "@/types/mask";
import { useNextStep } from 'nextstepjs';
import { Button } from "@/components/ui/button";
// import { testApiConnection } from '@/lib/api';

export default function Home() {
  // useEffect(() => {
  //   testApiConnection();
  // }, []);
  const { isAuthenticated } = useAuth();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMaskData, setCopiedMaskData] = useState<MaskData | null>(null);

  const { startNextStep, closeNextStep, currentTour, currentStep, setCurrentStep, isNextStepVisible } = useNextStep();

  const handleStartTour = () => {
    startNextStep("mainTour");
  };

  // Myマスク一覧データ取得
  const fetchPresets = async (showLoading: boolean = true): Promise<void> => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }
      const presetData = await getPresets();
      setPresets(presetData);
    } catch (error) {
      console.error('Myマスク取得エラー:', error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // マスク保存後・削除後の一覧更新（ページリロードなし）
  const fetchPresetsAfterSave = () => fetchPresets(false);

  // 認証状態が変わった時にMyマスクを取得
  useEffect(() => {
    if(isAuthenticated){
      fetchPresets();
    }
  }, [isAuthenticated]);

  // コピーされたマスクデータを確認（コピーして編集用）
  useEffect(() => {
    const stored = localStorage.getItem('copiedMaskData');
    if (stored) {
      try {
        const maskData = JSON.parse(stored) as MaskData;
        setCopiedMaskData(maskData);
        localStorage.removeItem('copiedMaskData');  // 一度使用したら削除
      } catch (error) {
        console.error('コピーされたマスクデータの読み込みに失敗:', error);
      }
    }
  }, []);

  return (
    <div className="justify-items-center mx-4 sm:mx-8 lg:mx-16 mb-40 space-y-8">
      {isLoading ? (
        <div className="text-center">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 gap-y-16 lg:gap-y-32">
          {/* オンボーディング開始ボタン */}
          <div className="text-center">
            <Button
              onClick={handleStartTour}
              variant="ghost"
              className="px-6 py-3 transition-colors"
            >
              ガイドツアー
            </Button>
          </div>
          {/* マスク作成セクション */}
          <div id="mask-making-section">
            <MaskMaking
              onSaveSuccess={fetchPresetsAfterSave}
              copiedMaskData={copiedMaskData} // コピーして編集用
            />
          </div>

          {/* Myマスク一覧セクション */}
          <div id="my-mask-list-section" className="space-y-8">
            <h3 className="text-label text-left text-lg font-semibold">Myマスク一覧</h3>
            <MyMaskList
              myPresets={presets}
              fetchPresets={() => fetchPresets(false)}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      )}
    </div>
  );
}
