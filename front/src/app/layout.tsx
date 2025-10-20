'use client';

// import type { Metadata } from 'next'
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';
import AlertContainer from '@/components/AlertContainer';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextStepProvider, NextStep } from 'nextstepjs';
import { Tour } from 'nextstepjs';
import { CustomCard } from '@/components/CustomCard';
import { useState } from 'react';
import { BsPersonArmsUp } from "react-icons/bs";
import { MdOutlineCollections } from "react-icons/md";
import { HiOutlineRocketLaunch } from "react-icons/hi2";

// export const metadata: Metadata = {
//   title: 'GamutCut - ガマットマスク制作サイト',
//   description: '着彩に悩むイラストレーターへ',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ツアー内容
  const steps: Tour[] = [
    {
      tour: 'mainTour',
      steps: [
        {
          // FirstStep（step:0）
          icon: <><BsPersonArmsUp className="text-primary" /></>,
          title: 'GamutCutへようこそ',
          content: <>ここではガマットマスクを作成できます。</>,
          showControls: true,
          showSkip: true,
        },
        {
          // 2ndStep（step:1）
          icon: <><MdOutlineCollections className="text-primary"/></>,
          title: 'マスク作成',
          content: <>色相環上にマスクを設置します。（最大３つまで）<br />サイズや形状を調整できます。</>,
          selector: '#step-2',
          side: 'top',
          showControls: true,
          showSkip: true,
          pointerPadding: 10,
          pointerRadius: 10,
        },
        {
          // 3thStep（step:2）
          icon: <><MdOutlineCollections className="text-primary"/></>,
          title: 'ダウンロード',
          content: <>作成したマスクはpng画像としてダウンロードできます。お使いのペイントソフトのスポイトツールで色を抽出するなどして、着彩にご利用ください。</>,
          selector: '#step-3',
          side: 'top',
          showControls: true,
          showSkip: true,
          pointerPadding: 10,
          pointerRadius: 10,
        },
        {
          // 4thStep（step:3）
          icon: <><MdOutlineCollections className="text-primary"/></>,
          title: 'マスクの保存',
          content: <>作成したマスクは名前をつけて保存することができます。<br /><span className="text-muted-foreground text-xs">※ご利用にはログインが必要です</span></>,
          selector: '#step-4',
          side: 'top',
          showControls: true,
          showSkip: true,
          pointerPadding: 10,
          pointerRadius: 10,
        },
        {
          // 5thStep（step:4）
          icon: <><MdOutlineCollections className="text-primary"/></>,
          title: 'Myマスク一覧',
          content: <>保存したマスクはここに表示されます。<br /><span className="text-muted-foreground text-xs">※ご利用にはログインが必要です</span></>,
          selector: '#step-5',
          side: 'top',
          showControls: true,
          showSkip: true,
          pointerPadding: 10,
          pointerRadius: 10,
        },
        {
          // LastStep（step:5）
          icon: <><HiOutlineRocketLaunch className="text-primary"/></>,
          title: 'はじめてみましょう！',
          content: <>GamutCutの基本的な使い方は以上です。<br />素敵なマスクを作成してみてください！</>,
          showControls: true,
          showSkip: true,
          pointerPadding: 0,
          pointerRadius: 10,
        },
      ],
    },
  ];

  // ツアーのstep数（0ベースのインデックス）
  const [currentStep, setCurrentStep] = useState(0);

  // 現在のstep
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  }

  // 最後のstep（ステップ数nの場合、LastStepは（n-1）番目のインデックス）
  const isLastStep = currentStep === 5;

  return (
    <html lang="ja">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="min-h-screen bg-background">
        <AuthProvider>
          <AlertProvider>
            <TooltipProvider>
              <NextStepProvider>
                <NextStep
                  steps={steps}
                  showNextStep={true}
                  shadowRgb={isLastStep ? "0,0,0" : "200,200,200"}
                  shadowOpacity={isLastStep ? "0.5" : "0.4"}
                  cardComponent={CustomCard}
                  cardTransition={{ duration: 0.3, type: 'spring' }}
                  onStepChange={handleStepChange}
                  // onStepChange={(step, tourName) => console.log(`ステップ ${step} に移動 (ツアー: ${tourName})`)}
                  // onComplete={(tourName) => console.log(`ツアー完了: ${tourName}`)}
                  // onSkip={(step, tourName) => console.log(`ツアースキップ: ステップ ${step} (ツアー: ${tourName})`)}
                  clickThroughOverlay={false}
                  scrollToTop={false}
                  noInViewScroll={true}
                >
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
                </NextStep>
              </NextStepProvider>
            </TooltipProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  )
}