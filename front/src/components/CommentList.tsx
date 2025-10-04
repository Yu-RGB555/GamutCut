'use client';

import { useState, useEffect } from "react";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { getComments, deleteComment } from "@/lib/api";
import { Comment } from "@/types/comment";

interface CommentListProps {
  workId: number;
  isPreview?: boolean;
  previewLimit?: number;
  incrementStep?: number; // 段階的表示の増分
}

export function CommentList({
  workId,
  isPreview = false,
  previewLimit = 3,
  incrementStep = 3
}: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(previewLimit); // 表示するコメント数
  const { user } = useAuth();
  const { showAlert } = useAlert();

  // 投稿済みコメントの取得
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(workId);
      setComments(data);
      setError(null);
      // 新しいコメントが投稿された場合、表示カウントを調整
      if (data.length > displayCount) {
        setDisplayCount(Math.max(previewLimit, displayCount));
      }
    } catch (error) {
      setError("コメントの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [workId]);



  // コメント削除
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("このコメントを削除しますか？")) {
      return;
    }

    try {
      const result = await deleteComment(workId, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      showAlert(result.message);
    } catch (error) {
      console.error("コメント削除に失敗:", error);
      showAlert(error instanceof Error ? error.message : "コメントの削除に失敗しました");
    }
  };

  // プレビューモードまたは段階的表示での表示コメント数を決定
  const currentDisplayCount = isPreview ? previewLimit : displayCount;  // 表示するコメント数
  const displayComments = comments.slice(0, currentDisplayCount);       // 表示中のコメント
  const hasMoreComments = comments.length > currentDisplayCount;        // 非表示のコメント

  // 「他のコメントを見る」ボタンのハンドラ
  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + incrementStep, comments.length));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 p-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // コメント一覧の取得失敗時
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={fetchComments}>
          再試行
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          コメント（{comments.length}）
        </h3>

      </div>

      {!isPreview && (
        <div className="mb-6">
          <CommentForm workId={workId} onCommentCreated={fetchComments} />
        </div>
      )}

      {displayComments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {isPreview ? "まだコメントがありません" : "最初のコメントを投稿してみましょう！"}
        </div>
      ) : (
        // <div className="border rounded-lg divide-y divide-border">
        <div className="grid gap-2">
          {displayComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              workId={workId}
              currentUserId={user?.id}
              onCommentUpdated={fetchComments}
              onDelete={handleDeleteComment}
              showActions={!isPreview}
            />
          ))}
        </div>
      )}

      {/* 「他のコメントを見る」ボタン */}
      {hasMoreComments && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={handleShowMore}
            className="font-semibold min-w-[200px]"
          >
            他 {comments.length - currentDisplayCount} 件のコメントを見る
            {/* <span className="ml-2 text-xs text-muted-foreground">
              (+{Math.min(incrementStep, comments.length - currentDisplayCount)}件表示)
            </span> */}
          </Button>
        </div>
      )}

    </div>
  );
}