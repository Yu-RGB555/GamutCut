'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2Icon } from "lucide-react";
import XLogo from "./XLogo";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const tabs = [
  { id: 1, label: "公開作品", href: "/mypage" },
  { id: 2, label: "下書き", href: "/mypage/drafts" },
  { id: 3, label: "いいね", href: "/mypage/likes" },
  { id: 4, label: "ブックマーク", href: "/mypage/bookmarks" }
];

interface MyPageLayoutProps {
  children: React.ReactNode;
}

export function MyPageLayout({ children }: MyPageLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isAuthenticated } = useAuthRedirect();

  // パスからアクティブなタブを判定
  const getActiveIndex = () => {
    switch (pathname) {
      case '/mypage': return 0;
      case '/mypage/drafts': return 1;
      case '/mypage/likes': return 2;
      case '/mypage/bookmarks': return 3;
      default: return 0;
    }
  };

  const activeIndex = getActiveIndex();

  if(!user) {
    // 未ログイン
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring"></div>
      </div>
    );
  }

  return (
    // ログインユーザー
    <div className="px-12">
      <div className="grid grid-cols-1 gap-8">
        <div className="grid justify-items-center align-items-center gap-8">

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
              </div>
              <div>
                <h2>{user.bio}</h2>
              </div>
              { user.x_account_url &&
                <XLogo
                  url={user.x_account_url}
                />
              }
            </div>
          </div>
          <Button>
            <Link href='/mypage/profiles'>
              設定
            </Link>
          </Button>
        </div>

        {/* タブナビゲーション */}
        <div className="relative w-full border-b border-gray-200">
          <nav className="flex gap-6 justify-center">
            {tabs.map((tab, idx) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative py-2 px-4 font-semibold transition-none hover:cursor-pointer
                  ${idx === activeIndex ? "text-primary" : "text-gray-500"}
                `}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          {/* アンダーライン */}
          <div
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 rounded"
            style={{
              width: `calc(100% / ${tabs.length})`,
              left: `calc(${activeIndex} * (100% / ${tabs.length}))`,
            }}
          />
        </div>

        {/* タブの内容 */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
