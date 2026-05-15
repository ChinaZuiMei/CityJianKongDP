import { useEffect, useMemo, useState } from 'react';
import { dashboardPageSchema } from '../schema/dashboardSchema';
import { extractAlarmData, mapPayloadToScadaData } from '../schema/dataBindings';
import { type Alarm, type AlarmData, DEFAULT_DATA, type ScadaData } from '../model/types';
import { defaultWorkshopId, workshopRegistry } from '../../workshops/registry';
import type { WorkshopDefinition } from '../../workshops/types';

interface MqttApiResponse {
  success?: boolean;
  data?: {
    workshopId?: string;
    workshopName?: string;
    data?: Record<string, { value?: number | boolean }>;
  };
}

interface AlarmApiResponse {
  success: boolean;
  data: Alarm[];
}

interface LatestWorkshopMeta {
  workshopId?: string;
  workshopName?: string;
}

function getDataMode(): 'live' | 'mock' {
  return import.meta.env.VITE_DATA_MODE === 'mock' ? 'mock' : 'live';
}

function getRefreshPolicy(id: string, mode: 'live' | 'mock') {
  return dashboardPageSchema.refreshPolicies.find((item) => item.id === id && item.mode === mode);
}

export function useDashboardRuntime() {
  const dataMode = getDataMode();
  const workshops = workshopRegistry;

  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [scadaData, setScadaData] = useState<ScadaData>(DEFAULT_DATA);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [alarmData, setAlarmData] = useState<AlarmData>({});
  const [activeAlarms, setActiveAlarms] = useState<Alarm[]>([]);
  const [latestWorkshopMeta, setLatestWorkshopMeta] = useState<LatestWorkshopMeta>({});
  const [isAlarmPanelOpen, setIsAlarmPanelOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(defaultWorkshopId);

  const selectedWorkshopDefinition = useMemo(
    () => workshops.find((workshop) => workshop.id === selectedWorkshop) ?? workshops[0],
    [selectedWorkshop, workshops],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const mqttPolicy = getRefreshPolicy(dataMode === 'mock' ? 'mqtt-mock' : 'mqtt-live', dataMode);
    if (!mqttPolicy) return;

    let active = true;

    const fetchMqttData = async () => {
      try {
        const response = await fetch(mqttPolicy.endpoint);
        const result = (await response.json()) as MqttApiResponse;
        const payloadEnvelope = result.data;
        const payload = payloadEnvelope?.data ?? (result as unknown as { data?: Record<string, { value?: number | boolean }> }).data;

        if ((result.success === false) || !payload || !active) {
          setMqttConnected(false);
          return;
        }

        setMqttConnected(true);
        setLatestWorkshopMeta({
          workshopId: payloadEnvelope?.workshopId,
          workshopName: payloadEnvelope?.workshopName,
        });
        setAlarmData(extractAlarmData(payload));
        setScadaData((previous) => mapPayloadToScadaData(payload, previous));
      } catch (error) {
        console.error('获取 MQTT 数据失败:', error);
        if (active) setMqttConnected(false);
      }
    };

    void fetchMqttData();
    const timer = window.setInterval(fetchMqttData, mqttPolicy.intervalMs);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [dataMode]);

  useEffect(() => {
    if (dataMode === 'mock') {
      setActiveAlarms([]);
      return;
    }

    const alarmPolicy = getRefreshPolicy('alarm-live', 'live');
    if (!alarmPolicy) return;

    let active = true;

    const fetchAlarms = async () => {
      try {
        const response = await fetch(alarmPolicy.endpoint);
        const result = (await response.json()) as AlarmApiResponse;
        if (result.success && active) {
          setActiveAlarms(result.data);
        }
      } catch (error) {
        console.error('获取报警列表失败:', error);
      }
    };

    void fetchAlarms();
    const timer = window.setInterval(fetchAlarms, alarmPolicy.intervalMs);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [dataMode]);

  const scopedAlarmData = useMemo(
    () => filterAlarmDataForWorkshop(alarmData, selectedWorkshopDefinition, latestWorkshopMeta),
    [alarmData, latestWorkshopMeta, selectedWorkshopDefinition],
  );
  const scopedActiveAlarms = useMemo(
    () => filterActiveAlarmsForWorkshop(activeAlarms, selectedWorkshopDefinition),
    [activeAlarms, selectedWorkshopDefinition],
  );
  const alarmCount = useMemo(() => Object.values(scopedAlarmData).filter((value) => value).length, [scopedAlarmData]);

  return {
    currentTime,
    workshops,
    selectedWorkshopDefinition,
    scadaData,
    mqttConnected,
    alarmData: scopedAlarmData,
    activeAlarms: scopedActiveAlarms,
    alarmCount,
    isAlarmPanelOpen,
    selectedWorkshop,
    setIsAlarmPanelOpen,
    setSelectedWorkshop,
  };
}

function matchesWorkshopMeta(
  workshop: WorkshopDefinition | undefined,
  workshopId?: string,
  workshopName?: string,
) {
  if (!workshop) return false;

  const ids = new Set([workshop.id, ...(workshop.dataWorkshopIds ?? [])]);
  const names = new Set([workshop.name, ...(workshop.dataWorkshopNames ?? [])]);

  return Boolean((workshopId && ids.has(workshopId)) || (workshopName && names.has(workshopName)));
}

function matchesWorkshopAlarmName(workshop: WorkshopDefinition | undefined, alarmName: string) {
  if (!workshop?.alarmNamePrefixes?.length) return false;
  return workshop.alarmNamePrefixes.some((prefix) => alarmName.startsWith(prefix));
}

function filterAlarmDataForWorkshop(
  alarmData: AlarmData,
  workshop: WorkshopDefinition | undefined,
  latestWorkshopMeta: LatestWorkshopMeta,
) {
  if (!workshop) return {};

  if (latestWorkshopMeta.workshopId || latestWorkshopMeta.workshopName) {
    return matchesWorkshopMeta(workshop, latestWorkshopMeta.workshopId, latestWorkshopMeta.workshopName)
      ? alarmData
      : {};
  }

  return Object.fromEntries(
    Object.entries(alarmData).filter(([alarmName]) => matchesWorkshopAlarmName(workshop, alarmName)),
  );
}

function filterActiveAlarmsForWorkshop(alarms: Alarm[], workshop: WorkshopDefinition | undefined) {
  if (!workshop) return [];

  return alarms.filter((alarm) => (
    matchesWorkshopMeta(workshop, alarm.workshop_id, alarm.workshop_name)
    || matchesWorkshopAlarmName(workshop, alarm.alarm_name)
  ));
}
