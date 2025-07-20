import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { TrailerModule } from '../types/trailer';
import { ModuleCard } from './ModuleCard';
import moduleTemplates from '../data/moduleTemplates.json';
interface ModuleCatalogProps {
  onSelectModule: (module: TrailerModule) => void;
}
export function ModuleCatalog({
  onSelectModule
}: ModuleCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  // Filter modules based on search query and type filter
  const filteredModules = moduleTemplates.filter(module => {
    const matchesSearch = searchQuery === '' || module.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === null || module.type === filter;
    return matchesSearch && matchesFilter;
  });
  // Get unique module types for filter buttons
  const moduleTypes = Array.from(new Set(moduleTemplates.map(m => m.type)));
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input type="text" className="block w-full h-10 pl-10 pr-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" placeholder={t('Search modules...')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button className={`h-10 px-3 rounded text-sm whitespace-nowrap ${filter === null ? 'bg-primary-600 text-white' : 'bg-surface-100 text-primary-600 hover:bg-surface-100/60'}`} onClick={() => setFilter(null)}>
            {t('All')}
          </button>
          {moduleTypes.map(type => <button key={type} className={`h-10 px-3 rounded text-sm whitespace-nowrap ${filter === type ? 'bg-primary-600 text-white' : 'bg-surface-100 text-primary-600 hover:bg-surface-100/60'}`} onClick={() => setFilter(type)}>
              {t(type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '))}
            </button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map(module => <ModuleCard key={module.id} module={module} onClick={() => onSelectModule(module)} onAdd={() => onSelectModule(module)} />)}
      </div>
      {filteredModules.length === 0 && <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>{t('No modules found matching your search.')}</p>
        </div>}
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}