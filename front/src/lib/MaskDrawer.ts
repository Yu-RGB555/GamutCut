import { MaskWithScale } from "@/types/gamut";
import { getScaledPoints } from "./maskUtils";

export class MaskDrawer {
  drawMasks(ctx: CanvasRenderingContext2D, selectedMask: MaskWithScale[], canvasWidth: number, canvasHeight: number){
    // グレーアウト用のレイヤーを作成
    // 一時キャンバスを用意
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // 全体を半透明グレーで塗りつぶす
    tempCtx.globalAlpha = 0.65;
    tempCtx.fillStyle = "#000";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 全マスク領域をまとめて透明に抜く
    tempCtx.globalCompositeOperation = "destination-out";
    tempCtx.globalAlpha = 1.0;
    tempCtx.beginPath();
    selectedMask.forEach(mask => {
      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);
      if (scaledPoints.length > 0) {
        tempCtx.moveTo(scaledPoints[0].x, scaledPoints[0].y);
        for (let i = 1; i < scaledPoints.length; i++) {
          tempCtx.lineTo(scaledPoints[i].x, scaledPoints[i].y);
        }
        tempCtx.closePath();
      }
    });
    tempCtx.fill();

    // マスク境界線を描画
    tempCtx.globalCompositeOperation = "source-over";
    tempCtx.globalAlpha = 1.0;
    selectedMask.forEach(mask => {
      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);
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

    // メインキャンバスにグレーアウトレイヤーを合成
    ctx.drawImage(tempCanvas, 0, 0);
  }
}
