import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShapeTemplate, MaskWithScale } from '../types/gamut';
import { getMaskDisplayName, getShapeDisplayName } from '@/lib/shapeUtils';

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
  return (
    <div className="">
      <h3 className="text-card-foreground text-lg font-semibold mb-4">ガマットマスク</h3>
      {/* 拡大・縮小 */}
      {selectedMask.length > 0 && (
        <div className="bg-card p-4 mb-4 rounded-xl">
          <h3 className="text-label text-base font-semibold mb-4">サイズ</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedMask.map((mask, idx) => (
              <button
                key={idx}
                className={`px-2 py-1 font-bold rounded hover:cursor-pointer ${selectedMaskIndex === idx ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground text-muted'}`}
                onClick={() => onMaskIndexChange(idx)}
              >
                {/* マスク名 */}
                {getMaskDisplayName(mask, idx)}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center my-4 gap-2 sm:gap-4">
            <input
              type="range"
              min="0.2"
              max="1.8"
              step="0.01"
              value={selectedMask[selectedMaskIndex]?.scale ?? 1}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-full sm:w-1/3 h-2
                accent-cyan-400
                backdrop-blur-md
                bg-white/30
                rounded-lg
                shadow-md
                hover: cursor-pointer
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:bg-white/80
                [&::-webkit-slider-thumb]:backdrop-blur-sm
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-cyan-400
                [&::-webkit-slider-thumb]:shadow-lg
                hover:[&::-webkit-slider-thumb]:bg-cyan-200
                transition-all duration-200"
            />
            <span className="text-center">{((selectedMask[selectedMaskIndex]?.scale ?? 1) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline">マスクを追加</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ガマットマスクの選択</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {shapeTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className="p-4 h-auto"
                  onClick={() => onMaskSelect(template)}
                >
                  {/* マスク名 */}
                  {getShapeDisplayName(template.shape_type)}
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
            マスクを削除
          </Button>
        )}
      </div>
    </div>
  );
}