import type { Metadata } from 'next'
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'GamutCut - ガマットマスク制作サイト',
  description: '着彩に悩むイラストレーターへ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body  className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
            <main className="flex-1 flex items-center justify-center py-20 px-4">
              {children}
            </main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  )
}