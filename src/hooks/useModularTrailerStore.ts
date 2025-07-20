import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ModularTrailer, TrailerModule } from '../types/trailer';
import initialModules from '../data/moduleTemplates.json';
interface ModularTrailerStore {
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
// Initial empty trailer
const defaultTrailer: ModularTrailer = {
  id: 'modular-trailer-' + Date.now(),
  name: 'New Modular Trailer',
  modules: []
};
export const useModularTrailerStore = create<ModularTrailerStore>()(persist((set, get) => ({
  trailers: [],
  current: defaultTrailer,
  setCurrent: trailer => {
    set({
      current: trailer || defaultTrailer
    });
  },
  addModule: (module, index) => {
    set(state => {
      if (!state.current) return state;
      const newModule = {
        ...module,
        id: module.id || `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      const modules = [...state.current.modules];
      if (index !== undefined && index >= 0 && index <= modules.length) {
        modules.splice(index, 0, newModule);
      } else {
        modules.push(newModule);
      }
      return {
        current: {
          ...state.current,
          modules
        }
      };
    });
  },
  removeModule: id => {
    set(state => {
      if (!state.current) return state;
      return {
        current: {
          ...state.current,
          modules: state.current.modules.filter(m => m.id !== id)
        }
      };
    });
  },
  moveModule: (id, newIndex) => {
    set(state => {
      if (!state.current) return state;
      const modules = [...state.current.modules];
      const currentIndex = modules.findIndex(m => m.id === id);
      if (currentIndex === -1) return state;
      const [removed] = modules.splice(currentIndex, 1);
      modules.splice(newIndex, 0, removed);
      return {
        current: {
          ...state.current,
          modules
        }
      };
    });
  },
  updateModule: (id, props) => {
    set(state => {
      if (!state.current) return state;
      return {
        current: {
          ...state.current,
          modules: state.current.modules.map(m => m.id === id ? {
            ...m,
            ...props
          } : m)
        }
      };
    });
  },
  computeTotals: () => {
    const {
      current
    } = get();
    if (!current) {
      return {
        totalLength: 0,
        totalAxles: 0,
        totalTare: 0,
        totalPayload: 0
      };
    }
    let totalLength = 0;
    let totalAxles = 0;
    let totalTare = 0;
    let totalPayload = 0;
    current.modules.forEach(module => {
      totalLength += module.length;
      totalAxles += module.axleCount || 0;
      totalTare += module.tare;
      totalPayload += module.payloadCapacity;
    });
    return {
      totalLength,
      totalAxles,
      totalTare,
      totalPayload
    };
  }
}), {
  name: 'modular-trailer-store',
  partialize: state => ({
    trailers: state.trailers
  })
}));