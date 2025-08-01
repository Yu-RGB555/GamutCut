import React, { useEffect, useState } from 'react';
import { Preset } from '@/types/preset';
import { PresetCard } from './PresetCard';
import { getPresets } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface PresetSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (preset: Preset) => void;
}

export function PresetSelectDialog({ open, onOpenChange, onSelect }: PresetSelectDialogProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // プリセット一覧を取得
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        setIsLoading(true);
        const presetData = await getPresets();
        setPresets(presetData);
      } catch (error) {
        console.error('プリセット取得エラー:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchPresets();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>作成したマスクを選択</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-4">読み込み中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto py-4">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  onSelect(preset);
                  onOpenChange(false);
                }}
              >
                <PresetCard preset={preset} />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
