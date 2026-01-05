'use client';

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';
import AlertContainer from '@/components/AlertContainer';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextStepProvider, NextStep } from 'nextstepjs';
import { Tour } from 'nextstepjs';
import { CustomCard } from '@/components/CustomCard';
import { useState } from 'react';
import { BsPersonArmsUp } from "react-icons/bs";
import { FaShapes } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";
import { IoIosSave } from "react-icons/io";
import { MdOutlineCollections } from "react-icons/md";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { useTranslations } from 'next-intl';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Tour');

  // ツアー内容
  const steps: Tour[] = [
    {
      tour: 'mainTour',
      steps: [
        {
          // FirstStep（step:0）
          icon: <><BsPersonArmsUp className="text-primary" /></>,
          title: t('step1_title'),
          content: <>{t('step1_content')}</>,
          showControls: true,
          showSkip: true,
        },
        {
          // 2ndStep（step:1）
          icon: <><FaShapes className="text-primary"/></>,
          title: t('step2_title'),
          content: <>{t('step2_content_1')}<br />{t('step2_content_2')}</>,
          selector: '#step-2',
          side: 'top',
          showControls: true,
          showSkip: true,
          pointerPadding: 10,
          pointerRadius: 10,
        },
        {
          // 3thStep（step:2）
          icon: <><HiDownload className="text-primary"/></>,
          title: t('step3_title'),
          content: <>{t('step3_content_1')}<br />{t('step3_content_2')}</>,
          selector: '#step-3',
          side: 'top',
          showControls: true,
          showSkip: true,
          pointerPadding: 10,
          pointerRadius: 10,
        },
        {
          // 4thStep（step:3）
          icon: <><IoIosSave className="text-primary"/></>,
          title: t('step4_title'),
          content: <>{t('step4_content_1')}<br /><span className="text-muted-foreground text-xs">{t('step4_note')}</span></>,
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
          title: t('step5_title'),
          content: <>{t('step5_content_1')}<br /><span className="text-muted-foreground text-xs">{t('step5_note')}</span></>,
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
          title: t('step6_title'),
          content: <>{t('step6_content_1')}<br />{t('step6_content_2')}</>,
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
    <LoadingProvider>
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
                        <SidebarTrigger className="fixed left-4 top-20 z-50 border border-md md:hidden"/>
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
    </LoadingProvider>
  );
}