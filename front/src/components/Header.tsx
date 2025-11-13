'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useRouter } from 'next/navigation';
import {
  UserCircle2,
  LogOutIcon,
  HeartIcon,
  BookmarkIcon,
  Edit2Icon,
  HelpCircleIcon
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

// ユーザーメニュー項目の定義
const userMenuItems = [
  {
    title: "下書き",
    url: "/mypage/drafts",
    icon: Edit2Icon,
  },
  {
    title: "いいね一覧",
    url: "/mypage/likes",
    icon: HeartIcon,
  },
  {
    title: "ブックマーク一覧",
    url: "/mypage/bookmarks",
    icon: BookmarkIcon,
  },
];

export function Header() {
  const { logout } = useAuth();
  const { isAuthenticated, isLoading, user } = useAuthState();
  const router = useRouter();
  const [showBorder, setShowBorder] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false);
    router.push('/');
  }

  const handleLinkClick = (href: string) => {
    setIsSheetOpen(false);
    router.push(href);
  }

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // ボーダーの表示制御
      setShowBorder(currentScrollY > 100);

      // ヘッダーの表示制御
      if (currentScrollY <= 500) {
        setIsVisible(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 bg-background shadow-sm transition-all duration-300 ease-in-out
        ${showBorder ? "border-b" : ""}
        ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ・サイト名 */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground flex items-center">
              <Image
                src='/app_logo.svg'
                alt="GamutCut"
                width={100}
                height={20}
                sizes="100px"
                className="w-1/2 h-auto"
              />
            </Link>
          </div>

          {/* 認証・ユーザーメニューのみ */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              // ローディング中は何も表示しない（またはスケルトン表示）
              <div className="w-20 h-9"></div>
            ) : isAuthenticated ? (
              <>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger>
                    <Avatar className="w-10 h-10 hover:cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-background">
                        <UserCircle2 className="w-full h-full" />
                      </AvatarFallback>
                    </Avatar>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col bg-card border-none w-80">
                    <SheetHeader className="mt-4 border-b">
                      <SheetTitle className="w-65">
                        <button
                          onClick={() => handleLinkClick('/mypage')}
                          className="flex items-center p-3 w-full text-left rounded-sm hover:bg-muted hover:cursor-pointer transition-colors"
                        >
                          <Avatar className="mr-3 w-12 h-12">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback className="bg-background">
                              <UserCircle2 className="w-full h-full" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-label font-semibold truncate">
                              {user?.name && user.name.length > 14
                                ? `${user.name.slice(0, 14)}...`
                                : user?.name
                              }
                            </p>
                            <SheetDescription>マイページ</SheetDescription>
                          </div>
                        </button>
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 px-8 py-4">
                      <ul className="space-y-2">
                        {userMenuItems.map((item) => (
                          <li key={item.title}>
                            <button
                              onClick={() => handleLinkClick(item.url)}
                              className="flex items-center w-full p-3 rounded-lg hover:bg-muted hover:cursor-pointer transition-colors text-left"
                            >
                              <item.icon className="w-6 h-6 mr-3" />
                              <span className="text-xl font-medium">{item.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <SheetFooter className="px-8 p-6 border-t">
                      <Button
                        variant="plain"
                        onClick={handleLogout}
                        className="w-full justify-center p-4 text-destructive"
                      >
                        <LogOutIcon className="w-6 h-6 mr-3" />
                        <span className="text-lg font-medium">ログアウト</span>
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                >
                  ログイン
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/auth/register')}
                >
                  新規登録
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}