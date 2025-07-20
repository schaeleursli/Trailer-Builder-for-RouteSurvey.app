import React, { useEffect } from 'react';
import { AlignJustifyIcon, AlignHorizontalJustifyEndIcon, AlignVerticalJustifyCenterIcon } from 'lucide-react';
type ViewMode = 'top' | 'side' | 'front' | 'isometric';
interface ViewSwitcherProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}
export function ViewSwitcher({
  currentView,
  onChange
}: ViewSwitcherProps) {
  const views: Array<{
    id: ViewMode;
    label: string;
    icon: React.ReactNode;
    hotkey: string;
  }> = [{
    id: 'top',
    label: t('Top'),
    icon: <AlignJustifyIcon className="h-4 w-4" />,
    hotkey: '1'
  }, {
    id: 'side',
    label: t('Side'),
    icon: <AlignHorizontalJustifyEndIcon className="h-4 w-4" />,
    hotkey: '2'
  }, {
    id: 'front',
    label: t('Front'),
    icon: <AlignVerticalJustifyCenterIcon className="h-4 w-4" />,
    hotkey: '3'
  }, {
    id: 'isometric',
    label: t('ISO'),
    icon: <div className="h-4 w-4" />,
    hotkey: '4'
  }];
  // Register hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const view = views.find(v => v.hotkey === e.key);
      if (view) {
        onChange(view.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange, views]);
  return <div className="flex bg-surface-100 rounded-md p-1">
      {views.map(view => <button key={view.id} className={`flex items-center justify-center px-3 py-1.5 rounded-md text-xs transition-colors ${currentView === view.id ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-surface-100/60'}`} onClick={() => onChange(view.id)} title={`${view.label} (${view.hotkey})`}>
          {view.icon}
          <span className="ml-1.5">{view.label}</span>
        </button>)}
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}