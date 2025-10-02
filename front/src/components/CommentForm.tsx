'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { createComment } from "@/lib/api";

interface CommentFormProps {
  workId: number;
  onCommentCreated: () => void;
}

// コメント投稿フォーム
export function CommentForm({ workId, onCommentCreated }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showAlert("コメントを投稿するにはログインが必要です");
      return;
    }

    if (!content.trim()) {
      showAlert("コメント内容を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment(workId, { content: content.trim() });
      setContent("");
      onCommentCreated();
      showAlert(result.message);
    } catch (error) {
      console.error("コメント投稿エラー:", error);
      showAlert(error instanceof Error ? error.message : "コメントの投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = () => {
    setContent("");
  };

  if (!user) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          コメントを投稿するにはログインが必要です
        </p>
        <Button variant="outline" size="sm" asChild>
          <a href="/auth/login">ログイン</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを入力"
        className="text-white border-none min-h-[100px] resize-none"
        maxLength={1000}
        disabled={isSubmitting}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {content.length}/1000
        </span>
        <div className="flex items-center gap-2">
          {content && (
            <Button
              variant="ghost"
              onClick={handleDeleteContent}
              size="sm"
              className="border"
            >
              キャンセル
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            size="sm"
          >
            {isSubmitting ? "投稿中..." : "投稿"}
          </Button>
        </div>
      </div>
    </form>
  );
}