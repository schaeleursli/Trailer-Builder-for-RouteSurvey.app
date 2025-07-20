export type ConnectionType = 'gooseneck' | 'towbar' | 'jeep_dolly';
export type TruckAxleConfig = '4x2' | '4x4' | '6x2' | '6x4' | '8x4' | '8x6';
export interface TireSpec {
  width_mm: number;
  aspect_ratio: number;
  rim_size_inch: number;
  label: string; // e.g., "385/65R22.5"
}
export interface TrailerSpec {
  id: string;
  manufacturer: string;
  family: string;
  model: string;
  type: 'flat' | 'semi-low' | 'lowbed' | 'platform-modular';
  connection: ConnectionType;
  axles: number;
  width_m: number;
  length_closed_m: number;
  stroke_m?: number;
  deck_height_m: number;
  axle_spacing_m: number;
  payload_t: number;
  tare_t: number;
  /* Connection-specific */
  kingpin_height_m?: number;
  swing_radius_m?: number;
  towbar_length_m?: number;
  eye_height_m?: number;
  jeep_axles?: number;
  jeep_length_m?: number;
  img: string;
  notes?: string;
  /* Tire specification */
  tires?: TireSpec;
}
export interface TruckSpec {
  id: string;
  manufacturer: string;
  model: string;
  axle_config: TruckAxleConfig;
  has_counterweight: boolean;
  has_kingpin: boolean;
  engine_power_hp: number;
  tare_t: number;
  max_gtw_t: number; // Gross Train Weight
  wheelbase_m: number;
  cab_type: 'day' | 'sleeper';
  img: string;
  /* Tire specification */
  front_tires: TireSpec;
  rear_tires: TireSpec;
  notes?: string;
}
export interface TrailerModule {
  id: string;
  type: 'gooseneck' | 'deck' | 'axle_bogie' | 'dolly' | 'extension' | 'ramp';
  length: number;
  width: number;
  height: number;
  tare: number;
  payloadCapacity: number;
  axleCount?: number;
  axleSpacings?: number[];
  kingpinHeight?: number;
  rampAngle?: number;
  notes?: string;
}
export interface ModularTrailer {
  id: string;
  name: string;
  modules: TrailerModule[];
}