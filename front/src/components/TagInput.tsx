'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

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
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleAddButtonClick = () => {
    addTag(inputValue);
  };

  return (
    <div className="space-y-3">
      <Label className="text-label font-semibold">
        タグ
        <span className="text-xs text-gray-500 ml-2">
          (最大{maxTags}個、各{maxTagLength}文字以内)
        </span>
      </Label>

      {/* タグ表示エリア */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[50px]">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 hover:text-red-500 transition-colors"
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
          placeholder="タグを入力してEnterキーまたは追加ボタンを押してください"
          maxLength={maxTagLength}
          disabled={tags.length >= maxTags}
        />
        <Button
          type="button"
          onClick={handleAddButtonClick}
          disabled={!inputValue.trim() || tags.length >= maxTags}
          variant="outline"
          className="whitespace-nowrap"
        >
          追加
        </Button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* ヘルプテキスト */}
      <p className="text-xs text-gray-500">
        Enterキーまたは追加ボタンでタグを追加できます。タグをクリックして削除できます。
      </p>
    </div>
  );
}