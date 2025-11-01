import React from "react";

interface GitHubLogoProps {
  url: string;
}

export default function GitHubLogo({ url }: GitHubLogoProps) {
  const handleOpenGitHub = () => {
    // セットしたGitHubアカウントのurlを新規タブで開く処理
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex items-center justify-center p-2 rounded-sm hover:cursor-pointer hover:bg-muted">
      <button
        onClick={handleOpenGitHub}
        className="w-full cursor-pointer hover:scale-105 transition-transform duration-200"
      >
        <img src="/github-mark-white.svg" alt="GitHub" className="w-5 h-5" />
      </button>
    </div>
  );
};