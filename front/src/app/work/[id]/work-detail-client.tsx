// クライアントコンポーネント
'use client';

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { LikeButton } from "@/components/LikeButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCircle2Icon } from "lucide-react";
import { Work } from "@/types/work";
import { MaskData } from "@/types/mask";
import { deleteWork } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { PresetPreview } from "@/components/PresetPreview";
import { BackButton } from "@/components/BackButton";
import { CommentList } from "@/components/CommentList";
import { ShareButton } from "@/components/ShareButton";
import { useLoad } from "@/contexts/LoadingContext";

interface WorkDetailClientProps {
  initialData: Work;
}

export function WorkDetailClient({initialData}: WorkDetailClientProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { setIsLoadingOverlay } = useLoad();
  const [work, setWork] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 編集
  const handleEdit = (id: number) => {
    router.push(`/work/${id}/edit`);
  }

  // 削除
  const handleDelete = async (id: number) => {
    setIsLoadingOverlay(true);

    try {
      const response = await deleteWork(id);
      showAlert(response.message);
      router.push('/work');
    } catch (error) {
      console.error(error);
      showAlert('作品の削除に失敗しました');
    } finally {
      setIsLoadingOverlay(false);
    }
  }

  // コピーして編集
  const handleCopyMask = (maskData: MaskData) => {
    // マスクデータをlocalStorageに保存
    localStorage.setItem('copiedMaskData', JSON.stringify(maskData));
    showAlert('マスクをコピーしました。マスク作成画面に移ります。');
    // 少し遅延を入れてからページ遷移
    setTimeout(() => {
      router.push('/mask');
    }, 2000);
  };

  if (!work) {
    return <div className="flex min-h-[500px] justify-center items-center">
      <div className="text-white text-center font-semibold">
        作品が見つかりません...
      </div>
    </div>;
  }

  // 未公開作品のアクセス制限
  if ( work.is_public !== "published" && user?.id !== work.user.id) {
    return <div className="flex min-h-[500px] justify-center items-center">
      <div className="text-white text-center font-semibold">
        作品が見つかりません...
      </div>
    </div>;
  }

  return (
    <div className="mx-16 mt-12 mb-16">
      {/* 戻るボタン */}
      <div>
        <BackButton />
      </div>

      {/* 編集・削除ボタン */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
        </div>
        {user && work.user.id === user.id && (
          <div className="flex items-center gap-x-2">
            <Button
              variant="secondary"
              onClick={() => handleEdit(work.id)}
            >編集</Button>
            <Button
              variant="destructive"
              onClick={() => setIsDialogOpen(true)}
            >削除</Button>
          </div>
        )}
      </div>

      {/* 削除確認ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>作品削除の確認</DialogTitle>
            <DialogDescription className="text-label pt-2">一度削除すると元に戻すことができなくなります。<br />本当に削除しますか？</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
            >キャンセル</Button>
            <Button
              variant="secondary"
              onClick={() => handleDelete(work.id)}
            >はい</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols md:grid-cols-2 gap-8 mb-4">

          {/* イラスト投稿 */}
          <div className="flex flex-1 flex-col">
            <div className="flex w-full aspect-[3/4] items-center justify-center border rounded-sm">
              {work.illustration_image_url ? (
                <img
                  src={work.illustration_image_url}
                  alt={work.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500">画像なし</span>
              )}
            </div>
          </div>

          {/* 作品で使用したマスク */}
          <div className="flex flex-1 flex-col">
            <Label className="text-label font-semibold mb-2">作品で使用したマスク</Label>
            <PresetPreview
              maskData={work.set_mask_data}
              size={250}
            />
            <Button
              variant="secondary"
              className="mt-2"
              onClick={() => handleCopyMask(work.set_mask_data)}
            >
              コピーして編集
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-8">
          <Label className="text-label text-4xl font-semibold">
            {work.title}
          </Label>

          {/* いいね・ブックマーク・シェアボタン */}
          <div className="flex gap-4">
            <LikeButton
              workId={work.id}
              initialLiked={work.is_liked_by_current_user}
              initialLikesCount={work.likes_count}
            />
            <BookmarkButton
              workId={work.id}
              initialBookmarked={work.is_bookmarked_by_current_user}
            />
            <ShareButton
              workId={work.id}
              workTitle={work.title}
              userName={work.user.name}
            />
          </div>

          {/* ユーザー情報 */}
          <div className="items-center">
            <Link
                href={user?.id === work.user.id ? "/mypage" : `/users/${work.user.id}`}
                className="text-label underline-offset-4 hover:cursor-pointer hover:underline"
            >
              <div className="flex items-center">
                <Avatar className="w-10 h-10 mr-2 hover:cursor-pointer flex-shrink-0">
                  <AvatarImage src={work.user.avatar_url} />
                  <AvatarFallback className="bg-background">
                    <UserCircle2Icon className="w-full h-full"/>
                  </AvatarFallback>
                </Avatar>
                <p className="text-label text-xl mr-8 hover:cursor-pointer hover:underline truncate">
                  {work.user.name}
                </p>
              </div>
            </Link>
          </div>

          {/* タグ表示エリア */}
          {work.tags && work.tags.length > 0 && (
            <div className="mt-4">
              <Label className="text-label font-semibold mb-3 block">タグ</Label>
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/work?tag=${encodeURIComponent(tag.name)}`}
                    className="transition-transform hover:scale-105"
                  >
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 作品説明欄 */}
          <div className="text-label whitespace-pre-wrap">{work.description}</div>
        </div>

        {/* コメントセクション */}
        <div className="mt-20 pt-8">
          <CommentList
            workId={work.id}
            incrementStep={5}  // 段階的表示の増分数
          />
        </div>

        <div className="mb-40"></div>
      </div>
    </div>
  );
}
