import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {dashboardPageSchema} from '../schema/dashboardSchema';
import {extractWorkshopAlarmData, mapWorkshopPayloadToScadaData} from '../schema/dataBindings';
import {type Alarm, type AlarmData, DEFAULT_DATA, type ScadaData} from '../model/types';
import {defaultWorkshopId, workshopRegistry} from '../../workshops/registry';
import type {WorkshopDefinition} from '../../workshops/types';
import {useDashboardSettings} from '../settings/useDashboardSettings';
import {useWorkshopCarousel, type WorkshopSelectSource} from '../settings/useWorkshopCarousel';
import type {PauseDurationChoice} from '../settings/types';

interface MqttApiResponse {
    success?: boolean;
    data?: {
        workshopId?: string;
        workshopName?: string;
        timestamp?: string;
        timestampMs?: number;
        data?: Record<string, { value?: number | boolean }>;
    };
}

interface AlarmApiResponse {
    success: boolean;
    data: Alarm[];
}

type WorkshopSnapshot = {
    scada: ScadaData;
    alarms: AlarmData;
    connected: boolean;
    lastUpdatedAt?: number;
};

const EMPTY_SNAPSHOT: WorkshopSnapshot = {
    scada: DEFAULT_DATA,
    alarms: {},
    connected: false,
};

function getDataMode(): 'live' | 'mock' {
    return import.meta.env.VITE_DATA_MODE === 'mock' ? 'mock' : 'live';
}

function getRefreshPolicy(id: string, mode: 'live' | 'mock') {
    return dashboardPageSchema.refreshPolicies.find((item) => item.id === id && item.mode === mode);
}

function applyMqttPayload(
    workshopId: string,
    payload: Record<string, { value?: number | boolean }>,
    previous: WorkshopSnapshot,
    timestampMs?: number,
): WorkshopSnapshot {
    return {
        scada: mapWorkshopPayloadToScadaData(workshopId, payload, previous.scada),
        alarms: {...extractWorkshopAlarmData(workshopId, payload)},
        connected: true,
        lastUpdatedAt: timestampMs ?? Date.now(),
    };
}

