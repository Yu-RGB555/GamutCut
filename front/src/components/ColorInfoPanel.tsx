import { ColorInfo } from "@/types/gamut";

interface ColorInfoProps {
  colorInfo: ColorInfo;
}

export const ColorInfoPanel: React.FC<ColorInfoProps> = ({ colorInfo }) => {
  return (
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
  );
}