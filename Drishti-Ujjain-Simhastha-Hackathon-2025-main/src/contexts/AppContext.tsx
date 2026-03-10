import React, { createContext, useState, useContext, ReactNode } from 'react';
import { MockData, Checkpoint, Sector, SOSAlert } from '../utils/mockData';

type POI = Checkpoint | Sector | (SOSAlert & { x: number; y: number });

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  selectedPOI: POI | null;
  setSelectedPOI: (poi: POI | null) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <AppContext.Provider value={{ selectedPOI, setSelectedPOI, isSidebarCollapsed, toggleSidebar, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
