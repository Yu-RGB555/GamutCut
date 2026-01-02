import { ColorInfo } from "@/types/gamut";
import { useTranslations } from 'next-intl';

interface ColorInfoProps {
  colorInfo: ColorInfo;
}

export const ColorInfoPanel: React.FC<ColorInfoProps> = ({ colorInfo }) => {
  const t = useTranslations('CreateMask');

  return (
    <div className="bg-card/90 backdrop-blur-sm p-2 rounded-lg border shadow-lg text-xs max-w-24">
      <h4 className="text-card-foreground font-semibold mb-2 text-xs">{t('color_info')}</h4>
      <div className="space-y-0.5">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('hue')}：</span>
          <span className="font-mono">{colorInfo.hue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('saturation')}：</span>
          <span className="font-mono">{colorInfo.saturation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('value')}：</span>
          <span className="font-mono">{colorInfo.value}</span>
        </div>
        {/* <div className="flex justify-between">
          <span className="text-muted-foreground">RGB：</span>
          <span className="font-mono text-xs">({colorInfo.rgb})</span>
        </div> */}
      </div>
    </div>
  );
}