export function useDashboardRuntime() {
    const dataMode = getDataMode();
    const workshops = workshopRegistry;
    const {settings, setSettings, restoreDefaults} = useDashboardSettings();

    const [currentTime, setCurrentTime] = useState(() => new Date());
    const [workshopSnapshots, setWorkshopSnapshots] = useState<Record<string, WorkshopSnapshot>>({});
    const [activeAlarms, setActiveAlarms] = useState<Alarm[]>([]);
    const [isAlarmPanelOpen, setIsAlarmPanelOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState(defaultWorkshopId);
    const [selectedPauseChoice, setSelectedPauseChoice] = useState<PauseDurationChoice>(settings.lastPauseChoice);

    const workshopIds = useMemo(
        () => workshops.filter((workshop) => workshop.enabled).map((workshop) => workshop.id),
        [workshops],
    );
    const workshopNamesById = useMemo(
        () => Object.fromEntries(workshops.map((workshop) => [workshop.id, workshop.name])),
        [workshops],
    );

    const onManualSwitchRef = useRef<() => void>(() => {
    });

    const onSelectWorkshop = useCallback((workshopId: string, source: WorkshopSelectSource) => {
        setSelectedWorkshop(workshopId);
        if (source === 'manual') {
            onManualSwitchRef.current();
        }
    }, []);

    const carousel = useWorkshopCarousel({
        workshopIds,
        workshopNamesById,
        settings,
        selectedWorkshop,
        onSelectWorkshop,
        freeze: isSettingsOpen || isAlarmPanelOpen,
    });

    onManualSwitchRef.current = carousel.onManualSwitch;

    const selectedWorkshopDefinition = useMemo(
        () => workshops.find((workshop) => workshop.id === selectedWorkshop) ?? workshops[0],
        [selectedWorkshop, workshops],
    );

    const currentSnapshot = workshopSnapshots[selectedWorkshop] ?? EMPTY_SNAPSHOT;

    const workshopConnectionStatuses = useMemo(
        () => workshops
            .filter((workshop) => workshop.enabled)
            .map((workshop) => {
                const snapshot = workshopSnapshots[workshop.id] ?? EMPTY_SNAPSHOT;
                return {
                    id: workshop.id,
                    name: workshop.name,
                    connected: snapshot.connected,
                    lastUpdatedAt: snapshot.lastUpdatedAt,
                };
            }),
        [workshopSnapshots, workshops],
    );

    useEffect(() => {
        setSelectedPauseChoice(settings.lastPauseChoice);
    }, [settings.lastPauseChoice]);

    useEffect(() => {
        const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const fetchWorkshopMqtt = useCallback(async (workshopId: string, mqttPolicyEndpoint: string) => {
        const endpoint = `${mqttPolicyEndpoint}?workshopId=${encodeURIComponent(workshopId)}&_t=${Date.now()}`;
        const response = await fetch(endpoint, {cache: 'no-store'});
        const result = (await response.json()) as MqttApiResponse;
        const payloadEnvelope = result.data;
        const payload = payloadEnvelope?.data;

        if (result.success === false || !payload) {
            setWorkshopSnapshots((previous) => ({
                ...previous,
                [workshopId]: {
                    ...(previous[workshopId] ?? EMPTY_SNAPSHOT),
                    connected: false,
                },
            }));
            return;
        }

        setWorkshopSnapshots((previous) => {
            const last = previous[workshopId] ?? EMPTY_SNAPSHOT;
            const timestampMs = payloadEnvelope?.timestampMs;

            if (last.lastUpdatedAt === timestampMs && last.connected) {
                return previous;
            }

            return {
                ...previous,
                [workshopId]: applyMqttPayload(
                    workshopId,
                    payload,
                    last,
                    timestampMs,
                ),
            };
        });
    }, []);

    useEffect(() => {
        const mqttPolicy = getRefreshPolicy(dataMode === 'mock' ? 'mqtt-mock' : 'mqtt-live', dataMode);
        if (!mqttPolicy) return;

        let active = true;
        const enabledWorkshopIds = workshops.filter((workshop) => workshop.enabled).map((workshop) => workshop.id);

        const fetchAllWorkshops = async () => {
            if (!active) return;
            await Promise.all(enabledWorkshopIds.map((workshopId) => fetchWorkshopMqtt(workshopId, mqttPolicy.endpoint)));
        };

        void fetchAllWorkshops();
        const timer = window.setInterval(() => {
            void fetchAllWorkshops();
        }, mqttPolicy.intervalMs);

        return () => {
            active = false;
            window.clearInterval(timer);
        };
    }, [dataMode, fetchWorkshopMqtt, workshops]);

    useEffect(() => {
        const mqttPolicy = getRefreshPolicy(dataMode === 'mock' ? 'mqtt-mock' : 'mqtt-live', dataMode);
        if (!mqttPolicy) return;
        void fetchWorkshopMqtt(selectedWorkshop, mqttPolicy.endpoint);
    }, [dataMode, fetchWorkshopMqtt, selectedWorkshop]);

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
                const response = await fetch(alarmPolicy.endpoint, {cache: 'no-store'});
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

    const scopedActiveAlarms = useMemo(
        () => filterActiveAlarmsForWorkshop(activeAlarms, selectedWorkshopDefinition),
        [activeAlarms, selectedWorkshopDefinition],
    );
    const alarmCount = useMemo(
        () => Object.values(currentSnapshot.alarms).filter((value) => value).length,
        [currentSnapshot.alarms],
    );

    const handleWorkshopChange = useCallback((workshopId: string) => {
        onSelectWorkshop(workshopId, 'manual');
    }, [onSelectWorkshop]);

    const handlePauseChoiceChange = useCallback((choice: PauseDurationChoice) => {
        setSelectedPauseChoice(choice);
        setSettings((current) => ({...current, lastPauseChoice: choice}));
    }, [setSettings]);

    const handlePauseCarousel = useCallback(() => {
        carousel.pauseCarousel(selectedPauseChoice);
    }, [carousel, selectedPauseChoice]);

    return {
        currentTime,
        workshops,
        selectedWorkshopDefinition,
        scadaData: currentSnapshot.scada,
        mqttConnected: currentSnapshot.connected,
        alarmData: currentSnapshot.alarms,
        activeAlarms: scopedActiveAlarms,
        alarmCount,
        isAlarmPanelOpen,
        isSettingsOpen,
        selectedWorkshop,
        settings,
        setSettings,
        restoreDefaults,
        setIsAlarmPanelOpen,
        setIsSettingsOpen,
        handleWorkshopChange,
        workshopConnectionStatuses,
        carousel,
        selectedPauseChoice,
        handlePauseChoiceChange,
        handlePauseCarousel,
        handleResumeCarousel: carousel.resumeCarousel,
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
    return workshop.alarmNamePrefixes.some((prefix) => alarmName.includes(prefix));
}

function filterActiveAlarmsForWorkshop(alarms: Alarm[], workshop: WorkshopDefinition | undefined) {
    if (!workshop) return [];

    return alarms.filter((alarm) => (
        matchesWorkshopMeta(workshop, alarm.workshop_id, alarm.workshop_name)
        || matchesWorkshopAlarmName(workshop, alarm.alarm_name)
    ));
}
