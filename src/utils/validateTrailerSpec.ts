import { TrailerSpec } from '../types/trailer';
export function validateTrailerSpec(trailer: TrailerSpec): {
  message: string;
  severity: 'error' | 'warning' | 'success';
} | null {
  // Validation for gooseneck connection
  if (trailer.connection === 'gooseneck') {
    if (trailer.kingpin_height_m === undefined || trailer.swing_radius_m === undefined) {
      return {
        message: t('Kingpin height and swing radius are required for gooseneck connection'),
        severity: 'error'
      };
    }
    if (trailer.kingpin_height_m + trailer.deck_height_m > 1.6) {
      return {
        message: t('King-pin + deck too high for 4 m overall height'),
        severity: 'warning'
      };
    }
  }
  // Validation for towbar connection
  if (trailer.connection === 'towbar') {
    if (trailer.towbar_length_m === undefined || trailer.eye_height_m === undefined) {
      return {
        message: t('Towbar length and eye height are required for towbar connection'),
        severity: 'error'
      };
    }
    if (trailer.towbar_length_m > 6) {
      return {
        message: t('Towbar exceeds 6 m – driver line-of-sight risk'),
        severity: 'warning'
      };
    }
  }
  // Validation for jeep_dolly connection
  if (trailer.connection === 'jeep_dolly') {
    if (trailer.jeep_axles === undefined || trailer.jeep_length_m === undefined) {
      return {
        message: t('Jeep axle count and length are required for jeep/dolly connection'),
        severity: 'error'
      };
    }
    if (trailer.jeep_axles < 1) {
      return {
        message: t('Jeep axle count required'),
        severity: 'error'
      };
    }
  }
  // If all validations pass
  return {
    message: t('Configuration valid'),
    severity: 'success'
  };
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}