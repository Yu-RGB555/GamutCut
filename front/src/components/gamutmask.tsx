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

  const maxRadius = 200;
  const sectorCount = 360;
  const trackCount = 10;

  // テンプレートマスク
  const [presets] = useState<ShapeTemplate[]>([
    {
      id: 1,
      name: "三角形",
      points: [
        { x: 350, y: 200 },
        { x: 400, y: 150 },
        { x: 400, y: 250 }
      ]
    },
    {
      id: 2,
      name: "四角形",
      points: [
        { x: 320, y: 180 },
        { x: 380, y: 180 },
        { x: 380, y: 240 },
        { x: 320, y: 240 }
      ]
    },
    {
      id: 3,
      name: "五角形",
      points: [
        { x: 350, y: 170 },
        { x: 380, y: 190 },
        { x: 370, y: 230 },
        { x: 330, y: 230 },
        { x: 320, y: 190 }
      ]
    }
  ]);

  const [selectedMask, setSelectedMask] = useState<ShapeTemplate[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState<number>(-1);  // 頂点ドラッグ用
  const [draggingMaskIndex, setDraggingMaskIndex] = useState<number>(-1); // 図形全体ドラッグ用
  const [lastMousePos, setLastMousePos] = useState<{x: number, y: number} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dragMaskIndex, setDragMaskIndex] = useState<number>(-1);

  const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

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
    if (mask.points.length > 0) {
      tempCtx.moveTo(mask.points[0].x, mask.points[0].y);
      for (let i = 1; i < mask.points.length; i++) {
        tempCtx.lineTo(mask.points[i].x, mask.points[i].y);
      }
      tempCtx.closePath();
    }
  });
  tempCtx.fill();

  // 2-3. マスク境界線を描画（オプション）
  tempCtx.globalCompositeOperation = "source-over";
  tempCtx.globalAlpha = 1.0;
  selectedMask.forEach(mask => {
    tempCtx.beginPath();
    tempCtx.moveTo(mask.points[0].x, mask.points[0].y);
    for (let i = 1; i < mask.points.length; i++) {
      tempCtx.lineTo(mask.points[i].x, mask.points[i].y);
    }
    tempCtx.closePath();
    tempCtx.strokeStyle = "#101010";
    tempCtx.lineWidth = 0.1;
    tempCtx.stroke();
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
  };

  // ガマットマスクテンプレートの選択
  const handleMaskSelect = (mask: ShapeTemplate) => {
    if (selectedMask.length < 3) {
      setSelectedMask([...selectedMask,{ ...mask }]);
      setIsDialogOpen(false);
    } else {
      alert('マスクは最大3つまで追加できます');
    }
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
      if (mask.points.length > 0) {
        tempCtx.moveTo(mask.points[0].x, mask.points[0].y);
        for (let i = 1; i < mask.points.length; i++) {
          tempCtx.lineTo(mask.points[i].x, mask.points[i].y);
        }
        tempCtx.closePath();
      }
    });
    tempCtx.fill();

    // 3-3. マスク境界線を描画（オプション）
    tempCtx.globalCompositeOperation = "source-over";
    tempCtx.globalAlpha = 1.0;
    selectedMask.forEach(mask => {
      tempCtx.beginPath();
      tempCtx.moveTo(mask.points[0].x, mask.points[0].y);
      for (let i = 1; i < mask.points.length; i++) {
        tempCtx.lineTo(mask.points[i].x, mask.points[i].y);
      }
      tempCtx.closePath();
      tempCtx.strokeStyle = "#101010";
      tempCtx.lineWidth = 1;
      tempCtx.stroke();
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
    <div className="flex flex-col items-center p-6">
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
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
          <div className="flex gap-4 items-center">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">色相(H)：</span>
              <span className="font-mono">{colorInfo.hue}°</span>
            </div>
            <div>
              <span className="font-medium">彩度(S)：</span>
              <span className="font-mono">{colorInfo.saturation}%</span>
            </div>
            <div>
              <span className="font-medium">明度(V)：</span>
              <span className="font-mono">{colorInfo.value}%</span>
            </div>
            <div>
              <span className="font-medium">RGB：</span>
              <span className="font-mono">({colorInfo.rgb})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}