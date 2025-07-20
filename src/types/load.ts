export type LoadCategory = 'container' | 'box' | 'e-room' | 'machinery' | 'tank' | 'drum' | 'cable_spool' | 'blade' | 'tower_section' | 'nacelle' | 'vehicle' | 'excavator' | 'mining_truck' | 'custom';
export interface LoadSpec {
  id: string;
  category: LoadCategory;
  weight: number;
  dims: {
    length: number;
    width: number;
    height: number;
  };
  cg: {
    chainage: number;
    offset: number;
  };
  securing: string;
  dynamicFactor: number;
  envelopeRef?: string;
  notes?: string;
  // NEW:
  shapeSvg?: string; // arbitrary 2D outline SVG path
  shapePoints?: {
    x: number;
    y: number;
  }[]; // normalized polygon points
  // Legacy fields for backward compatibility
  load_type?: string;
  cargo_weight?: number;
  cargo_axle_weights?: number[];
  cargo_length?: number;
  cargo_width?: number;
  cargo_height?: number;
  cargo_cg_chainage?: number;
  cargo_cg_offset?: number;
  load_securing?: string;
  dynamic_factor?: number;
  permitted_envelope_ref?: string;
}

// Helper to convert between legacy and new format
export function normalizeLoadSpec(load: LoadSpec): LoadSpec {
  // If already in new format
  if (load.category && load.dims && load.cg) {
    return load;
  }
  // Convert legacy format to new format
  return {
    id: load.id,
    category: load.load_type as LoadCategory || 'box',
    weight: load.cargo_weight || 0,
    dims: {
      length: load.cargo_length || 0,
      width: load.cargo_width || 0,
      height: load.cargo_height || 0
    },
    cg: {
      chainage: load.cargo_cg_chainage || 0,
      offset: load.cargo_cg_offset || 0
    },
    securing: load.load_securing || 'chains',
    dynamicFactor: load.dynamic_factor || 1.2,
    envelopeRef: load.permitted_envelope_ref,
    notes: load.notes,
    // Keep legacy fields for backward compatibility
    load_type: load.load_type,
    cargo_weight: load.cargo_weight,
    cargo_axle_weights: load.cargo_axle_weights,
    cargo_length: load.cargo_length,
    cargo_width: load.cargo_width,
    cargo_height: load.cargo_height,
    cargo_cg_chainage: load.cargo_cg_chainage,
    cargo_cg_offset: load.cargo_cg_offset,
    load_securing: load.load_securing,
    dynamic_factor: load.dynamic_factor,
    permitted_envelope_ref: load.permitted_envelope_ref
  };
}