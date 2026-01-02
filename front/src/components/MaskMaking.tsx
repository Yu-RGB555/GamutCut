import React, { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAlert } from '@/contexts/AlertContext';
import { ShapeTemplate, ColorInfo, MaskWithScale } from '@/types/gamut';
import { Preset } from '@/types/preset';
import { MaskData } from '@/types/mask';
import { maskSave } from '@/lib/api';
import { MaskControls } from './MaskControls';
import { ExportControls } from './ExportControls';
import { ColorInfoPanel } from './ColorInfoPanel';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { MaskDrawer } from '@/lib/MaskDrawer';
import { shapeTemplates } from '@/lib/shapeTemplates';
import { hsvToRgb, getColorFromCoords } from '@/lib/colorUtils';
import {
  getCenter,
  getScaledPoints,
  findClosestPoint,
  isPointInPolygon,
  toAbsolutePoints
} from '@/lib/maskUtils';
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
  const { showAlert } = useAlert();
  const t = useTranslations('CreateMask');
  const [isComposing, setIsComposing] = useState(false);

  // キャンバスを参照
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 描画インスタンス
  const colorWheelDrawer = new ColorWheelDrawer;
  const maskDrawer = new MaskDrawer;

  // 色相環パラメータ
  const [currentValue, setCurrentValue] = useState<number>(100);
  const [colorInfo, setColorInfo] = useState<ColorInfo>({
    coordinates: '-',
    hue: '-',
    saturation: '-',
    value: '-',
    rgb: '-'
  });

  // 選択マスクの状態
  const [selectedMask, setSelectedMask] = useState<MaskWithScale[]>([]); // 選択中のマスク情報
  const [selectedMaskIndex, setSelectedMaskIndex] = useState<number>(0); // 表示マスクのインデックス
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // プリセット名入力ダイアログの状態
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  // ドラッグ関連の状態
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointIndex, setDragPointIndex] = useState<number>(-1);  // 頂点
  const [draggingMaskIndex, setDraggingMaskIndex] = useState<number>(-1); // 図形全体
  const [lastMousePos, setLastMousePos] = useState<{x: number, y: number} | null>(null);
  const [dragMaskIndex, setDragMaskIndex] = useState<number>(-1);

  // 円形マスクかどうかを判定
  const isCircularMask = (mask: MaskWithScale): boolean => {
    return mask.shape_type === 'circle';
  };

  // 再描画処理
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 色相環を描画
    colorWheelDrawer.draw(ctx, canvas.width, canvas.height, currentValue);

    if (selectedMask.length === 0) {
      return; // マスクがない場合はグレーアウト処理をしない
    }

    // マスクを描画
    maskDrawer.drawMasks(ctx, selectedMask, canvas.width, canvas.height)
  };

  // マスク図形自体または頂点のドラッグ
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    // 表示サイズからCanvas内部座標に変換
    const x = (displayX / rect.width) * canvas.width;
    const y = (displayY / rect.height) * canvas.height;

    // 頂点ドラッグ判定
    for (let maskIdx = 0; maskIdx < selectedMask.length; maskIdx++) {
      const mask = selectedMask[maskIdx];

      // 円形マスクの場合は頂点ドラッグを無効化
      if (isCircularMask(mask)) {
        continue;
      }

      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);
      const pointIdx = findClosestPoint(x, y, scaledPoints);
      if (pointIdx !== -1) {
        setIsDragging(true);
        setDragMaskIndex(maskIdx);
        setDragPointIndex(pointIdx);
        return; // 頂点ドラッグならここで終了
      }
    }

    // 図形全体ドラッグ判定
    for (let idx = 0; idx < selectedMask.length; idx++) {
      const mask = selectedMask[idx];
      const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);
      if (isPointInPolygon(x, y, scaledPoints)) {
        setDraggingMaskIndex(idx);
        setLastMousePos({ x, y });
        return;
      }
    }
  };

  // マウスムーブイベント
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;

    // 表示サイズからCanvas内部座標に変換
    const x = (displayX / rect.width) * canvas.width;
    const y = (displayY / rect.height) * canvas.height;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const { hue, saturation, distance } = getColorFromCoords(x, y, centerX, centerY, colorWheelDrawer.getMaxRadius());

    // 色情報の取得
    if (distance <= colorWheelDrawer.getMaxRadius()) {
      const [r, g, b] = hsvToRgb(hue, saturation, currentValue);
      setColorInfo({
        coordinates: `(${Math.round(x)}, ${Math.round(y)})`,
        hue: Math.round(hue).toString(),
        saturation: Math.round(saturation).toString(),
        value: currentValue.toString(),
        rgb: `${r}, ${g}, ${b}`
      });
    } else {
      setColorInfo({
        coordinates: '-',
        hue: '-',
        saturation: '-',
        value: '-',
        rgb: '-'
      });
    }

    // 1. 頂点ドラッグ処理
    if (isDragging && dragMaskIndex !== -1 && dragPointIndex !== -1) {
      const updatedMasks = selectedMask.map((mask, idx) => {
        if (idx === dragMaskIndex) {
          const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1); // スケール済み点群の取得
          const newScaledPoints = [...scaledPoints]; // ドラッグされた頂点だけ新しい座標に置き換え
          newScaledPoints[dragPointIndex] = { x, y };
          // 逆変換でoriginalPointsを再計算
          const center = getCenter(scaledPoints);
          const scale = mask.scale ?? 1;
          const newOriginalPoints = newScaledPoints.map(p => ({
            x: center.x + (p.x - center.x) / scale,
            y: center.y + (p.y - center.y) / scale
          }));
          return { ...mask, originalPoints: newOriginalPoints };
        }
        return mask;
      });
      setSelectedMask(updatedMasks);
      canvas.style.cursor = 'grabbing';  // 頂点ドラッグ中のカーソル設定
      return; // 頂点ドラッグ時は他の処理をしない
    }

    // 2. 図形全体ドラッグ処理
    if (draggingMaskIndex !== -1 && lastMousePos) {
      const dx = x - lastMousePos.x;
      const dy = y - lastMousePos.y;
      const updatedMasks = selectedMask.map((mask, idx) => {
        if (idx === draggingMaskIndex) {
          return {
            ...mask,
            originalPoints: mask.originalPoints.map(p => ({ x: p.x + dx, y: p.y + dy }))
          };
        }
        return mask;
      });
      setSelectedMask(updatedMasks);
      setLastMousePos({ x, y });
      canvas.style.cursor = 'all-scroll';  // マスク全体移動中のカーソル設定
      return; // マスク全体移動中は他の処理をしない
    }

    // カーソルスタイル変更（ドラッグ操作以外の場合）
    if (!isDragging) {
      let foundPoint = false; // マスク頂点の判定
      let foundMask = false;  // マスク領域の判定

      selectedMask.forEach(mask => {
        const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);

        // 円形マスク以外の場合のみ頂点判定を行う
        if (!isCircularMask(mask)) {
          const pointIndex = findClosestPoint(x, y, scaledPoints);
          if (pointIndex !== -1) foundPoint = true;
        }

        // マスク内部判定（全てのマスクで実行）
        if (isPointInPolygon(x, y, scaledPoints)) {
          foundMask = true;
        }
      });

      if (foundPoint) {
        canvas.style.cursor = 'grab';  // 頂点付近
      } else if (foundMask) {
        canvas.style.cursor = 'all-scroll';  // マスク内部
      } else {
        canvas.style.cursor = 'default';  // マスク外
      }
    }
  };

  // マウス操作の状態リセット
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragPointIndex(-1);
    setDragMaskIndex(-1);
    setDraggingMaskIndex(-1);
    setLastMousePos(null);

    // ドラッグ終了時、originalPointsも更新
    setSelectedMask(selectedMask.map((mask, idx) => {
      if (idx === selectedMaskIndex) {
        return { ...mask, originalPoints: mask.originalPoints };
      }
      return mask;
    }));
  };

  // テンプレートマスク選択
  const handleMaskSelect = (mask: ShapeTemplate) => {
    // マスクの最大数制限（3つまで）
    if (selectedMask.length >= 3) {
      setIsDialogOpen(false);
      showAlert(t('alert_max_masks'));
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    const absPoints = toAbsolutePoints(mask.points, width, height);
    setSelectedMask([
      ...selectedMask,
      {
        id: mask.id,
        originalPoints: absPoints,
        scale: 1,
        shape_type: mask.shape_type
      }
    ]);
    setSelectedMaskIndex(selectedMask.length);
    setIsDialogOpen(false);
  };

  // エクスポート処理
  const handleMaskExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 既に描画済みのcanvasをそのままエクスポート
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'masked-color-wheel.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  // マスク削除
  const handleMaskDelete = () => {
    if (selectedMask.length === 0) return;

    // 選択中のマスクを削除
    const updatedMasks = selectedMask.filter((_, idx) => idx !== selectedMaskIndex);
    setSelectedMask(updatedMasks);

    // 削除後にインデックスを調整
    if (updatedMasks.length === 0) {
      setSelectedMaskIndex(0);
    } else if (selectedMaskIndex >= updatedMasks.length) {
      setSelectedMaskIndex(updatedMasks.length - 1);
    }
  };

  // プリセット保存ダイアログを開く
  const handleMaskSave = () => {
    setPresetName('No Title');
    setIsSaveDialogOpen(true);
  };

  // プリセット保存を実行する
  const executePresetSave = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 現在のマスクの状態を相対座標で保存
      const currentMasks = selectedMask.map(mask => {
        const scaledPoints = getScaledPoints(mask.originalPoints, mask.scale ?? 1);

        // 中心点からの相対座標に変換（-1.0 ~ 1.0の範囲）
        const relativePoints = scaledPoints.map(point => ({
          x: (point.x - centerX) / canvas.width * 2,
          y: (point.y - centerY) / canvas.height * 2
        }));

        return {
          originalPoints: relativePoints, // 相対座標
          scale: 1, // スケールは相対座標化に含まれるため1にリセット
          shape_type: mask.shape_type // 図形タイプ
        };
      });

      // プリセットデータの作成
      const presetData: Preset = {
        id: Date.now(), // 一時的なID（API側で上書き）
        name: presetName,
        mask_data: {
          value: currentValue,
          masks: currentMasks,
        }
      };

      // プリセットを保存
      const response = await maskSave(presetData);
      showAlert(response.message);

      // ダイアログを閉じて、プリセット一覧を更新
      setIsSaveDialogOpen(false);
      setPresetName('');
      await onSaveSuccess();
    } catch (error) {
      console.error('プリセット保存エラー:', error);
      showAlert(t('alert_save_fail'));
    }
  };

  // プリセット保存をキャンセル
  const cancelPresetSave = () => {
    setIsSaveDialogOpen(false);
    setPresetName('');
  };

  // 拡大縮小
  const handleScaleChange = (scale: number) => {
    setSelectedMask(selectedMask.map((mask, idx) =>
      idx === selectedMaskIndex ? { ...mask, scale } : mask
    ));
  };

  // Enterキーで保存
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter' && !isComposing){
      executePresetSave();
    } else if(e.key === 'Escape') {
      cancelPresetSave();
    }
  }

  // 初期マスクデータの復元
  useEffect(() => {
    if (copiedMaskData) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 相対座標を絶対座標に変換
      const restoredMasks = copiedMaskData.masks.map((mask, index) => {
        const absolutePoints = mask.originalPoints.map(point => ({
          x: centerX + (point.x * canvas.width / 2),
          y: centerY + (point.y * canvas.height / 2)
        }));

        return {
          // MaskWithScale（gamut.ts）
          id: Date.now() + index, // 一時的なID
          originalPoints: absolutePoints,
          scale: mask.scale || 1,
          shape_type: mask.shape_type || 'unknown' // 図形タイプ
        };
      });

      setSelectedMask(restoredMasks);
      setCurrentValue(copiedMaskData.value);
      setSelectedMaskIndex(restoredMasks.length > 0 ? restoredMasks.length - 1 : 0);
    }
  }, [copiedMaskData]);

  // 再描画トリガー
  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, selectedMask]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mt-6 lg:mt-12">
        <div className="justify-items-center space-y-4 lg:space-y-8">
          <div className="relative w-full max-w-[400px]">

            {/* キャンバス */}
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="rounded-md w-full h-auto max-w-[400px] max-h-[400px]"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="absolute top-0 left-0">
              <ColorInfoPanel colorInfo={colorInfo}/>
            </div>

            <div className="flex flex-col space-y-8 mt-4">
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

              {/* Myマスクに保存ボタン・ダウンロードボタン */}
              <ExportControls
                selectedMaskLength={selectedMask.length}
                onMaskExport={handleMaskExport}
                onMaskSave={handleMaskSave}
              />
            </div>
          </div>
        </div>

        {/* 色情報パネル */}
        <div className="justify-items-center space-y-4 lg:space-y-8">
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