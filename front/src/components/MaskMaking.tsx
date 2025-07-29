import React, { useRef, useEffect, useState } from 'react';
import { ShapeTemplate, ColorInfo, MaskWithScale } from '@/types/gamut';
import { MaskControls } from './MaskControls';
import { ColorInfoPanel } from './ColorInfoPanel';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { MaskDrawer } from '@/lib/MaskDrawer';
import { shapeTemplates } from '@/lib/shapeTemplates';
import { hsvToRgb, getColorFromCoords } from '@/lib/colorUtils';
import { getCenter, getScaledPoints, findClosestPoint, isPointInPolygon, toAbsolutePoints } from '@/lib/maskUtils';

export function MaskMaking() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  // 描画インスタンス
  const colorWheelDrawer = new ColorWheelDrawer;
  const maskDrawer = new MaskDrawer;

  // 色相環パラメータ
  const [currentValue, setCurrentValue] = useState<number>(100);
  const [colorInfo, setColorInfo] = useState<ColorInfo>({
    coordinates: '-',
    hue: '-',
    saturation: '-',
    value: '-',
    rgb: '-'
  });

  // 選択マスクの状態
  const [selectedMask, setSelectedMask] = useState<MaskWithScale[]>([]); // 頂点座標(初期状態)、スケール
  const [selectedMaskIndex, setSelectedMaskIndex] = useState<number>(0); // 表示したマスクのインデックス
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ドラッグ関連の状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState<number>(-1);  // 頂点
  const [draggingMaskIndex, setDraggingMaskIndex] = useState<number>(-1); // 図形全体
  const [lastMousePos, setLastMousePos] = useState<{x: number, y: number} | null>(null);
  const [dragMaskIndex, setDragMaskIndex] = useState<number>(-1);


  // 再描画処理
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 色相環を描画
    colorWheelDrawer.draw(ctx, canvas.width, canvas.height, currentValue);

    if (selectedMask.length === 0) {
      return; // マスクがない場合はグレーアウト処理をしない
    }

    // マスクを描画
    maskDrawer.drawMasks(ctx, selectedMask, canvas.width, canvas.height)
    // ctx.restore();
  };

  // マスク図形自体または頂点のドラッグ
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 頂点ドラッグ判定
    for (let maskIdx = 0; maskIdx < selectedMask.length; maskIdx++) {
      const mask = selectedMask[maskIdx];
      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);
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
      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);
      if (isPointInPolygon(x, y, scaledPoints)) {
        setDraggingMaskIndex(idx);
        setLastMousePos({ x, y });
        return;
      }
    }
  };

  // マウスムーブイベント
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const { hue, saturation, distance } = getColorFromCoords(x, y, centerX, centerY, colorWheelDrawer.getMaxRadius());

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

    // 頂点ドラッグ処理
    if (isDragging && dragMaskIndex !== -1 && dragPointIndex !== -1) {
      const updatedMasks = selectedMask.map((mask, idx) => {
        if (idx === dragMaskIndex) {
          const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1); // スケール済み点群の取得
          const newScaledPoints = [...scaledPoints]; // ドラッグされた頂点だけ新しい座標に置き換え
          newScaledPoints[dragPointIndex] = { x, y };
          // 逆変換でoriginalPointsを再計算
          const center = getCenter(scaledPoints);
          const scale = mask.scale ?? 1;
          const newOriginalPoints = newScaledPoints.map(p => ({
            x: center.x + (p.x - center.x) / scale,
            y: center.y + (p.y - center.y) / scale
          }));
          return { ...mask, originalPoints: newOriginalPoints };
        }
        return mask;
      });
      setSelectedMask(updatedMasks);
      return; // 頂点ドラッグ時は他の処理をしない
    }

    // 図形全体ドラッグ処理
    if (draggingMaskIndex !== -1 && lastMousePos) {
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      const updatedMasks = selectedMask.map((mask, idx) => {
        if (idx === draggingMaskIndex) {
          return {
            ...mask,
            originalPoints: mask.originalPoints.map(p => ({ x: p.x + dx, y: p.y + dy }))
          };
        }
        return mask;
      });
      setSelectedMask(updatedMasks);
      setLastMousePos({ x, y });
      return;
    }

    // カーソルスタイル変更
    if (!isDragging) {
      let found = false;
      selectedMask.forEach(mask => {
        const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);
        const pointIndex = findClosestPoint(x, y, scaledPoints);
        if (pointIndex !== -1) found = true;
      });
      canvas.style.cursor = found ? 'pointer' : 'default';
    }
  };

  const handleMouseUp = () => {
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

  // テンプレートマスク選択
  const handleMaskSelect = (mask: ShapeTemplate) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const absPoints = toAbsolutePoints(mask.points, width, height);
    setSelectedMask([
      ...selectedMask,
      { ...mask, originalPoints: absPoints, scale: 1 }
    ]);
    setSelectedMaskIndex(selectedMask.length);
    setIsDialogOpen(false);
  };

  // エクスポート処理
  const handleMaskExport = () => {
    const canvas = canvasRef.current; // 色相環用
    const hiddenCanvas = hiddenCanvasRef.current; // マスク用
    if (!canvas || !hiddenCanvas || selectedMask.length === 0) return;

    const hiddenCtx = hiddenCanvas.getContext('2d');
    if (!hiddenCtx) return;

    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;

    colorWheelDrawer.draw(hiddenCtx, hiddenCanvas.width, hiddenCanvas.height, currentValue);

    maskDrawer.drawMasks(hiddenCtx, selectedMask, hiddenCanvas.width, hiddenCanvas.height);

    // エクスポート
    hiddenCanvas.toBlob((blob) => {
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
  };

  // マスク削除
  const handleMaskDelete = () => {
    setSelectedMask(selectedMask.slice(0, -1));
  };

  // 拡大縮小
  const handleScaleChange = (scale: number) => {
    setSelectedMask(selectedMask.map((mask, idx) =>
      idx === selectedMaskIndex ? { ...mask, scale } : mask
    ));
  };

  // 再描画トリガー
  useEffect(() => {
    redraw();
  }, [currentValue, selectedMask]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-6">
      <div className="justify-items-center mb-6">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <canvas
          ref={hiddenCanvasRef}
          style={{ display: 'none' }}
        />
        <div className="bg-card">
          <h3 className="text-card-foreground text-lg font-semibold mb-4">明度調整</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={currentValue}
              onChange={(e) => setCurrentValue(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="w-12 text-center">{currentValue}%</span>
          </div>
        </div>
      </div>

      {/* コントロールパネル */}
      <div className="w-full max-w-2xl space-y-8">
        <MaskControls
          shapeTemplates={shapeTemplates}
          selectedMask={selectedMask}
          selectedMaskIndex={selectedMaskIndex}
          isDialogOpen={isDialogOpen}
          onDialogOpenChange={setIsDialogOpen}
          onMaskSelect={handleMaskSelect}
          onMaskDelete={handleMaskDelete}
          onMaskExport={handleMaskExport}
          onMaskIndexChange={setSelectedMaskIndex}
          onScaleChange={handleScaleChange}
        />
        <ColorInfoPanel colorInfo={colorInfo}/>
      </div>
    </div>
  );
}