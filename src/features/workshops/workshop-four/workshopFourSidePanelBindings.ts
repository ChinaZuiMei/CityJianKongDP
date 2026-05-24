import type {ScadaData} from '../../dashboard/model/types';

const zeroLevels = [0, 0, 0, 0];
const noLabels = ['无', '无', '无', '无'];

export const WORKSHOP_FOUR_LEFT_PANEL_CONFIG = {
    flow: {
        title: '福邦硫酸氢钾流量面板',
        subtitle: 'FUBANG POTASSIUM BISULFATE FLOW PANEL',
    },
    level: {
        title: '罐区液位面板',
        subtitle: 'TANK LEVEL PANEL',
        labels: noLabels,
        values: zeroLevels,
    },
    loading: {
        title: '包装统计面板',
        subtitle: 'PACKAGING OUTPUT PANEL',
        meta: ['喷雾干燥包装', '实时监测'] as const,
    },
} as const;

export const WORKSHOP_FOUR_RIGHT_PANEL_CONFIG = {
    flow: {
        title: '福邦盐酸流量面板',
        subtitle: 'FUBANG HYDROCHLORIC ACID FLOW PANEL',
    },
    external: {
        title: '外部设备可视化面板',
        subtitle: 'EXTERNAL EQUIPMENT PANEL',
        labels: noLabels,
        values: zeroLevels,
        meta: ['无', '无'] as const,
    },
    loading: {
        title: '包装统计面板',
        subtitle: 'PACKAGING OUTPUT PANEL',
        meta: ['喷雾干燥包装', '累计产量'] as const,
    },
} as const;

export type WorkshopFourExternalRow = { label: string; value: number };
export type WorkshopFourLeakRow = { label: string; value: number };

export function getWorkshopFourLeftFlowValues(data: ScadaData) {
    return {
        instant: Number.isFinite(data.w4_fubang_khs_instant) ? data.w4_fubang_khs_instant : 0,
        total: Number.isFinite(data.w4_fubang_khs_total) ? data.w4_fubang_khs_total : 0,
    };
}

export function getWorkshopFourRightFlowValues(data: ScadaData) {
    return {
        instant: Number.isFinite(data.w4_fubang_hcl_instant) ? data.w4_fubang_hcl_instant : 0,
        total: Number.isFinite(data.w4_fubang_hcl_total) ? data.w4_fubang_hcl_total : 0,
    };
}

export function getWorkshopFourLoadingValues(data: ScadaData) {
    const total = Number.isFinite(data.w4_output_packaging) ? data.w4_output_packaging : 0;
    return {instant: total, total, isActive: total > 0};
}
