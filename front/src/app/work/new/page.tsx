'use client';

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Preset } from "@/types/preset";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { DropZone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PresetPreview } from "@/components/PresetPreview";
import { PresetSelectDialog } from "@/components/PresetSelectDialog";
import { postWork } from "@/lib/api";

// 型定義(公開設定)
type PublicStatus = 0 | 1 | 2; // published: 0, restricted: 1, draft: 2

export default function PostWorks() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [presetData, setPresetData] = useState<Preset | null>(null);
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [illustrationFile, setIllustrationFile] = useState<File | null>(null);
  const [illustrationPreview, setIllustrationPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!illustrationFile){
      return setIllustrationPreview(null);
    }
    // ObjectURLを生成
    const url = URL.createObjectURL(illustrationFile);
    setIllustrationPreview(url);
    // クリーンアップ(メモリリーク防止)
    return () => URL.revokeObjectURL(url);
  }, [illustrationFile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveMask = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPresetData(null);
  }

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);

    try{
      const submitData = new FormData();

      submitData.append('work[title]', formData.title);
      submitData.append('work[description]', formData.description);

      const publicStatus: PublicStatus = isDraft ? 2 : 0;
      submitData.append('work[is_public]', publicStatus.toString());

      if (illustrationFile) {
        submitData.append('work[illustration_image]', illustrationFile);
      }

      submitData.append('work[set_mask_data]', JSON.stringify(presetData?.mask_data));

      await postWork(submitData);
      router.push('/work');
    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-16 mt-12 mb-40">
      <div className="flex justify-between mb-16">
        <div className="flex items-center">
          <h1 className="text-label text-4xl font-extrabold">作品投稿</h1>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="destructive">削除</Button>
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isLoading}
          >
            下書き保存
          </Button>
        </div>
      </div>
      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <Label className="text-label font-semibold mb-2">イラスト作品</Label>
              <DropZone
                onFileSelect={setIllustrationFile}
                accept="image/*"
                previewUrl={illustrationPreview}
              />
              {illustrationFile && (
                <span className="flex justify-end text-sm text-gray-600 mt-2">
                  選択中: {illustrationFile.name} ({(illustrationFile.size / 1024 / 1024).toFixed(2)}MB)
                </span>
              )}
            </div>
            <div className="gap-2">
              <Label className="text-label font-semibold mb-2">作品で使用したマスク</Label>
              <div
                className="cursor-pointer"
                onClick={() => setIsPresetDialogOpen(true)}
              >
                {presetData ? (
                  <div className="grid grid-row-2 relative">
                    <PresetPreview maskData={presetData.mask_data} size={300} />
                    <button
                      type="button"
                      title="マスクを削除"
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black hover:cursor-pointer"
                      onClick={handleRemoveMask}
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <span className="flex justify-end text-sm text-gray-600 mt-2">
                      選択中: {presetData.name}
                    </span>
                  </div>
                ) : (
                  <div className="justify-center w-full h-full border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-card hover:bg-gray-700 relative">
                    <div className="flex flex-col items-center justify-center h-80">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 800x400px)</p>
                    </div>
                  </div>
                )}
              </div>
              <PresetSelectDialog
                open={isPresetDialogOpen}
                onOpenChange={setIsPresetDialogOpen}
                onSelect={setPresetData}
              />
            </div>
          </div>
          <div className="grid grid-cols gap-6">
            <div>
              <Label className="text-label font-semibold mb-2">作品タイトル</Label>
              <Input
                value={formData.title}
                onChange={(e)=> handleInputChange('title', e.target.value)}
                placeholder="最大30文字まで"
                required
              />
            </div>
            {/* <div>
              <Label className="text-label font-semibold mb-2">タグ</Label>
              <Input></Input>
            </div> */}
            <div>
              <Label className="text-label font-semibold mb-2">作品説明</Label>
              <Textarea
                className="h-32"
                value={formData.description}
                onChange={(e)=> handleInputChange('description', e.target.value)}
                placeholder="最大300文字まで"
              />
            </div>
          </div>
        </div>
          <div className="flex justify-end mt-10">
            <Button type="submit" disabled={isLoading}>
              {isLoading? '投稿中...' : '投稿'}
            </Button>
          </div>
      </form>
    </div>
  );
}
