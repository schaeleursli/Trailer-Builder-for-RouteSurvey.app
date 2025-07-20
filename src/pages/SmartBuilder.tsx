import React, { useEffect, useState, createElement } from 'react';
import { ChevronLeftIcon, DownloadIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSmartBuilder, SmartMatch } from '../hooks/useSmartBuilder';
import { CargoSelect } from '../components/CargoSelect';
import { CandidateGrid } from '../components/CandidateGrid';
import { RecommendationPanel } from '../components/RecommendationPanel';
export function SmartBuilder() {
  const navigate = useNavigate();
  const {
    findMatches
  } = useSmartBuilder();
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [chosenMatch, setChosenMatch] = useState<SmartMatch | null>(null);
  const [loading, setLoading] = useState(false);
  // When selected load changes, find matches
  useEffect(() => {
    if (selectedLoadId) {
      setLoading(true);
      // Add a slight delay to show loading state
      const timer = setTimeout(() => {
        const newMatches = findMatches(selectedLoadId);
        setMatches(newMatches);
        setChosenMatch(null);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setMatches([]);
      setChosenMatch(null);
    }
  }, [selectedLoadId, findMatches]);
  // Handle export
  const handleExport = () => {
    if (!chosenMatch || !selectedLoadId) return;
    // Create export data
    const exportData = {
      timestamp: new Date().toISOString(),
      cargo: selectedLoadId,
      recommendation: {
        trailer: 'modules' in chosenMatch.trailer ? chosenMatch.trailer.id : chosenMatch.trailer.id,
        type: 'modules' in chosenMatch.trailer ? 'modular' : 'standard',
        axleLoads: chosenMatch.axleLoads,
        canCarry: chosenMatch.canCarry,
        margin: chosenMatch.margin,
        heightViolation: chosenMatch.heightViolation
      }
    };
    // Convert to JSON
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], {
      type: 'application/json'
    });
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-builder-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return <div className="min-h-screen bg-surface dark:bg-[#0F1117] text-gray-900 dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-surface dark:bg-[#0F1117] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-600" aria-label={t('Back')}>
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-satoshi">{t('Smart Builder')}</h1>
          </div>
          <button onClick={handleExport} disabled={!chosenMatch} className="h-10 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed" aria-label={t('Export')}>
            <DownloadIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('Export')}</span>
          </button>
        </div>
      </header>
      <main className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <CargoSelect onSelectLoad={setSelectedLoadId} selectedLoadId={selectedLoadId} />
            </div>
            <div>
              <CandidateGrid matches={matches} onSelectMatch={setChosenMatch} loading={loading} />
            </div>
            <div>
              <RecommendationPanel chosenMatch={chosenMatch} selectedLoadId={selectedLoadId} />
            </div>
          </div>
        </div>
      </main>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}