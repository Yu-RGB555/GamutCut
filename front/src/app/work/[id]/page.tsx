'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Work } from "@/types/work";
import { deleteWork, showWork } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { PresetPreview } from "@/components/PresetPreview";

export default function ShowWorks() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchWork = async () => {
      try{
        const workData = await showWork(Number(id));
        setWork(workData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }

    };

    fetchWork();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        await deleteWork(id);
        router.push('/work');
      } catch (error) {
        console.error(error);
      }
    }
  }

    if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (!work) {
    return <div>作品が見つかりません</div>;
  }

  return (
    <div className="m-16">
      <div className="flex justify-between">
        <div className="flex items-center">
        </div>
        {user && work.user.id === user.id && (
          <Button
            variant="destructive"
            onClick={() => handleDelete(work.id)}
          >削除</Button>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols md:grid-cols-2 gap-8 mb-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-center border rounded-sm w-full h-80">
              {work.illustration_image_url ? (
                <img
                  src={work.illustration_image_url}
                  alt={work.title}
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-gray-500">画像なし</span>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-label font-semibold mb-2">作品で使用したマスク</Label>
            <PresetPreview maskData={work.set_mask_data} size={300} />
          </div>
        </div>
        <div className="grid grid-cols gap-6">
          <div>
            <Label className="text-label text-2xl font-semibold mb-2">{work.title}</Label>
            {/* <p className="text-label">{work.user.avatar_url}<span>{work.user.name}</span></p> */}
            <p className="text-label">{work.user.name}</p>
          </div>
          {/* <div className="text-label font-semibold mb-2"> タグ </div> */}
          <div className="text-label">{work.description}</div>
        </div>
        <div className="mb-40"></div>
      </div>
    </div>
  );
}
