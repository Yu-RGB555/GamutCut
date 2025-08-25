
import { Preset } from "@/types/preset";
import { PresetCard } from "@/components/PresetCard";

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
  // Myマスク一覧の表示コンテンツの制御
  return (
    <>
      {!isAuthenticated ? (
        <div className="text-white text-center">Myマスクを利用するにはログインが必要です</div>
      ) : (
        <>
          {myPresets.length === 0 ? (
            <div className="text-white text-center">Myマスクがありません</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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