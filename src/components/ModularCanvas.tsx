import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, EyeOffIcon, MoveIcon, TrashIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { ModularTrailer, TrailerModule } from '../types/trailer';
import { getModuleColor } from '../utils/moduleUtils';
interface ModularCanvasProps {
  trailer: ModularTrailer;
  onSelectModule: (module: TrailerModule) => void;
  onRemoveModule: (id: string) => void;
  onMoveModule: (id: string, newIndex: number) => void;
}
export function ModularCanvas({
  trailer,
  onSelectModule,
  onRemoveModule,
  onMoveModule
}: ModularCanvasProps) {
  const [viewMode, setViewMode] = useState<'side' | 'top' | 'both'>('both');
  const [zoom, setZoom] = useState(1);
  const [showDimensions, setShowDimensions] = useState(true);
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  // Calculate total length of trailer
  const totalLength = trailer.modules.reduce((sum, module) => sum + module.length, 0);
  return <DndProvider backend={HTML5Backend}>
      <div className="bg-surface rounded-card shadow-card overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t('Trailer Configuration')}
          </h2>
          <div className="flex items-center space-x-3">
            <div className="flex bg-surface-100 rounded-md p-1">
              <button className={`px-3 py-1 rounded-md text-xs ${viewMode === 'side' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setViewMode('side')}>
                {t('Side')}
              </button>
              <button className={`px-3 py-1 rounded-md text-xs ${viewMode === 'top' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setViewMode('top')}>
                {t('Top')}
              </button>
              <button className={`px-3 py-1 rounded-md text-xs ${viewMode === 'both' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300'}`} onClick={() => setViewMode('both')}>
                {t('Both')}
              </button>
            </div>
            <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-gray-800" onClick={() => setShowDimensions(!showDimensions)} title={showDimensions ? t('Hide dimensions') : t('Show dimensions')}>
              {showDimensions ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
            </button>
            <div className="flex">
              <button className="p-1.5 rounded-l hover:bg-surface-100 dark:hover:bg-gray-800 border-r border-gray-200 dark:border-gray-700" onClick={handleZoomOut}>
                <ZoomOutIcon className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-r hover:bg-surface-100 dark:hover:bg-gray-800" onClick={handleZoomIn}>
                <ZoomInIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {trailer.modules.length === 0 ? <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
              <div>
                <p className="mb-2">
                  {t('No modules added to this trailer yet.')}
                </p>
                <p className="text-sm">
                  {t('Add modules from the catalog to start building your trailer.')}
                </p>
              </div>
            </div> : <div className={`h-full ${viewMode === 'both' ? 'flex flex-col md:flex-row' : 'flex'}`}>
              {/* Side View */}
              {(viewMode === 'side' || viewMode === 'both') && <div className={`${viewMode === 'both' ? 'flex-1' : 'w-full'} p-4 overflow-auto`}>
                  <div className="h-full relative" style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.2s'
            }}>
                    <div className="absolute top-1/2 left-0 right-0 border-b border-gray-300 dark:border-gray-700"></div>
                    <div className="flex items-center justify-center h-full">
                      <ModuleList modules={trailer.modules} viewType="side" showDimensions={showDimensions} onSelectModule={onSelectModule} onRemoveModule={onRemoveModule} onMoveModule={onMoveModule} />
                    </div>
                  </div>
                </div>}
              {/* Top View */}
              {(viewMode === 'top' || viewMode === 'both') && <div className={`${viewMode === 'both' ? 'flex-1' : 'w-full'} p-4 overflow-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800`}>
                  <div className="h-full relative" style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.2s'
            }}>
                    <div className="absolute top-1/2 left-0 right-0 border-b border-gray-300 dark:border-gray-700"></div>
                    <div className="flex items-center justify-center h-full">
                      <ModuleList modules={trailer.modules} viewType="top" showDimensions={showDimensions} onSelectModule={onSelectModule} onRemoveModule={onRemoveModule} onMoveModule={onMoveModule} />
                    </div>
                  </div>
                </div>}
            </div>}
        </div>
        {trailer.modules.length > 0 && <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-surface-400">{t('Total Length')}:</span>
                <span className="ml-2 font-medium">
                  {totalLength.toFixed(2)} m
                </span>
              </div>
              <div className="text-sm">
                <span className="text-surface-400">{t('Modules')}:</span>
                <span className="ml-2 font-medium">
                  {trailer.modules.length}
                </span>
              </div>
            </div>
          </div>}
      </div>
    </DndProvider>;
}
interface ModuleListProps {
  modules: TrailerModule[];
  viewType: 'side' | 'top';
  showDimensions: boolean;
  onSelectModule: (module: TrailerModule) => void;
  onRemoveModule: (id: string) => void;
  onMoveModule: (id: string, newIndex: number) => void;
}
function ModuleList({
  modules,
  viewType,
  showDimensions,
  onSelectModule,
  onRemoveModule,
  onMoveModule
}: ModuleListProps) {
  return <div className="flex">
      {modules.map((module, index) => <DraggableModule key={module.id} module={module} index={index} viewType={viewType} showDimensions={showDimensions} onSelect={() => onSelectModule(module)} onRemove={() => onRemoveModule(module.id)} onMove={onMoveModule} />)}
    </div>;
}
interface DraggableModuleProps {
  module: TrailerModule;
  index: number;
  viewType: 'side' | 'top';
  showDimensions: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMove: (id: string, newIndex: number) => void;
}
function DraggableModule({
  module,
  index,
  viewType,
  showDimensions,
  onSelect,
  onRemove,
  onMove
}: DraggableModuleProps) {
  const moduleColor = getModuleColor(module.type);
  // Scale factor (pixels per meter)
  const scaleFactor = 40;
  // Calculate dimensions based on view type
  const width = module.length * scaleFactor;
  const height = viewType === 'side' ? module.height * scaleFactor : module.width * scaleFactor;
  // Set up drag and drop
  const [{
    isDragging
  }, drag] = useDrag({
    type: 'MODULE',
    item: {
      id: module.id,
      index
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const [, drop] = useDrop({
    accept: 'MODULE',
    hover(item: {
      id: string;
      index: number;
    }, monitor) {
      if (item.index === index) {
        return;
      }
      // Move the module
      onMove(item.id, index);
      // Update the index for the dragged item
      item.index = index;
    }
  });
  return <div ref={node => drag(drop(node))} className={`relative cursor-move ${isDragging ? 'opacity-50' : ''}`} style={{
    width: `${width}px`,
    height: `${height}px`
  }}>
      <div className="absolute inset-0 flex items-center justify-center border-2 hover:border-4 transition-all duration-100" style={{
      borderColor: moduleColor,
      backgroundColor: `${moduleColor}20` // 20% opacity
    }} onClick={onSelect}>
        <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 text-xs py-1 px-2 truncate">
          {t(module.type.charAt(0).toUpperCase() + module.type.slice(1).replace('_', ' '))}
        </div>
        {/* Type-specific elements */}
        {viewType === 'side' && module.type === 'axle_bogie' && module.axleCount && <div className="absolute bottom-0 left-0 right-0 flex justify-around">
              {Array.from({
          length: module.axleCount
        }).map((_, i) => <div key={`axle-${i}`} className="w-3 h-8 bg-gray-800" style={{
          marginLeft: i > 0 && module.axleSpacings ? `${module.axleSpacings[i - 1] * scaleFactor}px` : '0'
        }}></div>)}
            </div>}
        {viewType === 'side' && module.type === 'gooseneck' && module.kingpinHeight && <div className="absolute w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-800" style={{
        bottom: `${module.kingpinHeight * scaleFactor}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }}></div>}
        {viewType === 'side' && module.type === 'ramp' && module.rampAngle && <div className="absolute bottom-0 right-0 w-16 h-1 bg-red-500 origin-left" style={{
        transform: `rotate(-${module.rampAngle}deg)`,
        transformOrigin: 'right bottom'
      }}></div>}
        {/* Dimension label */}
        {showDimensions && <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-primary-600 bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 py-1">
            {module.length} m
          </div>}
        {/* Controls */}
        <div className="absolute top-0 right-0 flex">
          <button className="p-1 bg-white dark:bg-gray-800 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={e => {
          e.stopPropagation();
          onRemove();
        }}>
            <TrashIcon className="h-3 w-3" />
          </button>
          <button className="p-1 bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={e => {
          e.stopPropagation();
        }}>
            <MoveIcon className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}