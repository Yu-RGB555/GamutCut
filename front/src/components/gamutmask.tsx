import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Point {
  x: number;
  y: number;
}

interface ShapeTemplate {
  id: number;
  name: string;
  points: Point[];
}

interface ColorInfo {
  coordinates: string;
  hue: string;
  saturation: string;
  value: string;
  rgb: string;
}

interface MaskWithScale extends ShapeTemplate {
  scale: number;
  originalPoints: Point[]; // スケールの基準
}

export function GamutMask() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

  // 色相環のパラメータ
  const [currentValue, setCurrentValue] = useState<number>(100);
  const [colorInfo, setColorInfo] = useState<ColorInfo>({
    coordinates: '-',
    hue: '-',
    saturation: '-',
    value: '-',
    rgb: '-'
  });

  const maxRadius = 150;
  const sectorCount = 360;
  const trackCount = 10;

  // テンプレートマスク
  const [presets] = useState<ShapeTemplate[]>([
    {
      id: 1,
      name: "三角形",
      points: [
        { x: 0.5, y: 0.2 },
        { x: 0.7, y: 0.8 },
        { x: 0.3, y: 0.8 }
      ]
    },
    {
      id: 2,
      name: "四角形",
      points: [
        { x: 0.3, y: 0.3 },
        { x: 0.7, y: 0.3 },
        { x: 0.7, y: 0.7 },
        { x: 0.3, y: 0.7 }
      ]
    },
    {
      id: 3,
      name: "円形",
      points: createCirclePoints(0.5, 0.5, 0.2, 36)
    }
  ]);

  const [selectedMask, setSelectedMask] = useState<MaskWithScale[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState<number>(-1);  // 頂点ドラッグ用
  const [draggingMaskIndex, setDraggingMaskIndex] = useState<number>(-1); // 図形全体ドラッグ用
  const [lastMousePos, setLastMousePos] = useState<{x: number, y: number} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dragMaskIndex, setDragMaskIndex] = useState<number>(-1);
  const [selectedMaskIndex, setSelectedMaskIndex] = useState<number>(0); // 0番目を初期選択

  const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  // 円形ポリゴン生成関数
  function createCirclePoints(centerX: number, centerY: number, radius: number, numPoints: number): Point[] {
    return Array.from({ length: numPoints }, (_, i) => {
      const angle = (2 * Math.PI * i) / numPoints;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
  }

  // HSV変換
  const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = v - c;

    let r: number, g: number, b: number;

    if (h < 1/6) {
      r = c; g = x; b = 0;
    } else if (h < 2/6) {
      r = x; g = c; b = 0;
    } else if (h < 3/6) {
      r = 0; g = c; b = x;
    } else if (h < 4/6) {
      r = 0; g = x; b = c;
    } else if (h < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  };

  // 各座標(x, y)の色相と彩度を定義
  const getColorFromCoords = (x: number, y: number, centerX: number, centerY: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const hue = (angle + 90 + 360) % 360;
    const saturation = Math.max(0, Math.min(100, (distance / maxRadius) * 100));

    return { hue, saturation, distance };
  };

  // マスクの拡大縮小
  function getScaledPoints(points: Point[], scale: number): Point[] {
    // 中心座標を計算
    const center = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 }
    );
    center.x /= points.length;
    center.y /= points.length;

    // 各頂点をスケール
    return points.map(p => ({
      x: center.x + (p.x - center.x) * scale,
      y: center.y + (p.y - center.y) * scale
    }));
  }

  // 色相環の描画
  const drawColorWheel = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const degreesPerSector = 360 / sectorCount;

    for (let sector = 0; sector < sectorCount; sector++) {
      const startAngle = degToRad(sector * degreesPerSector - 90);
      const endAngle = degToRad((sector + 1) * degreesPerSector - 90);
      const hue = sector * degreesPerSector;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);

      const gradientSteps = 20;
      for (let i = 0; i <= gradientSteps; i++) {
        const position = i / gradientSteps;
        const saturation = position * 100;
        const [r, g, b] = hsvToRgb(hue, saturation, currentValue);
        gradient.addColorStop(position, `rgb(${r}, ${g}, ${b})`);
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);

      const angleBuffer = degToRad(0.1);
      ctx.arc(centerX, centerY, maxRadius, startAngle - angleBuffer, endAngle + angleBuffer);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const findClosestPoint = (x: number, y: number, points: Point[]): number => {
    let minDistance = Infinity;
    let closestIndex = -1;

    points.forEach((point, index) => {
      const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      if (distance < minDistance && distance < 12) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  // レンダリング時に色相環を再描画(マスクを選択中はマスクも再描画)
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. 色相環を描画
    drawColorWheel(ctx, canvas.width, canvas.height);

    if (selectedMask.length === 0) {
      return; // マスクがない場合はグレーアウト処理をしない
    }

    // 2. グレーアウト用のレイヤーを作成
    // 一時キャンバスを用意
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

  // 2-1. 全体を半透明グレーで塗りつぶす
    tempCtx.globalAlpha = 0.65;
    tempCtx.fillStyle = "#000";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 2-2. 全マスク領域をまとめて透明に抜く
    tempCtx.globalCompositeOperation = "destination-out";
    tempCtx.globalAlpha = 1.0;
    tempCtx.beginPath();
    selectedMask.forEach(mask => {
      const scaledPoints = getScaledPoints(mask.points, mask.scale ?? 1);
      if (scaledPoints.length > 0) {
        tempCtx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
        for (let i = 1; i < scaledPoints.length; i++) {
          tempCtx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
        }
        tempCtx.closePath();
      }
    });
    tempCtx.fill();

    // 2-3. マスク境界線を描画（オプション）
    tempCtx.globalCompositeOperation = "source-over";
    tempCtx.globalAlpha = 1.0;
    selectedMask.forEach(mask => {
      const scaledPoints = getScaledPoints(mask.points, mask.scale ?? 1);
      if (scaledPoints.length > 0) {
        tempCtx.beginPath();
        tempCtx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
        for (let i = 1; i < scaledPoints.length; i++) {
          tempCtx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
        }
        tempCtx.closePath();
        tempCtx.strokeStyle = "#101010";
        tempCtx.lineWidth = 0.001;
        tempCtx.stroke();
      }
    });

    // 3. メインキャンバスにグレーアウトレイヤーを合成
    ctx.drawImage(tempCanvas, 0, 0);

    ctx.restore();
  };

  // マウスポインタのマスク領域内外判定
  function isPointInPolygon(x: number, y: number, points: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi + 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // マスク図形自体または頂点のドラッグ
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. 頂点ドラッグ判定（最初にヒットしたものだけ）
    for (let maskIdx = 0; maskIdx < selectedMask.length; maskIdx++) {
      const mask = selectedMask[maskIdx];
      const pointIdx = findClosestPoint(x, y, mask.points);
      if (pointIdx !== -1) {
        setIsDragging(true);
        setDragMaskIndex(maskIdx);
        setDragPointIndex(pointIdx);
        return; // 頂点にヒットしたらここで終了
      }
    }

    // 2. 図形全体ドラッグ判定（頂点にヒットしなかった場合のみ）
    for (let idx = 0; idx < selectedMask.length; idx++) {
      const mask = selectedMask[idx];
      if (isPointInPolygon(x, y, mask.points)) {
        setDraggingMaskIndex(idx);
        setLastMousePos({ x, y });
        return;
      }
    }
  };

  // マウスオーバーポイントの色情報取得
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const { hue, saturation, distance } = getColorFromCoords(x, y, centerX, centerY);

    if (distance <= maxRadius) {
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

  // 1. 頂点ドラッグ
  if (isDragging && dragMaskIndex !== -1 && dragPointIndex !== -1) {
    const updatedMasks = selectedMask.map((mask, idx) => {
      if (idx === dragMaskIndex) {
        const updatedPoints = [...mask.points];
        updatedPoints[dragPointIndex] = { x, y };
        return { ...mask, points: updatedPoints };
      }
      return mask;
    });
    setSelectedMask(updatedMasks);
    return; // 頂点ドラッグ時は他の処理をしない
  }

  // 2. 図形全体ドラッグ
  if (draggingMaskIndex !== -1 && lastMousePos) {
    const dx = x - lastMousePos.x;
    const dy = y - lastMousePos.y;
    const updatedMasks = selectedMask.map((mask, idx) => {
      if (idx === draggingMaskIndex) {
        return {
          ...mask,
          points: mask.points.map(p => ({ x: p.x + dx, y: p.y + dy }))
        };
      }
      return mask;
    });
    setSelectedMask(updatedMasks);
    setLastMousePos({ x, y });
    return;
  }

    // カーソル変更
    if (!isDragging) {
      let found = false;
      selectedMask.forEach(mask => {
        const pointIndex = findClosestPoint(x, y, mask.points);
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
        return { ...mask, originalPoints: mask.points };
      }
      return mask;
    }));
  };

  // ガマットマスクテンプレートの選択
  const toAbsolutePoints = (points: Point[], width: number, height: number): Point[] => {
    return points.map(p => ({
      x: p.x * width,
      y: p.y * height
    }));
  };

  const handleMaskSelect = (mask: ShapeTemplate) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const absPoints = toAbsolutePoints(mask.points, width, height);
    setSelectedMask([
      ...selectedMask,
      { ...mask, points: absPoints, originalPoints: absPoints, scale: 1 }
    ]);
    setSelectedMaskIndex(selectedMask.length);
    setIsDialogOpen(false);
  };

  // マスク画像のエクスポート
  const exportMaskedImage = () => {
    const canvas = canvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    if (!canvas || !hiddenCanvas || selectedMask.length === 0) return;

    const hiddenCtx = hiddenCanvas.getContext('2d');
    if (!hiddenCtx) return;

    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;

    drawColorWheel(hiddenCtx, hiddenCanvas.width, hiddenCanvas.height);

    // 3. グレーアウト用のレイヤーを作成
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = hiddenCanvas.width;
    tempCanvas.height = hiddenCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // 3-1. 全体を半透明グレーで塗りつぶす
    tempCtx.globalAlpha = 0.65;
    tempCtx.fillStyle = "#000";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 3-2. 全マスク領域をまとめて透明に抜く
    tempCtx.globalCompositeOperation = "destination-out";
    tempCtx.globalAlpha = 1.0;
    tempCtx.beginPath();
    selectedMask.forEach(mask => {
      const scaledPoints = getScaledPoints(mask.points, mask.scale ?? 1);
      if (scaledPoints.length > 0) {
        tempCtx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
        for (let i = 1; i < scaledPoints.length; i++) {
          tempCtx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
        }
        tempCtx.closePath();
      }
    });
    tempCtx.fill();

    // 3-3. マスク境界線を描画（オプション）
    tempCtx.globalCompositeOperation = "source-over";
    tempCtx.globalAlpha = 1.0;
    selectedMask.forEach(mask => {
      const scaledPoints = getScaledPoints(mask.points, mask.scale ?? 1);
      if (scaledPoints.length > 0) {
        tempCtx.beginPath();
        tempCtx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
        for (let i = 1; i < scaledPoints.length; i++) {
          tempCtx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
        }
        tempCtx.closePath();
        tempCtx.strokeStyle = "#101010";
        tempCtx.lineWidth = 0.001;
        tempCtx.stroke();
      }
    });

    // 4. hiddenCanvasにグレーアウトレイヤーを合成
    hiddenCtx.drawImage(tempCanvas, 0, 0);

    // 5. エクスポート
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

  // リロード時、明度変更時、マスク選択時に再レンダリング
  useEffect(() => {
    redraw();
  }, [currentValue, selectedMask]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-6">
      <div className="relative mb-6">
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
      </div>

      {/* コントロールパネル */}
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-card p-4 rounded-lg">
          <h3 className="text-card-foreground text-lg font-semibold mb-4">ガマットマスク</h3>
          <div className="flex gap-2 items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">マスクを追加</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ガマットマスクの選択</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 p-4">
                  {presets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      className="p-4 h-auto"
                      onClick={() => handleMaskSelect(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {selectedMask.length > 0 && (
              <>
                <Button
                  onClick={() => setSelectedMask(selectedMask.slice(0, -1))}
                  variant="outline"
                >
                  マスクを削除
                </Button>
                <Button
                  onClick={exportMaskedImage}
                  className="bg-primary hover:bg-mouseover"
                >
                  マスク画像をエクスポート
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="bg-card p-4">
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

        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-card-foreground text-lg font-semibold mb-3">色情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
            <div>
              <span className="text-label font-medium inline-block">色相（H）：</span>
              <span className="font-mono inline-block mr-3">{colorInfo.hue}°</span>
              <span className="text-label font-medium inline-block">彩度（S）：</span>
              <span className="font-mono inline-block mr-3">{colorInfo.saturation}%</span>
              <span className="text-label font-medium inline-block">明度（V）：</span>
              <span className="font-mono inline-block mr-3">{colorInfo.value}%</span>
            </div>
            <div>
              <span className="text-label font-medium">RGB：</span>
              <span className="font-mono text-right">({colorInfo.rgb})</span>
            </div>
          </div>
        </div>

        {selectedMask.length > 0 && (
          <div className="flex gap-2 mb-2">
            {selectedMask.map((mask, idx) => (
              <button
                key={idx}
                className={`px-2 py-1 rounded ${selectedMaskIndex === idx ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedMaskIndex(idx)}
              >
                {mask.name} {idx + 1}
              </button>
            ))}
          </div>
        )}
        {selectedMask.length > 0 && (
          <div className="my-2">
            <label className="block text-sm font-medium mb-1">マスク拡大縮小</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.01"
              value={selectedMask[selectedMaskIndex]?.scale ?? 1}
              onChange={e => {
                const newScale = parseFloat(e.target.value);
                setSelectedMask(selectedMask.map((mask, idx) => {
                  if (idx === selectedMaskIndex) {
                    // スケール時はoriginalPointsから再計算
                    const scaledPoints = getScaledPoints(mask.originalPoints, newScale);
                    return { ...mask, scale: newScale, points: scaledPoints };
                  }
                  return mask;
                }));
              }}
              className="w-full"
            />
            <span className="text-xs">{((selectedMask[selectedMaskIndex]?.scale ?? 1) * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}