import React, { useEffect, useState, Suspense, Component } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { TrailerSpec, TruckSpec } from '../../types/trailer';
import { LoadSpec } from '../../types/load';
import { useTrailerStore } from '../../hooks/useTrailerStore';
import { useTruckStore } from '../../hooks/useTruckStore';
import { useLoadStore } from '../../hooks/useLoadStore';
import { AssemblyCanvas } from './AssemblyCanvas';
import { ConnectionAdjuster } from './ConnectionAdjuster';
import { TruckIcon, BoxIcon, Link, MoveHorizontal, MoveVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { ErrorFallback } from './ErrorFallback';
interface AssemblyBuilderProps {
  initialTrailerId?: string;
  initialTruckId?: string;
  initialLoadId?: string;
  onClose?: () => void;
}
export function AssemblyBuilder({
  initialTrailerId,
  initialTruckId,
  initialLoadId,
  onClose
}: AssemblyBuilderProps) {
  const {
    trailers
  } = useTrailerStore();
  const {
    trucks
  } = useTruckStore();
  const {
    loads
  } = useLoadStore();
  const [selectedTrailerId, setSelectedTrailerId] = useState<string | null>(initialTrailerId || null);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(initialTruckId || null);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(initialLoadId || null);
  const [connectionAdjustments, setConnectionAdjustments] = useState({
    offset: 0,
    height: 0,
    rotation: 0
  });
  const [showConnectionDetails, setShowConnectionDetails] = useState(true);
  const selectedTrailer = selectedTrailerId ? trailers.find(t => t.id === selectedTrailerId) : null;
  const selectedTruck = selectedTruckId ? trucks.find(t => t.id === selectedTruckId) : null;
  const selectedLoad = selectedLoadId ? loads.find(l => l.id === selectedLoadId) : null;
  // Reset adjustments when connection type or vehicles change
  useEffect(() => {
    if (selectedTrailer) {
      setConnectionAdjustments({
        offset: 0,
        height: 0,
        rotation: 0
      });
    }
  }, [selectedTrailerId, selectedTruckId, selectedTrailer?.connection]);
  // Helper function to get next item from array
  const getNextItem = <T,>(items: T[], currentId: string | null, idGetter: (item: T) => string, step: number): string => {
    if (!items.length || !currentId) return items[0] ? idGetter(items[0]) : '';
    const currentIndex = items.findIndex(item => idGetter(item) === currentId);
    if (currentIndex === -1) return items[0] ? idGetter(items[0]) : '';
    const nextIndex = (currentIndex + step + items.length) % items.length;
    return idGetter(items[nextIndex]);
  };
  const selectNextTrailer = () => {
    setSelectedTrailerId(getNextItem(trailers, selectedTrailerId, t => t.id, 1));
  };
  const selectPrevTrailer = () => {
    setSelectedTrailerId(getNextItem(trailers, selectedTrailerId, t => t.id, -1));
  };
  const selectNextTruck = () => {
    setSelectedTruckId(getNextItem(trucks, selectedTruckId, t => t.id, 1));
  };
  const selectPrevTruck = () => {
    setSelectedTruckId(getNextItem(trucks, selectedTruckId, t => t.id, -1));
  };
  const selectNextLoad = () => {
    setSelectedLoadId(getNextItem(loads, selectedLoadId, l => l.id, 1));
  };
  const selectPrevLoad = () => {
    setSelectedLoadId(getNextItem(loads, selectedLoadId, l => l.id, -1));
  };
  const handleConnectionAdjust = (key: string, value: number) => {
    setConnectionAdjustments(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const getConnectionDescription = () => {
    if (!selectedTrailer) return '';
    switch (selectedTrailer.connection) {
      case 'gooseneck':
        return 'Gooseneck connection with kingpin';
      case 'towbar':
        return 'Towbar connection with eye';
      case 'jeep_dolly':
        return 'Jeep/Dolly connection';
      default:
        return 'Connection';
    }
  };
  return <div className="bg-surface rounded-card shadow-card overflow-hidden flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <h2 className="text-lg font-semibold">Assembly Builder</h2>
        <p className="text-sm text-surface-400">
          Connect trucks and trailers to visualize the complete rig
        </p>
      </div>
      <div className="flex flex-col lg:flex-row flex-1">
        {/* 3D Canvas - takes most of the space */}
        <div className="flex-1 relative">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
          // Reset any state that might have caused the error
          setConnectionAdjustments({
            offset: 0,
            height: 0,
            rotation: 0
          });
        }}>
            <Suspense fallback={<div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-medium mb-2">
                      Loading 3D viewer...
                    </div>
                    <p className="text-sm text-surface-400">
                      Please wait while we initialize the scene
                    </p>
                  </div>
                </div>}>
              <AssemblyCanvas trailer={selectedTrailer} truck={selectedTruck} load={selectedLoad} connectionAdjustments={connectionAdjustments} showConnectionDetails={showConnectionDetails} />
            </Suspense>
          </ErrorBoundary>
          {/* Controls overlay */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-2 shadow-md flex gap-2">
              <button className="h-8 px-3 bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60 text-sm" onClick={() => setShowConnectionDetails(!showConnectionDetails)}>
                {showConnectionDetails ? 'Hide' : 'Show'} Connection Details
              </button>
            </div>
          </div>
        </div>
        {/* Side panel for controls */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Vehicle selection */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium mb-3">Truck Selection</h3>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={selectPrevTruck} className="h-8 w-8 flex items-center justify-center bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded p-2">
                <div className="font-medium text-sm flex items-center gap-2">
                  <TruckIcon className="h-4 w-4" />
                  {selectedTruck ? `${selectedTruck.manufacturer} ${selectedTruck.model}` : 'No truck selected'}
                </div>
                {selectedTruck && <div className="text-xs text-surface-400 mt-1">
                    {selectedTruck.axle_config} •{' '}
                    {selectedTruck.engine_power_hp} HP
                  </div>}
              </div>
              <button onClick={selectNextTruck} className="h-8 w-8 flex items-center justify-center bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-sm font-medium mb-3">Trailer Selection</h3>
            <div className="flex items-center gap-2">
              <button onClick={selectPrevTrailer} className="h-8 w-8 flex items-center justify-center bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded p-2">
                <div className="font-medium text-sm">
                  {selectedTrailer ? `${selectedTrailer.manufacturer} ${selectedTrailer.model}` : 'No trailer selected'}
                </div>
                {selectedTrailer && <div className="text-xs text-surface-400 mt-1">
                    {selectedTrailer.type} • {selectedTrailer.axles} axles
                  </div>}
              </div>
              <button onClick={selectNextTrailer} className="h-8 w-8 flex items-center justify-center bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <h3 className="text-sm font-medium mb-3 mt-4">Load Selection</h3>
            <div className="flex items-center gap-2">
              <button onClick={selectPrevLoad} className="h-8 w-8 flex items-center justify-center bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded p-2">
                <div className="font-medium text-sm flex items-center gap-2">
                  <BoxIcon className="h-4 w-4" />
                  {selectedLoad ? `${selectedLoad.load_type} - ${selectedLoad.cargo_weight}t` : 'No load selected'}
                </div>
                {selectedLoad && <div className="text-xs text-surface-400 mt-1">
                    {selectedLoad.cargo_length}m × {selectedLoad.cargo_width}m ×{' '}
                    {selectedLoad.cargo_height}m
                  </div>}
              </div>
              <button onClick={selectNextLoad} className="h-8 w-8 flex items-center justify-center bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Connection details */}
          {selectedTrailer && selectedTruck && <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Connection Details</h3>
                <div className="h-6 px-2 bg-surface-100 text-primary-600 rounded-full text-xs flex items-center">
                  <Link className="h-3 w-3 mr-1" />
                  {selectedTrailer.connection}
                </div>
              </div>
              <p className="text-xs text-surface-400 mt-1 mb-3">
                {getConnectionDescription()}
              </p>
              <ConnectionAdjuster trailer={selectedTrailer} truck={selectedTruck} adjustments={connectionAdjustments} onAdjust={handleConnectionAdjust} />
            </div>}
          {/* Load details */}
          {selectedLoad && <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium mb-3">Load Details</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="text-surface-400">{t('Weight')}:</div>
                  <div>{selectedLoad.cargo_weight} t</div>
                  <div className="text-surface-400">{t('CG Chainage')}:</div>
                  <div>{selectedLoad.cargo_cg_chainage} m</div>
                  <div className="text-surface-400">{t('CG Offset')}:</div>
                  <div>{selectedLoad.cargo_cg_offset} m</div>
                  <div className="text-surface-400">{t('Securing')}:</div>
                  <div>{t(selectedLoad.load_securing)}</div>
                </div>
              </div>
            </div>}
          {/* Connection parameters */}
          {selectedTrailer && selectedTruck && <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="text-sm font-medium mb-3">
                Connection Parameters
              </h3>
              <div className="space-y-4">
                {selectedTrailer.connection === 'gooseneck' && <>
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">
                        Kingpin height (m)
                      </label>
                      <div className="text-sm font-medium">
                        {selectedTrailer.kingpin_height_m || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">
                        Swing radius (m)
                      </label>
                      <div className="text-sm font-medium">
                        {selectedTrailer.swing_radius_m || 'Not specified'}
                      </div>
                    </div>
                  </>}
                {selectedTrailer.connection === 'towbar' && <>
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">
                        Towbar length (m)
                      </label>
                      <div className="text-sm font-medium">
                        {selectedTrailer.towbar_length_m || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">
                        Eye height (m)
                      </label>
                      <div className="text-sm font-medium">
                        {selectedTrailer.eye_height_m || 'Not specified'}
                      </div>
                    </div>
                  </>}
                {selectedTrailer.connection === 'jeep_dolly' && <>
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">
                        Jeep axles
                      </label>
                      <div className="text-sm font-medium">
                        {selectedTrailer.jeep_axles || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-surface-400 mb-1">
                        Jeep length (m)
                      </label>
                      <div className="text-sm font-medium">
                        {selectedTrailer.jeep_length_m || 'Not specified'}
                      </div>
                    </div>
                  </>}
                <div className="bg-surface-100 rounded-lg p-3 mt-4">
                  <h4 className="text-xs font-medium mb-2">Compatibility</h4>
                  {selectedTrailer.connection === 'gooseneck' && !selectedTruck.has_kingpin ? <div className="text-xs text-danger-500">
                      Warning: Selected truck does not have a kingpin connection
                    </div> : <div className="text-xs text-green-600">
                      ✓ Connection is compatible
                    </div>}
                </div>
              </div>
            </div>}
          {/* Bottom actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="flex gap-2">
              {onClose && <button onClick={onClose} className="h-8 px-3 bg-surface-100 text-primary-600 rounded hover:bg-surface-100/60 text-sm flex-1">
                  Close
                </button>}
              <button className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex-1" onClick={() => {}}>
                Add to Build
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}