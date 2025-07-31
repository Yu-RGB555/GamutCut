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

  // 座標のスケーリング
  const scalePoints = (points: Point[], scale: number): Point[] => {
    // キャンバスの中心を計算
    const centerX = CARD_CANVAS_SIZE / 2;
    const centerY = CARD_CANVAS_SIZE / 2;

    return points.map(point => {
      // 1. まずキャンバスサイズの比率でスケーリング
      const scaledX = (point.x * CARD_CANVAS_SIZE) / EDITOR_CANVAS_SIZE;
      const scaledY = (point.y * CARD_CANVAS_SIZE) / EDITOR_CANVAS_SIZE;

      // 2. 中心点からの相対位置を計算
      const relativeX = scaledX - centerX;
      const relativeY = scaledY - centerY;

      // 3. マスクのスケール値を適用
      const scaledRelativeX = relativeX * scale;
      const scaledRelativeY = relativeY * scale;

      // 4. 中心点から実際の位置に戻す
      return {
        x: centerX + scaledRelativeX,
        y: centerY + scaledRelativeY
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
      <canvas
        ref={canvasRef}
        width={CARD_CANVAS_SIZE}
        height={CARD_CANVAS_SIZE}
        className="mb-2"
      />
      <p className="text-gray-300 font-medium">{preset.name}</p>
      <p className="text-gray-300 text-xs">
        明度: {preset.mask_data.value}%
      </p>
    </div>
  );
}