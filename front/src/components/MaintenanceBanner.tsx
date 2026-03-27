'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isMaintenanceMode } from '@/lib/maintenance';

export function MaintenanceBanner() {
  const t = useTranslations('Maintenance');

  if (!isMaintenanceMode()) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-950 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <p>{t('banner')}</p>
      </div>
    </div>
  );
}
