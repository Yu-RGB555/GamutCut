'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Work } from "@/types/work";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LikeButton } from "@/components/LikeButton";
import { BookmarkButton } from "./BookmarkButton";
import { UserCircle2Icon } from "lucide-react";
import { useLoad } from "@/contexts/LoadingContext";

interface PublishedWorksProps {
  isActive: boolean;
  userId: number;
}

export function PublishedWorks({ isActive, userId }: PublishedWorksProps) {
  const { user } = useAuth();
  const { setIsLoadingOverlay } = useLoad();
  const [works, setWorks] = useState<Work[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getWorks = async () => {
    if (!isActive || !userId) return;

    setIsLoadingOverlay(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/works?is_public=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('作品の取得に失敗しました');
      }

      const data = await response.json();
      setWorks(data.works || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoadingOverlay(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      getWorks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, userId]);

  if (!isActive) {
    return null;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="flex justify-center min-h-50 items-center py-8">
        <div className="text-gray-500">公開作品がありません</div>
      </div>
    );
  }

  return (
      <div className="px-8 pb-8 mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-none mx-auto">
          {works.map((work) => (
            <div key={work.id} className="flex flex-col bg-background rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* 作品画像エリア - 作品詳細へのリンク */}
              <Link href={`/work/${work.id}`}>
                <div className="flex aspect-[3/4] bg-background items-center justify-center">
                  {work.illustration_image_url ? (
                    <img
                      src={work.illustration_image_url}
                      alt={work.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-500">作品 {work.id}</span>
                  )}
                </div>
              </Link>

              {/* 作品情報エリア */}
              <div className="flex-1 flex flex-col p-3 lg:p-4 border-t">
                <div className="flex-1">
                  {/* 作品タイトル - 作品詳細へのリンク */}
                  <Link href={`/work/${work.id}`}>
                    <h3 className="text-card-foreground font-semibold text-xl hover:underline line-clamp-1 my-2">
                      {work.title}
                    </h3>
                  </Link>

                  {/* ユーザー情報 - ユーザープロフィールへのリンク */}
                  <Link
                    href={user?.id === work.user.id ? "/mypage" : `/users/${work.user.id}`}
                    className="text-label underline-offset-4 hover:cursor-pointer hover:underline"
                  >
                    <div className="flex items-center">
                      <Avatar className="w-8 h-8 lg:w-6 lg:h-6 mr-2 flex-shrink-0">
                        <AvatarImage src={work.user.avatar_url} />
                        <AvatarFallback className="bg-background">
                          <UserCircle2Icon className="w-full h-full"/>
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-gray-400 text-base font-normal truncate">
                        {work.user.name}
                      </p>
                    </div>
                  </Link>
                  <p className="text-gray-400 text-sm lg:text-xs mt-2">{work.created_at}</p>
                </div>

                {/* ボタン */}
                <div className="flex gap-2 lg:gap-4 justify-end mt-3 pt-2">
                  <LikeButton
                    workId={work.id}
                    initialLiked={work.is_liked_by_current_user}
                    initialLikesCount={work.likes_count}
                  />
                  <BookmarkButton
                    workId={work.id}
                    initialBookmarked={work.is_bookmarked_by_current_user}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
