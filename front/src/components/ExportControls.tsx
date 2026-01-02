import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';

interface ExportControlsProps {
  selectedMaskLength: number;
  onMaskExport: () => void;
  onMaskSave: () => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  selectedMaskLength,
  onMaskExport,
  onMaskSave
}) => {
  const { isAuthenticated } = useAuth();
  const t = useTranslations('CreateMask');

  return (
    <div className="bg-card space-y-4 mb-16">
      <div className="grid grid-cols-2 gap-4">
        {isAuthenticated ? (
          <Button
            id="step-4"
            type="button"
            onClick={onMaskSave}
            className="bg-primary hover:bg-mouseover"
          >
            {t('save_to_my_masks')}
          </Button>
        ) : (
          <Button
            id="step-4"
            className="bg-gray-500 relative overflow-hidden hover:bg-gray-500 hover:cursor-not-allowed"
          >
            <div className="flex flex-col items-center justify-center h-full py-1 px-2">
              <span className="text-xs">{t('save_to_my_masks')}</span>
            </div>
          </Button>
        )}
        <Button
          id="step-3"
          type="button"
          onClick={onMaskExport}
          className="bg-primary hover:bg-mouseover"
        >
          <Download className="w-4 h-4 mr-1" />
          {t('download')}
        </Button>
      </div>
    </div>
  );
};
