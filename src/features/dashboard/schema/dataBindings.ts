import type {ScadaData} from '../model/types';
import {DEFAULT_DATA} from '../model/types';
import {getWorkshopBinding} from './workshopPayloadBindings';

type PayloadRecord = Record<string, { value?: number | boolean }>;

export interface MetricBindingSchema {
    field: keyof ScadaData;
    sources: string[];
    transform?: (payload: PayloadRecord, previous: number) => number;
}

const readNumber = (payload: PayloadRecord, key: string, fallback: number) => {
    const rawValue = payload[key]?.value;
    if (typeof rawValue === 'number') return rawValue;
    if (typeof rawValue === 'boolean') return rawValue ? 1 : 0;
    return fallback;
};

const sumValues = (keys: string[]) => (payload: PayloadRecord, previous: number) =>
    keys.reduce((total, key) => total + readNumber(payload, key, 0), 0) || previous;

export const scadaMetricBindings: MetricBindingSchema[] = [
    {field: 'tank1_temp', sources: ['反应槽1温度值']},
    {field: 'tank2_temp', sources: ['反应槽2温度值']},
    {field: 'acid_flow_instant', sources: ['盐酸硫酸流量-瞬时']},
    {field: 'acid_flow_total', sources: ['盐酸硫酸流量-累计']},
    {field: 'waste_flow_instant', sources: ['东氟废水流量-瞬时']},
    {
        field: 'waste_flow_total',
        sources: ['东氟废水流量-累计整数', '东氟废水流量-累计小数'],
        transform: sumValues(['东氟废水流量-累计整数', '东氟废水流量-累计小数']),
    },
    {field: 'hcl_tank1_level', sources: ['1#盐酸罐液位值']},
    {field: 'hcl_tank2_level', sources: ['2#盐酸罐液位值']},
    {field: 'hcl_tank3_level', sources: ['3#盐酸罐液位值']},
    {field: 'hcl_tank4_level', sources: ['4#盐酸罐液位值']},
    {field: 'hcl_tank5_level', sources: ['5#盐酸罐液位值']},
    {field: 'h2so4_tank1_level', sources: ['1#硫酸罐液位值']},
    {field: 'leak1', sources: ['1#泄漏检测值']},
    {field: 'leak2', sources: ['2#泄漏检测值']},
    {field: 'leak3', sources: ['3#泄漏检测值']},
    {field: 'leak4', sources: ['4#泄漏检测值']},
    {field: 'loading_instant', sources: ['装车流量-瞬时']},
    {
        field: 'loading_total',
        sources: ['装车流量-累计整数', '装车流量-累计小数'],
        transform: sumValues(['装车流量-累计整数', '装车流量-累计小数']),
    },
    {field: 'old_fan_v', sources: ['老厂风机电流值']},
    {field: 'old_pump1_v', sources: ['老厂水泵1电流值']},
    {field: 'old_pump2_v', sources: ['老厂水泵2电流值']},
    {field: 'old_pump3_v', sources: ['老厂水泵3电流值']},
    {field: 'drum_fan_v', sources: ['滚筒风机电流']},
    {field: 'drum_pump1_v', sources: ['滚筒水泵1电流']},
    {field: 'drum_pump2_v', sources: ['滚筒水泵2电流']},
    {field: 'drum_centrifuge_v', sources: ['老厂离心机电流值']},
];

export function mapPayloadToScadaData(payload: PayloadRecord, previous: ScadaData): ScadaData {
    return applyMetricBindings(scadaMetricBindings, payload, previous);
}

/** 按车间仅更新该车间绑定的字段，避免跨车间污染 */
export function mapWorkshopPayloadToScadaData(
    workshopId: string,
    payload: PayloadRecord,
    previous: ScadaData,
): ScadaData {
    const config = getWorkshopBinding(workshopId);
    if (!config) {
        return applyMetricBindings(scadaMetricBindings, payload, previous);
    }
    return applyMetricBindings(config.metricBindings, payload, previous);
}

function applyMetricBindings(
    bindings: MetricBindingSchema[],
    payload: PayloadRecord,
    previous: ScadaData,
): ScadaData {
    const nextState: ScadaData = {...DEFAULT_DATA, ...previous};

    for (const binding of bindings) {
        const currentValue = nextState[binding.field];
        const nextValue = binding.transform
            ? binding.transform(payload, currentValue)
            : readNumber(payload, binding.sources[0], currentValue);
        nextState[binding.field] = nextValue;
    }

    return {...nextState};
}

export function extractAlarmData(payload: PayloadRecord) {
    return Object.fromEntries(
        Object.entries(payload)
            .filter(([key]) => key.includes('报警') && !key.includes('设定值'))
            .map(([key, value]) => [key, Boolean(value?.value)]),
    );
}

/** 仅提取本车间 MQTT 报文中的报警字段 */
export function extractWorkshopAlarmData(workshopId: string, payload: PayloadRecord) {
    const config = getWorkshopBinding(workshopId);
    if (!config) return {};

    return Object.fromEntries(
        Object.entries(payload)
            .filter(([key]) => config.alarmKeyMatcher(key))
            .map(([key, value]) => [key, Boolean(value?.value)]),
    );
}
