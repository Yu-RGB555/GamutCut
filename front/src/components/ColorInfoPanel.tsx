import { ColorInfo } from "@/types/gamut";

interface ColorInfoProps {
  colorInfo: ColorInfo;
}

export const ColorInfoPanel: React.FC<ColorInfoProps> = ({ colorInfo }) => {
  return (
    <div className="bg-card p-4 rounded-lg border z-1">
      <h3 className="text-card-foreground text-lg font-semibold mb-3">色情報</h3>
      <div className="grid grid-cols-6 gap-x-1">
        <span className="text-label font-medium col-span-1 text-right">色相：</span>
        <span className="font-mono col-span-1 text-left">{colorInfo.hue}°</span>
        <span className="text-label font-medium col-span-1 text-right">彩度：</span>
        <span className="font-mono col-span-1 text-left">{colorInfo.saturation}%</span>
        <span className="text-label font-medium col-span-1 text-right">明度：</span>
        <span className="font-mono col-span-1 text-left">{colorInfo.value}%</span>
        <span className="text-label font-medium col-span-1 text-right">RGB：</span>
        <span className="font-mono col-span-3 text-left">({colorInfo.rgb})</span>
      </div>
    </div>
  );
}