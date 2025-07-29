// ラジアン変換
export const degToRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

// HSV変換
export const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
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
export const getColorFromCoords = (x: number, y: number, centerX: number, centerY: number, maxRadius: number) => {
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const hue = (angle + 90 + 360) % 360;
  const saturation = Math.max(0, Math.min(100, (distance / maxRadius) * 100));

  return { hue, saturation, distance };
};