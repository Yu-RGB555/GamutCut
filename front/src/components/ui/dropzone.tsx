import { Input } from "./input";
import { User, X } from 'lucide-react';

type DropZoneProps = {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  isAvatarImage?: boolean;
  previewUrl?: string | null;
};

export function DropZone({ onFileSelect, accept, isAvatarImage, previewUrl }: DropZoneProps){
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
    // 同じファイルを再選択できるようにvalueをリセット
    e.target.value = '';
  };

  // ファイル削除の処理
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileSelect(null); // 選択中のファイルを「なし」の状態にする
  };

  return (
    <>
      {isAvatarImage ? (
        <div className="relative">
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            htmlFor="avatar-file"
            className="block cursor-pointer"
          >
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="プレビュー画像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </label>

          {/* アバター削除ボタン */}
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white rounded-full p-1 shadow-lg transition-colors duration-200"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          <Input
            id="avatar-file"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
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
            // 初期表示
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
      )}
    </>
  );
}