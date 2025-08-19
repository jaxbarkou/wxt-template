import React, { createContext, useContext, ReactNode } from 'react';
import { AppMode } from '../types';

interface ModeContextType {
  mode: AppMode;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  mode: AppMode;
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ mode, children }) => {
  return (
    <ModeContext.Provider value={{ mode }}>{children}</ModeContext.Provider>
  );
};

export const useMode = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}; 