'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LikeButton } from "@/components/LikeButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  UserCircle2Icon,
  Share2Icon
} from "lucide-react";
import { Work } from "@/types/work";
import { deleteWork, showWork } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { PresetPreview } from "@/components/PresetPreview";

export default function ShowWorks() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();
  const { showAlert } = useAlert();
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

  const handleEdit = (id: number) => {
    router.push(`/work/${id}/edit`);
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        const response = await deleteWork(id);
        showAlert(response.message);
        router.push('/work');
      } catch (error) {
        console.error(error);
        showAlert('作品の削除に失敗しました');
      }
    }
  }

    if (isLoading) {
    return <div className="flex min-h-[500px] justify-center items-center">
      <div className="text-center font-semibold">
        読み込み中...
      </div>
    </div>;
  }

  if (!work) {
    return <div className="flex min-h-[500px] justify-center items-center">
      <div className="text-white text-center font-semibold">
        作品が見つかりません...
      </div>
    </div>;
  }

  return (
    <div className="m-16">
      {/* アラート(デバッグ用) */}
      {/* <div className="mb-4 p-4 bg-card rounded">
        <p className="text-sm text-label mb-2">アラートテスト用（開発中のみ）</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => showAlert('成功メッセージのテストです')}>
            成功アラート
          </Button>
          <Button size="sm" variant="destructive" onClick={() => showAlert('エラーメッセージのテストです')}>
            エラーアラート
          </Button>
          <Button size="sm" variant="outline" onClick={() => showAlert('情報メッセージのテストです')}>
            情報アラート
          </Button>
        </div>
      </div> */}

      <div className="flex justify-between">
        <div className="flex items-center">
        </div>
        {user && work.user.id === user.id && (
          <div className="flex items-center gap-x-2">
            <Button
              variant="outline"
              onClick={() => handleEdit(work.id)}
            >編集</Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(work.id)}
            >削除</Button>
          </div>
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
        <div className="grid grid-cols gap-8">
          <Label className="text-label text-4xl font-semibold">{work.title}</Label>
            <div className="flex items-center">
              <Link
                  href={user?.id === work.user.id ? "/mypage" : `/users/${work.user.id}`}
                  className="text-label underline-offset-4 hover:cursor-pointer hover:underline"
              >
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-2 hover:cursor-pointer">
                    <AvatarImage src={work.user.avatar_url} />
                    <AvatarFallback className="bg-background">
                      <UserCircle2Icon className="w-full h-full"/>
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-label text-xl mr-8 hover:cursor-pointer hover:underline">
                    {work.user.name}
                  </p>
                </div>
              </Link>
              <div className="flex gap-4 mx-4">
                <LikeButton
                  workId={work.id}
                  initialLiked={work.is_liked_by_current_user}
                  initialLikesCount={work.likes_count}
                />
                <BookmarkButton
                  workId={work.id}
                  initialBookmarked={work.is_bookmarked_by_current_user}
                />
                <Share2Icon className="text-white rounded-sm hover:bg-muted"/>
              </div>
            </div>
          {/* <div className="text-label font-semibold mb-2"> タグ </div> */}
          <div className="text-label">{work.description}</div>
        </div>
        <div className="mb-40"></div>
      </div>
    </div>
  );
}
