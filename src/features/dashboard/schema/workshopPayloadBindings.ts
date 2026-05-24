import type {MetricBindingSchema} from './dataBindings';

const sumValues = (keys: string[]) => (payload: Record<string, { value?: number | boolean }>, previous: number) =>
    keys.reduce((total, key) => {
        const raw = payload[key]?.value;
        return total + (typeof raw === 'number' ? raw : 0);
    }, 0) || previous;

/** 新聚铝液位 workshop-02：MQTT 字段 ↔ ScadaData（仅更新本车间相关字段） */
export const WORKSHOP_02_METRIC_BINDINGS: MetricBindingSchema[] = [
    {field: 'hcl_tank1_level', sources: ['1#盐酸罐液位值']},
    {field: 'hcl_tank2_level', sources: ['2#盐酸罐液位值']},
    {field: 'hcl_tank3_level', sources: ['3#盐酸罐液位值']},
    {field: 'hcl_tank4_level', sources: ['4#盐酸罐液位值']},
    {field: 'hcl_tank5_level', sources: ['5#盐酸罐液位值']},
    {field: 'leak1', sources: ['1#泄漏检测值']},
    {field: 'leak2', sources: ['2#泄漏检测值']},
    {field: 'leak3', sources: ['3#泄漏检测值']},
    {field: 'leak4', sources: ['4#泄漏检测值']},
];

