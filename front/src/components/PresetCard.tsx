import React, { useRef, useEffect } from 'react';
import { Trash2Icon } from 'lucide-react';
import { Preset } from '@/types/preset';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { MaskDrawer } from '@/lib/MaskDrawer';
import { Point } from '@/types/gamut';
import { deletePreset } from '@/lib/api';
import { useAlert } from '@/contexts/AlertContext';

interface PresetCardProps {
  preset: Preset;
  onDeleteSuccess?: () => void;
}

export function PresetCard({ preset, onDeleteSuccess }: PresetCardProps) {
  const { showAlert } = useAlert();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CARD_CANVAS_SIZE = 200;   // キャンバスサイズ(プレビュー用)

  // 描画インスタンス
  const colorWheelDrawer = new ColorWheelDrawer();
  const maskDrawer = new MaskDrawer();

  // 相対座標から絶対座標へのスケーリング
  const scalePoints = (points: Point[], scale: number): Point[] => {
    // キャンバスの中心を計算
    const centerX = CARD_CANVAS_SIZE / 2;
    const centerY = CARD_CANVAS_SIZE / 2;

    return points.map(point => {
      // 1. 相対座標（-1.0 ~ 1.0）をキャンバスサイズに合わせて絶対座標に変換
      const absoluteX = centerX + (point.x * CARD_CANVAS_SIZE / 2);
      const absoluteY = centerY + (point.y * CARD_CANVAS_SIZE / 2);

      // 2. スケール値を適用（中心点からの距離に対して）
      const relativeX = absoluteX - centerX;
      const relativeY = absoluteY - centerY;
      const scaledX = centerX + (relativeX * scale);
      const scaledY = centerY + (relativeY * scale);

      return {
        x: scaledX,
        y: scaledY
      };
    });
  };

  // 描画処理(プリセット用)
  const drawPreset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 色相環を描画
    colorWheelDrawer.draw(ctx, CARD_CANVAS_SIZE, CARD_CANVAS_SIZE, preset.mask_data.value);

    // マスクを描画
    if (preset.mask_data.masks.length > 0) {
      const masksWithRequired = preset.mask_data.masks.map((mask, index) => {
        // 保存された座標をプレビューサイズにスケーリング
        const scaledPoints = scalePoints(mask.originalPoints, mask.scale);

        return {
          id: index,
          name: 'プリセットマスク',
          points: [],
          originalPoints: scaledPoints,
          scale: mask.scale
        };
      });
      maskDrawer.drawMasks(ctx, masksWithRequired, CARD_CANVAS_SIZE, CARD_CANVAS_SIZE);
    }
  };

  // Myマスク削除
  const removePreset = async (id: number) => {
    try {
      const response = await deletePreset(id);
      showAlert(response.message);
      // 親コンポーネントのMyマスク一覧を更新
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('プリセット削除エラー:', error);
      showAlert('プリセットの削除に失敗しました');
    }
  }

  // 初回レンダリング時に描画
  useEffect(() => {
    drawPreset();
  }, [preset]);

  return (
    <div className="bg-background border p-4 rounded-lg">
      <div className="flex flex-col">
        <div className="flex justify-between w-full items-center">
          <p className=" text-gray-300 font-medium">
            {preset.name.length > 15
              ? `${preset.name.slice(0, 15)}...`
              : preset.name
            }
          </p>
          <Trash2Icon
            onClick={() => removePreset(preset.id)}
            className="text-destructive w-5 h-5 hover:cursor-pointer"
          />
        </div>
        <canvas
          ref={canvasRef}
          width={CARD_CANVAS_SIZE}
          height={CARD_CANVAS_SIZE}
          className="my-2"
        />
        <p className="text-gray-300 text-xs text-right">
          明度： {preset.mask_data.value}%
        </p>
      </div>
    </div>
  );
}