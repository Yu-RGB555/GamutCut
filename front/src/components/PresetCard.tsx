import React, { useRef, useEffect } from 'react';
import { Preset } from '@/types/preset';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { MaskDrawer } from '@/lib/MaskDrawer';
import { Point } from '@/types/gamut';

interface PresetCardProps {
  preset: Preset;
}

export function PresetCard({ preset }: PresetCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const EDITOR_CANVAS_SIZE = 400; // オリジナルのキャンバスサイズ
  const CARD_CANVAS_SIZE = 200;   // プレビュー用のキャンバスサイズ

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

  // 初回レンダリング時に描画
  useEffect(() => {
    drawPreset();
  }, [preset]);

  return (
    <div className="bg-card border p-4 rounded-lg">
      <div className="flex flex-col">
        <p className="text-gray-300 font-medium">{preset.name}</p>
        <canvas
          ref={canvasRef}
          width={CARD_CANVAS_SIZE}
          height={CARD_CANVAS_SIZE}
          className="mb-2"
        />
        <p className="text-gray-300 text-xs">
          明度： {preset.mask_data.value}%
        </p>
      </div>
    </div>
  );
}