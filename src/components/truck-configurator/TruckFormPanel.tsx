import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { TruckSpec } from '../../types/trailer';
interface TruckFormPanelProps {
  config: TruckSpec;
  onChange: (field: string, value: any) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}
export function TruckFormPanel({
  config,
  onChange,
  activeSection,
  onSectionChange
}: TruckFormPanelProps) {
  const sections = [{
    id: 'basic-info',
    title: t('Basic Info'),
    fields: [{
      id: 'truck_name',
      label: t('Truck ID / Name'),
      type: 'text',
      value: config.truck_name || ''
    }, {
      id: 'manufacturer',
      label: t('Manufacturer'),
      type: 'text',
      value: config.manufacturer
    }, {
      id: 'model',
      label: t('Model'),
      type: 'text',
      value: config.model
    }, {
      id: 'year',
      label: t('Year'),
      type: 'number',
      value: config.year || new Date().getFullYear(),
      min: 1950,
      max: new Date().getFullYear() + 1
    }, {
      id: 'cab_type',
      label: t('Cab Type'),
      type: 'select',
      value: config.cab_type,
      options: [{
        value: 'day',
        label: t('Day Cab')
      }, {
        value: 'sleeper',
        label: t('Sleeper Cab')
      }]
    }]
  }, {
    id: 'axle-config',
    title: t('Axle Configuration'),
    fields: [{
      id: 'num_axles',
      label: t('Number of Axles'),
      type: 'number',
      value: config.num_axles || (config.axle_config ? parseInt(config.axle_config.split('x')[0]) / 2 : 3),
      min: 2,
      max: 5,
      step: 1
    }, {
      id: 'axle_config',
      label: t('Axle Configuration'),
      type: 'select',
      value: config.axle_config,
      options: [{
        value: '4x2',
        label: '4x2'
      }, {
        value: '4x4',
        label: '4x4'
      }, {
        value: '6x2',
        label: '6x2'
      }, {
        value: '6x4',
        label: '6x4'
      }, {
        value: '6x6',
        label: '6x6'
      }, {
        value: '8x4',
        label: '8x4'
      }, {
        value: '8x6',
        label: '8x6'
      }, {
        value: '8x8',
        label: '8x8'
      }, {
        value: '10x4',
        label: '10x4'
      }, {
        value: '10x6',
        label: '10x6'
      }, {
        value: '10x8',
        label: '10x8'
      }]
    }, {
      id: 'track_width_m',
      label: t('Track Width (m)'),
      type: 'number',
      value: config.track_width_m || 2.55,
      min: 2.0,
      max: 3.0,
      step: 0.01
    }, ...(config.axle_spacings || []).map((spacing, index) => ({
      id: `axle_spacings[${index}]`,
      label: t(`Axle ${index + 1} to ${index + 2} Spacing (m)`),
      type: 'number',
      value: spacing,
      min: 0.8,
      max: 2.5,
      step: 0.01
    }))]
  }, {
    id: 'tire-setup',
    title: t('Tire Setup'),
    fields: [{
      id: 'front_tires.width_mm',
      label: t('Front Tire Width (mm)'),
      type: 'number',
      value: config.front_tires?.width_mm || 385,
      min: 275,
      max: 445,
      step: 10
    }, {
      id: 'front_tires.aspect_ratio',
      label: t('Front Tire Aspect Ratio (%)'),
      type: 'number',
      value: config.front_tires?.aspect_ratio || 65,
      min: 45,
      max: 95,
      step: 5
    }, {
      id: 'front_tires.rim_size_inch',
      label: t('Front Tire Rim Size (inch)'),
      type: 'number',
      value: config.front_tires?.rim_size_inch || 22.5,
      min: 17.5,
      max: 24.5,
      step: 0.5
    }, {
      id: 'rear_tires.width_mm',
      label: t('Rear Tire Width (mm)'),
      type: 'number',
      value: config.rear_tires?.width_mm || 315,
      min: 275,
      max: 445,
      step: 10
    }, {
      id: 'rear_tires.aspect_ratio',
      label: t('Rear Tire Aspect Ratio (%)'),
      type: 'number',
      value: config.rear_tires?.aspect_ratio || 80,
      min: 45,
      max: 95,
      step: 5
    }, {
      id: 'rear_tires.rim_size_inch',
      label: t('Rear Tire Rim Size (inch)'),
      type: 'number',
      value: config.rear_tires?.rim_size_inch || 22.5,
      min: 17.5,
      max: 24.5,
      step: 0.5
    }, {
      id: 'tire_pressure_bar',
      label: t('Tire Pressure (bar)'),
      type: 'number',
      value: config.tire_pressure_bar || 8.5,
      min: 6.0,
      max: 10.0,
      step: 0.1
    }]
  }, {
    id: 'dimensions',
    title: t('Dimensions'),
    fields: [{
      id: 'wheelbase_m',
      label: t('Wheelbase (m)'),
      type: 'number',
      value: config.wheelbase_m,
      min: 2.5,
      max: 6.5,
      step: 0.01
    }, {
      id: 'overall_length_m',
      label: t('Overall Length (m)'),
      type: 'number',
      value: config.overall_length_m || config.wheelbase_m + 2.7,
      min: 5.0,
      max: 12.0,
      step: 0.01
    }, {
      id: 'overall_width_m',
      label: t('Overall Width (m)'),
      type: 'number',
      value: config.overall_width_m || 2.55,
      min: 2.3,
      max: 3.0,
      step: 0.01
    }, {
      id: 'cab_height_m',
      label: t('Cab Height (m)'),
      type: 'number',
      value: config.cab_height_m || 3.2,
      min: 2.5,
      max: 4.0,
      step: 0.01
    }, {
      id: 'chassis_height_m',
      label: t('Chassis Height (m)'),
      type: 'number',
      value: config.chassis_height_m || 1.0,
      min: 0.8,
      max: 1.5,
      step: 0.01
    }, {
      id: 'ground_clearance_m',
      label: t('Ground Clearance (m)'),
      type: 'number',
      value: config.ground_clearance_m || 0.35,
      min: 0.2,
      max: 0.6,
      step: 0.01
    }]
  }, {
    id: 'weight-distribution',
    title: t('Weight & Distribution'),
    fields: [{
      id: 'tare_t',
      label: t('Tare Weight (t)'),
      type: 'number',
      value: config.tare_t,
      min: 5.0,
      max: 15.0,
      step: 0.1
    }, {
      id: 'payload_capacity_t',
      label: t('Payload Capacity (t)'),
      type: 'number',
      value: config.payload_capacity_t || 25,
      min: 10.0,
      max: 100.0,
      step: 0.1
    }, {
      id: 'max_gtw_t',
      label: t('Maximum GTW (t)'),
      type: 'number',
      value: config.max_gtw_t,
      min: 40.0,
      max: 250.0,
      step: 0.1
    }, ...(config.axle_weights || []).map((weight, index) => ({
      id: `axle_weights[${index}]`,
      label: t(`Axle ${index + 1} Weight (t)`),
      type: 'number',
      value: weight,
      min: 0,
      max: 20,
      step: 0.1
    }))]
  }, {
    id: 'connection-counterweight',
    title: t('Connection & Counterweight'),
    fields: [{
      id: 'has_kingpin',
      label: t('Kingpin'),
      type: 'checkbox',
      value: config.has_kingpin
    }, ...(config.has_kingpin ? [{
      id: 'kingpin_height_m',
      label: t('Kingpin Height (m)'),
      type: 'number',
      value: config.kingpin_height_m || 1.2,
      min: 0.8,
      max: 1.5,
      step: 0.01
    }, {
      id: 'kingpin_offset_m',
      label: t('Kingpin Offset (m)'),
      type: 'number',
      value: config.kingpin_offset_m || 0.5,
      min: 0,
      max: 2.0,
      step: 0.01
    }] : []), {
      id: 'has_counterweight',
      label: t('Counterweight'),
      type: 'checkbox',
      value: config.has_counterweight
    }, ...(config.has_counterweight ? [{
      id: 'counterweight_mass_t',
      label: t('Counterweight Mass (t)'),
      type: 'number',
      value: config.counterweight_mass_t || 1.5,
      min: 0.5,
      max: 5.0,
      step: 0.1
    }, {
      id: 'counterweight_position_m',
      label: t('Counterweight Position (m from rear)'),
      type: 'number',
      value: config.counterweight_position_m || 0.5,
      min: 0,
      max: 1.5,
      step: 0.01
    }] : [])]
  }, {
    id: 'suspension-brakes',
    title: t('Suspension & Brakes'),
    fields: [{
      id: 'suspension_type',
      label: t('Suspension Type'),
      type: 'select',
      value: config.suspension_type || 'leaf',
      options: [{
        value: 'leaf',
        label: t('Leaf Spring')
      }, {
        value: 'airbag',
        label: t('Air Bag')
      }, {
        value: 'coil',
        label: t('Coil Spring')
      }]
    }, {
      id: 'brake_type',
      label: t('Brake Type'),
      type: 'select',
      value: config.brake_type || 'disc',
      options: [{
        value: 'disc',
        label: t('Disc')
      }, {
        value: 'drum',
        label: t('Drum')
      }]
    }, {
      id: 'max_steering_angle_deg',
      label: t('Max Steering Angle (°)'),
      type: 'number',
      value: config.max_steering_angle_deg || 40,
      min: 30,
      max: 50,
      step: 1
    }]
  }, {
    id: 'notes',
    title: t('Notes'),
    fields: [{
      id: 'notes',
      label: t('Additional Notes'),
      type: 'textarea',
      value: config.notes || '',
      rows: 4
    }]
  }];
  const toggleSection = (sectionId: string) => {
    onSectionChange(activeSection === sectionId ? '' : sectionId);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    if (type === 'checkbox') {
      onChange(name, (e.target as HTMLInputElement).checked);
    } else if (type === 'number') {
      onChange(name, parseFloat(value));
    } else {
      onChange(name, value);
    }
  };
  return <div className="bg-surface rounded-card shadow-card overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold">{t('Truck Configuration')}</h2>
        <p className="text-sm text-surface-400">
          {t('Configure all aspects of your truck')}
        </p>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {sections.map(section => <div key={section.id} className="overflow-hidden">
            <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-100 dark:hover:bg-gray-800 transition-colors" onClick={() => toggleSection(section.id)}>
              <span className="font-medium">{section.title}</span>
              {activeSection === section.id ? <ChevronUpIcon className="h-5 w-5 text-surface-400" /> : <ChevronDownIcon className="h-5 w-5 text-surface-400" />}
            </button>
            {activeSection === section.id && <div className="px-4 pb-4 space-y-4">
                {section.fields.map(field => <div key={field.id} className="space-y-1">
                    <label htmlFor={field.id} className="block text-sm text-surface-400">
                      {field.label}
                    </label>
                    {field.type === 'text' && <input type="text" id={field.id} name={field.id} value={field.value} onChange={handleInputChange} className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />}
                    {field.type === 'number' && <input type="number" id={field.id} name={field.id} value={field.value} min={field.min} max={field.max} step={field.step} onChange={handleInputChange} className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />}
                    {field.type === 'select' && <select id={field.id} name={field.id} value={field.value} onChange={handleInputChange} className="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]">
                        {field.options?.map(option => <option key={option.value} value={option.value}>
                            {option.label}
                          </option>)}
                      </select>}
                    {field.type === 'checkbox' && <div className="flex items-center">
                        <input type="checkbox" id={field.id} name={field.id} checked={field.value} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
                        <label htmlFor={field.id} className="ml-2 block text-sm">
                          {t('Enable')}
                        </label>
                      </div>}
                    {field.type === 'textarea' && <textarea id={field.id} name={field.id} value={field.value} rows={field.rows || 3} onChange={handleInputChange} className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0F1117]" />}
                  </div>)}
              </div>}
          </div>)}
      </div>
    </div>;
}
// Simple i18n placeholder function
function t(str: string): string {
  return str;
}