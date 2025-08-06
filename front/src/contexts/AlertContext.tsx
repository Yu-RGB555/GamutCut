'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AlertMessage {
  id: string;
  message: string;
}

interface AlertContextType {
  showAlert: (message: string) => void;
  hideAlert: (id: string) => void;
  alerts: AlertMessage[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  // 表示内容
  const showAlert = (message: string) => {
    const id = Date.now().toString();
    const newAlert: AlertMessage = { id, message };
    setAlerts(prev => [...prev, newAlert]);
  };

  // 非表示
  const hideAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // 提供可能なメソッドおよびアラート内容
  const value: AlertContextType = {
    showAlert,
    hideAlert,
    alerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

// 提供可否判断
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
