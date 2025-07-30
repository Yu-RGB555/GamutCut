import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShapeTemplate, MaskWithScale } from '../types/gamut';

interface MaskControlsProps {
  shapeTemplates: ShapeTemplate[];
  selectedMask: MaskWithScale[];
  selectedMaskIndex: number;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onMaskSelect: (mask: ShapeTemplate) => void;
  onMaskDelete: () => void;
  onMaskExport: () => void;
  onMaskSave: () => void;
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
  onMaskExport,
  onMaskSave,
  onMaskIndexChange,
  onScaleChange
}) => {
  return (
    <div className="space-y-12">
      <div className="bg-card">
        <h3 className="text-card-foreground text-lg font-semibold mb-4">ガマットマスク</h3>
        <div className="grid grid-cols-2 gap-4">
          <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline">マスクを追加</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ガマットマスクの選択</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 p-4">
                {shapeTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="p-4 h-auto"
                    onClick={() => onMaskSelect(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {selectedMask.length > 0 && (
            <>
              <Button
                onClick={onMaskDelete}
                variant="destructive"
              >
                マスクを削除
              </Button>
              <Button
                onClick={onMaskExport}
                className="bg-primary hover:bg-mouseover"
              >
                ダウンロード
              </Button>
              <Button
                onClick={onMaskSave}
                className="bg-primary hover:bg-mouseover"
              >
                プリセットに保存
              </Button>
            </>
          )}
        </div>
      </div>

      {selectedMask.length > 0 && (
        <div className="">
          <h3 className="text-card-foreground text-lg font-semibold mb-4">拡大・縮小</h3>
          <div className="flex gap-2 mb-2">
            {selectedMask.map((mask, idx) => (
              <button
                key={idx}
                className={`px-2 py-1 font-bold rounded hover:cursor-pointer ${selectedMaskIndex === idx ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-muted'}`}
                onClick={() => onMaskIndexChange(idx)}
              >
                {mask.name}
              </button>
            ))}
          </div>

          <div className="flex items-center my-4">
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.01"
              value={selectedMask[selectedMaskIndex]?.scale ?? 1}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="mr-4"
            />
            <span>{((selectedMask[selectedMaskIndex]?.scale ?? 1) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}