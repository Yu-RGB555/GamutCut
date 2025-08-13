import type { Metadata } from 'next'
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';
import AlertContainer from '@/components/AlertContainer';

export const metadata: Metadata = {
  title: 'GamutCut - ガマットマスク制作サイト',
  description: '着彩に悩むイラストレーターへ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <AlertProvider>
            <Header />
              <main className="mt-24 min-h-[1000px]">
                {children}
              </main>
            <AlertContainer />
          </AlertProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  )
}