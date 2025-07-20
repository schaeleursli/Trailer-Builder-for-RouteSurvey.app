import React from 'react';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon } from 'lucide-react';
import { TruckSpec } from '../../types/trailer';
import { calculateCenterOfGravity } from '../../utils/truckCalculations';
interface TruckSummaryCardProps {
  config: TruckSpec;
  validationMessages: Array<{
    message: string;
    severity: 'warning' | 'error';
  }>;
}
export function TruckSummaryCard({
  config,
  validationMessages
}: TruckSummaryCardProps) {
  // Calculate center of gravity
  const cg = calculateCenterOfGravity(config);
  // Calculate total axle load
  const totalAxleLoad = config.axle_weights ? config.axle_weights.reduce((sum, weight) => sum + weight, 0) : config.tare_t;
  return <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">{t('Summary')}</h2>
        <p className="text-sm text-surface-400">
          {t('Key metrics and warnings')}
        </p>
      </div>
      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t('Key Metrics')}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-surface-400">{t('Tare Weight')}:</div>
            <div className="font-medium">{config.tare_t} t</div>
            <div className="text-surface-400">{t('Payload Capacity')}:</div>
            <div className="font-medium">
              {config.payload_capacity_t || 25} t
            </div>
            <div className="text-surface-400">{t('Maximum GTW')}:</div>
            <div className="font-medium">{config.max_gtw_t} t</div>
            <div className="text-surface-400">{t('Center of Gravity')}:</div>
            <div className="font-medium">
              {cg.toFixed(2)} m {t('from front')}
            </div>
            {config.has_kingpin && <>
                <div className="text-surface-400">{t('Kingpin Height')}:</div>
                <div className="font-medium">
                  {config.kingpin_height_m || 1.2} m
                </div>
              </>}
            {config.has_counterweight && <>
                <div className="text-surface-400">{t('Counterweight')}:</div>
                <div className="font-medium">
                  {config.counterweight_mass_t || 1.5} t
                </div>
              </>}
          </div>
        </div>
        {/* Axle Loads */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t('Axle Loads')}</h3>
          <div className="space-y-2">
            {config.axle_weights && config.axle_weights.map((weight, index) => <div key={index} className="flex items-center justify-between">
                  <div className="text-sm">
                    {t('Axle')} {index + 1}:
                  </div>
                  <div className="text-sm font-medium">{weight} t</div>
                  <div className="w-full max-w-[120px] bg-surface-100 rounded-full h-2.5 ml-2">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{
                width: `${weight / Math.max(...config.axle_weights) * 100}%`
              }}></div>
                  </div>
                </div>)}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="text-sm font-medium">{t('Total')}:</div>
              <div className="text-sm font-medium">
                {totalAxleLoad.toFixed(1)} t
              </div>
            </div>
          </div>
        </div>
        {/* Weight Distribution Chart */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">{t('Weight Distribution')}</h3>
          <div className="h-20 flex items-end space-x-1">
            {config.axle_weights && config.axle_weights.map((weight, index) => {
            const percentage = weight / totalAxleLoad * 100;
            return <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-primary-600 rounded-t" style={{
                height: `${Math.max(percentage, 5)}%`
              }}></div>
                    <div className="text-xs mt-1">{percentage.toFixed(0)}%</div>
                    <div className="text-xs text-surface-400">
                      {t('Axle')} {index + 1}
                    </div>
                  </div>;
          })}
          </div>
        </div>
        {/* Validation Messages */}
        {validationMessages.length > 0 && <div className="space-y-2">
            <h3 className="text-sm font-medium">{t('Warnings & Notices')}</h3>
            {validationMessages.map((msg, index) => <div key={index} className={`p-3 rounded-md flex items-start space-x-2 ${msg.severity === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                {msg.severity === 'error' ? <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" /> : <InfoIcon className="h-5 w-5 flex-shrink-0" />}
                <span className="text-sm">{msg.message}</span>
              </div>)}
          </div>}
        {validationMessages.length === 0 && <div className="p-3 rounded-md flex items-start space-x-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{t('Configuration valid')}</span>
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}