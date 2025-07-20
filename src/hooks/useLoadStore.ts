import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoadSpec, normalizeLoadSpec } from '../types/load';

// Initial sample data
const initialLoads: LoadSpec[] = [{
  id: 'load-001',
  category: 'container',
  weight: 20,
  dims: {
    length: 12,
    width: 2.5,
    height: 2.6
  },
  cg: {
    chainage: 6,
    offset: 0
  },
  securing: 'chains',
  dynamicFactor: 1.2,
  envelopeRef: 'standard',
  // Legacy fields for backward compatibility
  load_type: 'container',
  cargo_weight: 20,
  cargo_axle_weights: [5, 5, 5, 5],
  cargo_length: 12,
  cargo_width: 2.5,
  cargo_height: 2.6,
  cargo_cg_chainage: 6,
  cargo_cg_offset: 0,
  load_securing: 'chains',
  dynamic_factor: 1.2,
  permitted_envelope_ref: 'standard'
}, {
  id: 'load-002',
  category: 'machinery',
  weight: 35,
  dims: {
    length: 8,
    width: 3.2,
    height: 3.5
  },
  cg: {
    chainage: 4.5,
    offset: 0.3
  },
  securing: 'chains_and_straps',
  dynamicFactor: 1.5,
  envelopeRef: 'oversize',
  // Legacy fields for backward compatibility
  load_type: 'machinery',
  cargo_weight: 35,
  cargo_axle_weights: [10, 15, 10],
  cargo_length: 8,
  cargo_width: 3.2,
  cargo_height: 3.5,
  cargo_cg_chainage: 4.5,
  cargo_cg_offset: 0.3,
  load_securing: 'chains_and_straps',
  dynamic_factor: 1.5,
  permitted_envelope_ref: 'oversize'
}, {
  id: 'load-003',
  category: 'blade',
  weight: 15,
  dims: {
    length: 60,
    width: 4,
    height: 3
  },
  cg: {
    chainage: 20,
    offset: 0
  },
  securing: 'custom',
  dynamicFactor: 1.8,
  envelopeRef: 'oversize',
  shapeSvg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,50 Q25,30 50,25 T90,50 Q75,70 50,75 T10,50" fill="#6B7280" stroke="#1F2937" stroke-width="2"/>
    </svg>`,
  shapePoints: [{
    x: 10,
    y: 50
  }, {
    x: 25,
    y: 30
  }, {
    x: 50,
    y: 25
  }, {
    x: 75,
    y: 30
  }, {
    x: 90,
    y: 50
  }, {
    x: 75,
    y: 70
  }, {
    x: 50,
    y: 75
  }, {
    x: 25,
    y: 70
  }]
}, {
  id: 'load-004',
  category: 'cable_spool',
  weight: 28,
  dims: {
    length: 5,
    width: 5,
    height: 5
  },
  cg: {
    chainage: 2.5,
    offset: 0
  },
  securing: 'chains',
  dynamicFactor: 1.4,
  envelopeRef: 'oversize',
  shapeSvg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#6B7280" stroke="#1F2937" stroke-width="2"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="#1F2937" stroke-width="2"/>
      <line x1="10" y1="50" x2="90" y2="50" stroke="#1F2937" stroke-width="1"/>
      <line x1="50" y1="10" x2="50" y2="90" stroke="#1F2937" stroke-width="1"/>
    </svg>`
}];
interface LoadStore {
  loads: LoadSpec[];
  build: LoadSpec[];
  addToBuild: (load: LoadSpec) => void;
  updateLoad: (id: string, updates: Partial<LoadSpec>) => void;
  removeBuildItem: (index: number) => void;
  clearBuild: () => void;
  getTotals: () => {
    totalWeight: number;
    averageCG: number;
  };
}
export const useLoadStore = create<LoadStore>()(persist((set, get) => ({
  loads: initialLoads,
  build: [],
  addToBuild: load => {
    const normalizedLoad = normalizeLoadSpec(load);
    set(state => ({
      build: [...state.build, normalizedLoad]
    }));
  },
  updateLoad: (id, updates) => {
    set(state => ({
      loads: state.loads.map(load => load.id === id ? {
        ...load,
        ...updates
      } : load),
      build: state.build.map(load => load.id === id ? {
        ...load,
        ...updates
      } : load)
    }));
  },
  removeBuildItem: index => {
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
    // Ensure we're using the new format fields
    const normalizedBuild = build.map(normalizeLoadSpec);
    const totalWeight = normalizedBuild.reduce((sum, load) => sum + load.weight, 0);
    // Calculate weighted average CG
    const totalWeightedCG = normalizedBuild.reduce((sum, load) => sum + load.weight * load.cg.chainage, 0);
    const averageCG = totalWeight > 0 ? totalWeightedCG / totalWeight : 0;
    return {
      totalWeight,
      averageCG: Number(averageCG.toFixed(2))
    };
  }
}), {
  name: 'load-storage',
  partialize: state => ({
    build: state.build
  })
}));