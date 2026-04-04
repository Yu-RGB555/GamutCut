'use client';

import { useEffect, useState } from "react";
import { MaskMaking } from "@/components/MaskMaking";
import { useAuth } from "@/contexts/AuthContext";
import { getPresets } from "@/lib/api";
import { Preset } from "@/types/preset";
import { MyMaskList } from "@/components/MyMaskList";
import { MaskData } from "@/types/mask";
import { useLoad } from "@/contexts/LoadingContext";
import { useTranslations } from "next-intl";
import { isMaintenanceMode } from "@/lib/maintenance";

export default function CreateGamutMask() {
  const { isAuthenticated } = useAuth();
  const maintenance = isMaintenanceMode();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [copiedMaskData, setCopiedMaskData] = useState<MaskData | null>(null);
  const { setIsLoadingOverlay } = useLoad();
  const t = useTranslations('CreateMask');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      {/* <div className="bg-gray-400 border border-gray-500 rounded-lg p-4 m-12">
        <h3 className="font-semibold text-gray-900">{t('temp_message')}</h3>
      </div> */}
      <div className="justify-items-center mx-4 sm:mx-8 lg:mx-16 mb-40">
        <div className="grid grid-cols-1 gap-y-16">
          {/* マスク作成セクション */}
          <div className="w-full">
            <MaskMaking
              onSaveSuccess={fetchPresetsAfterSave}
              copiedMaskData={copiedMaskData} // 「コピーして編集」用
            />
          </div>

          {/* Myマスク一覧セクション（メンテナンス中は非表示） */}
          {!maintenance && (
            <div id="step-5" className="space-y-16">
              <h3 className="text-label text-left text-lg font-semibold">{t('my_mask_list')}</h3>
              <MyMaskList
                myPresets={presets}
                fetchPresets={() => fetchPresets(false)}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
