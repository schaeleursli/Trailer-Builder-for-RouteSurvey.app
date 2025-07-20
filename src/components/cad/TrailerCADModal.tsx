import React, { useState } from 'react';
import { XIcon, DownloadIcon } from 'lucide-react';
import { useTrailerStore } from '../../hooks/useTrailerStore';
import { TrailerCADCanvas } from './TrailerCADCanvas';
import { CADToolbar } from './CADToolbar';
import { useCadScene } from '../../hooks/useCadScene';
import { TechnicalDrawingView } from './TechnicalDrawingView';
import { AssemblyBuilder } from '../assembly/AssemblyBuilder';
interface TrailerCADModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerId: string | null;
}
export function TrailerCADModal({
  isOpen,
  onClose,
  trailerId
}: TrailerCADModalProps) {
  const {
    trailers
  } = useTrailerStore();
  const {
    exportCAD,
    cacheSVG
  } = useCadScene();
  const [viewMode, setViewMode] = useState<'plan' | 'isometric'>('isometric');
  const [cameraMode, setCameraMode] = useState<'orthographic' | 'perspective'>('orthographic');
  const [cameraView, setCameraView] = useState<'top' | 'side' | 'front' | 'isometric'>('top');
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showAxles, setShowAxles] = useState(true);
  const [showDeck, setShowDeck] = useState(true);
  const [showConnection, setShowConnection] = useState(true);
  const [showTractor, setShowTractor] = useState(true);
  const [activeTab, setActiveTab] = useState<'3d' | 'technical' | 'assembly'>('3d');
  const trailer = trailerId ? trailers.find(t => t.id === trailerId) : null;
  if (!isOpen || !trailer) return null;
  const handleExport = async (format: 'svg' | 'glb' | 'dxf' | 'all') => {
    if (!trailer) return;
    try {
      await exportCAD(trailer, format, {
        viewMode,
        cameraView,
        showAxles,
        showDeck,
        showConnection,
        showDimensions,
        showTractor
      });
    } catch (error) {
      console.error('Export failed:', error);
      // Show error notification
    }
  };
  const handleSVGsReady = (svgs: {
    top: string;
    side: string;
    front: string;
  }) => {
    // Cache SVGs for later export
    cacheSVG(`${trailer.id}_top_${showTractor ? 'with_truck' : 'no_truck'}`, svgs.top);
    cacheSVG(`${trailer.id}_side_${showTractor ? 'with_truck' : 'no_truck'}`, svgs.side);
    cacheSVG(`${trailer.id}_front_${showTractor ? 'with_truck' : 'no_truck'}`, svgs.front);
  };
  return <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#0F1117] rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">
            {t('CAD Designer')}: {trailer.manufacturer} {trailer.model}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden flex">
              <button className={`px-4 py-1.5 text-sm ${activeTab === '3d' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('3d')}>
                {t('3D View')}
              </button>
              <button className={`px-4 py-1.5 text-sm ${activeTab === 'technical' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('technical')}>
                {t('Technical Drawing')}
              </button>
              <button className={`px-4 py-1.5 text-sm ${activeTab === 'assembly' ? 'bg-primary-600 text-white' : 'bg-surface-100 text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveTab('assembly')}>
                {t('Assembly')}
              </button>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          {activeTab !== 'assembly' && <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
              <CADToolbar viewMode={viewMode} cameraMode={cameraMode} cameraView={cameraView} showGrid={showGrid} showDimensions={showDimensions} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} showTractor={showTractor} onViewModeChange={setViewMode} onCameraModeChange={setCameraMode} onCameraViewChange={setCameraView} onToggleGrid={() => setShowGrid(!showGrid)} onToggleDimensions={() => setShowDimensions(!showDimensions)} onToggleAxles={() => setShowAxles(!showAxles)} onToggleDeck={() => setShowDeck(!showDeck)} onToggleConnection={() => setShowConnection(!showConnection)} onToggleTractor={() => setShowTractor(!showTractor)} onExport={handleExport} />
            </div>}
          <div className={`${activeTab === 'assembly' ? 'w-full' : 'flex-1'} p-4 overflow-hidden`}>
            <div className="h-full rounded-lg overflow-hidden">
              {activeTab === '3d' ? <TrailerCADCanvas trailer={trailer} viewMode={viewMode} cameraMode={cameraMode} cameraView={cameraView} showGrid={showGrid} showDimensions={showDimensions} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} showTractor={showTractor} /> : activeTab === 'technical' ? <div className="h-full bg-white dark:bg-gray-900 rounded-lg p-4 overflow-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      {t('Technical Drawing')}
                    </h3>
                    <button onClick={() => handleExport('all')} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1">
                      <DownloadIcon className="h-4 w-4" />
                      {t('Export SVG')}
                    </button>
                  </div>
                  <TechnicalDrawingView trailer={trailer} showTractor={showTractor} showAxles={showAxles} showDeck={showDeck} showConnection={showConnection} onSVGsReady={handleSVGsReady} />
                </div> : <div className="h-full">
                  <AssemblyBuilder initialTrailerId={trailerId} />
                </div>}
            </div>
          </div>
        </div>
        {activeTab !== 'assembly' && <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            {activeTab === '3d' ? t('Tip: Press 1-4 to switch views (1=Top, 2=Side, 3=Front, 4=ISO). Hold Alt while dragging to disable grid snapping.') : t('Tip: Toggle elements on/off in the sidebar to customize your technical drawing before exporting.')}
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}