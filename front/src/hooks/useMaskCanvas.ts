'use client';

import { useRef, useEffect, useCallback } from 'react';
import { MaskWithScale } from '@/types/gamut';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { MaskDrawer } from '@/lib/MaskDrawer';

/* =====================================================
  * 色相環＋マスクの Canvas 描画を管理するフック
  * 描画クラスは useRef で永続化（キャッシュ保持のため再生成禁止）
  * 初回描画は rAF 2回分の遅延（LCP/INP対策、詳細: docs/maskMaking.md）
  ======================================================
*/
export const useMaskCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  currentValue: number,
  rotation: number,
  selectedMask: MaskWithScale[]
) => {
  // 描画インスタンス（キャッシュを保持するため再レンダーをまたいで永続化する）
  const colorWheelDrawerRef = useRef<ColorWheelDrawer | null>(null);
  if (colorWheelDrawerRef.current === null) {
    colorWheelDrawerRef.current = new ColorWheelDrawer();
  }
  const colorWheelDrawer = colorWheelDrawerRef.current;

  const maskDrawerRef = useRef<MaskDrawer | null>(null);
  if (maskDrawerRef.current === null) {
    maskDrawerRef.current = new MaskDrawer();
  }
  const maskDrawer = maskDrawerRef.current;

  // 再描画処理
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 色相環を描画
    colorWheelDrawer.draw(ctx, canvas.width, canvas.height, currentValue, rotation);

    if (selectedMask.length === 0) {
      return; // マスクがない場合はグレーアウト処理をしない
    }

    // マスクを描画
    maskDrawer.drawMasks(ctx, selectedMask, canvas.width, canvas.height)
  };

  // エクスポート処理
  const handleMaskExport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 既に描画済みのcanvasをそのままエクスポート
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'masked-color-wheel.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
    // canvasRef は useRef 由来で参照が安定しているため、deps に含めても再生成は発生しない
  }, [canvasRef]);

  // 初回の描画が終わったかどうか
  const hasDrawnRef = useRef(false);

  // 再描画トリガー
  // 初回のみ、ページ表示を優先するため描画をrAF2回分あとに遅らせる（詳細: docs/maskMaking.md）
  // 2回目以降も、スライダーのドラッグ中など短時間にdepsが連続で変わるケースに備えて
  // rAFでスケジュールし、1フレームにつき最大1回の描画に間引く（連続変化時は
  // クリーンアップで前回分をキャンセルし、最終的な値で1回だけ描画される）
  useEffect(() => {
    if (!hasDrawnRef.current) {
      let cancelled = false;
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          hasDrawnRef.current = true;
          redraw();
        });
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
      };
    }

    const rafId = requestAnimationFrame(() => {
      redraw();
    });

    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, rotation, selectedMask]);

  return {
    colorWheelDrawer,
    handleMaskExport,
  };
};
