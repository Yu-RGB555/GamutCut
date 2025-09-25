import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Preset } from '@/types/preset';
import { PresetCard } from './PresetCard';
import { getPresets } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './ui/alert-dialog';

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
                  <PresetCard preset={preset} showEditButton={showEditButton} showDeleteButton={showDeleteButton} />
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showEmptyAlert} onOpenChange={setShowEmptyAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>プリセットにマスクがありません</AlertDialogTitle>
            <AlertDialogDescription className="text-label">
              トップページでマスクを作成してプリセットに保存してください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                router.push('/');
                setShowEmptyAlert(false);
                onOpenChange(false);
              }}
              className="bg-primary hover:bg-mouseover"
            >
              マスクを作成
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
