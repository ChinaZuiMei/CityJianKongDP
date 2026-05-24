import type {ScadaData} from '../../dashboard/model/types';

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];

export const WORKSHOP_SEVEN_LEFT_PANEL_CONFIG = {
    flow: {title: '蒸汽流量液体硫酸铝', subtitle: 'STEAM FLOW LIQUID ALUMINUM SULFATE'},
    level: {title: '罐区液位面板', subtitle: 'TANK LEVEL PANEL', labels: noLabels, values: zeroLevels},
    loading: {
        title: '蒸汽监测面板',
        subtitle: 'STEAM MONITOR PANEL',
        meta: ['液体硫酸铝蒸汽', '实时监测'] as const,
    },
} as const;

export const WORKSHOP_SEVEN_RIGHT_PANEL_CONFIG = {
    temperature: {
        title: '主画面可视化面板',
        subtitle: 'MAIN SCREEN VISUALIZATION',
        labels: ['反应釜1', '反应釜2'] as [string, string],
    },
    external: {
        title: '反应釜电流面板',
        subtitle: 'REACTOR CURRENT PANEL',
        labels: ['反应釜7', '反应釜8', '反应釜9', '反应釜10'],
        meta: ['电流监测', '单位 / A'] as const,
    },
    loading: {
        title: '蒸汽监测面板',
        subtitle: 'STEAM MONITOR PANEL',
        meta: ['液体硫酸铝蒸汽', '累计监测'] as const,
    },
} as const;

export type WorkshopSevenExternalRow = { label: string; value: number };
export type WorkshopSevenLeakRow = { label: string; value: number };

export function getWorkshopSevenFlowValues(data: ScadaData) {
    return {
        instant: Number.isFinite(data.w7_steam_instant) ? data.w7_steam_instant : 0,
        total: Number.isFinite(data.w7_steam_total) ? data.w7_steam_total : 0,
    };
}

export function getWorkshopSevenTemperatureValues(data: ScadaData): [number, number] {
    return [
        Number.isFinite(data.w7_reactor1_temp) ? data.w7_reactor1_temp : 0,
        Number.isFinite(data.w7_reactor2_temp) ? data.w7_reactor2_temp : 0,
    ];
}

export function getWorkshopSevenExternalValues(data: ScadaData) {
    return [
        Number.isFinite(data.w7_reactor7_current) ? data.w7_reactor7_current : 0,
        Number.isFinite(data.w7_reactor8_current) ? data.w7_reactor8_current : 0,
        Number.isFinite(data.w7_reactor9_current) ? data.w7_reactor9_current : 0,
        Number.isFinite(data.w7_reactor10_current) ? data.w7_reactor10_current : 0,
    ];
}

export function getWorkshopSevenLoadingValues(data: ScadaData) {
    const instant = Number.isFinite(data.w7_steam_instant) ? data.w7_steam_instant : 0;
    const total = Number.isFinite(data.w7_steam_total) ? data.w7_steam_total : 0;
    return {instant, total, isActive: instant > 0};
}
