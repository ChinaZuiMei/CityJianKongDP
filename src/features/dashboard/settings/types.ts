export type PauseDurationChoice = number | 'forever';

export interface DashboardDisplaySettings {
    carouselEnabled: boolean;
    rotateIntervalSec: number;
    manualCooldownSec: number;
    lastPauseChoice: PauseDurationChoice;
}

export const DEFAULT_DASHBOARD_DISPLAY_SETTINGS: DashboardDisplaySettings = {
    carouselEnabled: true,
    rotateIntervalSec: 10,
    manualCooldownSec: 180,
    lastPauseChoice: 60,
};

export const PAUSE_DURATION_PRESETS: Array<{ label: string; value: PauseDurationChoice }> = [
    {label: '10 秒', value: 10},
    {label: '30 秒', value: 30},
    {label: '1 分钟', value: 60},
    {label: '5 分钟', value: 300},
    {label: '15 分钟', value: 900},
    {label: '永久', value: 'forever'},
];

export function clampDashboardDisplaySettings(settings: DashboardDisplaySettings): DashboardDisplaySettings {
    return {
        carouselEnabled: settings.carouselEnabled,
        rotateIntervalSec: Math.min(300, Math.max(5, Math.round(settings.rotateIntervalSec))),
        manualCooldownSec: Math.min(600, Math.max(30, Math.round(settings.manualCooldownSec))),
        lastPauseChoice: settings.lastPauseChoice === 'forever'
            ? 'forever'
            : Math.min(86400, Math.max(10, Math.round(Number(settings.lastPauseChoice) || 60))),
    };
}
