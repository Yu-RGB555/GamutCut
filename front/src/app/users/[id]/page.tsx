'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { User } from "@/types/auth";
import { PublishedWorks } from "@/components/PublishedWorks";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2Icon } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);

        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error || 'ユーザーが見つかりません'}</div>
      </div>
    );
  }

  return (
    <div className="px-12">
      <div className="grid grid-cols-1 gap-8">
        {/* ユーザープロフィール */}
        <div className="grid justify-items-center align-items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-background">
                <UserCircle2Icon className="w-full h-full"/>
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-label">{user.name}</h1>
              <p className="text-gray-500">ID: {user.id}</p>
            </div>
          </div>
        </div>

        {/* 公開作品一覧 */}
        <div>
          <h2 className="text-xl font-semibold text-label mb-6 text-center">公開作品</h2>
          <PublishedWorks
            isActive={true}
            userId={parseInt(userId)}
          />
        </div>
      </div>
    </div>
  );
}
