import React, { useEffect } from 'react';
import { TruckConfiguratorPage } from './truck-configurator/TruckConfiguratorPage';
import { useTruckStore } from '../hooks/useTruckStore';
interface TruckConfiguratorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  truckId: string | null;
}
export function TruckConfiguratorDrawer({
  isOpen,
  onClose,
  truckId
}: TruckConfiguratorDrawerProps) {
  const {
    addToBuild
  } = useTruckStore();
  if (!isOpen) return null;
  const handleSave = truck => {
    addToBuild(truck);
    onClose();
  };
  return <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 bg-white dark:bg-[#0F1117] shadow-xl flex flex-col overflow-hidden">
        <TruckConfiguratorPage truckId={truckId} onClose={onClose} onSave={handleSave} />
      </div>
    </div>;
}