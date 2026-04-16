export type Screen = 'main' | 'tanks' | 'loading' | 'external' | 'selection';

export interface ScadaData {
  tank1_temp: number;
  tank2_temp: number;
  acid_flow_instant: number;
  acid_flow_total: number;
  waste_flow_instant: number;
  waste_flow_total: number;
  hcl_tank1_level: number;
  hcl_tank2_level: number;
  hcl_tank3_level: number;
  h2so4_tank1_level: number;
  leak1: number;
  leak2: number;
  leak3: number;
  loading_instant: number;
  loading_total: number;
  old_fan_v: number;
  old_pump1_v: number;
  old_pump2_v: number;
  old_pump3_v: number;
  drum_fan_v: number;
  drum_pump1_v: number;
  drum_pump2_v: number;
  drum_centrifuge_v: number;
}

export interface AlarmData {
  [key: string]: boolean;
}

export interface Alarm {
  id: number;
  alarm_type: string;
  alarm_name: string;
  alarm_status: boolean;
  timestamp: string;
}

export const DEFAULT_DATA: ScadaData = {
  tank1_temp: 0,
  tank2_temp: 0,
  acid_flow_instant: 0.0,
  acid_flow_total: 0,
  waste_flow_instant: 0.0,
  waste_flow_total: 0,
  hcl_tank1_level: 0,
  hcl_tank2_level: 0,
  hcl_tank3_level: 0,
  h2so4_tank1_level: 0,
  leak1: 0,
  leak2: 0,
  leak3: 0,
  loading_instant: 0.0,
  loading_total: 0,
  old_fan_v: 0,
  old_pump1_v: 0,
  old_pump2_v: 0,
  old_pump3_v: 0,
  drum_fan_v: 0.0,
  drum_pump1_v: 0.0,
  drum_pump2_v: 0.0,
  drum_centrifuge_v: 0,
};
