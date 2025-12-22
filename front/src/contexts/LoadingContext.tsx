'use client';

import LoadingOverlay from "@/components/LoadingOverlay";
import { createContext, ReactNode, useContext, useState } from "react";

// 定義する定数やメソッドの型定義
interface LoadingContextType {
  isLoadingOverlay: boolean;
  setIsLoadingOverlay: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// <LoadingProvider>でwrapした範囲で扱える定数やメソッドなどをvalueとして定義
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

  // wrapしたchildrenにvalueを渡す
  return (
  <LoadingContext.Provider value={{ isLoadingOverlay, setIsLoadingOverlay }}>
    {children}
    <LoadingOverlay isLoading={isLoadingOverlay} />
  </LoadingContext.Provider>
);
};

export function useLoad() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoad must be used within an LoadProvider');
  }
  return context;
}