import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, ArrowRightIcon } from 'lucide-react';
import { TrailerSpec, ModularTrailer } from '../types/trailer';
import { TrailerSvgPreview } from './TrailerSvgPreview';
import { SmartMatch } from '../hooks/useSmartBuilder';
interface CandidateCardProps {
  match: SmartMatch;
  onSelect: () => void;
}
export function CandidateCard({
  match,
  onSelect
}: CandidateCardProps) {
  const {
    trailer,
    totalAxles,
    axleLoads,
    heightViolation,
    axleViolations,
    canCarry,
    margin
  } = match;
  // Determine if it's a modular trailer
  const isModular = 'modules' in trailer;
  // Get trailer name
  const trailerName = isModular ? trailer.name : `${trailer.manufacturer} ${trailer.model}`;
  // Format axle loads
  const formattedAxleLoads = axleLoads.map(load => load.toFixed(1)).join(', ');
  // Calculate score for progress bar (0-100%)
  const score = Math.min(Math.round(margin * 100), 100);
  // Determine color scheme based on compatibility
  const colorScheme = canCarry ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
  return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card hover:shadow-cardHover transition overflow-hidden">
      <div className="aspect-video relative bg-surface-100 dark:bg-gray-800 overflow-hidden">
        {isModular ? <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-surface-400">
              <p className="font-medium">{t('Modular Trailer')}</p>
              <p className="text-sm">{t('Preview in recommendation panel')}</p>
            </div>
          </div> : <TrailerSvgPreview trailer={trailer as TrailerSpec} />}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-base font-medium">{trailerName}</h3>
            <p className="text-sm text-surface-400">
              {totalAxles} {t('axles')} •{' '}
              {isModular ? t('Modular') : t(trailer.type)}
            </p>
          </div>
          {canCarry ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <AlertTriangleIcon className="h-5 w-5 text-red-500" />}
        </div>
        <div className="space-y-3 mb-4">
          <div>
            <div className="text-sm text-surface-400 mb-1">
              {t('Axle Loads')}
            </div>
            <div className="flex flex-wrap gap-1">
              {axleLoads.map((load, i) => <span key={i} className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${axleViolations[i] ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
                  L{i + 1}: {load.toFixed(1)}t
                </span>)}
            </div>
          </div>
          <div>
            <div className="text-sm text-surface-400 mb-1">{t('Height')}</div>
            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${heightViolation ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}`}>
              {heightViolation && <AlertTriangleIcon className="h-3 w-3 mr-1" />}
              {isModular ? (trailer.modules.find(m => m.type === 'deck')?.height || 1.2).toFixed(1) : (trailer as TrailerSpec).deck_height_m.toFixed(1)}
              m deck
            </span>
          </div>
          <div>
            <div className="text-sm text-surface-400 mb-1">
              {t('Capacity Margin')}
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${canCarry ? 'bg-green-500' : 'bg-red-500'}`} style={{
              width: `${score}%`
            }}></div>
            </div>
            <div className="text-xs mt-1 text-right">
              {score}% {t('margin')}
            </div>
          </div>
        </div>
        <button onClick={onSelect} className="w-full h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
          {t('Preview')}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}