'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, X } from 'lucide-react';

interface SlideInAlertProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const SlideInAlert: React.FC<SlideInAlertProps> = ({
  message,
  isVisible,
  onClose,
  duration,
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // 少し遅延してアニメーション開始
      setTimeout(() => setIsAnimating(true), 10);

      // 指定時間後に自動で閉じる
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    // アニメーション完了後にレンダリングを停止
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed top-24 left-4 z-50">
      <Alert
        className={`
          bg-card border-ring border-1 text-foreground shadow-lg min-w-80 max-w-md
          transform transition-all duration-300 ease-out
          ${isAnimating
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0'
          }`
        }
      >
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-foreground font-semibold">{message}</span>
          <button
            onClick={handleClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SlideInAlert;
