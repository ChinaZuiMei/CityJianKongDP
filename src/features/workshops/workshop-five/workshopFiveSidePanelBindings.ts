import type {ScadaData} from '../../dashboard/model/types';

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];

export const WORKSHOP_FIVE_LEFT_PANEL_CONFIG = {
    flow: {title: '工艺概览面板', subtitle: 'PROCESS OVERVIEW PANEL'},
    level: {title: '罐区液位面板', subtitle: 'TANK LEVEL PANEL', labels: noLabels, values: zeroLevels},
    loading: {
        title: '包装1统计面板',
        subtitle: 'PACKAGING 1 OUTPUT PANEL',
        meta: ['低铁硫酸铝包装1', '实时监测'] as const,
    },
} as const;

export const WORKSHOP_FIVE_RIGHT_PANEL_CONFIG = {
    temperature: {
        title: '主画面可视化面板',
        subtitle: 'MAIN SCREEN VISUALIZATION',
        labels: ['反应釜1', '反应釜2'] as [string, string],
    },
    external: {
        title: '外部设备可视化面板',
        subtitle: 'EXTERNAL EQUIPMENT PANEL',
        labels: ['包装1', '包装2', '反应釜5', '反应釜6'],
        meta: ['包装统计', '实时监测'] as const,
    },
    loading: {
        title: '包装2统计面板',
        subtitle: 'PACKAGING 2 OUTPUT PANEL',
        meta: ['低铁硫酸铝包装2', '实时监测'] as const,
    },
} as const;

export type WorkshopFiveExternalRow = { label: string; value: number };
export type WorkshopFiveLeakRow = { label: string; value: number };

export function getWorkshopFiveFlowValues(data: ScadaData) {
    const instant = (Number.isFinite(data.w5_output1) ? data.w5_output1 : 0) + (Number.isFinite(data.w5_output2) ? data.w5_output2 : 0);
    return {instant, total: instant};
}

export function getWorkshopFiveTemperatureValues(data: ScadaData): [number, number] {
    return [
        Number.isFinite(data.w5_reactor1_temp) ? data.w5_reactor1_temp : 0,
        Number.isFinite(data.w5_reactor2_temp) ? data.w5_reactor2_temp : 0,
    ];
}

export function getWorkshopFiveExternalValues(data: ScadaData) {
    return [
        Number.isFinite(data.w5_output1) ? data.w5_output1 : 0,
        Number.isFinite(data.w5_output2) ? data.w5_output2 : 0,
        Number.isFinite(data.w5_reactor5_current) ? data.w5_reactor5_current : 0,
        Number.isFinite(data.w5_reactor6_current) ? data.w5_reactor6_current : 0,
    ];
}

export function getWorkshopFiveLoadingValues(data: ScadaData, line: 1 | 2 = 1) {
    const total = line === 1 ? data.w5_output1 : data.w5_output2;
    const value = Number.isFinite(total) ? total : 0;
    return {instant: value, total: value, isActive: value > 0};
}
