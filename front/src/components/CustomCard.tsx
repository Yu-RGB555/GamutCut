'use client';
import type { CardComponentProps } from 'nextstepjs';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';

export const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) => {

  const t = useTranslations('Tour');

  return (
    <div className="bg-background rounded-lg shadow-lg p-3 sm:p-4 md:p-5 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg border border-gray-300 mx-2 sm:mx-0">
      {/* ヘッダー */}
      <div className="flex items-center justify-center font-bold text-label mb-2 sm:mb-4 gap-0.5 sm:gap-2">
        <span className="text-xl sm:text-2xl text-center">{step.icon}</span>
        <p className="text-sm sm:text-lg text-center">{step.title}</p>
      </div>

      {/* コンテンツ */}
      <div className="mb-6">
        <p className="text-label text-xs sm:text-sm leading-relaxed">{step.content}</p>
      </div>

      {/* ボタンエリア */}
      <div className="grid gap-2 sm:gap-3">
        <div className="flex items-center justify-between px-1 sm:px-2 md:px-4">
          {/* 戻るボタン */}
          <div className="w-12 sm:w-14 md:w-16">
            {currentStep != 0 ? (
              <Button
                onClick={prevStep}
                variant="secondary"
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors w-full"
              >
                {t('button.back')}
              </Button>
            ) : (
              <Button
                onClick={prevStep}
                variant="plain"
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-500 text-xs sm:text-sm transition-colors hover:cursor-not-allowed w-full"
              >
                {t('button.back')}
              </Button>
            )}
          </div>

          {/* ステップ表示 */}
          <div className="flex items-center justify-center min-w-12 sm:min-w-14 md:min-w-16">
            <span className="text-xs text-label px-2 sm:px-3 py-1 whitespace-nowrap">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {/* 次へボタン */}
          <div className="w-12 sm:w-14 md:w-16">
            <Button
              onClick={nextStep}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-colors w-full"
            >
              {currentStep + 1 === totalSteps ? t('button.done') : t('button.next')}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={skipTour}
            variant="plain"
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-gray-400 text-xs transition-colors"
          >
            {t('button.skip')}
          </Button>
        </div>
      </div>

      {/* 矢印 */}
      <div className="text-gray-300 fill-label">
        {arrow}
      </div>
    </div>
  );
};