'use client';

import { useEffect, useState } from "react";
// import { testApiConnection } from '@/lib/api';
import { MaskMaking } from "@/components/MaskMaking";
import { getPresets } from "@/lib/api";
import { Preset } from "@/types/preset";
import { PresetCard } from "@/components/PresetCard";

export default function Home() {
  // useEffect(() => {
  //   testApiConnection();
  // }, []);
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

  // 初回マウント時にプリセットを取得
  useEffect(() => {
    fetchPresets();
  }, []);

  return (
    <div className="justify-items-center mx-16 mb-40 space-y-8">
      {isLoading ? (
        <div className="text-center">読み込み中...</div>
      ) : (
        <>
          <MaskMaking onSaveSuccess={fetchPresets} />
          <div className="grid grid-cols-1 gap-y-4">
            <h3 className="text-card-foreground text-left text-lg font-semibold">プリセット一覧</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {presets.map((preset) => (
                <PresetCard key={preset.id} preset={preset} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
