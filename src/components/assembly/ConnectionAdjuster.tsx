import React from 'react';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { MoveHorizontal, MoveVertical, RotateCcw } from 'lucide-react';
interface ConnectionAdjusterProps {
  trailer: TrailerSpec;
  truck: TruckSpec;
  adjustments: {
    offset: number;
    height: number;
    rotation: number;
  };
  onAdjust: (key: string, value: number) => void;
}
export function ConnectionAdjuster({
  trailer,
  truck,
  adjustments,
  onAdjust
}: ConnectionAdjusterProps) {
  // Get ranges for each adjustment based on connection type
  const getAdjustmentRanges = () => {
    if (trailer.connection === 'gooseneck') {
      return {
        offset: {
          min: -1,
          max: 1,
          step: 0.1
        },
        height: {
          min: -0.5,
          max: 0.5,
          step: 0.05
        },
        rotation: {
          min: -10,
          max: 10,
          step: 1
        }
      };
    } else if (trailer.connection === 'towbar') {
      return {
        offset: {
          min: -2,
          max: 2,
          step: 0.2
        },
        height: {
          min: -0.5,
          max: 0.5,
          step: 0.05
        },
        rotation: {
          min: -15,
          max: 15,
          step: 1
        }
      };
    } else {
      return {
        offset: {
          min: -2,
          max: 2,
          step: 0.2
        },
        height: {
          min: -0.5,
          max: 0.5,
          step: 0.05
        },
        rotation: {
          min: -10,
          max: 10,
          step: 1
        }
      };
    }
  };
  const ranges = getAdjustmentRanges();
  return <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-surface-400 flex items-center">
            <MoveHorizontal className="h-3 w-3 mr-1" />
            Horizontal Offset
          </label>
          <span className="text-xs">{adjustments.offset.toFixed(1)} m</span>
        </div>
        <input type="range" min={ranges.offset.min} max={ranges.offset.max} step={ranges.offset.step} value={adjustments.offset} onChange={e => onAdjust('offset', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-surface-400 flex items-center">
            <MoveVertical className="h-3 w-3 mr-1" />
            Height Adjustment
          </label>
          <span className="text-xs">{adjustments.height.toFixed(2)} m</span>
        </div>
        <input type="range" min={ranges.height.min} max={ranges.height.max} step={ranges.height.step} value={adjustments.height} onChange={e => onAdjust('height', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-surface-400 flex items-center">
            <RotateCcw className="h-3 w-3 mr-1" />
            Rotation
          </label>
          <span className="text-xs">{adjustments.rotation.toFixed(0)}°</span>
        </div>
        <input type="range" min={ranges.rotation.min} max={ranges.rotation.max} step={ranges.rotation.step} value={adjustments.rotation} onChange={e => onAdjust('rotation', parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
      </div>
    </div>;
}