'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2Icon } from "lucide-react";
import XLogo from "./XLogo";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { motion } from "motion/react";

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
  const router = useRouter();
  const { user } = useAuth();
  const { isAuthenticated, isLoading } = useAuthRedirect();

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

  // 認証状態の初期化中またはユーザー情報がない場合はローディング表示
  if(isLoading || !user) {
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
          <Button
            variant="secondary"
            onClick={() => router.push('/mypage/profiles')}
          >
            設定
          </Button>
        </div>

        {/* タブナビゲーション */}
        <div className="w-full max-w-screen mx-auto">
          <nav className="flex gap-4 lg:gap-6 justify-center border-b border-gray-600">
            {tabs.map((tab, idx) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative text-sm sm:text-base font-semibold py-2 px-3 md:py-3 lg:px-4 transition-colors duration-200 hover:cursor-pointer hover:text-primary/80
                  ${idx === activeIndex ? "text-primary" : "text-gray-500"}
                `}
              >
                {tab.label}
                {/* 個別タブのアンダーライン */}
                {idx === activeIndex && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    layoutId="activeTab"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* タブの内容 */}
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
