'use client';

import { useState, useEffect } from "react";
import { Work } from "@/types/work";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  UserCircle2Icon,
  HeartIcon,
} from "lucide-react";

interface PublishedWorksProps {
  isActive: boolean;
  userId: number;
}

export function PublishedWorks({ isActive, userId }: PublishedWorksProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWorks = async () => {
    if (!isActive || !userId) return;

    setLoading(true);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      getWorks();
    }
  }, [isActive, userId]);

  if (!isActive) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
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
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">公開作品がありません</div>
      </div>
    );
  }

  return (
      <div className="px-8 pb-8 mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {works.map((work) => (
            <Link key={work.id} href={`/work/${work.id}`}>
              <div className="bg-background rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* 作品画像エリア */}
                <div className="aspect-video bg-background flex items-center justify-center">
                  {work.illustration_image_url ? (
                    <img
                      src={work.illustration_image_url}
                      alt={work.title}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-500">作品 {work.id}</span>
                  )}
                </div>

                {/* 作品情報エリア */}
                <div className="p-4 border-t">
                  <div className="grid gap-2">
                    <h3 className="text-card-foreground font-semibold text-xl">
                      {work.title.length > 23
                        ? `${work.title.slice(0, 23)}...`
                        : work.title
                      }
                    </h3>
                    <div className="flex items-center">
                      <Avatar className="w-5 h-5 mr-2 hover:cursor-pointer">
                        <AvatarImage src={work.user.avatar_url} />
                        <AvatarFallback className="bg-background">
                          <UserCircle2Icon className="w-full h-full"/>
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-gray-400 text-base font-normal">
                        {work.user.name.length > 14
                          ? `${work.user.name.slice(0, 14)}...`
                          : work.user.name
                        }
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">{work.created_at}</p>
                    <div className="flex gap-4 justify-end">
                      <HeartIcon className="text-error"/>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
  );
}
