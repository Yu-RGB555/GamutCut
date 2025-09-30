'use client';

import React from 'react';
import { useAlert } from '@/contexts/AlertContext';
import SlideInAlert from '@/components/ui/SlideInAlert';

const AlertContainer: React.FC = () => {
  const { alerts, hideAlert } = useAlert();

  // 最新のアラートのみ表示
  const latestAlert = alerts[alerts.length - 1];

  if (!latestAlert) return null;

  return (
    <SlideInAlert
      message={latestAlert.message}
      isVisible={true}
      onClose={() => hideAlert(latestAlert.id)}
      duration={3500}
    />
  );
};

export default AlertContainer;
