import React, { useMemo, useState } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { useTruckStore } from '../hooks/useTruckStore';
import { TruckCard } from './TruckCard';
interface TruckCatalogProps {
  onSelectTruck: (truckId: string) => void;
}
export function TruckCatalog({
  onSelectTruck
}: TruckCatalogProps) {
  const {
    trucks
  } = useTruckStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const axleConfigs = useMemo(() => {
    const configs = new Set<string>();
    trucks.forEach(truck => configs.add(truck.axle_config));
    return Array.from(configs);
  }, [trucks]);
  const filteredTrucks = useMemo(() => {
    return trucks.filter(truck => {
      const matchesSearch = searchQuery === '' || truck.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || truck.model.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === null || truck.axle_config === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [trucks, searchQuery, activeFilter]);
  return <div className="max-w-7xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input type="text" placeholder={t('Search trucks...')} className="w-full h-10 pl-10 pr-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117] focus:ring-2 focus:ring-[#2E5FEC] focus:border-transparent" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <FilterIcon className="h-4 w-4" />
            <span>{t('Filter')}:</span>
          </div>
          <button className={`px-3 py-1 text-sm rounded-full ${activeFilter === null ? 'bg-[#2E5FEC] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveFilter(null)}>
            {t('All')}
          </button>
          {axleConfigs.map(config => <button key={config} className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeFilter === config ? 'bg-[#2E5FEC] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveFilter(config)}>
              {config}
            </button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrucks.map(truck => <TruckCard key={truck.id} truck={truck} onSelect={() => onSelectTruck(truck.id)} />)}
        {filteredTrucks.length === 0 && <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <p>{t('No trucks found matching your criteria.')}</p>
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}