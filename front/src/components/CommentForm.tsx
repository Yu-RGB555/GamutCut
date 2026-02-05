'use client';

import { useState } from "react";
import { useRouter } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { createComment } from "@/lib/api";
import { useTranslations } from "next-intl";

interface CommentFormProps {
  workId: number;
  onCommentCreated: () => void;
}

// コメント投稿フォーム
export function CommentForm({ workId, onCommentCreated }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const t = useTranslations('Comment');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showAlert(t('login_required'));
      return;
    }

    if (!content.trim()) {
      showAlert(t('enter_content'));
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
      showAlert(error instanceof Error ? error.message : t('fetch_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = () => {
    setContent("");
  };

  if (!user) {
    return (
      <div className="p-4 border rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {t('login_required')}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            // localStorageにパスを保存してログイン画面へ遷移
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            router.push('/auth/login');
          }}
        >
          {t('login')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('placeholder')}
        className="text-white min-h-[100px] resize-none"
        maxLength={500}
        disabled={isSubmitting}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {content.length}/500
        </span>
        <div className="flex items-center gap-2">
          {content && (
            <Button
              variant="ghost"
              onClick={handleDeleteContent}
              size="sm"
              className="border"
            >
              {t('cancel')}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            size="sm"
          >
            {isSubmitting ? t('posting') : t('post')}
          </Button>
        </div>
      </div>
    </form>
  );
}