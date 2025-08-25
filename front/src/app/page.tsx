'use client';

import { useEffect, useState } from "react";
import { MaskMaking } from "@/components/MaskMaking";
import { useAuth } from "@/contexts/AuthContext";
import { getPresets } from "@/lib/api";
import { Preset } from "@/types/preset";
import { MyMaskList } from "@/components/MyMaskList";
// import { testApiConnection } from '@/lib/api';

export default function Home() {
  // useEffect(() => {
  //   testApiConnection();
  // }, []);
  const { isAuthenticated } = useAuth();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="justify-items-center mx-16 mb-40 space-y-8">
      {isLoading ? (
        <div className="text-center">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 gap-y-32">
          <MaskMaking onSaveSuccess={fetchPresetsAfterSave} />
          <div className="space-y-8">
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
