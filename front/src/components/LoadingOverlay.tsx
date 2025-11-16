import React from "react";
import { ThreeDots } from "react-loader-spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
}

// ローディング中（isLoadingがtrue）の場合、ローディングアニメーションを表示
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#87EE0C"
        radius="9"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
};

export default LoadingOverlay;