import React from 'react';
import { SmartMatch } from '../hooks/useSmartBuilder';
import { CandidateCard } from './CandidateCard';
interface CandidateGridProps {
  matches: SmartMatch[];
  onSelectMatch: (match: SmartMatch) => void;
  loading?: boolean;
}
export function CandidateGrid({
  matches,
  onSelectMatch,
  loading = false
}: CandidateGridProps) {
  if (loading) {
    return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card p-4 h-full flex flex-col">
        <h2 className="text-xl font-satoshi mb-4">{t('Candidate Trailers')}</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-surface-400">
            <div className="w-8 h-8 border-t-2 border-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>{t('Finding suitable trailers...')}</p>
          </div>
        </div>
      </div>;
  }
  if (matches.length === 0) {
    return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card p-4 h-full flex flex-col">
        <h2 className="text-xl font-satoshi mb-4">{t('Candidate Trailers')}</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-surface-400">
            <p className="mb-2">{t('No matching trailers found.')}</p>
            <p className="text-sm">
              {t('Select a cargo item to see suitable trailers.')}
            </p>
          </div>
        </div>
      </div>;
  }
  return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card p-4 h-full flex flex-col">
      <h2 className="text-xl font-satoshi mb-4">{t('Candidate Trailers')}</h2>
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {matches.map((match, index) => <CandidateCard key={index} match={match} onSelect={() => onSelectMatch(match)} />)}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 text-sm text-surface-400">
        {matches.length} {t('trailers found')} •{' '}
        {matches.filter(m => m.canCarry).length} {t('suitable')}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}