import React from "react";

interface XLogoProps {
  url: string;
}

export default function XLogo({ url }: XLogoProps) {
  const handleOpenX = () => {
    // セットしたXアカウントのurlを新規タブで開く処理
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex items-center justify-center p-2 rounded-sm hover:cursor-pointer hover:bg-muted">
      <button
        onClick={handleOpenX}
        className="w-full cursor-pointer hover:scale-105 transition-transform duration-200"
      >
        <img src="/X_logo.svg" alt="X" className="w-4 h-4" />
      </button>
    </div>
  );
};