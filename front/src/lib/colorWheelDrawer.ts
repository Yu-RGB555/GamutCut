import { degToRad, hsvToRgb } from "./colorUtils";

// 色相環クラス
export class ColorWheelDrawer {
  private maxRadius: number = 0;  // 初期値を設定
  private sectorCount: number;

  // 明度100%・無回転状態の色相環を描画したオフスクリーンキャッシュ
  private cacheCanvas: HTMLCanvasElement | null = null;
  private cacheWidth: number = 0;
  private cacheHeight: number = 0;

  // 現在の明度(value)を適用した結果を保持するオフスクリーンキャンバス
  private valueCanvas: HTMLCanvasElement | null = null;
  private lastValue: number | null = null;

  constructor(sectorCount: number = 360) {
    this.sectorCount = sectorCount;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, value: number, rotation: number = 0) {
    const centerX = width / 2;
    const centerY = height / 2;

    // キャンバスサイズに応じて適切な半径を計算
    // 最小サイズの75%を半径として使用（余白を確保）
    this.maxRadius = Math.min(width, height) * 0.375;

    if (!this.isCacheValid(width, height)) {
      this.renderToCache(width, height);
    }

    // 明度が変化した場合のみ、valueCanvasにピクセル演算で明度を反映し直す
    if (value !== this.lastValue) {
      this.applyBrightness(value, width, height);
      this.lastValue = value;
    }

    ctx.clearRect(0, 0, width, height);

    // 明度反映済みキャンバスを描画
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(degToRad(rotation));
    ctx.drawImage(this.valueCanvas!, -centerX, -centerY);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private isCacheValid(width: number, height: number): boolean {
    return this.cacheCanvas !== null
      && this.cacheWidth === width
      && this.cacheHeight === height;
  }

  // 明度100%・無回転状態の色相環をキャッシュキャンバスに描画する
  private renderToCache(width: number, height: number) {
    if (!this.cacheCanvas) {
      this.cacheCanvas = document.createElement('canvas');
    }

    if (this.cacheCanvas.width !== width || this.cacheCanvas.height !== height) {
      this.cacheCanvas.width = width;
      this.cacheCanvas.height = height;
    }

    const cacheCtx = this.cacheCanvas.getContext('2d');
    if (!cacheCtx) return;

    cacheCtx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const degreesPerSector = 360 / this.sectorCount;

    for (let sector = 0; sector < this.sectorCount; sector++) {
      const startAngle = degToRad(sector * degreesPerSector - 90);
      const endAngle = degToRad((sector + 1) * degreesPerSector - 90);
      const hue = sector * degreesPerSector;

      const gradient = cacheCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.maxRadius);

      const gradientSteps = 20;
      for (let i = 0; i <= gradientSteps; i++) {
        const position = i / gradientSteps;
        const saturation = position * 100;
        const [r, g, b] = hsvToRgb(hue, saturation, 100);
        gradient.addColorStop(position, `rgb(${r}, ${g}, ${b})`);
      }

      // 扇形の内側だけを直接塗る（全面塗り＋切り抜きより大幅に軽い。詳細: docs/colorWheelDrawer.md）
      cacheCtx.beginPath();
      cacheCtx.moveTo(centerX, centerY);

      const angleBuffer = degToRad(0.1);
      cacheCtx.arc(centerX, centerY, this.maxRadius, startAngle - angleBuffer, endAngle + angleBuffer);
      cacheCtx.closePath();

      cacheCtx.fillStyle = gradient;
      cacheCtx.fill();
    }

    this.cacheWidth = width;
    this.cacheHeight = height;

    // valueCanvasもcacheCanvasと同サイズに揃え、明度の再計算を強制する
    if (!this.valueCanvas) {
      this.valueCanvas = document.createElement('canvas');
    }
    if (this.valueCanvas.width !== width || this.valueCanvas.height !== height) {
      this.valueCanvas.width = width;
      this.valueCanvas.height = height;
    }
    this.lastValue = null;
  }

  // 色相環に明度を反映してvalueCanvasに描き出す。
  // JSのピクセルループではなくCanvasの合成モードで一括適用する（詳細: docs/colorWheelDrawer.md）
  private applyBrightness(value: number, width: number, height: number) {
    if (!this.cacheCanvas || !this.valueCanvas) return;

    const valueCtx = this.valueCanvas.getContext('2d');
    if (!valueCtx) return;

    valueCtx.clearRect(0, 0, width, height);
    valueCtx.drawImage(this.cacheCanvas, 0, 0);

    // 明度100%はキャッシュそのままで終了
    if (value >= 100) return;

    const v = Math.round(255 * value / 100);
    valueCtx.save();
    // 乗算合成でグレーを重ね、全体を明度の割合だけ暗くする
    valueCtx.globalCompositeOperation = 'multiply';
    valueCtx.fillStyle = `rgb(${v}, ${v}, ${v})`;
    valueCtx.fillRect(0, 0, width, height);
    // 円の外側まで塗られたグレーを、元の色相環の円形に切り抜き直す
    valueCtx.globalCompositeOperation = 'destination-in';
    valueCtx.drawImage(this.cacheCanvas, 0, 0);
    valueCtx.restore();
  }

  getMaxRadius(){
    return this.maxRadius;
  }
}