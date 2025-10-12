'use client'

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Lock, UserX, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-label mb-2">設定</h1>
        <p className="text-muted-foreground">アカウント設定を管理できます</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {/* メールアドレス変更 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">メールアドレス変更</CardTitle>
                  <CardDescription>
                    登録されているメールアドレスを変更できます
                  </CardDescription>
                </div>
              </div>
              <Link href="/settings/email">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* パスワード変更 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">パスワード変更</CardTitle>
                  <CardDescription>
                    アカウントのパスワードを変更できます
                  </CardDescription>
                </div>
              </div>
              <Link href="/settings/password">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* 退会 */}
        <Card className="hover:shadow-md transition-shadow border-red-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <UserX className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-red-700">アカウント削除</CardTitle>
                  <CardDescription className="text-red-600">
                    アカウントを完全に削除します（復元不可）
                  </CardDescription>
                </div>
              </div>
              <Link href="/settings/delete-account">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* 戻るボタン */}
      <div className="flex justify-end mt-8 mr-8">
        <Link href="/mypage">
          <Button variant="outline" className="w-full sm:w-auto">
            マイページに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
