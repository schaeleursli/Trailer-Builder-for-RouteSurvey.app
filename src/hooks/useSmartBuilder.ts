import { useMemo } from 'react';
import { useTrailerStore } from './useTrailerStore';
import { useLoadStore } from './useLoadStore';
import { useModularTrailerStore } from './useModularTrailerStore';
import { TrailerSpec, ModularTrailer } from '../types/trailer';
import { LoadSpec, normalizeLoadSpec } from '../types/load';
export interface SmartMatch {
  trailer: TrailerSpec | ModularTrailer;
  totalAxles: number;
  axleLoads: number[];
  heightViolation: boolean;
  axleViolations: boolean[];
  canCarry: boolean;
  margin: number; // safety margin
}
export function useSmartBuilder() {
  const {
    trailers,
    build: trailerBuild
  } = useTrailerStore();
  const {
    trucks,
    build: truckBuild
  } = useTruckStore();
  const {
    current: currentModular
  } = useModularTrailerStore();
  const {
    loads
  } = useLoadStore();
  // Get the current truck if available
  const currentTruck = truckBuild.length > 0 ? truckBuild[0] : null;
  const findMatches = (loadId: string): SmartMatch[] => {
    if (!loadId) return [];
    // Find the load
    const load = loads.find(l => l.id === loadId);
    if (!load) return [];
    const normalizedLoad = normalizeLoadSpec(load);
    // Collect all trailers to evaluate
    const allTrailers: (TrailerSpec | ModularTrailer)[] = [...trailers];
    if (currentModular && currentModular.modules.length > 0) {
      allTrailers.push(currentModular);
    }
    // Calculate matches for each trailer
    const matches: SmartMatch[] = allTrailers.map(trailer => {
      // Calculate if it's a standard or modular trailer
      const isModular = 'modules' in trailer;
      // Calculate total axles
      const totalAxles = isModular ? trailer.modules.reduce((sum, module) => sum + (module.axleCount || 0), 0) : trailer.axles + (trailer.connection === 'jeep_dolly' && trailer.jeep_axles ? trailer.jeep_axles : 0);
      // Calculate deck height
      const deckHeight = isModular ? trailer.modules.find(m => m.type === 'deck')?.height || 1.2 : trailer.deck_height_m;
      // Calculate total height with cargo
      const totalHeight = deckHeight + normalizedLoad.dims.height;
      const heightViolation = totalHeight > 4.5; // Standard height limit
      // Calculate payload capacity
      const payloadCapacity = isModular ? trailer.modules.reduce((sum, module) => sum + (module.payloadCapacity || 0), 0) : trailer.payload_t;
      // Calculate if trailer can carry the load
      const canCarry = payloadCapacity >= normalizedLoad.weight;
      // Calculate safety margin (as percentage of capacity used)
      const margin = canCarry ? (payloadCapacity - normalizedLoad.weight) / payloadCapacity : 0;
      // Simulate axle loads distribution
      // This is a simplified calculation - in a real system, this would use
      // physics calculations based on CG and axle positions
      const axleLoads: number[] = [];
      const loadPerAxle = normalizedLoad.weight / totalAxles;
      for (let i = 0; i < totalAxles; i++) {
        // Add some variation to make it realistic
        const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        axleLoads.push(loadPerAxle * variation);
      }
      // Check for axle violations (over 11 tons per axle is a violation)
      const axleViolations = axleLoads.map(load => load > 11);
      // Check if trailer length is sufficient
      const trailerLength = isModular ? trailer.modules.reduce((sum, module) => sum + module.length, 0) : trailer.length_closed_m;
      const lengthViolation = trailerLength < normalizedLoad.dims.length;
      // Check if trailer width is sufficient
      const trailerWidth = isModular ? Math.max(...trailer.modules.map(m => m.width)) : trailer.width_m;
      const widthViolation = trailerWidth < normalizedLoad.dims.width;
      // Update canCarry based on all violations
      const canCarryWithConstraints = canCarry && !lengthViolation && !widthViolation && !axleViolations.some(v => v);
      return {
        trailer,
        totalAxles,
        axleLoads,
        heightViolation,
        axleViolations,
        canCarry: canCarryWithConstraints,
        margin: margin
      };
    });
    // Sort matches by:
    // 1. Can carry (true first)
    // 2. No height violation (false first)
    // 3. Higher margin (higher first)
    return matches.sort((a, b) => {
      if (a.canCarry !== b.canCarry) return a.canCarry ? -1 : 1;
      if (a.heightViolation !== b.heightViolation) return a.heightViolation ? 1 : -1;
      return b.margin - a.margin;
    });
  };
  return {
    findMatches
  };
}
// Helper to determine if a trailer is modular
function isModularTrailer(trailer: TrailerSpec | ModularTrailer): trailer is ModularTrailer {
  return 'modules' in trailer;
}