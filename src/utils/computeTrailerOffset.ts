import { TrailerSpec, TruckSpec } from '../types/trailer';
export function computeTrailerOffset(trailer: TrailerSpec, truck: TruckSpec) {
  const base = truck.wheelbase_m;
  switch (trailer.connection) {
    case 'gooseneck':
      return base - (trailer.swing_radius_m || 2.0);
    case 'towbar':
      return base + (trailer.towbar_length_m || 4.0);
    case 'jeep_dolly':
      return base + (trailer.jeep_length_m || 4.0);
    default:
      return base;
  }
}