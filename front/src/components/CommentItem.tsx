'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCircle2Icon } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Comment } from "@/types/comment";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  onEdit?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  showActions?: boolean;
}

// 単一コメント表示用
export function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  showActions = true
}: CommentItemProps) {
  const isOwner = currentUserId === comment.user.id;

  // 投稿日時
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ja
    });
  };

  return (
    <div className="flex gap-3 p-4">
      <Link href={`/users/${comment.user.id}`}>
        <Avatar className="w-10 h-10 hover:opacity-80 transition-opacity">
          <AvatarImage src={comment.user.avatar_url} />
          <AvatarFallback className="bg-background">
            <UserCircle2Icon className="w-full h-full" />
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
            <span className="text-muted-foreground">・</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.created_at)}
            </span>
          </div>

          {showActions && isOwner && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onEdit?.(comment.id)}
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

        <p className="text-label text-sm whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}