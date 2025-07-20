import React, { createContext, useContext } from 'react';
import { useModularTrailerStore } from '../hooks/useModularTrailerStore';
import { ModularTrailer, TrailerModule } from '../types/trailer';
interface ModularTrailerContextType {
  trailers: ModularTrailer[];
  current: ModularTrailer | null;
  setCurrent: (trailer: ModularTrailer | null) => void;
  addModule: (module: TrailerModule, index?: number) => void;
  removeModule: (id: string) => void;
  moveModule: (id: string, newIndex: number) => void;
  updateModule: (id: string, props: Partial<TrailerModule>) => void;
  computeTotals: () => {
    totalLength: number;
    totalAxles: number;
    totalTare: number;
    totalPayload: number;
  };
}
const ModularTrailerContext = createContext<ModularTrailerContextType | undefined>(undefined);
export function ModularTrailerProvider({
  children
}: {
  children: ReactNode;
}) {
  const store = useModularTrailerStore();
  return <ModularTrailerContext.Provider value={store}>
      {children}
    </ModularTrailerContext.Provider>;
}
export function useModularTrailer() {
  const context = useContext(ModularTrailerContext);
  if (context === undefined) {
    throw new Error('useModularTrailer must be used within a ModularTrailerProvider');
  }
  return context;
}