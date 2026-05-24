import type {ScadaData} from '../../dashboard/model/types';

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];

export const WORKSHOP_FOUR_LEFT_PANEL_CONFIG = {
    flow: {
        title: '福邦硫酸氢钾流量面板',
        subtitle: 'FUBANG POTASSIUM BISULFATE FLOW PANEL',
        instant: 0,
        total: 27377.6,
    },
    level: {
        title: '罐区液位面板',
        subtitle: 'TANK LEVEL PANEL',
        labels: noLabels,
        values: zeroLevels,
    },
    loading: {
        title: '装车可视化面板',
        subtitle: 'LOADING VISUALIZATION PANEL',
        meta: ['喷雾干燥装车', '实时监测'] as const,
    },
} as const;

export const WORKSHOP_FOUR_RIGHT_PANEL_CONFIG = {
    flow: {
        title: '福邦盐酸流量面板',
        subtitle: 'FUBANG HYDROCHLORIC ACID FLOW PANEL',
        instant: 0,
        total: 5501.2,
    },
    external: {
        title: '外部设备可视化面板',
        subtitle: 'EXTERNAL EQUIPMENT PANEL',
        labels: noLabels,
        values: zeroLevels,
        meta: ['无', '无'] as const,
    },
    loading: {
        title: '装车可视化面板',
        subtitle: 'LOADING VISUALIZATION PANEL',
        meta: ['喷雾干燥装车', '实时监测'] as const,
    },
} as const;

export type WorkshopFourExternalRow = { label: string; value: number };
export type WorkshopFourLeakRow = { label: string; value: number };

export function getWorkshopFourLoadingValues(data: ScadaData) {
    const instant = Number.isFinite(data.loading_instant) ? data.loading_instant : 0;
    const total = Number.isFinite(data.loading_total) ? data.loading_total : 0;
    return {instant, total, isActive: instant > 0};
}
