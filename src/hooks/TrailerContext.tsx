import React, { createContext, useContext } from 'react';
import { useTrailerStore } from './useTrailerStore';
import { TrailerSpec } from '../types/trailer';
// Define the context type
interface TrailerContextType {
  trailers: TrailerSpec[];
  build: TrailerSpec[];
  addToBuild: (trailer: TrailerSpec) => void;
  removeBuildItem: (index: number) => void;
  clearBuild: () => void;
  getTotals: () => {
    totalLength: number;
    totalAxles: number;
    totalPayload: number;
  };
}
// Create the context
const TrailerContext = createContext<TrailerContextType | undefined>(undefined);
// Create a provider component
export function TrailerProvider({
  children
}: {
  children: ReactNode;
}) {
  const trailerStore = useTrailerStore();
  return <TrailerContext.Provider value={trailerStore}>
      {children}
    </TrailerContext.Provider>;
}
// Create a hook to use the context
export function useTrailer() {
  const context = useContext(TrailerContext);
  if (context === undefined) {
    throw new Error('useTrailer must be used within a TrailerProvider');
  }
  return context;
}