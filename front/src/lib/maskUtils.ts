import { Point } from "@/types/gamut";

  // マスクの中心座標を計算
  export const getCenter = (points: Point[]): Point => {
    const center = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    center.x /= points.length;
    center.y /= points.length;
    return center;
  }

  // マスクの拡大縮小
  export const getScaledPoints = (points: Point[], scale: number): Point[] => {
    const center = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    center.x /= points.length;
    center.y /= points.length;

    return points.map(p => ({
      x: center.x + (p.x - center.x) * scale,
      y: center.y + (p.y - center.y) * scale
    }));
  }

  // 円周座標(円形マスク用)
  export const createCirclePoints = (centerX: number, centerY: number, radius: number, numPoints: number): Point[] => {
    return Array.from({ length: numPoints }, (_, i) => {
      const angle = (2 * Math.PI * i) / numPoints;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    });
  }

  export const findClosestPoint = (x: number, y: number, points: Point[]): number => {
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

  // マスク領域内外判定(マスクドラッグ用)
  export const isPointInPolygon = (x: number, y: number, points: Point[]): boolean => {
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

    // テンプレートマスクの配置場所
    export const toAbsolutePoints = (points: Point[], width: number, height: number): Point[] => {
      return points.map(p => ({
        x: p.x * width,
        y: p.y * height
      }));
    };