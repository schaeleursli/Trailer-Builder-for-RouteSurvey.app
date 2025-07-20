import React from 'react';
import { ConnectionType } from '../types/trailer';
import { getConnectionIcon } from '../utils/connectionUtils';
interface ConnectionTypePickerProps {
  value: ConnectionType;
  onChange: (value: ConnectionType) => void;
}
export function ConnectionTypePicker({
  value,
  onChange
}: ConnectionTypePickerProps) {
  const options: {
    value: ConnectionType;
    label: string;
  }[] = [{
    value: 'gooseneck',
    label: t('Gooseneck')
  }, {
    value: 'towbar',
    label: t('Towbar')
  }, {
    value: 'jeep_dolly',
    label: t('Jeep/Dolly')
  }];
  return <div className="grid grid-cols-3 gap-3">
      {options.map(option => <div key={option.value} className={`
            border rounded p-3 text-center cursor-pointer transition
            ${value === option.value ? 'border-[#2E5FEC] bg-[#2E5FEC]/10' : 'border-gray-300 dark:border-gray-700 hover:border-[#2E5FEC]/50'}
          `} onClick={() => onChange(option.value)}>
          <div className="text-2xl mb-1">{getConnectionIcon(option.value)}</div>
          <div className="text-sm font-medium">{option.label}</div>
        </div>)}
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}