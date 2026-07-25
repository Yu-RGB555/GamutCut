'use client';

import { useState, useEffect } from 'react';
import { ColorInfo, MaskWithScale } from '@/types/gamut';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { hsvToRgb, getColorFromCoords } from '@/lib/colorUtils';
import {
  getCenter,
  getScaledPoints,
  findClosestPoint,
  isPointInPolygon
} from '@/lib/maskUtils';

// 円形マスクかどうかを判定
const isCircularMask = (mask: MaskWithScale): boolean => {
  return mask.shape_type === 'circle';
};

interface UseMaskPointerParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  colorWheelDrawer: ColorWheelDrawer;
  currentValue: number;
  rotation: number;
  selectedMask: MaskWithScale[];
  setSelectedMask: React.Dispatch<React.SetStateAction<MaskWithScale[]>>;
  selectedMaskIndex: number;
}

/* =====================================================
  * canvas 上のポインター操作を管理するフック
  * 頂点ドラッグ・図形全体の移動・カーソル形状の切り替え・
  * ポインター位置の色情報表示・タッチスクロール抑止を担当
  ======================================================
*/
export const useMaskPointer = ({
  canvasRef,
  colorWheelDrawer,
  currentValue,
  rotation,
  selectedMask,
  setSelectedMask,
  selectedMaskIndex,
}: UseMaskPointerParams) => {
  const [colorInfo, setColorInfo] = useState<ColorInfo>({
    coordinates: '-',
    hue: '-',
    saturation: '-',
    value: '-',
    rgb: '-'
  });

  // ドラッグ関連の状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState<number>(-1);  // 頂点
  const [draggingMaskIndex, setDraggingMaskIndex] = useState<number>(-1); // 図形全体
  const [lastMousePos, setLastMousePos] = useState<{x: number, y: number} | null>(null);
  const [dragMaskIndex, setDragMaskIndex] = useState<number>(-1);

  // マスク図形自体または頂点のドラッグ
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // キャンバス外でも操作を継続させる
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    // 表示サイズからCanvas内部座標に変換
    const x = (displayX / rect.width) * canvas.width;
    const y = (displayY / rect.height) * canvas.height;

    // 頂点ドラッグ判定
    for (let maskIdx = 0; maskIdx < selectedMask.length; maskIdx++) {
      const mask = selectedMask[maskIdx];

      // 円形マスクの場合は頂点ドラッグを無効化
      if (isCircularMask(mask)) {
        continue;
      }

      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1, mask.center);
      const pointIdx = findClosestPoint(x, y, scaledPoints);
      if (pointIdx !== -1) {
        setIsDragging(true);
        setDragMaskIndex(maskIdx);
        setDragPointIndex(pointIdx);
        return; // 頂点ドラッグならここで終了
      }
    }

    // 図形全体ドラッグ判定
    for (let idx = 0; idx < selectedMask.length; idx++) {
      const mask = selectedMask[idx];
      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1, mask.center);
      if (isPointInPolygon(x, y, scaledPoints)) {
        setDraggingMaskIndex(idx);
        setLastMousePos({ x, y });
        return;
      }
    }
  };

  // ポインタームーブイベント
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    // 表示サイズからCanvas内部座標に変換
    const x = (displayX / rect.width) * canvas.width;
    const y = (displayY / rect.height) * canvas.height;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const { hue, saturation, distance } = getColorFromCoords(x, y, centerX, centerY, colorWheelDrawer.getMaxRadius(), rotation);

    // 色情報の取得
    if (distance <= colorWheelDrawer.getMaxRadius()) {
      const [r, g, b] = hsvToRgb(hue, saturation, currentValue);
      setColorInfo({
        coordinates: `(${Math.round(x)}, ${Math.round(y)})`,
        hue: Math.round(hue).toString(),
        saturation: Math.round(saturation).toString(),
        value: currentValue.toString(),
        rgb: `${r}, ${g}, ${b}`
      });
    } else {
      setColorInfo({
        coordinates: '-',
        hue: '-',
        saturation: '-',
        value: '-',
        rgb: '-'
      });
    }

    // 1. 頂点ドラッグ処理
    if (isDragging && dragMaskIndex !== -1 && dragPointIndex !== -1) {
      const updatedMasks = selectedMask.map((mask, idx) => {
        if (idx === dragMaskIndex) {
          const scale = mask.scale ?? 1;
          const center = mask.center ?? getCenter(mask.originalPoints); // 拡縮の基準点（固定）
          const scaledPoints = getScaledPoints(mask.originalPoints, scale, center); // スケール済み点群の取得
          const newScaledPoints = [...scaledPoints]; // ドラッグされた頂点だけ新しい座標に置き換え
          newScaledPoints[dragPointIndex] = { x, y };
          // 逆変換でoriginalPointsを再計算（centerは固定のため他の頂点はズレない）
          const newOriginalPoints = newScaledPoints.map(p => ({
            x: center.x + (p.x - center.x) / scale,
            y: center.y + (p.y - center.y) / scale
          }));
          return { ...mask, originalPoints: newOriginalPoints };
        }
        return mask;
      });
      setSelectedMask(updatedMasks);
      canvas.style.cursor = 'grabbing';  // 頂点ドラッグ中のカーソル設定
      return; // 頂点ドラッグ時は他の処理をしない
    }

    // 2. 図形全体ドラッグ処理
    if (draggingMaskIndex !== -1 && lastMousePos) {
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      const updatedMasks = selectedMask.map((mask, idx) => {
        if (idx === draggingMaskIndex) {
          return {
            ...mask,
            originalPoints: mask.originalPoints.map(p => ({ x: p.x + dx, y: p.y + dy })),
            // 拡縮の基準点も図形と一緒に移動させる
            center: mask.center ? { x: mask.center.x + dx, y: mask.center.y + dy } : undefined
          };
        }
        return mask;
      });
      setSelectedMask(updatedMasks);
      setLastMousePos({ x, y });
      canvas.style.cursor = 'all-scroll';  // マスク全体移動中のカーソル設定
      return; // マスク全体移動中は他の処理をしない
    }

    // カーソルスタイル変更（ドラッグ操作以外の場合）
    if (!isDragging) {
      let foundPoint = false; // マスク頂点の判定
      let foundMask = false;  // マスク領域の判定

      selectedMask.forEach(mask => {
        const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1, mask.center);

        // 円形マスク以外の場合のみ頂点判定を行う
        if (!isCircularMask(mask)) {
          const pointIndex = findClosestPoint(x, y, scaledPoints);
          if (pointIndex !== -1) foundPoint = true;
        }

        // マスク内部判定（全てのマスクで実行）
        if (isPointInPolygon(x, y, scaledPoints)) {
          foundMask = true;
        }
      });

      if (foundPoint) {
        canvas.style.cursor = 'grab';  // 頂点付近
      } else if (foundMask) {
        canvas.style.cursor = 'all-scroll';  // マスク内部
      } else {
        canvas.style.cursor = 'default';  // マスク外
      }
    }
  };

  // ポインター操作の状態リセット
  const handlePointerUp = () => {
    setIsDragging(false);
    setDragPointIndex(-1);
    setDragMaskIndex(-1);
    setDraggingMaskIndex(-1);
    setLastMousePos(null);

    // ドラッグ終了時、originalPointsも更新
    setSelectedMask(selectedMask.map((mask, idx) => {
      if (idx === selectedMaskIndex) {
        return { ...mask, originalPoints: mask.originalPoints };
      }
      return mask;
    }));
  };

  // 色相環・マスクの上ではページスクロールを抑止し、円の外側（四隅など）は
  // ブラウザのデフォルト＝タッチスクロールに任せる
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;

      // 初回描画前は getMaxRadius() が 0 のためフォールバック値を使う
      const maxRadius = colorWheelDrawer.getMaxRadius()
        || Math.min(canvas.width, canvas.height) * 0.375;
      const inWheel = Math.hypot(x - canvas.width / 2, y - canvas.height / 2) <= maxRadius;

      // マスクは円の外へも移動できるため、マスク領域・頂点近傍も操作対象に含める
      const onMask = selectedMask.some(mask => {
        const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1, mask.center);
        return isPointInPolygon(x, y, scaledPoints)
          || (!isCircularMask(mask) && findClosestPoint(x, y, scaledPoints) !== -1);
      });

      if (inWheel || onMask) e.preventDefault();
    };

    // preventDefault を有効にするため passive: false で登録する
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => canvas.removeEventListener('touchstart', handleTouchStart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMask]);

  return {
    colorInfo,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};
