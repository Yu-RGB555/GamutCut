'use client';

import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PostWorks() {
  return (
    <div className="m-16">
      <div className="flex justify-between mb-16">
        <div className="flex items-center">
          <h1 className="text-label text-4xl font-extrabold">作品投稿</h1>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="destructive">削除</Button>
          <Button variant="outline">下書き保存</Button>
        </div>
      </div>
      <form>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-8 mb-16">
            <div className="grid gap-2">
              <Label className="text-label font-semibold mb-2">イラスト作品</Label>
              <DropZone></DropZone>
            </div>
            <div className="grid gap-2">
              <Label className="text-label font-semibold mb-2">作品で使用したマスク</Label>
              <DropZone></DropZone>
            </div>
          </div>
          <div className="grid grid-cols gap-6">
            <div>
              <Label className="text-label font-semibold mb-2">作品タイトル</Label>
              <Input></Input>
            </div>
            <div>
              <Label className="text-label font-semibold mb-2">タグ</Label>
              <Input></Input>
            </div>
            <div>
              <Label className="text-label font-semibold mb-2">作品説明</Label>
              <Textarea className="h-32"></Textarea>
            </div>
          </div>
        </div>
          <div className="flex justify-end mt-10">
            <Button type="submit">投稿</Button>
          </div>
      </form>
    </div>
  );
}
