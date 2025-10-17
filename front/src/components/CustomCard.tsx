'use client';
import type { CardComponentProps } from 'nextstepjs';
import { Button } from './ui/button';

export const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) => {
  return (
    <div className="bg-background rounded-lg shadow-lg p-5 w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-300 min-w-80">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-label flex items-center gap-2">
          <span className="text-2xl">{step.icon}</span>
          {step.title}
        </h1>
      </div>

      {/* コンテンツ */}
      <div className="mb-6">
        <p className="text-label text-sm leading-relaxed">{step.content}</p>
      </div>

      {/* ボタンエリア */}
      <div className="grid gap-3">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8">
          {/* 戻るボタン */}
          <div className="w-16">
            {currentStep != 0 ? (
              <Button
                onClick={prevStep}
                variant="secondary"
                className="px-3 py-2 text-sm transition-colors w-full"
              >
                戻る
              </Button>
            ) : (
              <Button
                onClick={prevStep}
                variant="plain"
                className="px-3 py-2 text-gray-500 text-sm transition-colors hover:cursor-not-allowed w-full"
              >
                戻る
              </Button>
            )}
          </div>

          {/* ステップ表示 */}
          <div className="flex items-center justify-center min-w-16">
            <span className="text-xs text-label px-3 py-1 whitespace-nowrap">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {/* 次へボタン */}
          <div className="w-16">
            <Button
              onClick={nextStep}
              className="px-3 py-2 text-sm rounded-md transition-colors w-full"
            >
              {currentStep + 1 === totalSteps ? '完了' : '次へ'}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={skipTour}
            variant="plain"
            className="px-3 py-2 text-gray-400 text-xs transition-colors"
          >
            ツアーをスキップ
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