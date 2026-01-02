import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShapeTemplate, MaskWithScale } from '../types/gamut';
import { useTranslations } from 'next-intl';

interface MaskControlsProps {
  shapeTemplates: ShapeTemplate[];
  selectedMask: MaskWithScale[];
  selectedMaskIndex: number;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onMaskSelect: (mask: ShapeTemplate) => void;
  onMaskDelete: () => void;
  onMaskIndexChange: (index: number) => void;
  onScaleChange: (scale: number) => void;
}

export const MaskControls: React.FC<MaskControlsProps> = ({
  shapeTemplates,
  selectedMask,
  selectedMaskIndex,
  isDialogOpen,
  onDialogOpenChange,
  onMaskSelect,
  onMaskDelete,
  onMaskIndexChange,
  onScaleChange
}) => {

  const t = useTranslations('CreateMask');

  // マスク追加のダイアログで表示する図形名
  const getShapeName = (shapeType?: string) => {
    if (!shapeType) return t('shapes.unknown');
    return t(`shapes.${shapeType}`);
  };

  // 追加したマスクの表示名
  const getMaskName = (mask: { shape_type?: string }, index: number) => {
    if (mask.shape_type) {
      return getShapeName(mask.shape_type);
    }
    return t('mask_default_name', { index: index + 1 });
  };

  return (
    <div className="w-full md:max-w-[400px]">
      {/* 拡大・縮小 */}
      {selectedMask.length > 0 && (
        <div className="bg-card p-4 mb-4 rounded-xl">
          <div className="flex flex-wrap gap-2 mb-2">

            {/* マスクの形状 */}
            {selectedMask.map((mask, idx) => (
              <button
                key={idx}
                className={`px-2 py-1 font-semibold border rounded hover:cursor-pointer ${selectedMaskIndex === idx ? 'text-label border-2 border-btn-border hover:text-foreground hover:bg-muted' : 'text-label bg-card hover:text-foreground hover:bg-muted'}`}
                onClick={() => onMaskIndexChange(idx)}
              >
                {getMaskName(mask, idx)}
              </button>
            ))}
          </div>
          <div className="flex items-center my-4 gap-2 sm:gap-4">
            <p className="text-label text-sm font-base">{t('zoom_in_or_out')}</p>
            <Slider
              defaultValue={[100]}
              value={[selectedMask[selectedMaskIndex]?.scale ?? 1]}
              min={0.2}
              max={1.8}
              step={0.01}
              onValueChange={(value) => onScaleChange(value[0])}
              className="w-full max-w-1/2 sm:w-1/3 h-2 hover:cursor-pointer"
            />
            <span className="text-label">{((selectedMask[selectedMaskIndex]?.scale ?? 1) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              id="step-2"
            >
              {t('add_mask')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('select_gamut_mask')}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {shapeTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="secondary"
                  className="p-4 h-auto"
                  onClick={() => onMaskSelect(template)}
                >
                  {/* マスク名 */}
                  {getShapeName(template.shape_type)}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {selectedMask.length > 0 && (
          <Button
            onClick={onMaskDelete}
            variant="destructive"
          >
            {t('delete_mask')}
          </Button>
        )}
      </div>
    </div>
  );
}