import React, { useMemo, useState } from 'react';
import { BoxIcon, SearchIcon, TruckIcon, CircleIcon, BarChart4Icon, LayersIcon } from 'lucide-react';
import { useLoadStore } from '../hooks/useLoadStore';
import { LoadSpec, LoadCategory, normalizeLoadSpec } from '../types/load';
interface LoadCatalogProps {
  onSelectLoad: (loadId: string) => void;
}
export function LoadCatalog({
  onSelectLoad
}: LoadCatalogProps) {
  const {
    loads
  } = useLoadStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<LoadCategory | null>(null);
  // Get unique load categories for filter
  const loadCategories = useMemo(() => {
    const categories = new Set<LoadCategory>();
    loads.forEach(load => {
      const normalizedLoad = normalizeLoadSpec(load);
      categories.add(normalizedLoad.category);
    });
    return Array.from(categories);
  }, [loads]);
  // Filter loads based on search and category filter
  const filteredLoads = useMemo(() => {
    return loads.filter(load => {
      const normalizedLoad = normalizeLoadSpec(load);
      const matchesSearch = searchTerm === '' || normalizedLoad.category.toLowerCase().includes(searchTerm.toLowerCase()) || `${normalizedLoad.weight}`.includes(searchTerm);
      const matchesCategory = filterCategory === null || normalizedLoad.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [loads, searchTerm, filterCategory]);
  // Get icon for load category
  const getCategoryIcon = (category: LoadCategory) => {
    switch (category) {
      case 'container':
        return <BoxIcon className="h-5 w-5 text-primary-600" />;
      case 'machinery':
      case 'excavator':
      case 'mining_truck':
        return <TruckIcon className="h-5 w-5 text-primary-600" />;
      case 'tank':
      case 'drum':
        return <CircleIcon className="h-5 w-5 text-primary-600" />;
      case 'blade':
      case 'tower_section':
        return <BarChart4Icon className="h-5 w-5 text-primary-600" />;
      case 'custom':
        return <LayersIcon className="h-5 w-5 text-primary-600" />;
      default:
        return <BoxIcon className="h-5 w-5 text-primary-600" />;
    }
  };
  return <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input type="text" placeholder={t('Search loads...')} className="pl-10 h-10 w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex-shrink-0">
          <select className="h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" value={filterCategory || ''} onChange={e => setFilterCategory(e.target.value as LoadCategory || null)}>
            <option value="">{t('All load types')}</option>
            {loadCategories.map(category => <option key={category} value={category}>
                {t(getCategoryDisplayName(category))}
              </option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLoads.map(load => <LoadCard key={load.id} load={normalizeLoadSpec(load)} onSelect={() => onSelectLoad(load.id)} />)}
        {filteredLoads.length === 0 && <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            <BoxIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('No loads found')}</p>
            <p className="text-sm mt-2">
              {t('Try adjusting your search or filter criteria')}
            </p>
          </div>}
      </div>
    </div>;
}
interface LoadCardProps {
  load: LoadSpec;
  onSelect: () => void;
}
function LoadCard({
  load,
  onSelect
}: LoadCardProps) {
  const normalizedLoad = normalizeLoadSpec(load);
  return <div className="bg-surface rounded-card shadow-card hover:shadow-cardHover transition p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {t(getCategoryDisplayName(normalizedLoad.category))}
          </h3>
          <p className="text-sm text-surface-400">
            {normalizedLoad.weight}t • {normalizedLoad.dims.length}m ×{' '}
            {normalizedLoad.dims.width}m
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-surface-100 flex items-center justify-center">
          {getCategoryIcon(normalizedLoad.category)}
        </div>
      </div>
      <div className="mb-4 aspect-video bg-surface-100 rounded-lg overflow-hidden relative">
        <LoadSvgPreview load={normalizedLoad} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        <div className="text-surface-400">{t('Weight')}:</div>
        <div>{normalizedLoad.weight} t</div>
        <div className="text-surface-400">{t('CG Chainage')}:</div>
        <div>{normalizedLoad.cg.chainage} m</div>
        <div className="text-surface-400">{t('Securing')}:</div>
        <div>{t(getSecuringDisplayName(normalizedLoad.securing))}</div>
        {normalizedLoad.shapeSvg && <>
            <div className="text-surface-400">{t('Shape')}:</div>
            <div>{t('Custom')}</div>
          </>}
      </div>
      <button onClick={onSelect} className="w-full h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm">
        {t('Configure')}
      </button>
    </div>;
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
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}