import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from 'lucide-react';
import { TrailerSpec } from '../types/trailer';
import { getConnectionIcon } from '../utils/connectionUtils';
interface TrailerCardProps {
  trailer: TrailerSpec;
  onSelect: () => void;
}
export function TrailerCard({
  trailer,
  onSelect
}: TrailerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  const connectionIcon = getConnectionIcon(trailer.connection);
  return <div className="bg-surface rounded-card shadow-card hover:shadow-cardHover transition">
      <div className="relative aspect-video rounded-t overflow-hidden">
        <img src={trailer.img || 'https://placehold.co/1600x900?text=Trailer'} alt={`${trailer.manufacturer} ${trailer.model}`} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{trailer.manufacturer}</h3>
            <p className="text-sm text-surface-400">
              {trailer.family} {trailer.model}
            </p>
          </div>
          <button className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1" onClick={onSelect}>
            <PlusIcon className="h-4 w-4" />
            {t('Add')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {t(trailer.type.charAt(0).toUpperCase() + trailer.type.slice(1).replace('-', ' '))}
          </span>
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {trailer.axles} {t('axles')}
          </span>
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {trailer.payload_t}t {t('payload')}
          </span>
          <span className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
            {connectionIcon} {t(trailer.connection)}
          </span>
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
            <div className="text-surface-400">{t('Length')}:</div>
            <div>{trailer.length_closed_m} m</div>
            <div className="text-surface-400">{t('Width')}:</div>
            <div>{trailer.width_m} m</div>
            <div className="text-surface-400">{t('Deck height')}:</div>
            <div>{trailer.deck_height_m} m</div>
            <div className="text-surface-400">{t('Axle spacing')}:</div>
            <div>{trailer.axle_spacing_m} m</div>
            <div className="text-surface-400">{t('Tare weight')}:</div>
            <div>{trailer.tare_t} t</div>
            {trailer.tires && <>
                <div className="text-surface-400">{t('Tires')}:</div>
                <div>{trailer.tires.label}</div>
              </>}
            {trailer.stroke_m && <>
                <div className="text-surface-400">{t('Stroke')}:</div>
                <div>{trailer.stroke_m} m</div>
              </>}
            {trailer.connection === 'gooseneck' && <>
                <div className="text-surface-400">{t('Kingpin height')}:</div>
                <div>{trailer.kingpin_height_m || '—'} m</div>
                <div className="text-surface-400">{t('Swing radius')}:</div>
                <div>{trailer.swing_radius_m || '—'} m</div>
              </>}
            {trailer.connection === 'towbar' && <>
                <div className="text-surface-400">{t('Towbar length')}:</div>
                <div>{trailer.towbar_length_m || '—'} m</div>
                <div className="text-surface-400">{t('Eye height')}:</div>
                <div>{trailer.eye_height_m || '—'} m</div>
              </>}
            {trailer.connection === 'jeep_dolly' && <>
                <div className="text-surface-400">{t('Jeep axles')}:</div>
                <div>{trailer.jeep_axles || '—'}</div>
                <div className="text-surface-400">{t('Jeep length')}:</div>
                <div>{trailer.jeep_length_m || '—'} m</div>
              </>}
            {trailer.notes && <div className="col-span-2 mt-2 text-surface-400">
                <strong>{t('Notes')}: </strong>
                {trailer.notes}
              </div>}
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}