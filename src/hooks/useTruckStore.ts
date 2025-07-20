import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import initialTrucks from '../data/trucks.json';
import { TruckSpec } from '../types/trailer';
interface TruckStore {
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
export const useTruckStore = create<TruckStore>()(persist((set, get) => ({
  trucks: initialTrucks,
  build: [],
  addToBuild: (truck: TruckSpec) => {
    set(state => ({
      build: [...state.build, truck]
    }));
  },
  removeBuildItem: (index: number) => {
    set(state => ({
      build: state.build.filter((_, i) => i !== index)
    }));
  },
  clearBuild: () => {
    set({
      build: []
    });
  },
  getTotals: () => {
    const {
      build
    } = get();
    // Sum of all engine power
    const totalPower = build.reduce((sum, truck) => sum + truck.engine_power_hp, 0);
    // Sum of all tare weights
    const totalTare = build.reduce((sum, truck) => sum + truck.tare_t, 0);
    // Maximum GTW from all trucks
    const maxGTW = build.length > 0 ? Math.max(...build.map(truck => truck.max_gtw_t)) : 0;
    return {
      totalPower,
      totalTare,
      maxGTW
    };
  }
}), {
  name: 'truck-builder-storage',
  partialize: state => ({
    build: state.build
  })
}));