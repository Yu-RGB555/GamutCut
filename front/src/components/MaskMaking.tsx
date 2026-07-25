import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { MaskData } from '@/types/mask';
import { MaskControls } from './MaskControls';
import { ExportControls } from './ExportControls';
import { ColorInfoPanel } from './ColorInfoPanel';
import { shapeTemplates } from '@/lib/shapeTemplates';
import { useMaskState } from '@/hooks/useMaskState';
import { useMaskCanvas } from '@/hooks/useMaskCanvas';
import { useMaskPointer } from '@/hooks/useMaskPointer';
import { usePresetSave } from '@/hooks/usePresetSave';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MaskMakingProps {
  onSaveSuccess: () => Promise<void>;
  copiedMaskData?: MaskData | null;
}

export function MaskMaking({ onSaveSuccess, copiedMaskData }: MaskMakingProps) {
  const t = useTranslations('CreateMask');

  // キャンバスを参照（各フックが共有するためコンポーネントが所有する）
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ドキュメント状態（明度・回転・マスク配列）とマスクの追加・削除・拡縮・復元
  const {
    selectedMask,
    setSelectedMask,
    selectedMaskIndex,
    setSelectedMaskIndex,
    currentValue,
    setCurrentValue,
    rotation,
    setRotation,
    isDialogOpen,
    setIsDialogOpen,
    handleMaskSelect,
    handleMaskDelete,
    handleScaleChange,
  } = useMaskState(canvasRef, copiedMaskData);

  // Canvas への描画（rAF スケジューリング）と PNG エクスポート
  const { colorWheelDrawer, handleMaskExport } =
    useMaskCanvas(canvasRef, currentValue, rotation, selectedMask);

  // ポインター操作（ドラッグ・カーソル形状・色情報・タッチスクロール抑止）
  const { colorInfo, handlePointerDown, handlePointerMove, handlePointerUp } =
    useMaskPointer({
      canvasRef,
      colorWheelDrawer,
      currentValue,
      rotation,
      selectedMask,
      setSelectedMask,
      selectedMaskIndex,
    });

  // プリセット名入力ダイアログと保存 API 呼び出し
  const {
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    presetName,
    setPresetName,
    setIsComposing,
    handleMaskSave,
    executePresetSave,
    cancelPresetSave,
    handleKeyDown,
  } = usePresetSave({ canvasRef, selectedMask, currentValue, rotation, onSaveSuccess });

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mt-6 lg:mt-12">
        {/* キャンバス */}
        <div className="relative w-full max-w-[400px] justify-self-center lg:col-start-1 lg:row-start-1">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded-md w-full h-auto max-w-[400px] max-h-[400px]"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          <div className="absolute top-0 left-0">
            <ColorInfoPanel colorInfo={colorInfo}/>
          </div>
        </div>

        {/* マスク操作パネル（lg未満はキャンバス直下、lg以上は右カラム） */}
        <div className="w-full max-w-[400px] justify-self-center lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <MaskControls
            shapeTemplates={shapeTemplates}
            selectedMask={selectedMask}
            selectedMaskIndex={selectedMaskIndex}
            isDialogOpen={isDialogOpen}
            onDialogOpenChange={setIsDialogOpen}
            onMaskSelect={handleMaskSelect}
            onMaskDelete={handleMaskDelete}
            onMaskIndexChange={setSelectedMaskIndex}
            onScaleChange={handleScaleChange}
          />
        </div>

        {/* スライダー・エクスポート操作 */}
        <div className="w-full max-w-[400px] justify-self-center lg:col-start-1 lg:row-start-2 flex flex-col space-y-8">
          {/* 明度調整スライダー */}
          <div className="w-full space-y-2">
            <h3 className="text-card-foreground text-lg font-semibold">{t('value')}</h3>
            <div className="flex items-center sm:flex-row gap-2 sm:gap-4">
              <Slider
                defaultValue={[100]}
                value={[currentValue]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setCurrentValue(value[0])}
                className="w-1/2 h-2 hover:cursor-pointer"
              />
              <span className="text-label">{currentValue}%</span>
            </div>
          </div>

          {/* 回転調整スライダー */}
          <div className="w-full space-y-2">
            <h3 className="text-card-foreground text-lg font-semibold">{t('rotation')}</h3>
            <div className="flex items-center sm:flex-row gap-2 sm:gap-4">
              <Slider
                defaultValue={[0]}
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => setRotation(value[0])}
                className="w-1/2 h-2 hover:cursor-pointer"
              />
              <span className="text-label">{rotation}°</span>
            </div>
          </div>

          {/* Myマスクに保存ボタン・ダウンロードボタン */}
          <ExportControls
            selectedMaskLength={selectedMask.length}
            onMaskExport={handleMaskExport}
            onMaskSave={handleMaskSave}
          />
        </div>
      </div>

      {/* マスクに名前をつけて保存ダイアログ */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('save_to_my_masks')}</DialogTitle>
            <DialogDescription className="text-label">
              {t('enter_preset_name')}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Label htmlFor="preset-name"></Label>
            <Input
              id="preset-name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="No Title"
              maxLength={30}
              className="text-label"
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={cancelPresetSave}
            >
              {t('cancel')}
            </Button>
            <Button
              variant="secondary"
              onClick={executePresetSave}
              disabled={!presetName.trim()}
            >
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
