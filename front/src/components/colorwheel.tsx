import React, { useRef, useEffect, useState } from 'react';

interface ColorInfo {
  coordinates: string;
  hue: string;
  saturation: string;
  value: string;
  rgb: string;
}

export function ColorWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // スクロールバーおよびチェックで変動させるパラメータ群
  const [currentValue, setCurrentValue] = useState<number>(100); // HSVのV（明度）- 色相環上では固定
  const [sectorCount] = useState<number>(360); // 1トラックあたりのセクタの数
  const [trackCount] = useState<number>(10); // 彩度のスケールが0~100までなので、ステップ数を10とする
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(false);

  const [colorInfo, setColorInfo] = useState<ColorInfo>({
    coordinates: '-',
    hue: '-',
    saturation: '-',
    value: '-',
    rgb: '-'
  });

  const maxRadius = 200; // 色相環の半径

  // 色相を度からラジアンに変換
  const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  // HSVからRGBに変換
  const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
    h = h / 360; // 0-1の範囲に正規化
    s = s / 100; // 0-1の範囲に正規化
    v = v / 100; // 0-1の範囲に正規化

    const c = v * s; // 彩度
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

  // 座標から色相と彩度を計算
  const getColorFromCoords = (x: number, y: number, centerX: number, centerY: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const hue = (angle + 90 + 360) % 360;
    const saturation = Math.max(0, Math.min(100, (distance / maxRadius) * 100));

    return { hue, saturation, distance };
  };

  // HSVベース色相環を描画（明度固定版）
  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 以前の描画をクリアし、新しい色相環を描画できるようにする。
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const degreesPerSector = 360 / sectorCount; // 1つのセクタが有する角度

    // 各セクタごとに放射状グラデーションで描画
    for (let sector = 0; sector < sectorCount; sector++) {
      const startAngle = degToRad(sector * degreesPerSector - 90);
      const endAngle = degToRad((sector + 1) * degreesPerSector - 90);
      const hue = sector * degreesPerSector; // 1つのセクタが有する色相

      // 放射状グラデーションを作成（中心から外側へ彩度が変化）
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);

      // グラデーションの色停止点を設定（中心から外側へ彩度のみ変化、明度は固定）
      const gradientSteps = 20; // 1セクタ内におけるグラデーションのステップ数
      for (let i = 0; i <= gradientSteps; i++) {
        const position = i / gradientSteps;
        const saturation = position * 100; // 0%から100%まで連続（彩度のみ変化）
        // 明度（currentValue）は固定
        const [r, g, b] = hsvToRgb(hue, saturation, currentValue);

        gradient.addColorStop(position, `rgb(${r}, ${g}, ${b})`);
      }

      // 現時点の描画状態の保存
      ctx.save();

      // パスの作成
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);

      const angleBuffer = degToRad(0.1); // わずかに角度を拡張して境界の隙間を防ぐ
      ctx.arc(centerX, centerY, maxRadius, startAngle - angleBuffer, endAngle + angleBuffer);
      ctx.closePath();

      // セクタの形状をクリップ
      ctx.clip();

      // 着彩（グラデーションの塗りつぶし）
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // グリッド線（セクタ境界）
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
    }

    // トラック境界線（グリッド）
    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      for (let track = 1; track < trackCount; track++) {
        const radius = (track * maxRadius) / trackCount;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // 中心点
    // ctx.beginPath();
    // ctx.arc(centerX, centerY, 0, 0, 2 * Math.PI);
    // ctx.fillStyle = '#333';
    // ctx.fill();

    // 外側境界線
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

    // マウス移動イベントハンドラー
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
      // HSVモデルでRGB値を計算（明度は固定）
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
  };

  // コンポーネントマウント時に色相環を描画
  useEffect(() => {
    drawColorWheel();
  }, [currentValue, showGrid, showLabels, sectorCount, trackCount]);

  return (
    <div id="colorWheel" className="flex flex-col">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="m-8"
        onMouseMove={handleMouseMove}
      />

      {/* 色情報表示パネル */}
      <div className="mt-4 p-4 bg-card rounded-lg">
        <h3 className="text-lg font-semibold mb-3">色情報</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 text-sm">
          <div>
            <span className="font-medium text-label">色相(H)：</span>
            <span className="ml-4 font-mono" id="hueDisplay">{colorInfo.hue}°</span>
          </div>
          <div>
            <span className="font-medium text-label">彩度(S)：</span>
            <span className="ml-4 font-mono" id="satDisplay">{colorInfo.saturation}%</span>
          </div>
          <div>
            <span className="font-medium text-label">明度(V)：</span>
            <span className="ml-4 font-mono" id="valueDisplay">{colorInfo.value}%</span>
          </div>
          <div>
            <span className="font-medium text-label">RGB：</span>
            <span className="ml-4 font-mono" id="rgbDisplay">({colorInfo.rgb})</span>
          </div>
        </div>
      </div>

      {/* コントロールパネル（オプション） */}
      <div className="mt-4 p-4 space-y-2">
        <div className="flex flex-col justify-items-center space-x-4">
          <h3 className="text-lg font-semibold mb-3">明度（色相環）</h3>
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentValue}
              onChange={(e) => setCurrentValue(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
          <span>{currentValue}%</span>
        </div>

        <div className="flex items-center space-x-4 mb-20">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            <span className="text-sm">グリッド表示</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            <span className="text-sm">ラベル表示</span>
          </label>
        </div>
      </div>
    </div>
  );
}