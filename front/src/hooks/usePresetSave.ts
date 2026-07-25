'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAlert } from '@/contexts/AlertContext';
import { MaskWithScale } from '@/types/gamut';
import { Preset } from '@/types/preset';
import { maskSave } from '@/lib/api';
import { getScaledPoints } from '@/lib/maskUtils';

interface UsePresetSaveParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  selectedMask: MaskWithScale[];
  currentValue: number;
  rotation: number;
  onSaveSuccess: () => Promise<void>;
}

/* =====================================================
  * プリセット名入力ダイアログの状態と maskSave API 呼び出しを管理するフック
  * 保存する JSON はバックエンドの Preset.mask_data にそのまま入るため
  * 構造を変えるときは既存プリセットとの前方互換の検討が必須
  ======================================================
*/
export const usePresetSave = ({
  canvasRef,
  selectedMask,
  currentValue,
  rotation,
  onSaveSuccess,
}: UsePresetSaveParams) => {
  const { showAlert } = useAlert();
  const t = useTranslations('CreateMask');
  const [isComposing, setIsComposing] = useState(false);

  // プリセット名入力ダイアログの状態
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  // プリセット保存ダイアログを開く
  const handleMaskSave = useCallback(() => {
    setPresetName('No Title');
    setIsSaveDialogOpen(true);
  }, []);

  // プリセット保存を実行する
  const executePresetSave = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 現在のマスクの状態を相対座標で保存
      const currentMasks = selectedMask.map(mask => {
        const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1, mask.center);

        // 中心点からの相対座標に変換（-1.0 ~ 1.0の範囲）
        const relativePoints = scaledPoints.map(point => ({
          x: (point.x - centerX) / canvas.width * 2,
          y: (point.y - centerY) / canvas.height * 2
        }));

        return {
          originalPoints: relativePoints, // 相対座標
          scale: 1, // スケールは相対座標化に含まれるため1にリセット
          shape_type: mask.shape_type // 図形タイプ
        };
      });

      // プリセットデータの作成
      const presetData: Preset = {
        id: Date.now(), // 一時的なID（API側で上書き）
        name: presetName,
        mask_data: {
          value: currentValue,
          rotation: rotation,
          masks: currentMasks,
        }
      };

      // プリセットを保存
      const response = await maskSave(presetData);
      showAlert(response.message);

      // ダイアログを閉じて、プリセット一覧を更新
      setIsSaveDialogOpen(false);
      setPresetName('');
      await onSaveSuccess();
    } catch (error) {
      console.error('プリセット保存エラー:', error);
      showAlert(t('alert_save_fail'));
    }
  };

  // プリセット保存をキャンセル
  const cancelPresetSave = () => {
    setIsSaveDialogOpen(false);
    setPresetName('');
  };

  // Enterキーで保存
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter' && !isComposing){
      executePresetSave();
    } else if(e.key === 'Escape') {
      cancelPresetSave();
    }
  }

  return {
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    presetName,
    setPresetName,
    setIsComposing,
    handleMaskSave,
    executePresetSave,
    cancelPresetSave,
    handleKeyDown,
  };
};
