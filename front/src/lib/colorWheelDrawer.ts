import { degToRad, hsvToRgb } from "./colorUtils";

// 色相環クラス
export class ColorWheelDrawer {
  private maxRadius: number = 0;  // 初期値を設定
  private sectorCount: number;

  // 明度100%・無回転状態の色相環を描画したオフスクリーンキャッシュ
  private cacheCanvas: HTMLCanvasElement | null = null;
  private cacheWidth: number = 0;
  private cacheHeight: number = 0;

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

    ctx.clearRect(0, 0, width, height);

    // キャッシュ済みの無回転色相環を描画
    // 明度に関しては、描画時に ctx.filter の brightness() で後付けの形で調整する
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(degToRad(rotation));
    ctx.filter = `brightness(${value}%)`;
    ctx.drawImage(this.cacheCanvas!, -centerX, -centerY);
    ctx.filter = 'none';
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

      cacheCtx.save();
      cacheCtx.beginPath();
      cacheCtx.moveTo(centerX, centerY);

      const angleBuffer = degToRad(0.1);
      cacheCtx.arc(centerX, centerY, this.maxRadius, startAngle - angleBuffer, endAngle + angleBuffer);
      cacheCtx.closePath();
      cacheCtx.clip();

      cacheCtx.fillStyle = gradient;
      cacheCtx.fillRect(0, 0, width, height);
      cacheCtx.restore();
    }

    this.cacheWidth = width;
    this.cacheHeight = height;
  }

  getMaxRadius(){
    return this.maxRadius;
  }
}