'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postWork } from "@/lib/api";

// 型定義を追加
type PublicStatus = 0 | 1 | 2; // published: 0, restricted: 1, draft: 2

export default function PostWorks() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [illustrationFile, setIllustrationFile] = useState<File | null>(null);
  const [maskFile, setMaskFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

      // ダミーのマスクデータ（jsonb型対応）
      const dummyMaskData = {
        maskId: 'dummy_mask_001',
        maskName: 'ダミーマスク',
        maskSettings: {
          opacity: 0.8,
          blendMode: 'multiply'
        },
        createdAt: new Date().toISOString()
      };
      submitData.append('work[set_mask_data]', JSON.stringify(dummyMaskData));


      // デバッグ用：FormDataの内容を確認
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
        console.log(publicStatus.toString())
      }

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
    <div className="m-16">
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
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-8 mb-16">
            <div className="grid gap-2">
              <Label className="text-label font-semibold mb-2">イラスト作品</Label>
              <DropZone
                onFileSelect={setIllustrationFile}
                accept="image/*"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-label font-semibold mb-2">作品で使用したマスク</Label>
              <DropZone
                onFileSelect={setMaskFile}
                accept="image/*,.json"
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
