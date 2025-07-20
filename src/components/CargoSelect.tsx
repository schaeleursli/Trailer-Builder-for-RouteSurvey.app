import React, { useMemo, useState } from 'react';
import { SearchIcon, BoxIcon } from 'lucide-react';
import { useLoadStore } from '../hooks/useLoadStore';
import { LoadSpec, LoadCategory, normalizeLoadSpec } from '../types/load';
import { LoadSvgPreview } from './LoadSvgPreview';
interface CargoSelectProps {
  onSelectLoad: (loadId: string) => void;
  selectedLoadId: string | null;
}
export function CargoSelect({
  onSelectLoad,
  selectedLoadId
}: CargoSelectProps) {
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
  return <div className="bg-white dark:bg-[#0F1117] rounded-card shadow-card p-4 h-full flex flex-col">
      <h2 className="text-xl font-satoshi mb-4">{t('Select Cargo')}</h2>
      <div className="mb-4 flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input type="text" placeholder={t('Search cargo...')} className="pl-10 h-10 w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" value={filterCategory || ''} onChange={e => setFilterCategory(e.target.value as LoadCategory || null)}>
          <option value="">{t('All cargo types')}</option>
          {loadCategories.map(category => <option key={category} value={category}>
              {t(getCategoryDisplayName(category))}
            </option>)}
        </select>
      </div>
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-1 gap-4">
          {filteredLoads.map(load => <CargoCard key={load.id} load={normalizeLoadSpec(load)} isSelected={load.id === selectedLoadId} onSelect={() => onSelectLoad(load.id)} />)}
          {filteredLoads.length === 0 && <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <BoxIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">{t('No cargo found')}</p>
              <p className="text-sm mt-2">
                {t('Try adjusting your search or filter criteria')}
              </p>
            </div>}
        </div>
      </div>
    </div>;
}
interface CargoCardProps {
  load: LoadSpec;
  isSelected: boolean;
  onSelect: () => void;
}
function CargoCard({
  load,
  isSelected,
  onSelect
}: CargoCardProps) {
  const normalizedLoad = normalizeLoadSpec(load);
  return <div className={`bg-surface-100 dark:bg-gray-800 rounded-lg p-3 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`} onClick={onSelect}>
      <div className="flex items-start gap-3">
        <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded flex items-center justify-center overflow-hidden">
          <LoadSvgPreview load={normalizedLoad} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-base">
            {t(getCategoryDisplayName(normalizedLoad.category))}
          </h3>
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {normalizedLoad.weight}t
            </span>
            <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {normalizedLoad.dims.length}m × {normalizedLoad.dims.width}m ×{' '}
              {normalizedLoad.dims.height}m
            </span>
          </div>
          <div className="mt-2 text-sm text-surface-400">
            CG: {normalizedLoad.cg.chainage}m chainage,{' '}
            {normalizedLoad.cg.offset}m offset
          </div>
        </div>
      </div>
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
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}