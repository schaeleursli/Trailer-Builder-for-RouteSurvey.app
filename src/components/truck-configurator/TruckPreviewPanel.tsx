import React, { useEffect, useState, useRef } from 'react';
import { LayersIcon, ZoomInIcon, ZoomOutIcon, RefreshCwIcon } from 'lucide-react';
import { TruckSpec } from '../../types/trailer';
import { TruckSideView } from './TruckSideView';
import { TruckTopView } from './TruckTopView';
interface TruckPreviewPanelProps {
  config: TruckSpec;
  mode: 'side' | 'top' | 'both';
  onModeChange: (mode: 'side' | 'top' | 'both') => void;
}
export function TruckPreviewPanel({
  config,
  mode,
  onModeChange
}: TruckPreviewPanelProps) {
  const [zoom, setZoom] = useState(1);
  const [showLayers, setShowLayers] = useState(false);
  const [layers, setLayers] = useState({
    tires: true,
    chassis: true,
    cab: true,
    kingpin: true,
    counterweight: true,
    dimensions: true,
    axleLabels: true
  });
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  const handleReset = () => {
    setZoom(1);
  };
  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };
  return <div className="bg-surface rounded-card shadow-card overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('Truck Preview')}</h2>
        <div className="flex items-center space-x-2">
          <div className="flex bg-surface-100 rounded-md p-1">
            <button className={`px-3 py-1 rounded-md text-xs ${mode === 'side' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => onModeChange('side')}>
              {t('Side')}
            </button>
            <button className={`px-3 py-1 rounded-md text-xs ${mode === 'top' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => onModeChange('top')}>
              {t('Top')}
            </button>
            <button className={`px-3 py-1 rounded-md text-xs ${mode === 'both' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => onModeChange('both')}>
              {t('Both')}
            </button>
          </div>
          <div className="relative">
            <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-gray-800" onClick={() => setShowLayers(!showLayers)}>
              <LayersIcon className="h-5 w-5" />
            </button>
            {showLayers && <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 p-2 border border-gray-200 dark:border-gray-700">
                <div className="space-y-1.5">
                  {Object.entries(layers).map(([key, value]) => <div key={key} className="flex items-center">
                      <input type="checkbox" id={`layer-${key}`} checked={value} onChange={() => toggleLayer(key as keyof typeof layers)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
                      <label htmlFor={`layer-${key}`} className="ml-2 block text-sm">
                        {t(key.charAt(0).toUpperCase() + key.slice(1))}
                      </label>
                    </div>)}
                </div>
              </div>}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col bg-white dark:bg-gray-800 rounded-md shadow-md">
          <button className="p-1.5 hover:bg-surface-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700" onClick={handleZoomIn}>
            <ZoomInIcon className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-surface-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700" onClick={handleZoomOut}>
            <ZoomOutIcon className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-surface-100 dark:hover:bg-gray-700" onClick={handleReset}>
            <RefreshCwIcon className="h-4 w-4" />
          </button>
        </div>
        {/* Preview content based on mode */}
        {mode === 'side' && <div className="h-full w-full p-4">
            <TruckSideView config={config} zoom={zoom} layers={layers} />
          </div>}
        {mode === 'top' && <div className="h-full w-full p-4">
            <TruckTopView config={config} zoom={zoom} layers={layers} />
          </div>}
        {mode === 'both' && <div className="h-full w-full grid grid-rows-2 p-4 gap-4">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
              <TruckSideView config={config} zoom={zoom} layers={layers} />
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
              <TruckTopView config={config} zoom={zoom} layers={layers} />
            </div>
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}