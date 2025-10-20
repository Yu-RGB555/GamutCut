import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

  // if (selectedMaskLength === 0) {
  //   return null;
  // }

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
            Myマスクに保存
          </Button>
        ) : (
          <Button
            // disabled
            id="step-4"
            className="bg-gray-500 relative overflow-hidden hover:bg-gray-500 hover:cursor-not-allowed"
          >
            <div className="flex flex-col items-center justify-center h-full py-1 px-2">
              {/* <div className="flex items-center mb-1">
                <Lock className="text-white w-3 h-3 mr-1" />
                <span className="text-white text-xs font-semibold">ログインユーザー限定</span>
              </div> */}
              <span className="text-xs">Myマスクに保存</span>
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
          ダウンロード
        </Button>
      </div>
    </div>
  );
};
