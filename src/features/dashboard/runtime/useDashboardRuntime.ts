import { useEffect, useMemo, useState } from 'react';
import { dashboardPageSchema } from '../schema/dashboardSchema';
import { extractAlarmData, mapPayloadToScadaData } from '../schema/dataBindings';
import { type Alarm, type AlarmData, DEFAULT_DATA, type ScadaData } from '../model/types';

interface MqttApiResponse {
  success?: boolean;
  data?: {
    data?: Record<string, { value?: number | boolean }>;
  };
}

interface AlarmApiResponse {
  success: boolean;
  data: Alarm[];
}

function getDataMode(): 'live' | 'mock' {
  return import.meta.env.VITE_DATA_MODE === 'mock' ? 'mock' : 'live';
}

function getRefreshPolicy(id: string, mode: 'live' | 'mock') {
  return dashboardPageSchema.refreshPolicies.find((item) => item.id === id && item.mode === mode);
}

export function useDashboardRuntime() {
  const dataMode = getDataMode();
  const workshops = dashboardPageSchema.workshops;

  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [scadaData, setScadaData] = useState<ScadaData>(DEFAULT_DATA);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [alarmData, setAlarmData] = useState<AlarmData>({});
  const [activeAlarms, setActiveAlarms] = useState<Alarm[]>([]);
  const [isAlarmPanelOpen, setIsAlarmPanelOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(workshops[0]);

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
        const payload = result.data?.data ?? (result as unknown as { data?: Record<string, { value?: number | boolean }> }).data;

        if ((result.success === false) || !payload || !active) {
          setMqttConnected(false);
          return;
        }

        setMqttConnected(true);
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

  const alarmCount = useMemo(() => Object.values(alarmData).filter((value) => value).length, [alarmData]);

  return {
    currentTime,
    workshops,
    scadaData,
    mqttConnected,
    alarmData,
    activeAlarms,
    alarmCount,
    isAlarmPanelOpen,
    selectedWorkshop,
    setIsAlarmPanelOpen,
    setSelectedWorkshop,
  };
}
