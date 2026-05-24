import type {ScadaData} from '../../dashboard/model/types';
import {WORKSHOP_TWO_UI_BINDINGS} from '../workshopTwoDataBindings';

/** 新聚铝液位 — 左侧面板配置（独立于聚铝老厂） */
export const WORKSHOP_TWO_LEFT_PANEL_CONFIG = {
    leak: {
        title: '盐酸泄漏面板',
        subtitle: 'HYDROCHLORIC ACID LEAK PANEL',
        meta: ['新聚铝液位盐酸泄漏', '单位 / ppm'] as const,
    },
    flow: {
        title: '主画面流量面板',
        subtitle: 'TANK FLOW PANEL',
        meta: ['新聚铝液位流量监测', '单位 / m³/h'] as const,
    },
    loading: {
        title: '装车可视化面板',
        subtitle: 'LOADING VISUALIZATION PANEL',
        meta: ['新聚铝装车状态', '实时监测'] as const,
    },
} as const;

/** 新聚铝液位 — 右侧面板配置 */
export const WORKSHOP_TWO_RIGHT_PANEL_CONFIG = {
    temperature: {
        title: '主画面可视化面板',
        subtitle: 'MAIN SCREEN VISUALIZATION',
        meta: ['新聚铝液位温度监测', '单位 / °C'] as const,
    },
    external: {
        title: '外部设备可视化面板',
        subtitle: 'EXTERNAL EQUIPMENT PANEL',
        metaOld: ['新聚铝液位外部设备', '聚铝老厂 / A'] as const,
        metaDrum: ['新聚铝液位外部设备', '滚筒干燥 / A'] as const,
    },
    loading: {
        title: '装车可视化面板',
        subtitle: 'LOADING VISUALIZATION PANEL',
        meta: ['新聚铝装车状态', '实时监测'] as const,
    },
} as const;

export type WorkshopTwoLeakRow = {
    label: string;
    value: number;
};

export type WorkshopTwoFlowSlice = {
    title: string;
    instant: number;
    total: number;
};

export type WorkshopTwoExternalRow = {
    label: string;
    value: number;
};

export function getWorkshopTwoLeakPanelRows(data: ScadaData): WorkshopTwoLeakRow[] {
    return WORKSHOP_TWO_UI_BINDINGS.filter((item) => item.leakField && item.leakUiLabel).map((binding) => ({
        label: binding.leakUiLabel!,
        value: data[binding.leakField!],
    }));
}

export function getWorkshopTwoFlowSlices(data: ScadaData): WorkshopTwoFlowSlice[] {
    return [
        {
            title: '盐酸硫酸流量',
            instant: data.acid_flow_instant,
            total: data.acid_flow_total,
        },
        {
            title: '东氟废水流量',
            instant: data.waste_flow_instant,
            total: data.waste_flow_total,
        },
    ];
}

export function getWorkshopTwoLoadingValues(data: ScadaData) {
    const instant = Number.isFinite(data.loading_instant) ? data.loading_instant : 0;
    const total = Number.isFinite(data.loading_total) ? data.loading_total : 0;
    return {
        instant,
        total,
        isActive: instant > 0,
    };
}

export function getWorkshopTwoTemperatureRows(data: ScadaData) {
    return [
        {label: '1# 反应槽温度', value: data.tank1_temp},
        {label: '2# 反应槽温度', value: data.tank2_temp},
    ] as const;
}

export function getWorkshopTwoExternalRows(data: ScadaData, variant: 'old' | 'drum'): WorkshopTwoExternalRow[] {
    if (variant === 'drum') {
        return [
            {label: '风机', value: data.drum_fan_v},
            {label: '循环泵1', value: data.drum_pump1_v},
            {label: '循环泵2', value: data.drum_pump2_v},
            {label: '离心机', value: data.drum_centrifuge_v},
        ];
    }

    return [
        {label: '风机', value: data.old_fan_v},
        {label: '循环泵1', value: data.old_pump1_v},
        {label: '循环泵2', value: data.old_pump2_v},
        {label: '循环泵3', value: data.old_pump3_v},
    ];
}
