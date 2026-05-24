import type {ScadaData} from '../dashboard/model/types';

export type WorkshopEightFlowItem = {
    title: string;
    instant: number;
    total: number;
};

export function buildWorkshopEightFlowItems(data: ScadaData): WorkshopEightFlowItem[] {
    return [
        {title: '明矾车间', instant: data.w8_steam_instant, total: data.w8_steam_total},
        {title: '老厂聚铝', instant: data.w8_old_steam_instant, total: data.w8_old_steam_total},
        {title: '恒光', instant: data.w8_hg_steam_instant, total: data.w8_hg_steam_total},
    ];
}

export function resolveWorkshopEightAlarmRegion(alarmName: string): 'main' | 'output' | null {
    if (alarmName.includes('包装')) return 'output';
    if (alarmName.includes('反应釜') || alarmName.includes('蒸汽流量')) return 'main';
    return null;
}
