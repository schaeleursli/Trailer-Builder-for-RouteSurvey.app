import React, { useEffect, useState } from 'react';
import { XIcon, CheckIcon, AlertTriangleIcon } from 'lucide-react';
import { useTrailerStore } from '../hooks/useTrailerStore';
import { ConnectionTypePicker } from './ConnectionTypePicker';
import { TrailerSvgPreview } from './TrailerSvgPreview';
import { ConnectionType, TrailerSpec } from '../types/trailer';
import { validateTrailerSpec } from '../utils/validateTrailerSpec';
interface ConfiguratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trailerId: string | null;
  onOpenCAD?: (trailerId: string) => void;
}
export function ConfiguratorDrawer({
  isOpen,
  onClose,
  trailerId,
  onOpenCAD
}: ConfiguratorDrawerProps) {
  const {
    trailers,
    addToBuild
  } = useTrailerStore();
  const [config, setConfig] = useState<TrailerSpec | null>(null);
  const [validationMessage, setValidationMessage] = useState<{
    message: string;
    severity: 'error' | 'warning' | 'success';
  } | null>(null);
  useEffect(() => {
    if (trailerId) {
      const trailer = trailers.find(t => t.id === trailerId);
      if (trailer) {
        setConfig({
          ...trailer
        });
      }
    } else {
      setConfig(null);
    }
  }, [trailerId, trailers]);
  useEffect(() => {
    if (config) {
      const validation = validateTrailerSpec(config);
      setValidationMessage(validation);
    }
  }, [config]);
  const handleConnectionChange = (type: ConnectionType) => {
    if (!config) return;
    // Reset connection-specific fields when changing connection type
    const updatedConfig: TrailerSpec = {
      ...config,
      connection: type,
      // Reset gooseneck fields
      ...(type !== 'gooseneck' && {
        kingpin_height_m: undefined,
        swing_radius_m: undefined
      }),
      // Reset towbar fields
      ...(type !== 'towbar' && {
        towbar_length_m: undefined,
        eye_height_m: undefined
      }),
      // Reset jeep_dolly fields
      ...(type !== 'jeep_dolly' && {
        jeep_axles: undefined,
        jeep_length_m: undefined
      })
    };
    setConfig(updatedConfig);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return;
    const {
      name,
      value
    } = e.target;
    const numValue = name !== 'notes' ? parseFloat(value) : value;
    setConfig({
      ...config,
      [name]: !isNaN(numValue as number) ? numValue : value
    });
  };
  const handleSave = () => {
    if (config) {
      addToBuild(config);
      onClose();
    }
  };
  const handleOpenCAD = () => {
    if (config && onOpenCAD) {
      onOpenCAD(config.id);
    }
  };
  if (!isOpen || !config) return null;
  return <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md flex">
        <div className="relative w-full bg-white dark:bg-[#0F1117] shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">{t('Configure Trailer')}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">{t('Trailer')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                <div className="font-medium">
                  {config.manufacturer} {config.model}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {config.type} • {config.axles} {t('axles')}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">
                {t('Connection Type')}
              </h3>
              <ConnectionTypePicker value={config.connection} onChange={handleConnectionChange} />
            </div>
            <div className="relative aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
              <TrailerSvgPreview trailer={config} />
              {/* CAD Preview button */}
              {onOpenCAD && <button onClick={handleOpenCAD} className="absolute bottom-3 right-3 h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1">
                  <div className="h-4 w-4" />
                  {t('Open in CAD')}
                </button>}
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">
                {t('Connection Details')}
              </h3>
              {config.connection === 'gooseneck' && <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Kingpin height (m)')}
                    </label>
                    <input type="number" name="kingpin_height_m" value={config.kingpin_height_m || ''} onChange={handleInputChange} step="0.001" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Swing radius (m)')}
                    </label>
                    <input type="number" name="swing_radius_m" value={config.swing_radius_m || ''} onChange={handleInputChange} step="0.01" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                </div>}
              {config.connection === 'towbar' && <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Towbar length (m)')}
                    </label>
                    <input type="number" name="towbar_length_m" value={config.towbar_length_m || ''} onChange={handleInputChange} step="0.01" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Eye height (m)')}
                    </label>
                    <input type="number" name="eye_height_m" value={config.eye_height_m || ''} onChange={handleInputChange} step="0.001" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                </div>}
              {config.connection === 'jeep_dolly' && <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Jeep axles')}
                    </label>
                    <input type="number" name="jeep_axles" value={config.jeep_axles || ''} onChange={handleInputChange} step="1" min="1" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Jeep length (m)')}
                    </label>
                    <input type="number" name="jeep_length_m" value={config.jeep_length_m || ''} onChange={handleInputChange} step="0.01" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                </div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Notes')}
              </label>
              <textarea name="notes" value={config.notes || ''} onChange={e => setConfig({
              ...config,
              notes: e.target.value
            })} rows={3} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
            </div>
            {validationMessage && <div className={`p-3 rounded flex items-start space-x-2 ${validationMessage.severity === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : validationMessage.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'}`}>
                {validationMessage.severity === 'error' ? <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" /> : validationMessage.severity === 'warning' ? <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" /> : <CheckIcon className="h-5 w-5 flex-shrink-0" />}
                <span className="text-sm">{validationMessage.message}</span>
              </div>}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex space-x-3">
            <button onClick={onClose} className="h-8 px-3 bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60 text-sm flex-1">
              {t('Cancel')}
            </button>
            <button onClick={handleSave} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex-1">
              {t('Save to Build')}
            </button>
          </div>
        </div>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}