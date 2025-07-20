import React from 'react';
import { PlusIcon, InfoIcon } from 'lucide-react';
import { TrailerModule } from '../types/trailer';
import { getModuleIcon } from '../utils/moduleUtils';
interface ModuleCardProps {
  module: TrailerModule;
  onClick: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  isPreview?: boolean;
}
export function ModuleCard({
  module,
  onClick,
  onAdd,
  onRemove,
  isPreview = false
}: ModuleCardProps) {
  const ModuleIcon = getModuleIcon(module.type);
  return <div className="bg-surface rounded-card shadow-card hover:shadow-cardHover transition cursor-pointer" onClick={onClick}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <ModuleIcon className="h-5 w-5 mr-2 text-primary-600" />
            <h3 className="text-lg font-semibold">
              {t(module.type.charAt(0).toUpperCase() + module.type.slice(1).replace('_', ' '))}
            </h3>
          </div>
          {onAdd && <button className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1" onClick={e => {
          e.stopPropagation();
          onAdd();
        }}>
              <PlusIcon className="h-4 w-4" />
              {t('Add')}
            </button>}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {module.length} m
          </span>
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {module.payloadCapacity} t
          </span>
          {module.axleCount && <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
              {module.axleCount} {t('axles')}
            </span>}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="text-surface-400">{t('Length')}:</div>
          <div>{module.length} m</div>
          <div className="text-surface-400">{t('Width')}:</div>
          <div>{module.width} m</div>
          <div className="text-surface-400">{t('Height')}:</div>
          <div>{module.height} m</div>
          <div className="text-surface-400">{t('Tare')}:</div>
          <div>{module.tare} t</div>
          {module.type === 'gooseneck' && module.kingpinHeight && <>
              <div className="text-surface-400">{t('Kingpin height')}:</div>
              <div>{module.kingpinHeight} m</div>
            </>}
          {module.type === 'axle_bogie' && module.axleCount && <>
              <div className="text-surface-400">{t('Axle count')}:</div>
              <div>{module.axleCount}</div>
            </>}
          {module.type === 'ramp' && module.rampAngle && <>
              <div className="text-surface-400">{t('Ramp angle')}:</div>
              <div>{module.rampAngle}°</div>
            </>}
        </div>
        {module.notes && !isPreview && <div className="mt-3 flex items-start gap-1 text-sm text-surface-400">
            <InfoIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{module.notes}</p>
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}