'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAlert } from '@/contexts/AlertContext';
import { ShapeTemplate, MaskWithScale } from '@/types/gamut';
import { MaskData } from '@/types/mask';
import { getCenter, toAbsolutePoints } from '@/lib/maskUtils';

/* =====================================================
  * ガマットマスク編集のドキュメント状態を管理するフック
  * 明度・回転・マスク配列（Preset.mask_data の { value, rotation, masks } に対応）と
  * マスクの追加・削除・拡縮・コピーからの復元を担当
  ======================================================
*/
export const useMaskState = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  copiedMaskData?: MaskData | null
) => {
  const { showAlert } = useAlert();
  const t = useTranslations('CreateMask');

  // 色相環パラメータ
  const [currentValue, setCurrentValue] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  // 選択マスクの状態
  const [selectedMask, setSelectedMask] = useState<MaskWithScale[]>([]); // 選択中のマスク情報
  const [selectedMaskIndex, setSelectedMaskIndex] = useState<number>(0); // 表示マスクのインデックス
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // テンプレートマスク選択
  const handleMaskSelect = useCallback((mask: ShapeTemplate) => {
    // マスクの最大数制限（3つまで）
    if (selectedMask.length >= 3) {
      setIsDialogOpen(false);
      showAlert(t('alert_max_masks'));
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const absPoints = toAbsolutePoints(mask.points, width, height);
    setSelectedMask([
      ...selectedMask,
      {
        id: mask.id,
        originalPoints: absPoints,
        scale: 1,
        shape_type: mask.shape_type,
        center: getCenter(absPoints) // 拡縮の基準点を固定
      }
    ]);
    setSelectedMaskIndex(selectedMask.length);
    setIsDialogOpen(false);
    // canvasRef は useRef 由来で参照が安定しているため、deps に含めても再生成は発生しない
  }, [selectedMask, showAlert, t, canvasRef]);

  // マスク削除
  const handleMaskDelete = useCallback(() => {
    if (selectedMask.length === 0) return;

    // 選択中のマスクを削除
    const updatedMasks = selectedMask.filter((_, idx) => idx !== selectedMaskIndex);
    setSelectedMask(updatedMasks);

    // 削除後にインデックスを調整
    if (updatedMasks.length === 0) {
      setSelectedMaskIndex(0);
    } else if (selectedMaskIndex >= updatedMasks.length) {
      setSelectedMaskIndex(updatedMasks.length - 1);
    }
  }, [selectedMask, selectedMaskIndex]);

  // 拡大縮小
  const handleScaleChange = useCallback((scale: number) => {
    setSelectedMask(selectedMask.map((mask, idx) =>
      idx === selectedMaskIndex ? { ...mask, scale } : mask
    ));
  }, [selectedMask, selectedMaskIndex]);

  // 初期マスクデータの復元
  useEffect(() => {
    if (copiedMaskData) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 相対座標を絶対座標に変換
      const restoredMasks = copiedMaskData.masks.map((mask, index) => {
        const absolutePoints = mask.originalPoints.map(point => ({
          x: centerX + (point.x * canvas.width / 2),
          y: centerY + (point.y * canvas.height / 2)
        }));

        return {
          // MaskWithScale（gamut.ts）
          id: Date.now() + index, // 一時的なID
          originalPoints: absolutePoints,
          scale: mask.scale || 1,
          shape_type: mask.shape_type || 'unknown', // 図形タイプ
          center: getCenter(absolutePoints) // 拡縮の基準点を固定
        };
      });

      setSelectedMask(restoredMasks);
      setCurrentValue(copiedMaskData.value);
      setRotation(copiedMaskData.rotation ?? 0);
      setSelectedMaskIndex(restoredMasks.length > 0 ? restoredMasks.length - 1 : 0);
    }
    // canvasRef は useRef 由来で参照が安定しているため、deps に含めても再実行は発生しない
  }, [copiedMaskData, canvasRef]);

  return {
    selectedMask,
    setSelectedMask,
    selectedMaskIndex,
    setSelectedMaskIndex,
    currentValue,
    setCurrentValue,
    rotation,
    setRotation,
    isDialogOpen,
    setIsDialogOpen,
    handleMaskSelect,
    handleMaskDelete,
    handleScaleChange,
  };
};
