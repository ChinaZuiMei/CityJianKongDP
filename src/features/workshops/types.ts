import type { ReactNode } from 'react';
import type { Alarm, AlarmData, ScadaData } from '../dashboard/model/types';

export interface WorkshopRuntimeData {
  currentTime: Date;
  scadaData: ScadaData;
  mqttConnected: boolean;
  alarmData: AlarmData;
  activeAlarms: Alarm[];
  alarmCount: number;
  isAlarmPanelOpen: boolean;
  setIsAlarmPanelOpen: (open: boolean) => void;
}

export interface WorkshopDefinition {
  id: string;
  name: string;
  enabled: boolean;
  hasContent: boolean;
  render: (runtime: WorkshopRuntimeData) => ReactNode;
}
