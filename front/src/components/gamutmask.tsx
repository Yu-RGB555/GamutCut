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
  const [showGrid, setShowGrid] = useState<boolean>(false);
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

  // マスク関連
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

  const [selectedMask, setSelectedMask] = useState<ShapeTemplate | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // カスタムマスク作成
  const [customShapePoints, setCustomShapePoints] = useState<Point[]>([]);
  const [isCreatingCustomShape, setIsCreatingCustomShape] = useState(false);

  const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

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

  const getColorFromCoords = (x: number, y: number, centerX: number, centerY: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const hue = (angle + 90 + 360) % 360;
    const saturation = Math.max(0, Math.min(100, (distance / maxRadius) * 100));

    return { hue, saturation, distance };
  };

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

    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 0.5;
      for (let sector = 0; sector < sectorCount; sector++) {
        const angle = degToRad(sector * degreesPerSector - 90);
        const endX = centerX + Math.cos(angle) * maxRadius;
        const endY = centerY + Math.sin(angle) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      for (let track = 1; track < trackCount; track++) {
        const radius = (track * maxRadius) / trackCount;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawMask = (ctx: CanvasRenderingContext2D, points: Point[], isActive: boolean = false) => {
    if (points.length < 3) return;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();

    // マスク境界線
    ctx.strokeStyle = isActive ? '#007acc' : '#666';
    ctx.lineWidth = 2;
    ctx.stroke();

    // マスク内部の半透明オーバーレイ
    ctx.fillStyle = 'rgba(0, 122, 204, 0.1)';
    ctx.fill();

    // 頂点を描画
    if (isActive) {
      points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#007acc';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    ctx.restore();
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

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawColorWheel(ctx, canvas.width, canvas.height);

    if (selectedMask) {
      drawMask(ctx, selectedMask.points, true);
    }

    if (isCreatingCustomShape && customShapePoints.length > 0) {
      drawMask(ctx, customShapePoints, true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isCreatingCustomShape) {
      setCustomShapePoints([...customShapePoints, { x, y }]);
      return;
    }

    if (selectedMask) {
      const pointIndex = findClosestPoint(x, y, selectedMask.points);
      if (pointIndex !== -1) {
        setIsDragging(true);
        setDragPointIndex(pointIndex);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 色情報の更新
    if (!isDragging && !isCreatingCustomShape) {
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
    }

    // ドラッグ処理
    if (isDragging && selectedMask && dragPointIndex !== -1) {
      const updatedPoints = [...selectedMask.points];
      updatedPoints[dragPointIndex] = { x, y };

      setSelectedMask({
        ...selectedMask,
        points: updatedPoints
      });
    }

    // カーソル変更
    if (selectedMask && !isDragging) {
      const pointIndex = findClosestPoint(x, y, selectedMask.points);
      canvas.style.cursor = pointIndex !== -1 ? 'pointer' : 'default';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragPointIndex(-1);
  };

  const handleMaskSelect = (mask: ShapeTemplate) => {
    setSelectedMask({ ...mask });
    setIsDialogOpen(false);
  };

  const handleStartCustomMask = () => {
    setIsCreatingCustomShape(true);
    setSelectedMask(null);
    setCustomShapePoints([]);
    setIsDialogOpen(false);
  };

  const finishCustomShape = () => {
    if (customShapePoints.length > 2) {
      const newShape: ShapeTemplate = {
        id: Date.now(),
        name: `カスタムマスク`,
        points: customShapePoints
      };
      setSelectedMask(newShape);
    }
    setCustomShapePoints([]);
    setIsCreatingCustomShape(false);
  };

  const exportMaskedImage = () => {
    const canvas = canvasRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    if (!canvas || !hiddenCanvas || !selectedMask) return;

    const ctx = canvas.getContext('2d');
    const hiddenCtx = hiddenCanvas.getContext('2d');
    if (!ctx || !hiddenCtx) return;

    // 隠しキャンバスのサイズを設定
    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;

    // 色相環を描画
    drawColorWheel(hiddenCtx, hiddenCanvas.width, hiddenCanvas.height);

    // マスクでクリッピング
    hiddenCtx.globalCompositeOperation = 'destination-in';
    hiddenCtx.beginPath();
    hiddenCtx.moveTo(selectedMask.points[0].x, selectedMask.points[0].y);
    for (let i = 1; i < selectedMask.points.length; i++) {
      hiddenCtx.lineTo(selectedMask.points[i].x, selectedMask.points[i].y);
    }
    hiddenCtx.closePath();
    hiddenCtx.fill();

    // PNGとしてダウンロード
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

  useEffect(() => {
    redraw();
  }, [currentValue, showGrid, selectedMask, customShapePoints, isCreatingCustomShape]);

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
        {/* マスク操作 */}
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
                  <Button
                    variant="outline"
                    onClick={handleStartCustomMask}
                    className="p-4 h-auto"
                  >
                    カスタムマスクを作成
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {selectedMask && (
              <>
                <Button
                  onClick={() => setSelectedMask(null)}
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

            {isCreatingCustomShape && (
              <Button
                onClick={finishCustomShape}
                className="bg-primary hover:bg-mouseover"
              >
                カスタムマスクを完了
              </Button>
            )}
          </div>
        </div>

        {/* 明度調整 */}
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

        {/* グリッド表示 */}
        <div className="bg-card p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded"
            />
            <span>グリッド表示</span>
          </label>
        </div>

        {/* 色情報表示 */}
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