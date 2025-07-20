import React from 'react';
import { BoxIcon, TruckIcon, LinkIcon, GitMergeIcon, StretchHorizontalIcon, ArrowDownIcon } from 'lucide-react';
import { TrailerModule } from '../types/trailer';
/**
 * Get the appropriate icon component for a module type
 */
export function getModuleIcon(type: string): React.ComponentType<any> {
  switch (type) {
    case 'deck':
      return BoxIcon;
    case 'axle_bogie':
      return TruckIcon;
    case 'gooseneck':
      return LinkIcon;
    case 'dolly':
      return GitMergeIcon;
    case 'extension':
      return StretchHorizontalIcon;
    case 'ramp':
      return ArrowDownIcon;
    default:
      return BoxIcon;
  }
}
/**
 * Get the color for a module type
 */
export function getModuleColor(type: string): string {
  switch (type) {
    case 'gooseneck':
      return '#3B82F6';
    // blue-500
    case 'deck':
      return '#10B981';
    // emerald-500
    case 'axle_bogie':
      return '#F59E0B';
    // amber-500
    case 'dolly':
      return '#8B5CF6';
    // violet-500
    case 'extension':
      return '#EC4899';
    // pink-500
    case 'ramp':
      return '#EF4444';
    // red-500
    default:
      return '#6B7280';
    // gray-500
  }
}
/**
 * Validate a module configuration
 */
export function validateModule(module: TrailerModule): {
  message: string;
  severity: 'error' | 'warning' | 'success';
} {
  // Check required fields
  if (!module.length || module.length <= 0) {
    return {
      message: t('Length must be greater than zero'),
      severity: 'error'
    };
  }
  if (!module.width || module.width <= 0) {
    return {
      message: t('Width must be greater than zero'),
      severity: 'error'
    };
  }
  if (!module.height || module.height <= 0) {
    return {
      message: t('Height must be greater than zero'),
      severity: 'error'
    };
  }
  // Type-specific validations
  if (module.type === 'axle_bogie') {
    if (!module.axleCount || module.axleCount < 1) {
      return {
        message: t('Axle bogie must have at least 1 axle'),
        severity: 'error'
      };
    }
    if (module.axleCount > 1 && (!module.axleSpacings || module.axleSpacings.length < module.axleCount - 1)) {
      return {
        message: t('Missing axle spacings'),
        severity: 'error'
      };
    }
  }
  if (module.type === 'gooseneck' && (!module.kingpinHeight || module.kingpinHeight <= 0)) {
    return {
      message: t('Kingpin height must be specified for gooseneck modules'),
      severity: 'error'
    };
  }
  if (module.type === 'ramp' && (!module.rampAngle || module.rampAngle <= 0)) {
    return {
      message: t('Ramp angle must be specified for ramp modules'),
      severity: 'error'
    };
  }
  // Warnings
  if (module.length > 15) {
    return {
      message: t('Length exceeds 15m - verify transportation regulations'),
      severity: 'warning'
    };
  }
  if (module.width > 3) {
    return {
      message: t('Width exceeds 3m - may require special permits'),
      severity: 'warning'
    };
  }
  if (module.type === 'axle_bogie' && module.axleCount && module.axleCount > 6) {
    return {
      message: t('Large number of axles - verify turning capability'),
      severity: 'warning'
    };
  }
  // Success
  return {
    message: t('Module configuration is valid'),
    severity: 'success'
  };
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}