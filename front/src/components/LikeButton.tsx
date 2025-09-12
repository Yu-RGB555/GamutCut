import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HeartIcon } from "lucide-react";
import { toggleLike } from "@/lib/api";

interface LikeButtonProps {
  workId: number;
  initialLiked?: boolean;
  initialLikesCount?: number;
}

export function LikeButton({ workId, initialLiked = false, initialLikesCount = 0 }: LikeButtonProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);

  // いいね状態を切り替える関数
  const handleLikeToggle = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const data = await toggleLike(workId, isLiked);
      setIsLiked(data.liked);
      setLikesCount(data.likes_count);
    } catch (error) {
      console.error('いいね処理エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={!user || isLoading}
      className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
        !user
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-100 cursor-pointer'
      }`}
    >
      <HeartIcon
        className={`w-5 h-5 ${
          isLiked
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-400'
        }`}
      />
      <span className="text-sm text-gray-600">{likesCount}</span>
    </button>
  );
}