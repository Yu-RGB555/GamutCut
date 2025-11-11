import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Preset } from '@/types/preset';
import { PresetCard } from './PresetCard';
import { getPresets } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';

interface PresetSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (preset: Preset) => void;
  showEditButton?: boolean; // 編集ボタン表示フラグ
  showDeleteButton?: boolean; // 削除ボタン表示フラグ
}

export function PresetSelectDialog({ open, onOpenChange, onSelect, showEditButton = true ,showDeleteButton = true }: PresetSelectDialogProps) {
  const router = useRouter();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  // プリセット一覧を取得
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        setIsLoading(true);
        const presetData = await getPresets();
        setPresets(presetData);

        // プリセットが空の場合、AlertDialogを表示
        if (presetData.length === 0) {
          setShowEmptyAlert(true);
        }
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
    <>
      <Dialog open={open && !showEmptyAlert} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>作成したマスクを選択</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring"></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto py-4">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    onSelect(preset);
                    onOpenChange(false);
                  }}
                >
                  <PresetCard preset={preset} showEditButton={showEditButton} showDeleteButton={showDeleteButton} />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Myマスクに1つもマスクがない場合に表示するダイアログ */}
      <Dialog open={showEmptyAlert} onOpenChange={setShowEmptyAlert}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>プリセットにマスクがありません</DialogTitle>
            <DialogDescription className="text-label">
              トップページでマスクを作成してプリセットに保存してください。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEmptyAlert(false);
                onOpenChange(false);
              }}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                router.push('/mask');
              }}
              className="bg-primary hover:bg-mouseover"
            >
              マスクを作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
