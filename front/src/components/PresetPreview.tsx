import React, { useRef, useEffect } from 'react';
import { Preset } from '@/types/preset';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { MaskDrawer } from '@/lib/MaskDrawer';
import { Point } from '@/types/gamut';

interface PresetPreviewProps {
  preset: Preset;
  size: number;
}

export function PresetPreview({ preset, size =300 }: PresetPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const PREVIEW_CANVAS_SIZE = size; // プレビュー用のキャンバスサイズ

  // 描画インスタンス
  const colorWheelDrawer = new ColorWheelDrawer();
  const maskDrawer = new MaskDrawer();

  // 相対座標から絶対座標へのスケーリング
  const scalePoints = (points: Point[], scale: number): Point[] => {
    // キャンバスの中心を計算
    const centerX = PREVIEW_CANVAS_SIZE / 2;
    const centerY = PREVIEW_CANVAS_SIZE / 2;

    return points.map(point => {
      // 1. 相対座標（-1.0 ~ 1.0）をキャンバスサイズに合わせて絶対座標に変換
      const absoluteX = centerX + (point.x * PREVIEW_CANVAS_SIZE / 2);
      const absoluteY = centerY + (point.y * PREVIEW_CANVAS_SIZE / 2);

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

  // 描画処理
  const drawPreset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 色相環を描画
    colorWheelDrawer.draw(ctx, PREVIEW_CANVAS_SIZE, PREVIEW_CANVAS_SIZE, preset.mask_data.value);

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
      maskDrawer.drawMasks(ctx, masksWithRequired, PREVIEW_CANVAS_SIZE, PREVIEW_CANVAS_SIZE);
    }
  };

  // 初回レンダリング時に描画
  useEffect(() => {
    drawPreset();
  }, [preset, size]);

  return (
    <div className="rounded-lg h-80 flex items-center bg-background/50">
      <div className="flex items-center justify-center w-full h-full">
        <canvas
          ref={canvasRef}
          width={PREVIEW_CANVAS_SIZE}
          height={PREVIEW_CANVAS_SIZE}
        />
      </div>
    </div>
  );
}
