'use client'

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, UserX } from 'lucide-react';
import { MdArrowForwardIos } from "react-icons/md";

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Card>
        <CardHeader className="mb-2">
          <CardTitle className="text-3xl font-bold text-label">
            設定
          </CardTitle>
          <CardDescription className="text-label">
            アカウント設定を管理できます<br />
          </CardDescription>
        </CardHeader>

        {/* 各種設定項目 */}
        <CardContent className="px-0">
          <div className="grid md:grid-cols-1">
            {/* メールアドレス変更 */}
            <Card className="hover:shadow-md transition-shadow">
              <Link href="/settings/email">
                <CardHeader className="py-2 rounded-lg hover:bg-white/10">
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
                    <MdArrowForwardIos />
                  </div>
                </CardHeader>
              </Link>
            </Card>

            {/* パスワード変更 */}
            <Card className="hover:shadow-md transition-shadow">
              <Link href="/settings/password">
                <CardHeader className="py-2 rounded-lg hover:bg-white/10">
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
                      <MdArrowForwardIos />
                  </div>
                </CardHeader>
              </Link>
            </Card>

            {/* 退会 */}
            <Card className="hover:shadow-md transition-shadow border-red-200">
              <Link href="/settings/delete-account">
                <CardHeader className="py-2 rounded-lg hover:bg-white/10">
                  <div className="flex items-center justify-between">
                  {/* <div className="flex items-center justify-between"> */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <UserX className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-red-700">アカウント削除</CardTitle>
                        <CardDescription className="text-red-700">
                          アカウントを完全に削除します（復元不可）
                        </CardDescription>
                      </div>
                    </div>
                    <MdArrowForwardIos className="text-red-700" />
                  </div>
                </CardHeader>
              </Link>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
