import type {ScadaData} from '../../dashboard/model/types';

export const WORKSHOP_THREE_LEFT_PANEL_CONFIG = {
    level: {
        title: '地下釜温度面板',
        subtitle: 'UNDERGROUND REACTOR PANEL',
        meta: ['地下反应槽温度', '单位 / °C'] as const,
    },
    steamFlow: {
        title: '蒸汽流量面板',
        subtitle: 'STEAM FLOW PANEL',
        meta: ['新聚铝反应蒸汽流量', '单位 / m³/h'] as const,
    },
    loading: {
        title: '装车可视化面板',
        subtitle: 'LOADING VISUALIZATION PANEL',
        meta: ['新聚铝反应装车', '实时监测'] as const,
    },
} as const;

export const WORKSHOP_THREE_RIGHT_PANEL_CONFIG = {
    temperature: {
        title: '主画面可视化面板',
        subtitle: 'MAIN SCREEN VISUALIZATION',
        meta: ['新聚铝反应温度', '单位 / °C'] as const,
    },
    external: {
        title: '外部设备可视化面板',
        subtitle: 'EXTERNAL EQUIPMENT PANEL',
        metaOld: ['新聚铝尾气设备', '聚铝尾气 / A'] as const,
        metaDrum: ['低铁尾气设备', '低铁尾气 / A'] as const,
    },
    otherFlow: {
        title: '流量面板',
        subtitle: 'FLOW PANEL',
        meta: ['新聚铝反应工艺流量', '单位 / m³/h'] as const,
    },
} as const;

export type WorkshopThreeLeakRow = {
    label: string;
    value: number;
};

export type WorkshopThreeFlowSlice = {
    title: string;
    instant: number;
    total: number;
};

export type WorkshopThreeExternalRow = {
    label: string;
    value: number;
};

export function getWorkshopThreeLevelRows(data: ScadaData) {
    return [
        {label: '地下釜1', value: data.w3_underground1_temp},
        {label: '地下釜2', value: data.w3_underground2_temp},
        {label: '地下釜3', value: data.w3_underground3_temp},
    ];
}

export function getWorkshopThreeLoadingValues(data: ScadaData) {
    const instant = Number.isFinite(data.w3_loading_instant) ? data.w3_loading_instant : 0;
    const total = Number.isFinite(data.w3_loading_total) ? data.w3_loading_total : 0;
    return {instant, total, isActive: instant > 0};
}

export function getWorkshopThreeTemperatureRows(data: ScadaData) {
    return [
        {label: '1# 铁锅反应釜', value: data.w3_iron1_temp},
        {label: '2# 铁锅反应釜', value: data.w3_iron2_temp},
    ] as const;
}

export function getWorkshopThreeExternalRows(data: ScadaData, variant: 'old' | 'drum'): WorkshopThreeExternalRow[] {
    if (variant === 'drum') {
        return [
            {label: '风机', value: data.w3_lowiron_tail_fan_v},
            {label: '循环泵1', value: data.w3_lowiron_tail_pump1_v},
            {label: '循环泵2', value: data.w3_lowiron_tail_pump2_v},
        ];
    }
    return [
        {label: '风机', value: data.w3_poly_tail_fan_v},
        {label: '循环泵1', value: data.w3_poly_tail_pump1_v},
        {label: '循环泵2', value: data.w3_poly_tail_pump2_v},
    ];
}

export function getWorkshopThreeSteamFlowSlices(data: ScadaData): WorkshopThreeFlowSlice[] {
    return [
        {title: '新聚铝反应蒸汽流量', instant: data.w3_steam_instant, total: data.w3_steam_total},
        {title: '低铁无铁蒸汽流量', instant: data.w3_lowiron_steam_instant, total: data.w3_lowiron_steam_total},
    ];
}

export function getWorkshopThreeOtherFlowSlices(data: ScadaData): WorkshopThreeFlowSlice[] {
    return [
        {title: '碱水流量', instant: data.w3_alkali_instant, total: data.w3_alkali_total},
        {title: '铁水流量', instant: data.w3_iron_flow_instant, total: data.w3_iron_flow_total},
        {title: '盐酸流量', instant: data.w3_hcl_flow_instant, total: data.w3_hcl_flow_total},
    ];
}
