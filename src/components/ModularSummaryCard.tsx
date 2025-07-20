import React from 'react';
import { InfoIcon } from 'lucide-react';
import { ModularTrailer } from '../types/trailer';
import { useModularTrailerStore } from '../hooks/useModularTrailerStore';
interface ModularSummaryCardProps {
  trailer: ModularTrailer;
}
export function ModularSummaryCard({
  trailer
}: ModularSummaryCardProps) {
  const {
    computeTotals
  } = useModularTrailerStore();
  const totals = computeTotals();
  // Count module types
  const moduleTypeCounts = trailer.modules.reduce((counts, module) => {
    counts[module.type] = (counts[module.type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  return <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">{t('Trailer Summary')}</h2>
        <p className="text-sm text-surface-400">
          {t('Configuration details and totals')}
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-medium mb-2">{t('Basic Information')}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-surface-400">{t('Name')}:</div>
            <div>{trailer.name}</div>
            <div className="text-surface-400">{t('Module Count')}:</div>
            <div>{trailer.modules.length}</div>
            <div className="text-surface-400">{t('Total Length')}:</div>
            <div>{totals.totalLength.toFixed(2)} m</div>
          </div>
        </div>
        {/* Module Composition */}
        <div>
          <h3 className="text-sm font-medium mb-2">
            {t('Module Composition')}
          </h3>
          <div className="space-y-2">
            {Object.entries(moduleTypeCounts).map(([type, count]) => <div key={type} className="flex justify-between items-center">
                <div className="text-sm">
                  {t(type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '))}
                  :
                </div>
                <div className="text-sm font-medium">{count}</div>
              </div>)}
          </div>
        </div>
        {/* Weight Distribution */}
        <div>
          <h3 className="text-sm font-medium mb-2">
            {t('Weight Information')}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-surface-400">{t('Total Tare Weight')}:</div>
            <div>{totals.totalTare.toFixed(1)} t</div>
            <div className="text-surface-400">{t('Payload Capacity')}:</div>
            <div>{totals.totalPayload.toFixed(1)} t</div>
            <div className="text-surface-400">{t('Total Axles')}:</div>
            <div>{totals.totalAxles}</div>
          </div>
        </div>
        {/* Tips */}
        <div className="p-3 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-md flex items-start space-x-2">
          <InfoIcon className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">{t('Configuration Tips')}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                {t('Arrange modules in the order they would be connected in reality')}
              </li>
              <li>
                {t('Ensure axle bogies have appropriate spacing for load distribution')}
              </li>
              <li>
                {t('Gooseneck modules should be positioned at the front of the trailer')}
              </li>
            </ul>
          </div>
        </div>
        {/* Notes if any module has notes */}
        {trailer.modules.some(m => m.notes) && <div>
            <h3 className="text-sm font-medium mb-2">{t('Module Notes')}</h3>
            <div className="space-y-2">
              {trailer.modules.filter(m => m.notes).map(module => <div key={module.id} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                    <div className="font-medium mb-1">
                      {t(module.type.charAt(0).toUpperCase() + module.type.slice(1).replace('_', ' '))}
                      :
                    </div>
                    <p className="text-surface-400">{module.notes}</p>
                  </div>)}
            </div>
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}