/** 聚铝老厂 workshop-01 */
export const WORKSHOP_01_METRIC_BINDINGS: MetricBindingSchema[] = [
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
    {field: 'h2so4_tank1_level', sources: ['1#硫酸罐液位值']},
    {field: 'leak1', sources: ['1#泄漏检测值']},
    {field: 'leak2', sources: ['2#泄漏检测值']},
    {field: 'leak3', sources: ['3#泄漏检测值']},
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

/** 新聚铝反应 workshop-03 */
export const WORKSHOP_03_METRIC_BINDINGS: MetricBindingSchema[] = [
    {field: 'w3_underground1_temp', sources: ['1#地下反应槽温度值']},
    {field: 'w3_underground2_temp', sources: ['2#地下反应槽温度值']},
    {field: 'w3_underground3_temp', sources: ['3#地下反应槽温度值']},
    {field: 'w3_iron1_temp', sources: ['1#铁锅反应釜温度值']},
    {field: 'w3_iron2_temp', sources: ['2#铁锅反应釜温度值']},
    {field: 'w3_iron1_pressure', sources: ['1#铁锅反应釜压力值']},
    {field: 'w3_iron2_pressure', sources: ['2#铁锅反应釜压力值']},
    {field: 'w3_iron1_current', sources: ['1#铁锅反应釜电流值']},
    {field: 'w3_iron2_current', sources: ['2#铁锅反应釜电流值']},
    {field: 'w3_glass1_temp', sources: ['1#玻璃钢反应釜温度值']},
    {field: 'w3_glass2_temp', sources: ['2#玻璃钢反应釜温度值']},
    {field: 'w3_glass3_temp', sources: ['3#玻璃钢反应釜温度值']},
    {field: 'w3_glass4_temp', sources: ['4#玻璃钢反应釜温度值']},
    {field: 'w3_glass5_temp', sources: ['5#玻璃钢反应釜温度值']},
    {field: 'w3_glass1_current', sources: ['1#玻璃钢反应釜电流值']},
    {field: 'w3_glass2_current', sources: ['2#玻璃钢反应釜电流值']},
    {field: 'w3_glass3_current', sources: ['3#玻璃钢反应釜电流值']},
    {field: 'w3_glass4_current', sources: ['4#玻璃钢反应釜电流值']},
    {field: 'w3_glass5_current', sources: ['5#玻璃钢反应釜电流值']},
    {field: 'w3_enamel1_temp', sources: ['1#搪瓷反应釜温度值']},
    {field: 'w3_enamel2_temp', sources: ['2#搪瓷反应釜温度值']},
    {field: 'w3_enamel3_temp', sources: ['3#搪瓷反应釜温度值']},
    {field: 'w3_enamel4_temp', sources: ['4#搪瓷反应釜温度值']},
    {field: 'w3_enamel5_temp', sources: ['5#搪瓷反应釜温度值']},
    {field: 'w3_enamel6_temp', sources: ['6#搪瓷反应釜温度值']},
    {field: 'w3_enamel1_pressure', sources: ['1#搪瓷反应釜压力值']},
    {field: 'w3_enamel2_pressure', sources: ['2#搪瓷反应釜压力值']},
    {field: 'w3_enamel3_pressure', sources: ['3#搪瓷反应釜压力值']},
    {field: 'w3_enamel4_pressure', sources: ['4#搪瓷反应釜压力值']},
    {field: 'w3_enamel5_pressure', sources: ['5#搪瓷反应釜压力值']},
    {field: 'w3_enamel6_pressure', sources: ['6#搪瓷反应釜压力值']},
    {field: 'w3_enamel1_current', sources: ['1#搪瓷反应釜电流值']},
    {field: 'w3_enamel2_current', sources: ['2#搪瓷反应釜电流值']},
    {field: 'w3_enamel3_current', sources: ['3#搪瓷反应釜电流值']},
    {field: 'w3_enamel4_current', sources: ['4#搪瓷反应釜电流值']},
    {field: 'w3_enamel5_current', sources: ['5#搪瓷反应釜电流值']},
    {field: 'w3_enamel6_current', sources: ['6#搪瓷反应釜电流值']},
    {field: 'w3_poly_tail_fan_v', sources: ['聚铝尾气风机电流值']},
    {field: 'w3_poly_tail_pump1_v', sources: ['聚铝尾气水泵1电流值']},
    {field: 'w3_poly_tail_pump2_v', sources: ['聚铝尾气水泵2电流值']},
    {field: 'w3_lowiron_tail_fan_v', sources: ['低铁尾气风机电流值']},
    {field: 'w3_lowiron_tail_pump1_v', sources: ['低铁尾气水泵1电流值']},
    {field: 'w3_lowiron_tail_pump2_v', sources: ['低铁尾气水泵2电流值']},
    {field: 'w3_steam_instant', sources: ['新聚铝反应蒸汽流量-瞬时']},
    {field: 'w3_steam_total', sources: ['新聚铝反应蒸汽流量-累计']},
    {field: 'w3_lowiron_steam_instant', sources: ['低铁无铁蒸汽流量-瞬时']},
    {field: 'w3_lowiron_steam_total', sources: ['低铁无铁蒸汽流量-累计']},
    {field: 'w3_loading_instant', sources: ['装车流量-瞬时']},
    {
        field: 'w3_loading_total',
        sources: ['装车流量-累计整数', '装车流量-累计小数'],
        transform: sumValues(['装车流量-累计整数', '装车流量-累计小数']),
    },
    {field: 'w3_alkali_instant', sources: ['碱水流量-瞬时']},
    {
        field: 'w3_alkali_total',
        sources: ['碱水流量-累计整数', '碱水流量-累计小数'],
        transform: sumValues(['碱水流量-累计整数', '碱水流量-累计小数']),
    },
    {field: 'w3_iron_flow_instant', sources: ['铁水流量-瞬时']},
    {
        field: 'w3_iron_flow_total',
        sources: ['铁水流量-累计整数', '铁水流量-累计小数'],
        transform: sumValues(['铁水流量-累计整数', '铁水流量-累计小数']),
    },
    {field: 'w3_hcl_flow_instant', sources: ['盐酸流量-瞬时']},
    {
        field: 'w3_hcl_flow_total',
        sources: ['盐酸流量-累计整数', '盐酸流量-累计小数'],
        transform: sumValues(['盐酸流量-累计整数', '盐酸流量-累计小数']),
    },
];

export type WorkshopBindingConfig = {
    workshopId: string;
    topicCode: string;
    metricBindings: MetricBindingSchema[];
    /** 从 MQTT 报警字段名中识别本车间报警（不含「设定值」） */
    alarmKeyMatcher: (key: string) => boolean;
};

export const WORKSHOP_BINDING_REGISTRY: WorkshopBindingConfig[] = [
    {
        workshopId: 'workshop-01',
        topicCode: 'JL_OLD',
        metricBindings: WORKSHOP_01_METRIC_BINDINGS,
        alarmKeyMatcher: (key) =>
            key.includes('报警')
            && !key.includes('设定值')
            && !key.includes('地下釜')
            && !key.includes('搪瓷'),
    },
    {
        workshopId: 'workshop-02',
        topicCode: 'XJLYW',
        metricBindings: WORKSHOP_02_METRIC_BINDINGS,
        alarmKeyMatcher: (key) =>
            key.includes('报警')
            && !key.includes('设定值')
            && (key.includes('盐酸罐') || key.includes('泄漏检测')),
    },
    {
        workshopId: 'workshop-03',
        topicCode: 'XJLFY',
        metricBindings: WORKSHOP_03_METRIC_BINDINGS,
        alarmKeyMatcher: (key) =>
            !key.includes('设定值')
            && (key.includes('报警') || key.includes('保护') || key.includes('故障')),
    },
];

export function getWorkshopBinding(workshopId: string): WorkshopBindingConfig | undefined {
    return WORKSHOP_BINDING_REGISTRY.find((item) => item.workshopId === workshopId);
}
