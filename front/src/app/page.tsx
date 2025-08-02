'use client';

import { useEffect, useState } from "react";
import { MaskMaking } from "@/components/MaskMaking";
import { useAuth } from "@/contexts/AuthContext";
import { getPresets } from "@/lib/api";
import { Preset } from "@/types/preset";
import { PresetCard } from "@/components/PresetCard";
// import { testApiConnection } from '@/lib/api';

export default function Home() {
  // useEffect(() => {
  //   testApiConnection();
  // }, []);
  const { isAuthenticated } = useAuth();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPresets = async () => {
    try {
      setIsLoading(true);
      const presetData = await getPresets();
      setPresets(presetData);
    } catch (error) {
      console.error('プリセット取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回マウント時にプリセットを取得(ログイン時のみ)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if(isAuthenticated){
      fetchPresets();
    }
  }, []);

  // プリセット一覧の表示コンテンツの制御
  const renderPresetContent = () => {
    if (!isAuthenticated) {
      return <span>プリセットを利用するにはログインが必要です</span>;
    }

    if (isAuthenticated && presets.length === 0) {
      return <span>保存されたマスクがありません</span>;
    }

    return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {presets.map((preset) => (
        <PresetCard key={preset.id} preset={preset} />
      ))}
    </div>
  };

  return (
    <div className="justify-items-center mx-16 mb-40 space-y-8">
      {isLoading ? (
        <div className="text-center">読み込み中...</div>
      ) : (
        <>
          <MaskMaking onSaveSuccess={fetchPresets} />
          <div className="grid grid-cols-1 gap-y-4">
            <h3 className="text-card-foreground text-left text-lg font-semibold">プリセット一覧</h3>
            {renderPresetContent()}
          </div>
        </>
      )}
    </div>
  );
}
