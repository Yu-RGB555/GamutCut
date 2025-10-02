'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CommentItem } from "@/components/CommentItem";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2Icon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  work: {
    id: number;
    title: string;
    illustration_image_url?: string;
    user: {
      id: number;
      name: string;
      avatar_url?: string;
    };
  };
}

// 通知からの遷移用
export default function CommentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const commentId = params?.id as string;
  const [comment, setComment] = useState<Comment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!commentId) return;

    const fetchComment = async () => {
      try {
        // TODO: 実際のAPIエンドポイントに置き換える
        const response = await fetch(`/api/v1/comments/${commentId}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const commentData = await response.json();
          setComment(commentData);
        } else {
          throw new Error('コメントの取得に失敗しました');
        }
      } catch (error) {
        console.error("Failed to fetch comment:", error);
        showAlert("コメントの取得に失敗しました");
        router.push('/work');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComment();
  }, [commentId, router, showAlert]);

  const handleEdit = (commentId: number) => {
    // TODO: 編集機能の実装
    showAlert("編集機能は現在開発中です");
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("このコメントを削除しますか？")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/works/${comment?.work.id}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showAlert("コメントを削除しました");
        router.push(`/work/${comment?.work.id}`);
      } else {
        const errorData = await response.json();
        showAlert(errorData.message || "コメントの削除に失敗しました");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      showAlert("コメントの削除に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] justify-center items-center">
        <div className="text-center font-semibold">
          読み込み中...
        </div>
      </div>
    );
  }

  if (!comment) {
    return (
      <div className="flex min-h-[500px] justify-center items-center">
        <div className="text-center font-semibold">
          コメントが見つかりません...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-16 mt-12 mb-16">
      {/* 戻るボタン */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* 作品情報 */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border rounded-sm overflow-hidden flex-shrink-0">
            {comment.work.illustration_image_url ? (
              <img
                src={comment.work.illustration_image_url}
                alt={comment.work.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">画像なし</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/work/${comment.work.id}`}>
              <Label className="text-xl font-semibold hover:underline cursor-pointer">
                {comment.work.title}
              </Label>
            </Link>

            <Link
              href={`/users/${comment.work.user.id}`}
              className="flex items-center gap-2 mt-1 hover:underline"
            >
              <Avatar className="w-5 h-5">
                <AvatarImage src={comment.work.user.avatar_url} />
                <AvatarFallback className="bg-background">
                  <UserCircle2Icon className="w-full h-full" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {comment.work.user.name}
              </span>
            </Link>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/work/${comment.work.id}`}>
                作品を見る
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* コメント詳細 */}
      <div className="border rounded-lg">
        <div className="p-4 bg-muted/30 border-b">
          <h2 className="text-lg font-semibold">コメント詳細</h2>
        </div>
        <CommentItem
          comment={comment}
          currentUserId={user?.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      </div>
    </div>
  );
}