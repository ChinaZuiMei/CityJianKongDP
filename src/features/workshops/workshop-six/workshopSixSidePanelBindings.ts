import type {ScadaData} from '../../dashboard/model/types';

export const WORKSHOP_SIX_LEFT_PANEL_CONFIG = {
    display: {
        title: '主画面数显面板',
        subtitle: 'MAIN SCREEN DIGITAL PANEL',
    },
    level: {
        title: '罐区液位面板',
        subtitle: 'TANK LEVEL PANEL',
        labels: ['1#硫酸罐', '2#硫酸罐', '1#盐酸罐', '地下罐'],
    },
    loading: {
        title: '装车流量面板',
        subtitle: 'LOADING FLOW PANEL',
        meta: ['装车1', '瞬时/累计/装入量'] as const,
    },
} as const;

export const WORKSHOP_SIX_RIGHT_PANEL_CONFIG = {
    temperature: {
        title: '主画面可视化面板',
        subtitle: 'MAIN SCREEN VISUALIZATION',
        labels: ['釜1温度', '釜2温度'] as [string, string],
    },
    external: {
        title: '氧气流量面板',
        subtitle: 'OXYGEN FLOW PANEL',
        labels: ['釜1氧气', '釜2氧气', '釜3氧气', '釜4氧气'],
        meta: ['氧气流量', '单位 / m3'] as const,
    },
    loading: {
        title: '装车流量面板',
        subtitle: 'LOADING FLOW PANEL',
        meta: ['装车2', '瞬时/累计/装入量'] as const,
    },
} as const;

export type WorkshopSixExternalRow = { label: string; value: number };
export type WorkshopSixLeakRow = { label: string; value: number };

export function getWorkshopSixMainDisplayValues(data: ScadaData) {
    return {
        liquidNitrogenTemp: null as number | null,
        diluteSulfuricLevel: Number.isFinite(data.w6_dilute_sulfuric_level) ? data.w6_dilute_sulfuric_level : 0,
    };
}

export function getWorkshopSixLevelValues(data: ScadaData) {
    return [
        Number.isFinite(data.w6_sulfuric1_level) ? data.w6_sulfuric1_level : 0,
        Number.isFinite(data.w6_sulfuric2_level) ? data.w6_sulfuric2_level : 0,
        Number.isFinite(data.w6_hcl1_level) ? data.w6_hcl1_level : 0,
        Number.isFinite(data.w6_underground_level) ? data.w6_underground_level : 0,
    ];
}

export function getWorkshopSixTemperatureValues(data: ScadaData): [number, number] {
    return [
        Number.isFinite(data.w6_kettle1_temp) ? data.w6_kettle1_temp : 0,
        Number.isFinite(data.w6_kettle2_temp) ? data.w6_kettle2_temp : 0,
    ];
}

export function getWorkshopSixExternalValues(data: ScadaData) {
    return [
        Number.isFinite(data.w6_kettle1_oxygen_flow) ? data.w6_kettle1_oxygen_flow : 0,
        Number.isFinite(data.w6_kettle2_oxygen_flow) ? data.w6_kettle2_oxygen_flow : 0,
        Number.isFinite(data.w6_kettle3_oxygen_flow) ? data.w6_kettle3_oxygen_flow : 0,
        Number.isFinite(data.w6_kettle4_oxygen_flow) ? data.w6_kettle4_oxygen_flow : 0,
    ];
}

export type WorkshopSixLoadingLane = 'loading1' | 'loading2';

export function getWorkshopSixLoadingValues(data: ScadaData, lane: WorkshopSixLoadingLane) {
    if (lane === 'loading1') {
        const once = Number.isFinite(data.w6_loading1_once) ? data.w6_loading1_once : 0;
        const instant = Number.isFinite(data.w6_loading1_instant) ? data.w6_loading1_instant : 0;
        const total = Number.isFinite(data.w6_loading1_total) ? data.w6_loading1_total : 0;
        return {once, instant, total, isActive: instant > 0};
    }
    const once = Number.isFinite(data.w6_loading2_once) ? data.w6_loading2_once : 0;
    const instant = Number.isFinite(data.w6_loading2_instant) ? data.w6_loading2_instant : 0;
    const total = Number.isFinite(data.w6_loading2_total) ? data.w6_loading2_total : 0;
    return {once, instant, total, isActive: instant > 0};
}
