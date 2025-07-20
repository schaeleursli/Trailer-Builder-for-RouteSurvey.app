import React, { createContext, useContext } from 'react';
import { useTruckStore } from './useTruckStore';
import { TruckSpec } from '../types/trailer';
interface TruckContextType {
  trucks: TruckSpec[];
  build: TruckSpec[];
  addToBuild: (truck: TruckSpec) => void;
  removeBuildItem: (index: number) => void;
  clearBuild: () => void;
  getTotals: () => {
    totalPower: number;
    totalTare: number;
    maxGTW: number;
  };
}
const TruckContext = createContext<TruckContextType | undefined>(undefined);
export function TruckProvider({
  children
}: {
  children: ReactNode;
}) {
  const truckStore = useTruckStore();
  return <TruckContext.Provider value={truckStore}>{children}</TruckContext.Provider>;
}
export function useTruck() {
  const context = useContext(TruckContext);
  if (context === undefined) {
    throw new Error('useTruck must be used within a TruckProvider');
  }
  return context;
}