import React from 'react';
import { ViewIcon, Grid3x3Icon, RulerIcon, DownloadIcon, BoxIcon, SquareIcon, TruckIcon, LayersIcon, CheckSquareIcon, SquareIcon as EmptySquareIcon } from 'lucide-react';
import { ViewSwitcher } from './ViewSwitcher';
interface CADToolbarProps {
  viewMode: 'plan' | 'isometric';
  cameraMode: 'orthographic' | 'perspective';
  cameraView: 'top' | 'side' | 'front' | 'isometric';
  showGrid: boolean;
  showDimensions: boolean;
  showAxles: boolean;
  showDeck: boolean;
  showConnection: boolean;
  showTractor: boolean;
  onViewModeChange: (mode: 'plan' | 'isometric') => void;
  onCameraModeChange: (mode: 'orthographic' | 'perspective') => void;
  onCameraViewChange: (view: 'top' | 'side' | 'front' | 'isometric') => void;
  onToggleGrid: () => void;
  onToggleDimensions: () => void;
  onToggleAxles: () => void;
  onToggleDeck: () => void;
  onToggleConnection: () => void;
  onToggleTractor: () => void;
  onExport: (format: 'svg' | 'glb' | 'dxf' | 'all') => void;
}
export function CADToolbar({
  viewMode,
  cameraMode,
  cameraView,
  showGrid,
  showDimensions,
  showAxles,
  showDeck,
  showConnection,
  showTractor,
  onViewModeChange,
  onCameraModeChange,
  onCameraViewChange,
  onToggleGrid,
  onToggleDimensions,
  onToggleAxles,
  onToggleDeck,
  onToggleConnection,
  onToggleTractor,
  onExport
}: CADToolbarProps) {
  return <div className="bg-surface rounded-card shadow-card p-2 flex flex-col gap-2">
      {/* View mode */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
        <h3 className="text-sm font-medium mb-2 px-2">{t('View')}</h3>
        <div className="flex flex-col gap-2">
          <ViewSwitcher currentView={cameraView} onChange={onCameraViewChange} />
          <div className="flex gap-1">
            <button className={`p-2 rounded flex items-center gap-1 text-xs ${cameraMode === 'orthographic' ? 'bg-primary-600 text-white' : 'hover:bg-surface-100 text-gray-700 dark:text-gray-300'}`} onClick={() => onCameraModeChange('orthographic')} title={t('Orthographic Camera')}>
              <ViewIcon className="h-4 w-4" />
              <span>{t('Ortho')}</span>
            </button>
            <button className={`p-2 rounded flex items-center gap-1 text-xs ${cameraMode === 'perspective' ? 'bg-primary-600 text-white' : 'hover:bg-surface-100 text-gray-700 dark:text-gray-300'}`} onClick={() => onCameraModeChange('perspective')} title={t('Perspective Camera')}>
              <ViewIcon className="h-4 w-4" />
              <span>{t('Persp')}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Layers */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
        <h3 className="text-sm font-medium mb-2 px-2">{t('Layers')}</h3>
        <div className="space-y-1 px-2">
          <button className="flex items-center justify-between w-full text-xs p-1 hover:bg-surface-100 rounded" onClick={onToggleGrid}>
            <div className="flex items-center gap-2">
              <Grid3x3Icon className="h-4 w-4" />
              <span>{t('Grid')}</span>
            </div>
            {showGrid ? <CheckSquareIcon className="h-4 w-4 text-primary-600" /> : <EmptySquareIcon className="h-4 w-4" />}
          </button>
          <button className="flex items-center justify-between w-full text-xs p-1 hover:bg-surface-100 rounded" onClick={onToggleDimensions}>
            <div className="flex items-center gap-2">
              <RulerIcon className="h-4 w-4" />
              <span>{t('Dimensions')}</span>
            </div>
            {showDimensions ? <CheckSquareIcon className="h-4 w-4 text-primary-600" /> : <EmptySquareIcon className="h-4 w-4" />}
          </button>
          <button className="flex items-center justify-between w-full text-xs p-1 hover:bg-surface-100 rounded" onClick={onToggleDeck}>
            <div className="flex items-center gap-2">
              <BoxIcon className="h-4 w-4" />
              <span>{t('Deck')}</span>
            </div>
            {showDeck ? <CheckSquareIcon className="h-4 w-4 text-primary-600" /> : <EmptySquareIcon className="h-4 w-4" />}
          </button>
          <button className="flex items-center justify-between w-full text-xs p-1 hover:bg-surface-100 rounded" onClick={onToggleAxles}>
            <div className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4" />
              <span>{t('Axles')}</span>
            </div>
            {showAxles ? <CheckSquareIcon className="h-4 w-4 text-primary-600" /> : <EmptySquareIcon className="h-4 w-4" />}
          </button>
          <button className="flex items-center justify-between w-full text-xs p-1 hover:bg-surface-100 rounded" onClick={onToggleConnection}>
            <div className="flex items-center gap-2">
              <LayersIcon className="h-4 w-4" />
              <span>{t('Connection')}</span>
            </div>
            {showConnection ? <CheckSquareIcon className="h-4 w-4 text-primary-600" /> : <EmptySquareIcon className="h-4 w-4" />}
          </button>
          <button className="flex items-center justify-between w-full text-xs p-1 hover:bg-surface-100 rounded" onClick={onToggleTractor}>
            <div className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4" />
              <span>{t('Tractor')}</span>
            </div>
            {showTractor ? <CheckSquareIcon className="h-4 w-4 text-primary-600" /> : <EmptySquareIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {/* Export */}
      <div>
        <h3 className="text-sm font-medium mb-2 px-2">{t('Export')}</h3>
        <div className="flex flex-col gap-1 px-2">
          <button className="flex items-center gap-2 text-xs p-2 hover:bg-surface-100 rounded" onClick={() => onExport('svg')}>
            <DownloadIcon className="h-4 w-4" />
            <span>
              {t(`Export ${cameraView.charAt(0).toUpperCase() + cameraView.slice(1)} (SVG)`)}
            </span>
          </button>
          <button className="flex items-center gap-2 text-xs p-2 hover:bg-surface-100 rounded" onClick={() => onExport('glb')}>
            <DownloadIcon className="h-4 w-4" />
            <span>{t('Export 3D (GLB)')}</span>
          </button>
          <button className="flex items-center gap-2 text-xs p-2 hover:bg-surface-100 rounded" onClick={() => onExport('dxf')}>
            <DownloadIcon className="h-4 w-4" />
            <span>
              {t(`Export ${cameraView.charAt(0).toUpperCase() + cameraView.slice(1)} (DXF)`)}
            </span>
          </button>
          <button className="flex items-center gap-2 text-xs p-2 hover:bg-surface-100 rounded" onClick={() => onExport('all')}>
            <DownloadIcon className="h-4 w-4" />
            <span>{t('Export 3-View Sheet')}</span>
          </button>
        </div>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}