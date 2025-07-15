import type { Metadata } from 'next'
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const metadata: Metadata = {
  title: 'GamutCut - ガマットマスク制作サイト',
  description: '着彩に悩むイラストレーターへ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body  className="min-h-screen flex flex-col">
        <Header />
          <main className="flex-1 flex items-center justify-center py-20 px-4">
            {children}
          </main>
        <Footer />
      </body>
    </html>
  )
}