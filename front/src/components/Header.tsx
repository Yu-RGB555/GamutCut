'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Image,
  PenToolIcon,
  UserCircle2,
  LogOutIcon,
  BookmarkIcon,
  Edit2Icon,
  InfoIcon
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

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showBorder, setShowBorder] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleLogout = () => {
    logout();
    router.push('/');
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
      className={`fixed top-0 left-0 right-0 z-50 bg-background shadow-sm transition-all duration-300 ease-in-out
        ${showBorder ? "border-b" : ""}
        ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ・サイト名 */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              GamutCut
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className="flex space-x-2 md:space-x-8">
            <Link href="/work" className="text-foreground hover:text-mouseover font-semibold">
              <div className="flex items-center">
                <Image className="w-5 h-5 mr-1" />
                <span>作品一覧</span>
              </div>
            </Link>
            <Link href="/work/new" className="text-foreground hover:text-mouseover font-semibold">
              <div className="flex items-center">
                <PenToolIcon className="w-5 h-5 mr-1" />
                <span>作品投稿</span>
              </div>
            </Link>
          </nav>

          {/* 認証ボタン */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Sheet>
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
                      <SheetTitle className="w-65 rounded-sm hover:bg-muted transition-colors">
                        <Link
                          href="/mypage"
                          className="flex items-center p-3"
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
                            <p className="text-sm text-muted-foreground">マイページ</p>
                          </div>
                        </Link>
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 px-8 py-4">
                      <ul className="space-y-2">
                        <li>
                          <Link href="#" className="flex items-center w-full p-3 rounded-lg hover:bg-muted transition-colors">
                            <Edit2Icon className="w-6 h-6 mr-3" />
                            <span className="text-xl font-medium">下書き</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="flex items-center w-full p-3 rounded-lg hover:bg-muted transition-colors">
                            <BookmarkIcon className="w-6 h-6 mr-3" />
                            <span className="text-xl font-medium">ブックマーク</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#" className="flex items-center w-full p-3 rounded-lg hover:bg-muted transition-colors">
                            <InfoIcon className="w-6 h-6 mr-3" />
                            <span className="text-xl font-medium">使い方</span>
                          </Link>
                        </li>
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
                <Button variant="outline" size="sm">
                  <Link href="/auth/login">
                    ログイン
                  </Link>
                </Button>
                <Button size="sm">
                  <Link href="/auth/register">
                    新規登録
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}