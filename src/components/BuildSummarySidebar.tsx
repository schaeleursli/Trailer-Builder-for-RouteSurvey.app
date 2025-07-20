import React, { createElement, Component } from 'react';
import { XIcon, TrashIcon, DownloadIcon, BoxIcon, LayersIcon } from 'lucide-react';
import { useTrailerStore } from '../hooks/useTrailerStore';
import { useTruckStore } from '../hooks/useTruckStore';
import { useLoadStore } from '../hooks/useLoadStore';
import { useModularTrailerStore } from '../hooks/useModularTrailerStore';
import { getConnectionIcon } from '../utils/connectionUtils';
import { getModuleIcon } from '../utils/moduleUtils';
import { normalizeLoadSpec } from '../types/load';
interface BuildSummarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
export function BuildSummarySidebar({
  isOpen,
  onClose
}: BuildSummarySidebarProps) {
  const {
    build: trailerBuild,
    removeBuildItem: removeTrailer,
    clearBuild: clearTrailers,
    getTotals: getTrailerTotals
  } = useTrailerStore();
  const {
    build: truckBuild,
    removeBuildItem: removeTruck,
    clearBuild: clearTrucks,
    getTotals: getTruckTotals
  } = useTruckStore();
  const {
    build: loadBuild,
    removeBuildItem: removeLoad,
    clearBuild: clearLoads,
    getTotals: getLoadTotals
  } = useLoadStore();
  const {
    current: modularTrailer,
    computeTotals: getModularTotals
  } = useModularTrailerStore();
  const trailerTotals = getTrailerTotals();
  const truckTotals = getTruckTotals();
  const loadTotals = getLoadTotals();
  const modularTotals = getModularTotals();
  const exportBuild = () => {
    const buildData = {
      trucks: truckBuild,
      trailers: trailerBuild,
      loads: loadBuild,
      modularTrailer,
      truckTotals,
      trailerTotals,
      loadTotals,
      modularTotals
    };
    const dataStr = JSON.stringify(buildData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `transport-build-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  const clearAll = () => {
    clearTrailers();
    clearTrucks();
    clearLoads();
  };
  const sidebarClasses = `
    fixed top-0 bottom-0 right-0 w-full max-w-sm bg-white dark:bg-[#0F1117] shadow-xl
    flex flex-col z-40 border-l border-gray-200 dark:border-gray-800
    lg:relative lg:translate-x-0 lg:z-0
    ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
    transition-transform duration-300
  `;
  const isEmpty = trailerBuild.length === 0 && truckBuild.length === 0 && loadBuild.length === 0 && (!modularTrailer || modularTrailer.modules.length === 0);
  return <aside className={sidebarClasses}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">{t('Build Summary')}</h2>
        <button onClick={onClose} className="lg:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty ? <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>{t('No vehicles or loads added to your build yet.')}</p>
            <p className="mt-2 text-sm">
              {t('Add trucks, trailers, and loads from the catalog to see them here.')}
            </p>
          </div> : <div className="space-y-6">
            {truckBuild.length > 0 && <div>
                <h3 className="text-sm font-medium mb-3 text-primary-600">
                  {t('Trucks')}
                </h3>
                <div className="space-y-4">
                  {truckBuild.map((truck, index) => <div key={`${truck.id}-${index}`} className="bg-surface-100 rounded p-3 relative">
                      <button onClick={() => removeTruck(index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="h-4 w-4" />
                      </button>
                      <div className="pr-6">
                        <div className="font-medium">
                          {truck.manufacturer} {truck.model}
                        </div>
                        <div className="text-sm text-surface-400 flex items-center gap-1 mt-1">
                          <span>{truck.axle_config}</span>
                          <span>•</span>
                          <span>{truck.engine_power_hp} HP</span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div className="text-surface-400">
                            {t('Max GTW')}:
                          </div>
                          <div>{truck.max_gtw_t} t</div>
                          <div className="text-surface-400">{t('Tires')}:</div>
                          <div>
                            {truck.front_tires.label} / {truck.rear_tires.label}
                          </div>
                          <div className="text-surface-400">
                            {t('Options')}:
                          </div>
                          <div>
                            {[truck.has_kingpin ? t('Kingpin') : null, truck.has_counterweight ? t('Counterweight') : null].filter(Boolean).join(', ') || t('None')}
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}
            {trailerBuild.length > 0 && <div>
                <h3 className="text-sm font-medium mb-3 text-primary-600">
                  {t('Trailers')}
                </h3>
                <div className="space-y-4">
                  {trailerBuild.map((trailer, index) => <div key={`${trailer.id}-${index}`} className="bg-surface-100 rounded p-3 relative">
                      <button onClick={() => removeTrailer(index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="h-4 w-4" />
                      </button>
                      <div className="pr-6">
                        <div className="font-medium">
                          {trailer.manufacturer} {trailer.model}
                        </div>
                        <div className="text-sm text-surface-400 flex items-center gap-1 mt-1">
                          <span>{getConnectionIcon(trailer.connection)}</span>
                          <span>{t(trailer.connection)}</span>
                          <span>•</span>
                          <span>
                            {trailer.axles} {t('axles')}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <div className="text-surface-400">{t('Length')}:</div>
                          <div>{trailer.length_closed_m} m</div>
                          <div className="text-surface-400">
                            {t('Payload')}:
                          </div>
                          <div>{trailer.payload_t} t</div>
                          {trailer.tires && <>
                              <div className="text-surface-400">
                                {t('Tires')}:
                              </div>
                              <div>{trailer.tires.label}</div>
                            </>}
                          {trailer.connection === 'gooseneck' && trailer.kingpin_height_m && <>
                                <div className="text-surface-400">
                                  {t('Kingpin height')}:
                                </div>
                                <div>{trailer.kingpin_height_m} m</div>
                              </>}
                          {trailer.connection === 'towbar' && trailer.towbar_length_m && <>
                                <div className="text-surface-400">
                                  {t('Towbar length')}:
                                </div>
                                <div>{trailer.towbar_length_m} m</div>
                              </>}
                          {trailer.connection === 'jeep_dolly' && trailer.jeep_axles && <>
                                <div className="text-surface-400">
                                  {t('Jeep axles')}:
                                </div>
                                <div>{trailer.jeep_axles}</div>
                              </>}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}
            {modularTrailer && modularTrailer.modules.length > 0 && <div>
                <h3 className="text-sm font-medium mb-3 text-primary-600">
                  {t('Trailer Modules')}
                </h3>
                <div className="space-y-4">
                  {modularTrailer.modules.map((module, index) => {
              const ModuleIcon = getModuleIcon(module.type);
              return <div key={`${module.id}-${index}`} className="bg-surface-100 rounded p-3 relative">
                        <div className="pr-6">
                          <div className="font-medium flex items-center">
                            <ModuleIcon className="h-4 w-4 mr-1 text-primary-600" />
                            {t(module.type.charAt(0).toUpperCase() + module.type.slice(1).replace('_', ' '))}
                          </div>
                          <div className="text-sm text-surface-400 flex items-center gap-1 mt-1">
                            <span>{module.length} m</span>
                            <span>•</span>
                            <span>{module.payloadCapacity} t</span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            {module.type === 'axle_bogie' && module.axleCount && <>
                                  <div className="text-surface-400">
                                    {t('Axles')}:
                                  </div>
                                  <div>{module.axleCount}</div>
                                </>}
                            {module.type === 'gooseneck' && module.kingpinHeight && <>
                                  <div className="text-surface-400">
                                    {t('Kingpin Height')}:
                                  </div>
                                  <div>{module.kingpinHeight} m</div>
                                </>}
                            {module.type === 'ramp' && module.rampAngle && <>
                                <div className="text-surface-400">
                                  {t('Ramp Angle')}:
                                </div>
                                <div>{module.rampAngle}°</div>
                              </>}
                          </div>
                        </div>
                      </div>;
            })}
                </div>
              </div>}
            {loadBuild.length > 0 && <div>
                <h3 className="text-sm font-medium mb-3 text-primary-600">
                  {t('Loads')}
                </h3>
                <div className="space-y-4">
                  {loadBuild.map((load, index) => {
              const normalizedLoad = normalizeLoadSpec(load);
              return <div key={`${load.id}-${index}`} className="bg-surface-100 rounded p-3 relative">
                        <button onClick={() => removeLoad(index)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                          <XIcon className="h-4 w-4" />
                        </button>
                        <div className="pr-6">
                          <div className="font-medium flex items-center gap-2">
                            {normalizedLoad.shapeSvg ? <LayersIcon className="h-4 w-4 text-primary-600" /> : <BoxIcon className="h-4 w-4 text-primary-600" />}
                            {t(getCategoryDisplayName(normalizedLoad.category))}
                          </div>
                          <div className="text-sm text-surface-400 flex items-center gap-1 mt-1">
                            <span>{normalizedLoad.weight} t</span>
                            <span>•</span>
                            <span>
                              {normalizedLoad.dims.length}m ×{' '}
                              {normalizedLoad.dims.width}m
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="text-surface-400">
                              {t('CG Chainage')}:
                            </div>
                            <div>{normalizedLoad.cg.chainage} m</div>
                            <div className="text-surface-400">
                              {t('CG Offset')}:
                            </div>
                            <div>{normalizedLoad.cg.offset} m</div>
                            <div className="text-surface-400">
                              {t('Securing')}:
                            </div>
                            <div>
                              {t(getSecuringDisplayName(normalizedLoad.securing))}
                            </div>
                            {normalizedLoad.shapeSvg && <>
                                <div className="text-surface-400">
                                  {t('Shape')}:
                                </div>
                                <div>{t('Custom')}</div>
                              </>}
                          </div>
                        </div>
                      </div>;
            })}
                </div>
              </div>}
          </div>}
      </div>
      {!isEmpty && <>
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <h3 className="font-medium mb-2">{t('Build Totals')}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {trailerBuild.length > 0 && <>
                  <div className="text-surface-400">
                    {t('Total trailer length')}:
                  </div>
                  <div>{trailerTotals.totalLength.toFixed(2)} m</div>
                  <div className="text-surface-400">
                    {t('Total trailer axles')}:
                  </div>
                  <div>{trailerTotals.totalAxles}</div>
                  <div className="text-surface-400">{t('Total payload')}:</div>
                  <div>{trailerTotals.totalPayload.toFixed(1)} t</div>
                </>}
              {modularTrailer && modularTrailer.modules.length > 0 && <>
                  <div className="text-surface-400">
                    {t('Modular trailer length')}:
                  </div>
                  <div>{modularTotals.totalLength.toFixed(2)} m</div>
                  <div className="text-surface-400">
                    {t('Modular trailer axles')}:
                  </div>
                  <div>{modularTotals.totalAxles}</div>
                  <div className="text-surface-400">
                    {t('Modular trailer tare')}:
                  </div>
                  <div>{modularTotals.totalTare.toFixed(1)} t</div>
                  <div className="text-surface-400">
                    {t('Modular payload capacity')}:
                  </div>
                  <div>{modularTotals.totalPayload.toFixed(1)} t</div>
                </>}
              {truckBuild.length > 0 && <>
                  <div className="text-surface-400">
                    {t('Total truck power')}:
                  </div>
                  <div>{truckTotals.totalPower} HP</div>
                  <div className="text-surface-400">
                    {t('Total truck weight')}:
                  </div>
                  <div>{truckTotals.totalTare.toFixed(1)} t</div>
                  <div className="text-surface-400">{t('Max GTW')}:</div>
                  <div>{truckTotals.maxGTW} t</div>
                </>}
              {loadBuild.length > 0 && <>
                  <div className="text-surface-400">
                    {t('Total load weight')}:
                  </div>
                  <div>{loadTotals.totalWeight.toFixed(1)} t</div>
                  <div className="text-surface-400">
                    {t('Average CG chainage')}:
                  </div>
                  <div>{loadTotals.averageCG.toFixed(2)} m</div>
                </>}
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex space-x-3">
            <button onClick={clearAll} className="h-8 px-3 bg-surface-100 text-danger-500 rounded hover:bg-surface-100/60 text-sm flex items-center gap-1 flex-1">
              <TrashIcon className="h-4 w-4" />
              {t('Clear All')}
            </button>
            <button onClick={exportBuild} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1 flex-1">
              <DownloadIcon className="h-4 w-4" />
              {t('Export JSON')}
            </button>
          </div>
        </>}
    </aside>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}
// Helper function to get display name for load category
function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'e-room':
      return 'E-Room';
    case 'cable_spool':
      return 'Cable Spool';
    case 'tower_section':
      return 'Tower Section';
    case 'mining_truck':
      return 'Mining Truck';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  }
}
// Helper function to get display name for securing method
function getSecuringDisplayName(securing: string): string {
  switch (securing) {
    case 'chains_and_straps':
      return 'Chains & Straps';
    default:
      return securing.charAt(0).toUpperCase() + securing.slice(1);
  }
}