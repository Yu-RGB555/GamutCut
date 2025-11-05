import { Input } from "./input";
import { X } from 'lucide-react';

type DropZoneProps = {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  previewUrl?: string | null;
};

export function DropZone({ onFileSelect, accept, previewUrl }: DropZoneProps){
  // ドラッグ&ドロップ対応
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if(files && files.length > 0){
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  // ファイル選択の処理を追加
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  // ファイル削除の処理
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className="flex items-center justify-center w-full h-80">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-card hover:bg-gray-700 relative"
      >
        {previewUrl ? (
          // プレビュー表示モード
          <div className="flex aspect-[4/3] w-full h-full items-center justify-center relative">
            <img
              src={previewUrl}
              alt="プレビュー画像"
              className="object-cover h-full w-full rounded"
            />
            <button
              // 画像削除
              type="button"
              title="画像を削除"
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black"
              onClick={handleRemoveFile}
            >
              <X className="w-4 h-4 text-white hover:cursor-pointer" />
            </button>
          </div>
        ) : (
          // 初期表示（説明文）
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {/* SVGと説明文は元コードのまま */}
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG or JPEG（最大16MBまで）</p>
          </div>
        )}
        <Input
          id="dropzone-file"
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}