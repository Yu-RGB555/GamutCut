import { degToRad, hsvToRgb } from "./colorUtils";

// 色相環クラス
export class ColorWheelDrawer {
  private maxRadius: number;
  private sectorCount: number;

  constructor(maxRadius: number = 150, sectorCount: number = 360) {
    this.maxRadius = maxRadius;
    this.sectorCount = sectorCount;
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, value: number) {
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const degreesPerSector = 360 / this.sectorCount;

    for (let sector = 0; sector < this.sectorCount; sector++) {
      const startAngle = degToRad(sector * degreesPerSector - 90);
      const endAngle = degToRad((sector + 1) * degreesPerSector - 90);
      const hue = sector * degreesPerSector;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.maxRadius);

      const gradientSteps = 20;
      for (let i = 0; i <= gradientSteps; i++) {
        const position = i / gradientSteps;
        const saturation = position * 100;
        const [r, g, b] = hsvToRgb(hue, saturation, value);
        gradient.addColorStop(position, `rgb(${r}, ${g}, ${b})`);
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);

      const angleBuffer = degToRad(0.1);
      ctx.arc(centerX, centerY, this.maxRadius, startAngle - angleBuffer, endAngle + angleBuffer);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, this.maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  getMaxRadius(){
    return this.maxRadius;
  }
}