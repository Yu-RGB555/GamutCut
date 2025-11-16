'use client';

import { useEffect, useState } from "react";
import { MaskMaking } from "@/components/MaskMaking";
import { useAuth } from "@/contexts/AuthContext";
import { getPresets } from "@/lib/api";
import { Preset } from "@/types/preset";
import { MyMaskList } from "@/components/MyMaskList";
import { MaskData } from "@/types/mask";
import { useNextStep } from 'nextstepjs';
import { motion } from "motion/react"
import { useLoad } from "@/contexts/LoadingContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [copiedMaskData, setCopiedMaskData] = useState<MaskData | null>(null);
  const { setIsLoadingOverlay } = useLoad();
  const { startNextStep } = useNextStep();

  const handleStartTour = () => {
    startNextStep("mainTour");
  };

  // Myマスク一覧データ取得
  const fetchPresets = async (showLoading: boolean = true): Promise<void> => {
    try {
      if (showLoading) {
        setIsLoadingOverlay(true);
      }
      const presetData = await getPresets();
      setPresets(presetData);
    } catch (error) {
      console.error('Myマスク取得エラー:', error);
    } finally {
      if (showLoading) {
        setIsLoadingOverlay(false);
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
    <div className="justify-items-center mx-4 sm:mx-8 lg:mx-16 mb-40">
      <div className="grid grid-cols-1 gap-y-16">
        {/* マスク作成セクション */}
        <div className="w-full">
          <MaskMaking
            onSaveSuccess={fetchPresetsAfterSave}
            copiedMaskData={copiedMaskData} // 「コピーして編集」用
          />
        </div>

        {/* Myマスク一覧セクション */}
        <div id="step-5" className="space-y-16">
          <h3 className="text-label text-left text-lg font-semibold">Myマスク一覧</h3>
          <MyMaskList
            myPresets={presets}
            fetchPresets={() => fetchPresets(false)}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
      {/* ガイドツアーボタン */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <motion.button
          onClick={handleStartTour}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-400 border-1 border-green-100 hover:bg-cyan-700 hover:cursor-pointer transition-colors rounded-full shadow-lg"
        >
          <p className="text-center text-[10px] sm:text-xs font-semibold text-black leading-tight">かんたん<br />ガイド</p>
        </motion.button>
      </div>
    </div>
  );
}
