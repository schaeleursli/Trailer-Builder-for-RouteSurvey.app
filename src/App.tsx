import React, { useState, Suspense, Component } from 'react';
import { TrailerCatalog } from './components/TrailerCatalog';
import { TruckCatalog } from './components/TruckCatalog';
import { LoadCatalog } from './components/LoadCatalog';
import { ConfiguratorDrawer } from './components/ConfiguratorDrawer';
import { TruckConfiguratorDrawer } from './components/TruckConfiguratorDrawer';
import { LoadConfiguratorDrawer } from './components/LoadConfiguratorDrawer';
import { BuildSummarySidebar } from './components/BuildSummarySidebar';
import { TrailerCADModal } from './components/cad/TrailerCADModal';
import { TruckProvider } from './hooks/TruckContext';
import { TrailerProvider } from './hooks/TrailerContext';
import { LoadProvider } from './hooks/LoadContext';
import { ModularTrailerProvider } from './contexts/ModularTrailerContext';
import { ModuleCatalog } from './components/ModuleCatalog';
import { ModuleConfiguratorDrawer } from './components/ModuleConfiguratorDrawer';
import { ModularCanvas } from './components/ModularCanvas';
import { ModularSummaryCard } from './components/ModularSummaryCard';
import { useModularTrailerStore } from './hooks/useModularTrailerStore';
import { TrailerModule } from './types/trailer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SmartBuilder } from './pages/SmartBuilder';
// Error boundary component
class ErrorBoundary extends Component<{
  children: React.ReactNode;
}, {
  hasError: boolean;
  errorMessage: string;
}> {
  constructor(props: {
    children: React.ReactNode;
  }) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }
  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unknown error occurred'
    };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-surface-400 mb-2">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
          <p className="text-xs text-red-500">{this.state.errorMessage}</p>
        </div>;
    }
    return this.props.children;
  }
}
export function App() {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isTruckConfiguratorOpen, setIsTruckConfiguratorOpen] = useState(false);
  const [isLoadConfiguratorOpen, setIsLoadConfiguratorOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCADModalOpen, setIsCADModalOpen] = useState(false);
  const [selectedTrailerId, setSelectedTrailerId] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trailers' | 'trucks' | 'loads' | 'modular'>('trailers');
  // Module configurator state
  const [isModuleConfiguratorOpen, setIsModuleConfiguratorOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TrailerModule | null>(null);
  const [isNewModule, setIsNewModule] = useState(false);
  const openConfigurator = (trailerId: string) => {
    setSelectedTrailerId(trailerId);
    setIsConfiguratorOpen(true);
  };
  const closeConfigurator = () => {
    setIsConfiguratorOpen(false);
    setSelectedTrailerId(null);
  };
  const openTruckConfigurator = (truckId: string) => {
    setSelectedTruckId(truckId);
    setIsTruckConfiguratorOpen(true);
  };
  const closeTruckConfigurator = () => {
    setIsTruckConfiguratorOpen(false);
    setSelectedTruckId(null);
  };
  const openLoadConfigurator = (loadId: string) => {
    setSelectedLoadId(loadId);
    setIsLoadConfiguratorOpen(true);
  };
  const closeLoadConfigurator = () => {
    setIsLoadConfiguratorOpen(false);
    setSelectedLoadId(null);
  };
  const openModuleConfigurator = (module: TrailerModule, isNew = false) => {
    setSelectedModule(module);
    setIsNewModule(isNew);
    setIsModuleConfiguratorOpen(true);
  };
  const closeModuleConfigurator = () => {
    setIsModuleConfiguratorOpen(false);
    setSelectedModule(null);
  };
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  const openCADModal = (trailerId: string) => {
    setSelectedTrailerId(trailerId);
    setIsCADModalOpen(true);
    setIsConfiguratorOpen(false);
  };
  const closeCADModal = () => {
    setIsCADModalOpen(false);
  };
  // Get modularTrailerStore functions for module handling
  const modularTrailerStore = useModularTrailerStore();
  // Handle module save with proper store access
  const handleModuleSave = (module: TrailerModule) => {
    if (isNewModule) {
      modularTrailerStore.addModule(module);
    } else {
      modularTrailerStore.updateModule(module.id, module);
    }
    closeModuleConfigurator();
  };
  return <ErrorBoundary>
      <Router>
        <TruckProvider>
          <TrailerProvider>
            <LoadProvider>
              <ModularTrailerProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/smart-builder" element={<SmartBuilder />} />
                    <Route path="/*" element={<div className="flex min-h-screen bg-surface dark:bg-[#0F1117] text-gray-900 dark:text-white">
                          <div className="flex-1 flex flex-col">
                            <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-surface dark:bg-[#0F1117] shadow-sm">
                              <div className="max-w-7xl mx-auto flex items-center justify-between">
                                <h1 className="text-xl font-semibold">
                                  {t('Transport Builder')}
                                </h1>
                                <button onClick={toggleMobileSidebar} className="lg:hidden px-3 py-2 rounded bg-primary-600 text-white">
                                  {t('Build Summary')}
                                </button>
                              </div>
                            </header>
                            <div className="border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-[#0F1117]">
                              <div className="max-w-7xl mx-auto px-4">
                                <div className="flex space-x-8 overflow-x-auto">
                                  <button className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'trailers' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('trailers')}>
                                    {t('Trailers')}
                                  </button>
                                  <button className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'modular' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('modular')}>
                                    {t('Modular Trailer')}
                                  </button>
                                  <button className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'trucks' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('trucks')}>
                                    {t('Trucks')}
                                  </button>
                                  <button className={`py-3 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'loads' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`} onClick={() => setActiveTab('loads')}>
                                    {t('Loads')}
                                  </button>
                                  <button className="py-3 border-b-2 font-medium text-sm whitespace-nowrap border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" onClick={() => window.location.href = '/smart-builder'}>
                                    {t('Smart Builder')}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <main className="flex-1 p-4 overflow-auto">
                              {activeTab === 'trailers' ? <TrailerCatalog onSelectTrailer={openConfigurator} /> : activeTab === 'trucks' ? <TruckCatalog onSelectTruck={openTruckConfigurator} /> : activeTab === 'loads' ? <LoadCatalog onSelectLoad={openLoadConfigurator} /> : <ModularTrailerBuilder onSelectModule={openModuleConfigurator} />}
                            </main>
                          </div>
                          <BuildSummarySidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
                          <ConfiguratorDrawer isOpen={isConfiguratorOpen} onClose={closeConfigurator} trailerId={selectedTrailerId} onOpenCAD={openCADModal} />
                          <TruckConfiguratorDrawer isOpen={isTruckConfiguratorOpen} onClose={closeTruckConfigurator} truckId={selectedTruckId} />
                          <LoadConfiguratorDrawer isOpen={isLoadConfiguratorOpen} onClose={closeLoadConfigurator} loadId={selectedLoadId} />
                          <ModuleConfiguratorDrawer isOpen={isModuleConfiguratorOpen} onClose={closeModuleConfigurator} module={selectedModule} onSave={handleModuleSave} isNew={isNewModule} />
                          <TrailerCADModal isOpen={isCADModalOpen} onClose={closeCADModal} trailerId={selectedTrailerId} />
                        </div>} />
                  </Routes>
                </Suspense>
              </ModularTrailerProvider>
            </LoadProvider>
          </TrailerProvider>
        </TruckProvider>
      </Router>
    </ErrorBoundary>;
}
function ModularTrailerBuilder({
  onSelectModule
}: {
  onSelectModule: (module: TrailerModule, isNew?: boolean) => void;
}) {
  const {
    current,
    addModule,
    removeModule,
    moveModule
  } = useModularTrailerStore();
  return <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            {t('Modular Trailer Builder')}
          </h2>
          {/* Module Catalog */}
          <div className="bg-surface rounded-card shadow-card p-4">
            <h3 className="text-lg font-semibold mb-4">
              {t('Module Catalog')}
            </h3>
            <ModuleCatalog onSelectModule={module => onSelectModule(module, true)} />
          </div>
          {/* Canvas */}
          <div className="h-[500px]">
            <ModularCanvas trailer={current!} onSelectModule={module => onSelectModule(module, false)} onRemoveModule={removeModule} onMoveModule={moveModule} />
          </div>
        </div>
        {/* Summary */}
        <div>
          <ModularSummaryCard trailer={current!} />
        </div>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}