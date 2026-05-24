import {useCallback, useState} from 'react';
import {
    DEFAULT_DASHBOARD_DISPLAY_SETTINGS,
    clampDashboardDisplaySettings,
    type DashboardDisplaySettings,
} from './types';
import {loadDashboardDisplaySettings, saveDashboardDisplaySettings} from './storage';

export function useDashboardSettings() {
    const [settings, setSettingsState] = useState<DashboardDisplaySettings>(() => loadDashboardDisplaySettings());

    const setSettings = useCallback((updater: DashboardDisplaySettings | ((current: DashboardDisplaySettings) => DashboardDisplaySettings)) => {
        setSettingsState((current) => {
            const next = typeof updater === 'function' ? updater(current) : updater;
            const clamped = clampDashboardDisplaySettings(next);
            saveDashboardDisplaySettings(clamped);
            return clamped;
        });
    }, []);

    const restoreDefaults = useCallback(() => {
        const defaults = {...DEFAULT_DASHBOARD_DISPLAY_SETTINGS};
        saveDashboardDisplaySettings(defaults);
        setSettingsState(defaults);
    }, []);

    return {settings, setSettings, restoreDefaults};
}
