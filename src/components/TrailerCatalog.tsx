import React, { useMemo, useState } from 'react';
import { useTrailerStore } from '../hooks/useTrailerStore';
import { TrailerCard } from './TrailerCard';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { TrailerSpec } from '../types/trailer';
interface TrailerCatalogProps {
  onSelectTrailer: (trailerId: string) => void;
}
export function TrailerCatalog({
  onSelectTrailer
}: TrailerCatalogProps) {
  const {
    trailers
  } = useTrailerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const trailerTypes = useMemo(() => {
    const types = new Set<string>();
    trailers.forEach(trailer => types.add(trailer.type));
    return Array.from(types);
  }, [trailers]);
  const filteredTrailers = useMemo(() => {
    return trailers.filter(trailer => {
      const matchesSearch = searchQuery === '' || trailer.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) || trailer.model.toLowerCase().includes(searchQuery.toLowerCase()) || trailer.family.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === null || trailer.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [trailers, searchQuery, activeFilter]);
  return <div className="max-w-7xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input type="text" placeholder={t('Search trailers...')} className="w-full h-10 pl-10 pr-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117] focus:ring-2 focus:ring-[#2E5FEC] focus:border-transparent" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
          {trailerTypes.map(type => <button key={type} className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${activeFilter === type ? 'bg-[#2E5FEC] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`} onClick={() => setActiveFilter(type)}>
              {t(type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '))}
            </button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrailers.map(trailer => <TrailerCard key={trailer.id} trailer={trailer} onSelect={() => onSelectTrailer(trailer.id)} />)}
        {filteredTrailers.length === 0 && <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <p>{t('No trailers found matching your criteria.')}</p>
          </div>}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}