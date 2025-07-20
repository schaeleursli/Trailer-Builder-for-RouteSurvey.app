import React, { useEffect, useState } from 'react';
import { XIcon, CheckIcon, AlertTriangleIcon, SaveIcon } from 'lucide-react';
import { TrailerModule } from '../types/trailer';
import { ModuleSvgPreview } from './ModuleSvgPreview';
import { validateModule } from '../utils/moduleUtils';
interface ModuleConfiguratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  module: TrailerModule | null;
  onSave: (module: TrailerModule) => void;
  isNew?: boolean;
}
export function ModuleConfiguratorDrawer({
  isOpen,
  onClose,
  module,
  onSave,
  isNew = false
}: ModuleConfiguratorDrawerProps) {
  const [config, setConfig] = useState<TrailerModule | null>(null);
  const [validationMessage, setValidationMessage] = useState<{
    message: string;
    severity: 'error' | 'warning' | 'success';
  } | null>(null);
  const [activeSection, setActiveSection] = useState<string>('common');
  useEffect(() => {
    if (module) {
      setConfig({
        ...module,
        // Ensure ID for new modules
        id: module.id || `module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      });
    } else {
      setConfig(null);
    }
  }, [module]);
  useEffect(() => {
    if (config) {
      const validation = validateModule(config);
      setValidationMessage(validation);
    }
  }, [config]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!config) return;
    const {
      name,
      value,
      type
    } = e.target;
    // Handle numeric inputs
    if (type === 'number') {
      setConfig({
        ...config,
        [name]: parseFloat(value)
      });
    } else {
      setConfig({
        ...config,
        [name]: value
      });
    }
  };
  const handleAxleSpacingChange = (index: number, value: number) => {
    if (!config) return;
    const axleSpacings = [...(config.axleSpacings || [])];
    axleSpacings[index] = value;
    setConfig({
      ...config,
      axleSpacings
    });
  };
  const handleAxleCountChange = (value: number) => {
    if (!config) return;
    // Update axle spacings array when axle count changes
    let axleSpacings = [...(config.axleSpacings || [])];
    if (value > 1) {
      // We need (value - 1) spacings
      const neededSpacings = value - 1;
      // If we need more spacings than we have, add default ones (1.4m)
      if (neededSpacings > axleSpacings.length) {
        for (let i = axleSpacings.length; i < neededSpacings; i++) {
          axleSpacings.push(1.4);
        }
      }
      // If we need fewer spacings, truncate the array
      else if (neededSpacings < axleSpacings.length) {
        axleSpacings = axleSpacings.slice(0, neededSpacings);
      }
    } else {
      // No spacings needed for 0 or 1 axle
      axleSpacings = [];
    }
    setConfig({
      ...config,
      axleCount: value,
      axleSpacings
    });
  };
  const handleSave = () => {
    if (config) {
      onSave(config);
      onClose();
    }
  };
  if (!isOpen || !config) return null;
  return <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md flex">
        <div className="relative w-full bg-white dark:bg-[#0F1117] shadow-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">
              {isNew ? t('Add Module') : t('Edit Module')}
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">{t('Module Type')}</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                <div className="font-medium">
                  {t(config.type.charAt(0).toUpperCase() + config.type.slice(1).replace('_', ' '))}
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
              <ModuleSvgPreview module={config} />
            </div>
            {/* Common Properties Section */}
            <div>
              <h3 className="text-sm font-medium mb-3">
                {t('Common Properties')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('Length (m)')}
                  </label>
                  <input type="number" name="length" value={config.length} onChange={handleInputChange} step="0.1" min="0.1" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('Width (m)')}
                  </label>
                  <input type="number" name="width" value={config.width} onChange={handleInputChange} step="0.01" min="0.1" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('Height (m)')}
                  </label>
                  <input type="number" name="height" value={config.height} onChange={handleInputChange} step="0.01" min="0.1" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('Tare Weight (t)')}
                  </label>
                  <input type="number" name="tare" value={config.tare} onChange={handleInputChange} step="0.1" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('Payload Capacity (t)')}
                  </label>
                  <input type="number" name="payloadCapacity" value={config.payloadCapacity} onChange={handleInputChange} step="0.1" min="0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                </div>
              </div>
            </div>
            {/* Type-specific Properties Section */}
            {config.type === 'axle_bogie' && <div>
                <h3 className="text-sm font-medium mb-3">
                  {t('Axle Bogie Properties')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Axle Count')}
                    </label>
                    <input type="number" name="axleCount" value={config.axleCount || 0} onChange={e => handleAxleCountChange(parseInt(e.target.value))} step="1" min="1" max="8" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                  {config.axleCount && config.axleCount > 1 && config.axleSpacings && <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {t('Axle Spacings (m)')}
                        </label>
                        <div className="space-y-2">
                          {config.axleSpacings.map((spacing, index) => <div key={`spacing-${index}`} className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400 w-24">
                                {t('Axle')} {index + 1} - {index + 2}:
                              </span>
                              <input type="number" value={spacing} onChange={e => handleAxleSpacingChange(index, parseFloat(e.target.value))} step="0.1" min="0.8" max="2.0" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                            </div>)}
                        </div>
                      </div>}
                </div>
              </div>}
            {config.type === 'gooseneck' && <div>
                <h3 className="text-sm font-medium mb-3">
                  {t('Gooseneck Properties')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Kingpin Height (m)')}
                    </label>
                    <input type="number" name="kingpinHeight" value={config.kingpinHeight || 0} onChange={handleInputChange} step="0.01" min="0.1" max="1.5" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                </div>
              </div>}
            {config.type === 'ramp' && <div>
                <h3 className="text-sm font-medium mb-3">
                  {t('Ramp Properties')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {t('Ramp Angle (degrees)')}
                    </label>
                    <input type="number" name="rampAngle" value={config.rampAngle || 0} onChange={handleInputChange} step="1" min="5" max="45" className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
                  </div>
                </div>
              </div>}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('Notes')}
              </label>
              <textarea name="notes" value={config.notes || ''} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />
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
            <button onClick={handleSave} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex-1 flex items-center justify-center gap-1" disabled={validationMessage?.severity === 'error'}>
              <SaveIcon className="h-4 w-4" />
              {isNew ? t('Add to Trailer') : t('Save Changes')}
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