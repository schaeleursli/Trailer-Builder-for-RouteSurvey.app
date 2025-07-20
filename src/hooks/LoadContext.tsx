import React, { createContext, useContext } from 'react';
import { useLoadStore } from './useLoadStore';
import { LoadSpec } from '../types/load';
// Define the context type
interface LoadContextType {
  loads: LoadSpec[];
  build: LoadSpec[];
  addToBuild: (load: LoadSpec) => void;
  removeBuildItem: (index: number) => void;
  clearBuild: () => void;
  getTotals: () => {
    totalWeight: number;
    averageCG: number;
  };
}
// Create the context
const LoadContext = createContext<LoadContextType | undefined>(undefined);
// Create a provider component
export function LoadProvider({
  children
}: {
  children: ReactNode;
}) {
  const store = useLoadStore();
  return <LoadContext.Provider value={store}>{children}</LoadContext.Provider>;
}
// Create a hook to use the context
export function useLoad() {
  const context = useContext(LoadContext);
  if (context === undefined) {
    throw new Error('useLoad must be used within a LoadProvider');
  }
  return context;
}