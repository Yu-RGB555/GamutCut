'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  maxTagLength?: number;
}

export function TagInput({
  tags,
  onTagsChange,
  maxTags = 5,
  maxTagLength = 20
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isComposing, setIsComposing] = useState(false); // IME変換中フラグ
  const t = useTranslations('Tags');
  const locale = useLocale();

  const addTag = (tagName: string) => {
    const trimmedTag = tagName.trim();

    // バリデーション
    if (!trimmedTag) {
      setError('タグ名を入力してください');
      return;
    }

    if (trimmedTag.length > maxTagLength) {
      setError(`タグ名は${maxTagLength}文字以内で入力してください`);
      return;
    }

    if (tags.length >= maxTags) {
      setError(`タグは最大${maxTags}個まで設定できます`);
      return;
    }

    if (tags.includes(trimmedTag)) {
      setError('同じタグは追加できません');
      return;
    }

    // タグを追加
    onTagsChange([...tags, trimmedTag]);
    setInputValue('');
    setError('');
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
    setError('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) { // IME変換中でない場合のみ追加
      e.preventDefault();
      addTag(inputValue);
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

  const handleAddButtonClick = () => {
    addTag(inputValue);
  };

  return (
    <div className="space-y-3">
      <Label className="text-label font-semibold">
        {t('title')}
        {locale === 'ja' ? (
          <span className="text-xs text-gray-500 ml-2">
            (最大{maxTags}個、各{maxTagLength}文字以内)
          </span>
        ) : (
          <span className="text-xs text-gray-500 ml-2">
            ( Up to {maxTags} keywords, {maxTagLength} characters maximum each. )
          </span>
          )}
      </Label>

      {/* タグ表示エリア */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 min-h-[50px]">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-1 px-2 py-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-label hover:cursor-pointer"
                aria-label={`${tag}タグを削除`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* タグ入力エリア */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart} // IME変換開始
          onCompositionEnd={handleCompositionEnd}     // IME変換終了
          placeholder={t('placeholder')}
          maxLength={maxTagLength}
          disabled={tags.length >= maxTags}
        />
        <Button
          type="button"
          onClick={handleAddButtonClick}
          disabled={!inputValue.trim() || tags.length >= maxTags}
          variant="secondary"
          className="whitespace-nowrap"
        >
          {t('add_button')}
        </Button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* ヘルプテキスト */}
      <p className="text-xs text-gray-500">
        {t('help')}
      </p>
    </div>
  );
}