import {
    clampDashboardDisplaySettings,
    DEFAULT_DASHBOARD_DISPLAY_SETTINGS,
    type DashboardDisplaySettings,
} from './types';

const STORAGE_KEY = 'dashboard-display-settings-v1';

export function loadDashboardDisplaySettings(): DashboardDisplaySettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {...DEFAULT_DASHBOARD_DISPLAY_SETTINGS};
        const parsed = JSON.parse(raw) as Partial<DashboardDisplaySettings>;
        return clampDashboardDisplaySettings({
            ...DEFAULT_DASHBOARD_DISPLAY_SETTINGS,
            ...parsed,
        });
    } catch {
        return {...DEFAULT_DASHBOARD_DISPLAY_SETTINGS};
    }
}

export function saveDashboardDisplaySettings(settings: DashboardDisplaySettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clampDashboardDisplaySettings(settings)));
}
