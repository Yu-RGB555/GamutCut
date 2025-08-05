'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Image, PenToolIcon, UserCircle2 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  return (
    <header className="bg-background shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <Avatar>
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-background">
                    <UserCircle2 className="w-full h-full" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                >
                  ログアウト
                </Button>
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