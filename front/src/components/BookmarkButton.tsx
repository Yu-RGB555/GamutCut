import React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BookmarkIcon} from "lucide-react";
import { toggleBookmark} from "@/lib/api";
import { useLoad } from "@/contexts/LoadingContext";

interface BookmarkButtonProps {
  workId: number;
  initialBookmarked?: boolean;
}

export function BookmarkButton({ workId, initialBookmarked = false }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  // ブックマーク状態を切り替える関数
  const handleBookmarkToggle = async () => {
    if (!user) return;

    try {
      const data = await toggleBookmark(workId, isBookmarked);
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('ブックマーク処理エラー:', error);
    }
  };

  return (
    <button
      onClick={handleBookmarkToggle}
      disabled={!user}
      className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
        !user
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:cursor-pointer'
      }`}
    >
      <BookmarkIcon
        className={`w-5 h-5 ${
          isBookmarked
            ? 'fill-primary text-primary'
            : 'text-gray-400 hover:text-primary'
        }`}
      />
    </button>
  );
}