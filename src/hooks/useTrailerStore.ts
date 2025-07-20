import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import initialTrailers from '../data/trailers.json';
import { TrailerSpec } from '../types/trailer';
interface TrailerStore {
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
export const useTrailerStore = create<TrailerStore>()(persist((set, get) => ({
  trailers: initialTrailers,
  build: [],
  addToBuild: (trailer: TrailerSpec) => {
    set(state => ({
      build: [...state.build, trailer]
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
    let totalLength = 0;
    let totalAxles = 0;
    let totalPayload = 0;
    build.forEach(trailer => {
      // Calculate length based on connection type
      let trailerLength = trailer.length_closed_m;
      if (trailer.connection === 'towbar' && trailer.towbar_length_m) {
        trailerLength += trailer.towbar_length_m;
      } else if (trailer.connection === 'jeep_dolly' && trailer.jeep_length_m) {
        trailerLength += trailer.jeep_length_m;
      }
      totalLength += trailerLength;
      // Calculate axles including jeep if present
      totalAxles += trailer.axles;
      if (trailer.connection === 'jeep_dolly' && trailer.jeep_axles) {
        totalAxles += trailer.jeep_axles;
      }
      // Add payload
      totalPayload += trailer.payload_t;
    });
    return {
      totalLength,
      totalAxles,
      totalPayload
    };
  }
}), {
  name: 'trailer-builder-storage',
  partialize: state => ({
    build: state.build
  })
}));