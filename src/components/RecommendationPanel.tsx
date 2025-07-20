import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, AlertTriangleIcon, TruckIcon, ArrowRightIcon } from 'lucide-react';
import { SmartMatch } from '../hooks/useSmartBuilder';
import { useLoadStore } from '../hooks/useLoadStore';
import { useTrailerStore } from '../hooks/useTrailerStore';
import { useModularTrailerStore } from '../hooks/useModularTrailerStore';
import { TrailerCADCanvas } from './cad/TrailerCADCanvas';
import { LoadSvgPreview } from './LoadSvgPreview';
import { useNavigate } from 'react-router-dom';
interface RecommendationPanelProps {
  chosenMatch: SmartMatch | null;
  selectedLoadId: string | null;
}
export function RecommendationPanel({
  chosenMatch,
  selectedLoadId
}: RecommendationPanelProps) {
  // State to track if component is mounted and ready
  const [isReady, setIsReady] = useState(false);
  // Safely access hooks only after ensuring we're in a proper context
  const navigate = useNavigate();
  const {
    loads,
    addToBuild
  } = useLoadStore();
  const {
    addToBuild: addTrailerToBuild
  } = useTrailerStore();
  const {
    setCurrent
  } = useModularTrailerStore();
  // Set component as ready after initial render
  useEffect(() => {
    setIsReady(true);
  }, []);
  // Find selected load
  const selectedLoad = selectedLoadId ? loads.find(l => l.id === selectedLoadId) : null;
  // Handle build assembly
  const handleAssembleBuild = () => {
    if (!chosenMatch || !selectedLoad || !isReady) return;
    try {
      // Add load to build
      addToBuild(selectedLoad);
      // Add trailer to build or set current modular
      if (chosenMatch.trailer && 'modules' in chosenMatch.trailer) {
        setCurrent(chosenMatch.trailer);
      } else if (chosenMatch.trailer) {
        addTrailerToBuild(chosenMatch.trailer);
      }
      // Navigate to assembly builder
      navigate('/assembly-builder');
    } catch (error) {
      console.error('Error during build assembly:', error);
    }
  };
  if (!isReady) {
    return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card p-4 h-full flex flex-col">
        <h2 className="text-xl font-satoshi mb-4">{t('Recommendation')}</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-surface-400">
            <p>{t('Loading recommendations...')}</p>
          </div>
        </div>
      </div>;
  }
  if (!chosenMatch || !selectedLoad) {
    return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card p-4 h-full flex flex-col">
        <h2 className="text-xl font-satoshi mb-4">{t('Recommendation')}</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-surface-400">
            <p className="mb-2">{t('Select a candidate to preview')}</p>
            <p className="text-sm">
              {t('Click "Preview" on any trailer card to see details')}
            </p>
          </div>
        </div>
      </div>;
  }
  // Determine if it's a modular trailer
  const isModular = 'modules' in chosenMatch.trailer;
  // Get trailer name
  const trailerName = isModular ? chosenMatch.trailer?.name || 'Unknown' : chosenMatch.trailer ? `${chosenMatch.trailer.manufacturer || ''} ${chosenMatch.trailer.model || ''}` : 'Unknown';
  // Get deck height for height calculation
  const getDeckHeight = () => {
    if (!chosenMatch.trailer) return 0;
    if (isModular) {
      return chosenMatch.trailer.modules.find(m => m.type === 'deck')?.height || 1.2;
    }
    return chosenMatch.trailer.deck_height_m || 0;
  };
  // Get load dimensions
  const loadHeight = selectedLoad.dims?.height || selectedLoad.cargo_height || 0;
  const totalHeight = getDeckHeight() + loadHeight;
  return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card p-4 h-full flex flex-col">
      <h2 className="text-xl font-satoshi mb-4">{t('Recommendation')}</h2>
      <div className="bg-surface-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
        <h3 className="font-medium flex items-center gap-2">
          {chosenMatch.canCarry ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <AlertTriangleIcon className="h-5 w-5 text-red-500" />}
          {trailerName}
        </h3>
        <p className="text-sm text-surface-400">
          {chosenMatch.totalAxles} {t('axles')} •{' '}
          {isModular ? t('Modular') : t(chosenMatch.trailer?.type || 'unknown')}
        </p>
      </div>
      <div className="h-[300px] bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 relative">
        {isModular ? <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-surface-400">
              <p className="font-medium">{t('Modular Trailer Preview')}</p>
              <p className="text-sm">{t('Configure in Modular Builder')}</p>
            </div>
          </div> : <div className="relative w-full h-full">
            <TrailerCADCanvas trailer={chosenMatch.trailer} viewMode="isometric" cameraView="isometric" cameraMode="perspective" showGrid={false} showDimensions={true} showAxles={true} showDeck={true} showConnection={true} showTractor={true} />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-3/4 h-3/4">
                <LoadSvgPreview load={selectedLoad} />
              </div>
            </div>
          </div>}
      </div>
      <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
        <div>
          <h3 className="text-sm font-medium mb-2">{t('Cargo Details')}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-surface-400">{t('Weight')}:</div>
            <div>{selectedLoad.weight || selectedLoad.cargo_weight} t</div>
            <div className="text-surface-400">{t('Dimensions')}:</div>
            <div>
              {selectedLoad.dims?.length || selectedLoad.cargo_length}m ×
              {selectedLoad.dims?.width || selectedLoad.cargo_width}m ×
              {selectedLoad.dims?.height || selectedLoad.cargo_height}m
            </div>
            <div className="text-surface-400">{t('CG Chainage')}:</div>
            <div>
              {selectedLoad.cg?.chainage || selectedLoad.cargo_cg_chainage} m
            </div>
            <div className="text-surface-400">{t('CG Offset')}:</div>
            <div>
              {selectedLoad.cg?.offset || selectedLoad.cargo_cg_offset} m
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">{t('Load Analysis')}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="text-surface-400">{t('Axle Loads')}:</div>
            <div>
              {chosenMatch.axleLoads.map(load => load.toFixed(1)).join(', ')}{' '}
              t
            </div>
            <div className="text-surface-400">{t('Total Height')}:</div>
            <div className={chosenMatch.heightViolation ? 'text-red-500 font-medium' : ''}>
              {totalHeight.toFixed(2)} m
              {chosenMatch.heightViolation && ' (exceeds limit)'}
            </div>
            <div className="text-surface-400">{t('Capacity Margin')}:</div>
            <div>{Math.round(chosenMatch.margin * 100)}%</div>
          </div>
        </div>
        {!chosenMatch.canCarry && <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-sm text-red-700 dark:text-red-300">
            <div className="font-medium mb-1 flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4" />
              {t('Compatibility Issues')}
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {!chosenMatch.canCarry && <li>{t('Trailer cannot safely carry this load')}</li>}
              {chosenMatch.heightViolation && <li>{t('Total height exceeds 4.5m limit')}</li>}
              {chosenMatch.axleViolations.some(v => v) && <li>{t('One or more axles exceed weight limits')}</li>}
            </ul>
          </div>}
      </div>
      <button onClick={handleAssembleBuild} disabled={!chosenMatch.canCarry} className="h-10 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed">
        <TruckIcon className="h-4 w-4" />
        {t('Assemble Build')}
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}