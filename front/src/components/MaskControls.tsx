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
    <div>
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
                {getMaskDisplayName(mask, idx)}
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center my-4 gap-2 sm:gap-4">
            <p className="text-label text-sm font-base">拡大・縮小</p>
            <input
              type="range"
              min="0.2"
              max="1.8"
              step="0.01"
              value={selectedMask[selectedMaskIndex]?.scale ?? 1}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-full max-w-1/2 sm:w-1/3 h-2
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
            <span className="text-label">{((selectedMask[selectedMaskIndex]?.scale ?? 1) * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              id="step-2"
            >
              マスクを追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ガマットマスクの選択</DialogTitle>
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