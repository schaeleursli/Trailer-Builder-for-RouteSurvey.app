import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, SaveIcon, AlertTriangleIcon } from 'lucide-react';
import { TruckSpec } from '../../types/trailer';
import { useTruckStore } from '../../hooks/useTruckStore';
import { TruckFormPanel } from './TruckFormPanel';
import { TruckPreviewPanel } from './TruckPreviewPanel';
import { TruckSummaryCard } from './TruckSummaryCard';
import { calculateCenterOfGravity, validateTruckConfig } from '../../utils/truckCalculations';
interface TruckConfiguratorPageProps {
  truckId: string | null;
  onClose: () => void;
  onSave: (truck: TruckSpec) => void;
}
export function TruckConfiguratorPage({
  truckId,
  onClose,
  onSave
}: TruckConfiguratorPageProps) {
  const {
    trucks
  } = useTruckStore();
  const [config, setConfig] = useState<TruckSpec | null>(null);
  const [activeSection, setActiveSection] = useState<string>('basic-info');
  const [validationMessages, setValidationMessages] = useState<Array<{
    message: string;
    severity: 'warning' | 'error';
  }>>([]);
  const [previewMode, setPreviewMode] = useState<'side' | 'top' | 'both'>('both');
  // Initialize config from existing truck or create a new one
  useEffect(() => {
    if (truckId) {
      const truck = trucks.find(t => t.id === truckId);
      if (truck) {
        setConfig({
          ...truck
        });
      }
    } else {
      // Default new truck
      setConfig({
        id: `truck-${Date.now()}`,
        manufacturer: '',
        model: '',
        axle_config: '6x4',
        has_counterweight: false,
        has_kingpin: false,
        engine_power_hp: 500,
        tare_t: 9.0,
        max_gtw_t: 150,
        wheelbase_m: 3.8,
        cab_type: 'day',
        img: 'https://placehold.co/1600x900?text=Truck',
        front_tires: {
          width_mm: 385,
          aspect_ratio: 65,
          rim_size_inch: 22.5,
          label: '385/65R22.5'
        },
        rear_tires: {
          width_mm: 315,
          aspect_ratio: 80,
          rim_size_inch: 22.5,
          label: '315/80R22.5'
        },
        notes: '',
        // Extended properties for detailed configurator
        truck_name: '',
        year: new Date().getFullYear(),
        num_axles: 3,
        axle_spacings: [1.4, 1.4],
        track_width_m: 2.55,
        overall_length_m: 6.5,
        overall_width_m: 2.55,
        cab_height_m: 3.2,
        chassis_height_m: 1.0,
        payload_capacity_t: 25,
        axle_weights: [7.5, 11.5, 11.5],
        kingpin_height_m: 1.2,
        kingpin_offset_m: 0.5,
        counterweight_mass_t: 1.5,
        counterweight_position_m: 0.5,
        ground_clearance_m: 0.35,
        max_steering_angle_deg: 40,
        suspension_type: 'leaf',
        brake_type: 'disc',
        tire_pressure_bar: 8.5
      });
    }
  }, [truckId, trucks]);
  // Validate configuration when it changes
  useEffect(() => {
    if (config) {
      const messages = validateTruckConfig(config);
      setValidationMessages(messages);
    }
  }, [config]);
  const handleFormChange = (field: string, value: any) => {
    if (!config) return;
    setConfig(prevConfig => {
      if (!prevConfig) return null;
      // Handle nested properties
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prevConfig,
          [parent]: {
            ...prevConfig[parent],
            [child]: value
          }
        };
      }
      // Special handling for axle-related fields that might need array resizing
      if (field === 'num_axles') {
        const newNumAxles = value as number;
        const currentAxles = prevConfig.axle_weights?.length || 0;
        let newAxleWeights = [...(prevConfig.axle_weights || [])];
        let newAxleSpacings = [...(prevConfig.axle_spacings || [])];
        // Adjust axle weights array
        if (newNumAxles > currentAxles) {
          // Add new axles with default weight
          for (let i = currentAxles; i < newNumAxles; i++) {
            newAxleWeights.push(10);
          }
        } else if (newNumAxles < currentAxles) {
          // Remove excess axles
          newAxleWeights = newAxleWeights.slice(0, newNumAxles);
        }
        // Adjust axle spacings array (always 1 less than number of axles)
        if (newNumAxles > 1) {
          if (newNumAxles - 1 > newAxleSpacings.length) {
            // Add new spacings with default value
            for (let i = newAxleSpacings.length; i < newNumAxles - 1; i++) {
              newAxleSpacings.push(1.4);
            }
          } else if (newNumAxles - 1 < newAxleSpacings.length) {
            // Remove excess spacings
            newAxleSpacings = newAxleSpacings.slice(0, newNumAxles - 1);
          }
        } else {
          newAxleSpacings = [];
        }
        // Update axle_config to match number of axles
        const drivenWheels = prevConfig.axle_config.split('x')[1] || '2';
        const newAxleConfig = `${newNumAxles * 2}x${Math.min(newNumAxles * 2, parseInt(drivenWheels))}`;
        return {
          ...prevConfig,
          [field]: value,
          axle_weights: newAxleWeights,
          axle_spacings: newAxleSpacings,
          axle_config: newAxleConfig
        };
      }
      // Special handling for axle_weights array
      if (field.startsWith('axle_weights[')) {
        const index = parseInt(field.match(/\[(\d+)\]/)?.[1] || '0');
        const newAxleWeights = [...(prevConfig.axle_weights || [])];
        newAxleWeights[index] = value;
        return {
          ...prevConfig,
          axle_weights: newAxleWeights
        };
      }
      // Special handling for axle_spacings array
      if (field.startsWith('axle_spacings[')) {
        const index = parseInt(field.match(/\[(\d+)\]/)?.[1] || '0');
        const newAxleSpacings = [...(prevConfig.axle_spacings || [])];
        newAxleSpacings[index] = value;
        return {
          ...prevConfig,
          axle_spacings: newAxleSpacings
        };
      }
      // Default case for simple field updates
      return {
        ...prevConfig,
        [field]: value
      };
    });
  };
  const handleSave = () => {
    if (config) {
      onSave(config);
    }
  };
  if (!config) return null;
  return <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-surface dark:bg-[#0F1117] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={onClose} className="flex items-center text-sm text-surface-400 hover:text-gray-700">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            {t('Back')}
          </button>
          <h1 className="text-xl font-semibold">
            {config.truck_name || config.manufacturer ? `${config.truck_name || ''} ${config.manufacturer} ${config.model}`.trim() : t('New Truck Configuration')}
          </h1>
          <button onClick={handleSave} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1">
            <SaveIcon className="h-4 w-4" />
            {t('Save Configuration')}
          </button>
        </div>
      </header>
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row h-full gap-4">
          {/* Form Panel */}
          <div className="md:w-1/3 overflow-auto">
            <TruckFormPanel config={config} onChange={handleFormChange} activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
          {/* Preview Panel */}
          <div className="md:w-1/3 overflow-auto">
            <TruckPreviewPanel config={config} mode={previewMode} onModeChange={setPreviewMode} />
          </div>
          {/* Summary Card */}
          <div className="md:w-1/3 overflow-auto">
            <TruckSummaryCard config={config} validationMessages={validationMessages} />
          </div>
        </div>
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}