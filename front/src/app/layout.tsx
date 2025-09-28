import type { Metadata } from 'next'
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';
import AlertContainer from '@/components/AlertContainer';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: 'GamutCut - ガマットマスク制作サイト',
  description: '着彩に悩むイラストレーターへ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-background">
        <AuthProvider>
          <AlertProvider>
            <SidebarProvider>
              <div className="flex min-h-screen min-w-screen">
                {/* サイドバー */}
                <AppSidebar />

                {/* メインコンテンツエリア */}
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 pt-16">
                    <SidebarTrigger  className="fixed left-4 top-20 z-50 border border-md md:hidden"/>
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
              <AlertContainer />
            </SidebarProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  )
}