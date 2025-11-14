"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Trash2Icon, Edit2Icon, CheckIcon, XIcon } from 'lucide-react';
import { Preset } from '@/types/preset';
import { ColorWheelDrawer } from '@/lib/colorWheelDrawer';
import { MaskDrawer } from '@/lib/MaskDrawer';
import { Point } from '@/types/gamut';
import { deletePreset, updatePreset } from '@/lib/api';
import { useAlert } from '@/contexts/AlertContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PresetCardProps {
  preset: Preset;
  onDeleteSuccess?: () => void;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

export function PresetCard({ preset, onDeleteSuccess, showEditButton = true, showDeleteButton = true }: PresetCardProps) {
  const { showAlert } = useAlert();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 編集状態を管理
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(preset.name);
  const [isComposing, setIsComposing] = useState(false); // IME変換中フラグ

  const CARD_CANVAS_SIZE = 200;   // キャンバスサイズ(プレビュー用)

  // 描画インスタンス
  const colorWheelDrawer = new ColorWheelDrawer();
  const maskDrawer = new MaskDrawer();

  // 相対座標から絶対座標へのスケーリング
  const scalePoints = (points: Point[], scale: number): Point[] => {
    // キャンバスの中心を計算
    const centerX = CARD_CANVAS_SIZE / 2;
    const centerY = CARD_CANVAS_SIZE / 2;

    return points.map(point => {
      // 1. 相対座標（-1.0 ~ 1.0）をキャンバスサイズに合わせて絶対座標に変換
      const absoluteX = centerX + (point.x * CARD_CANVAS_SIZE / 2);
      const absoluteY = centerY + (point.y * CARD_CANVAS_SIZE / 2);

      // 2. スケール値を適用（中心点からの距離に対して）
      const relativeX = absoluteX - centerX;
      const relativeY = absoluteY - centerY;
      const scaledX = centerX + (relativeX * scale);
      const scaledY = centerY + (relativeY * scale);

      return {
        x: scaledX,
        y: scaledY
      };
    });
  };

  // 描画処理(プリセット用)
  const drawPreset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 色相環を描画
    colorWheelDrawer.draw(ctx, CARD_CANVAS_SIZE, CARD_CANVAS_SIZE, preset.mask_data.value);

    // マスクを描画
    if (preset.mask_data.masks.length > 0) {
      const masksWithRequired = preset.mask_data.masks.map((mask, index) => {
        // 保存された座標をプレビューサイズにスケーリング
        const scaledPoints = scalePoints(mask.originalPoints, mask.scale);

        return {
          id: index,
          originalPoints: scaledPoints,
          scale: mask.scale,
          shape_type: mask.shape_type || 'unknown' // shape_typeを追加
        };
      });
      maskDrawer.drawMasks(ctx, masksWithRequired, CARD_CANVAS_SIZE, CARD_CANVAS_SIZE);
    }
  };

  // Myマスク削除
  const removePreset = async (id: number) => {
    try {
      const response = await deletePreset(id);
      showAlert(response.message);
      // 親コンポーネントのMyマスク一覧を更新
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('プリセット削除エラー:', error);
      showAlert('プリセットの削除に失敗しました');
    }
  }

  // 編集開始
  const startEditing = () => {
    setIsEditing(true);
    setEditedName(preset.name);
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedName(preset.name);
  };

  // 名前保存
  const saveName = async () => {
    if (editedName.trim() === '') {
      showAlert('Myマスクのタイトルを入力してください');
      return;
    }

    if (editedName.length > 30) {
      showAlert('Myマスクのタイトル名は最大30文字までです');
      return
    }

    try {
      const response = await updatePreset(preset.id, editedName.trim());
      showAlert(response.message);
      setIsEditing(false);
      // 親コンポーネントのMyマスク一覧を更新
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('プリセット名更新エラー:', error);
      showAlert('Myマスクのタイトルの更新に失敗しました');
    }
  };

  // Enterキーで保存
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isComposing) { // IME変換中でない場合のみ追加
      saveName();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // IME変換開始
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // IME変換終了
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // 初回レンダリング時に描画
  useEffect(() => {
    drawPreset();
  }, [preset]);

  return (
    <div className="bg-background border p-4 rounded-lg">
      <div className="flex flex-col">
        <div className="flex justify-between w-full items-center mb-2">
          {isEditing ? (
            <div className="flex items-center gap-1 flex-1">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart} // IME変換開始
                onCompositionEnd={handleCompositionEnd}     // IME変換終了
                className="text-sm"
                maxLength={50}
                autoFocus
              />
              <Tooltip>
                <TooltipTrigger>
                  <CheckIcon
                    onClick={saveName}
                    className="text-green-500 w-6 h-6 hover:cursor-pointer hover:bg-muted hover:rounded-full flex-shrink-0 p-1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>更新</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <XIcon
                    onClick={cancelEditing}
                    className="text-gray-400 w-6 h-6 hover:cursor-pointer hover:bg-muted hover:rounded-full flex-shrink-0 p-1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>キャンセル</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <>
              <p className="text-gray-300 font-medium flex-1">
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-start line-clamp-1">{preset.name}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{preset.name}</p>
                  </TooltipContent>
                </Tooltip>
              </p>
              <div className="flex gap-1">
                {showEditButton && (
                  <Edit2Icon
                    onClick={startEditing}
                    className="text-gray-400 w-4 h-4 hover:cursor-pointer hover:text-gray-200"
                  />
                )}
                {showDeleteButton && (
                  <Trash2Icon
                    onClick={() => setIsDialogOpen(true)}
                    className="text-destructive w-4 h-4 hover:cursor-pointer"
                  />
                )}
              </div>

      {/* コメント削除確認ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Myマスク削除の確認</DialogTitle>
            <DialogDescription
              className="text-label pt-2">
                Myマスク一覧から『 <span className="text-primary">{preset.name}</span> 』を削除しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >キャンセル</Button>
            <Button
              variant="secondary"
              onClick={() => removePreset(preset.id)}
            >はい</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
            </>
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={CARD_CANVAS_SIZE}
          height={CARD_CANVAS_SIZE}
          className="my-2"
        />
        <p className="text-gray-300 text-xs text-right">
          明度： {preset.mask_data.value}%
        </p>
      </div>
    </div>
  );
}