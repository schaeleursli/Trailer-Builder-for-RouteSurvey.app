import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from 'lucide-react';
import { TruckSpec } from '../types/trailer';
interface TruckCardProps {
  truck: TruckSpec;
  onSelect: () => void;
}
export function TruckCard({
  truck,
  onSelect
}: TruckCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  return <div className="bg-surface rounded-card shadow-card hover:shadow-cardHover transition">
      <div className="relative aspect-video rounded-t overflow-hidden">
        <img src={truck.img || 'https://placehold.co/1600x900?text=Truck'} alt={`${truck.manufacturer} ${truck.model}`} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{truck.manufacturer}</h3>
            <p className="text-sm text-surface-400">{truck.model}</p>
          </div>
          <button className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1" onClick={onSelect}>
            <PlusIcon className="h-4 w-4" />
            {t('Add')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {truck.axle_config}
          </span>
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {truck.engine_power_hp} HP
          </span>
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {truck.cab_type === 'sleeper' ? t('Sleeper cab') : t('Day cab')}
          </span>
          {truck.has_kingpin && <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
              {t('Kingpin')}
            </span>}
        </div>
        <button onClick={toggleExpand} className="flex items-center text-sm text-primary-600 mb-2">
          {expanded ? <>
              <ChevronUpIcon className="h-4 w-4 mr-1" />
              {t('Hide specifications')}
            </> : <>
              <ChevronDownIcon className="h-4 w-4 mr-1" />
              {t('Show specifications')}
            </>}
        </button>
        {expanded && <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-surface-400">{t('Max GTW')}:</div>
            <div>{truck.max_gtw_t} t</div>
            <div className="text-surface-400">{t('Tare weight')}:</div>
            <div>{truck.tare_t} t</div>
            <div className="text-surface-400">{t('Wheelbase')}:</div>
            <div>{truck.wheelbase_m} m</div>
            <div className="text-surface-400">{t('Front tires')}:</div>
            <div>{truck.front_tires.label}</div>
            <div className="text-surface-400">{t('Rear tires')}:</div>
            <div>{truck.rear_tires.label}</div>
            <div className="text-surface-400">{t('Counterweight')}:</div>
            <div>{truck.has_counterweight ? t('Yes') : t('No')}</div>
            <div className="text-surface-400">{t('Kingpin')}:</div>
            <div>{truck.has_kingpin ? t('Yes') : t('No')}</div>
            {truck.notes && <div className="col-span-2 mt-2 text-surface-400">
                <strong>{t('Notes')}: </strong>
                {truck.notes}
              </div>}
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}