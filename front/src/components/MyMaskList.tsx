
import { Preset } from "@/types/preset";
import { PresetCard } from "@/components/PresetCard";
import { useTranslations } from 'next-intl';

interface MyPresetsProps {
  myPresets: Preset[];
  fetchPresets: () => Promise<void>;
  isAuthenticated: boolean;
}

export const MyMaskList: React.FC<MyPresetsProps> = ({
  myPresets,
  fetchPresets,
  isAuthenticated
}) => {
  const t = useTranslations('CreateMask');

  // Myマスク一覧の表示コンテンツの制御
  return (
    <>
      {!isAuthenticated ? (
        <div className="text-white text-center">{t('login_required')}</div>
      ) : (
        <>
          {myPresets.length === 0 ? (
            <div className="text-white text-center">{t('no_my_masks')}</div>
          ) : (
            <div className="grid max-w-2xs grid-cols-1 md:max-w-md md:grid-cols-2 lg:max-w-3xl lg:grid-cols-3 xl:max-w-4xl xl:grid-cols-4 gap-4">
              {myPresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onDeleteSuccess={fetchPresets}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};