import type {ScadaData} from '../../dashboard/model/types';

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];
const noTemperatures: [number, number] = [0, 0];
const noTemperatureLabels: [string, string] = ['无', '无'];

export const WORKSHOP_SEVEN_LEFT_PANEL_CONFIG = {
    flow: {title: '蒸汽流量液体硫酸铝', subtitle: 'STEAM FLOW LIQUID ALUMINUM SULFATE', instant: 0, total: 93789},
    level: {title: '罐区液位面板', subtitle: 'TANK LEVEL PANEL', labels: noLabels, values: zeroLevels},
    loading: {
        title: '装车可视化面板',
        subtitle: 'LOADING VISUALIZATION PANEL',
        meta: ['液体硫酸铝装车', '实时监测'] as const
    },
} as const;

export const WORKSHOP_SEVEN_RIGHT_PANEL_CONFIG = {
    temperature: {
        title: '主画面可视化面板',
        subtitle: 'MAIN SCREEN VISUALIZATION',
        labels: noTemperatureLabels,
        values: noTemperatures
    },
    external: {
        title: '外部设备可视化面板',
        subtitle: 'EXTERNAL EQUIPMENT PANEL',
        labels: noLabels,
        values: zeroLevels,
        meta: ['无', '无'] as const
    },
    loading: {
        title: '装车可视化面板',
        subtitle: 'LOADING VISUALIZATION PANEL',
        meta: ['液体硫酸铝装车', '实时监测'] as const
    },
} as const;

export type WorkshopSevenExternalRow = { label: string; value: number };
export type WorkshopSevenLeakRow = { label: string; value: number };

export function getWorkshopSevenLoadingValues(data: ScadaData) {
    const instant = Number.isFinite(data.loading_instant) ? data.loading_instant : 0;
    const total = Number.isFinite(data.loading_total) ? data.loading_total : 0;
    return {instant, total, isActive: instant > 0};
}
