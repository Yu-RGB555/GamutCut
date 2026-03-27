'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function MaintenancePage() {
  const router = useRouter();
  const t = useTranslations('Maintenance');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-yellow-500 mb-6" />
      <h1 className="text-2xl font-bold mb-4">{t('page_unavailable_title')}</h1>
      <p className="text-muted-foreground mb-8 max-w-md">{t('page_unavailable_desc')}</p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.push('/')}>
          {t('back_home')}
        </Button>
        <Button onClick={() => router.push('/mask')}>
          {t('go_mask')}
        </Button>
      </div>
    </div>
  );
}
