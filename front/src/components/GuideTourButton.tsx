'use client';

import Image from 'next/image';
import { useNextStep } from 'nextstepjs';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// メンテナンス中のみ表示するガイドツアー起動ボタン。
// nextstepjs・motionは重いため、Headerから切り出してこのファイル単位で遅延ロードする
export function GuideTourButton() {
  const T = useTranslations('CreateMask');
  const { startNextStep } = useNextStep();

  const handleStartTour = () => {
    startNextStep('mainTour');
  };

  return (
    <div className="fixed top-2 right-4 sm:bottom-6 sm:right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={handleStartTour}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-12 sm:h-12 text-center border border-gray-500 hover:cursor-pointer rounded-full shadow-lg overflow-hidden"
          >
            <Image
              src="/guide_tour.webp"
              alt="クイックガイド"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{T('quick_guide')}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
