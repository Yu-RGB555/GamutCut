'use client';

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCircle2Icon, CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Comment } from "@/types/comment";
import { updateComment } from "@/lib/api";
import { useAlert } from "@/contexts/AlertContext";
import { Textarea } from "./ui/textarea";

interface CommentItemProps {
  comment: Comment;
  workId: number;
  currentUserId?: number;
  onCommentUpdated?: () => void;
  onDelete?: (commentId: number) => void;
  showActions?: boolean;
}

// 単一コメント表示用
export function CommentItem({
  comment,
  workId,
  currentUserId,
  onCommentUpdated,
  onDelete,
  showActions = true
}: CommentItemProps) {
  const { showAlert } = useAlert();
  const isOwner = currentUserId === comment.user.id;

  // 編集状態を管理
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isComposing, setIsComposing] = useState(false); // IME変換中フラグ
  const [isUpdating, setIsUpdating] = useState(false); // 更新処理中フラグ

  // 投稿日時
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ja
    });
  };

  // 編集開始
  const startEditing = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  // コメント更新保存
  const saveComment = async () => {
    const trimmedContent = editedContent.trim();
    if (trimmedContent === '') {
      showAlert('コメントを入力してください');
      return;
    }

    if (trimmedContent === comment.content) {
      // 変更がない場合は編集モードを終了するだけ
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      const response = await updateComment(workId, comment.id, { content: trimmedContent });
      showAlert(response.message);
      setIsEditing(false);
      // 親コンポーネントのコメント一覧を更新
      if (onCommentUpdated) {
        onCommentUpdated(); // fetchComments()
      }
    } catch (error) {
      console.error('コメント更新エラー:', error);
      showAlert(error instanceof Error ? error.message : 'コメントの更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  // Enterキーで保存（Shift+Enterで改行）
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      saveComment();
    } else if (e.key === 'Escape') {
      cancelEditing();
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

  return (
    <div className="flex gap-3 p-4">
      <Link href={`/users/${comment.user.id}`}>
        <Avatar className="w-10 h-10 hover:opacity-80 transition-opacity">
          <AvatarImage src={comment.user.avatar_url} />
          <AvatarFallback className="bg-background">
            <UserCircle2Icon className="w-full h-full" strokeWidth={1} />
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/users/${comment.user.id}`}
              className="text-label underline-offset-4 font-semibold text-sm hover:underline"
            >
              <span className="text-label">{comment.user.name}</span>
            </Link>
            <span className="text-xs text-muted-foreground">
              ・{formatDate(comment.created_at)}
              {comment.created_at !== comment.updated_at && (
                <span className="ml-1 text-xs text-muted-foreground">（編集済み）</span>
              )}
            </span>
          </div>

          {showActions && isOwner && !isEditing && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={startEditing}
              >
                編集
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete?.(comment.id)}
              >
                削除
              </Button>
            </div>
          )}
        </div>

        {/* コメント内容 */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              className="w-full p-2 text-sm rounded-md resize-none bg-background text-label focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
              maxLength={500}
              disabled={isUpdating}
              autoFocus
              placeholder="コメントを入力してください"
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{editedContent.length}/500</span>
              {/* 編集モード時のアクションボタン */}
                {isEditing && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1"
                      onClick={saveComment}
                      disabled={isUpdating}
                    >
                      <CheckIcon className="w-3 h-3 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1"
                      onClick={cancelEditing}
                      disabled={isUpdating}
                    >
                      <XIcon className="w-3 h-3 text-gray-400" />
                    </Button>
                  </div>
                )}
            </div>
          </div>
        ) : (
          <p className="text-label text-sm whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}