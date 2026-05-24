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

/** 聚铝新厂喷雾干燥 workshop-04 */
export const WORKSHOP_04_METRIC_BINDINGS: MetricBindingSchema[] = [
    {field: 'w4_reactor1_temp', sources: ['反应釜1温度值']},
    {field: 'w4_reactor2_temp', sources: ['反应釜2温度值']},
    {field: 'w4_reactor3_temp', sources: ['反应釜3温度值']},
    {field: 'w4_reactor4_temp', sources: ['反应釜4温度值']},
    {field: 'w4_reactor5_temp', sources: ['反应釜5温度值']},
    {field: 'w4_reactor6_temp', sources: ['反应釜6温度值']},
    {field: 'w4_reactor1_pressure', sources: ['反应釜1压力值']},
    {field: 'w4_reactor2_pressure', sources: ['反应釜2压力值']},
    {field: 'w4_reactor3_pressure', sources: ['反应釜3压力值']},
    {field: 'w4_reactor4_pressure', sources: ['反应釜4压力值']},
    {field: 'w4_reactor5_pressure', sources: ['反应釜5压力值']},
    {field: 'w4_reactor6_pressure', sources: ['反应釜6压力值']},
    {field: 'w4_reactor1_current', sources: ['反应釜1电流值']},
    {field: 'w4_reactor2_current', sources: ['反应釜2电流值']},
    {field: 'w4_reactor3_current', sources: ['反应釜3电流值']},
    {field: 'w4_reactor4_current', sources: ['反应釜4电流值']},
    {field: 'w4_reactor5_current', sources: ['反应釜5电流值']},
    {field: 'w4_reactor6_current', sources: ['反应釜6电流值']},
    {field: 'w4_fubang_khs_instant', sources: ['福邦硫酸氢钾流量-瞬时']},
    {
        field: 'w4_fubang_khs_total',
        sources: ['福邦硫酸氢钾流量-累计整数', '福邦硫酸氢钾流量-累计小数'],
        transform: sumValues(['福邦硫酸氢钾流量-累计整数', '福邦硫酸氢钾流量-累计小数']),
    },
    {field: 'w4_fubang_hcl_instant', sources: ['福邦盐酸流量-瞬时']},
    {
        field: 'w4_fubang_hcl_total',
        sources: ['福邦盐酸流量-累计整数', '福邦盐酸流量-累计小数'],
        transform: sumValues(['福邦盐酸流量-累计整数', '福邦盐酸流量-累计小数']),
    },
    {field: 'w4_output_packaging', sources: ['包装产量统计']},
];

/** 低铁硫酸铝 workshop-05 */
export const WORKSHOP_05_METRIC_BINDINGS: MetricBindingSchema[] = [
    {field: 'w5_reactor1_temp', sources: ['反应釜1温度值']},
    {field: 'w5_reactor2_temp', sources: ['反应釜2温度值']},
    {field: 'w5_reactor3_temp', sources: ['反应釜3温度值']},
    {field: 'w5_reactor4_temp', sources: ['反应釜4温度值']},
    {field: 'w5_reactor5_temp', sources: ['反应釜5温度值']},
    {field: 'w5_reactor6_temp', sources: ['反应釜6温度值']},
    {field: 'w5_reactor1_pressure', sources: ['反应釜1压力值']},
    {field: 'w5_reactor2_pressure', sources: ['反应釜2压力值']},
    {field: 'w5_reactor3_pressure', sources: ['反应釜3压力值']},
    {field: 'w5_reactor4_pressure', sources: ['反应釜4压力值']},
    {field: 'w5_reactor5_pressure', sources: ['反应釜5压力值']},
    {field: 'w5_reactor6_pressure', sources: ['反应釜6压力值']},
    {field: 'w5_reactor1_current', sources: ['反应釜1电流值']},
    {field: 'w5_reactor2_current', sources: ['反应釜2电流值']},
    {field: 'w5_reactor3_current', sources: ['反应釜3电流值']},
    {field: 'w5_reactor4_current', sources: ['反应釜4电流值']},
    {field: 'w5_reactor5_current', sources: ['反应釜5电流值']},
    {field: 'w5_reactor6_current', sources: ['反应釜6电流值']},
    {field: 'w5_output1', sources: ['包装1产量统计']},
    {field: 'w5_output2', sources: ['包装2产量统计']},
];

/** 聚合硫酸铁 workshop-06 */
export const WORKSHOP_06_METRIC_BINDINGS: MetricBindingSchema[] = [
    {field: 'w6_dilute_sulfuric_level', sources: ['稀硫酸液位值']},
    {field: 'w6_sulfuric1_level', sources: ['1#硫酸罐液位值']},
    {field: 'w6_sulfuric2_level', sources: ['2#硫酸罐液位值']},
    {field: 'w6_sulfuric3_level', sources: ['3#硫酸罐液位值']},
    {field: 'w6_sulfuric4_level', sources: ['4#硫酸罐液位值']},
    {field: 'w6_sulfuric5_level', sources: ['5#硫酸罐液位值']},
    {field: 'w6_sulfuric6_level', sources: ['6#硫酸罐液位值']},
    {field: 'w6_sulfuric7_level', sources: ['7#硫酸罐液位值']},
    {field: 'w6_hcl1_level', sources: ['1#盐酸罐液位值']},
    {field: 'w6_hcl2_level', sources: ['2#盐酸罐液位值']},
    {field: 'w6_underground_level', sources: ['地下罐液位值']},
    {field: 'w6_kettle1_pressure', sources: ['釜1压力值']},
    {field: 'w6_kettle2_pressure', sources: ['釜2压力值']},
    {field: 'w6_kettle3_pressure', sources: ['釜3压力值']},
    {field: 'w6_kettle4_pressure', sources: ['釜4压力值']},
    {field: 'w6_kettle1_temp', sources: ['釜1温度值']},
    {field: 'w6_kettle2_temp', sources: ['釜2温度值']},
    {field: 'w6_kettle3_temp', sources: ['釜3温度值']},
    {field: 'w6_kettle4_temp', sources: ['釜4温度值']},
    {field: 'w6_kettle1_oxygen_flow', sources: ['釜1氧气流量值']},
    {field: 'w6_kettle2_oxygen_flow', sources: ['釜2氧气流量值']},
    {field: 'w6_kettle3_oxygen_flow', sources: ['釜3氧气流量值']},
    {field: 'w6_kettle4_oxygen_flow', sources: ['釜4氧气流量值']},
    {field: 'w6_loading1_once', sources: ['装车1-本次装入量']},
    {field: 'w6_loading1_instant', sources: ['装车1流量-瞬时']},
    {
        field: 'w6_loading1_total',
        sources: ['装车1流量-累计整数', '装车1流量-累计小数'],
        transform: sumValues(['装车1流量-累计整数', '装车1流量-累计小数']),
    },
    {field: 'w6_loading2_once', sources: ['装车2-本次装入量']},
    {field: 'w6_loading2_instant', sources: ['装车2流量-瞬时']},
    {
        field: 'w6_loading2_total',
        sources: ['装车2流量-累计整数', '装车2流量-累计小数'],
        transform: sumValues(['装车2流量-累计整数', '装车2流量-累计小数']),
    },
    {field: 'w6_batch1_once', sources: ['定量1-本次装入量']},
    {field: 'w6_batch1_instant', sources: ['定量1流量-瞬时']},
    {
        field: 'w6_batch1_total',
        sources: ['定量1流量-累计整数', '定量1流量-累计小数'],
        transform: sumValues(['定量1流量-累计整数', '定量1流量-累计小数']),
    },
    {field: 'w6_batch2_once', sources: ['定量2-本次装入量']},
    {field: 'w6_batch2_instant', sources: ['定量2流量-瞬时']},
    {
        field: 'w6_batch2_total',
        sources: ['定量2流量-累计整数', '定量2流量-累计小数'],
        transform: sumValues(['定量2流量-累计整数', '定量2流量-累计小数']),
    },
    {field: 'w6_kettle1_link_feed_open', sources: ['釜1连锁料阀开到位']},
    {field: 'w6_kettle1_link_feed_closed', sources: ['釜1连锁料阀关到位']},
    {field: 'w6_kettle2_link_feed_open', sources: ['釜2连锁料阀开到位']},
    {field: 'w6_kettle2_link_feed_closed', sources: ['釜2连锁料阀关到位']},
    {field: 'w6_kettle3_link_feed_open', sources: ['釜3连锁料阀开到位']},
    {field: 'w6_kettle3_link_feed_closed', sources: ['釜3连锁料阀关到位']},
    {field: 'w6_kettle4_link_feed_open', sources: ['釜4连锁料阀开到位']},
    {field: 'w6_kettle4_link_feed_closed', sources: ['釜4连锁料阀关到位']},
    {field: 'w6_kettle1_feed_open', sources: ['釜1进料阀开到位']},
    {field: 'w6_kettle1_feed_closed', sources: ['釜1进料阀关到位']},
    {field: 'w6_kettle2_feed_open', sources: ['釜2进料阀开到位']},
    {field: 'w6_kettle2_feed_closed', sources: ['釜2进料阀关到位']},
    {field: 'w6_kettle3_feed_open', sources: ['釜3进料阀开到位']},
    {field: 'w6_kettle3_feed_closed', sources: ['釜3进料阀关到位']},
    {field: 'w6_kettle4_feed_open', sources: ['釜4进料阀开到位']},
    {field: 'w6_kettle4_feed_closed', sources: ['釜4进料阀关到位']},
    {field: 'w6_kettle1_discharge_open', sources: ['釜1放料阀开到位']},
    {field: 'w6_kettle1_discharge_closed', sources: ['釜1放料阀关到位']},
    {field: 'w6_kettle2_discharge_open', sources: ['釜2放料阀开到位']},
    {field: 'w6_kettle2_discharge_closed', sources: ['釜2放料阀关到位']},
    {field: 'w6_kettle3_discharge_open', sources: ['釜3放料阀开到位']},
    {field: 'w6_kettle3_discharge_closed', sources: ['釜3放料阀关到位']},
    {field: 'w6_kettle4_discharge_open', sources: ['釜4放料阀开到位']},
    {field: 'w6_kettle4_discharge_closed', sources: ['釜4放料阀关到位']},
    {field: 'w6_kettle1_catalyst_open', sources: ['釜1进催化剂阀开到位']},
    {field: 'w6_kettle1_catalyst_closed', sources: ['釜1进催化剂阀关到位']},
    {field: 'w6_kettle2_catalyst_open', sources: ['釜2进催化剂阀开到位']},
    {field: 'w6_kettle2_catalyst_closed', sources: ['釜2进催化剂阀关到位']},
    {field: 'w6_kettle3_catalyst_open', sources: ['釜3进催化剂阀开到位']},
    {field: 'w6_kettle3_catalyst_closed', sources: ['釜3进催化剂阀关到位']},
    {field: 'w6_kettle4_catalyst_open', sources: ['釜4进催化剂阀开到位']},
    {field: 'w6_kettle4_catalyst_closed', sources: ['釜4进催化剂阀关到位']},
    {field: 'w6_kettle1_oxygen_open', sources: ['釜1进氧气阀开']},
    {field: 'w6_kettle2_oxygen_open', sources: ['釜2进氧气阀开']},
    {field: 'w6_kettle3_oxygen_open', sources: ['釜3进氧气阀开']},
    {field: 'w6_kettle4_oxygen_open', sources: ['釜4进氧气阀开']},
];

/** 液体硫酸铝 workshop-07 */
export const WORKSHOP_07_METRIC_BINDINGS: MetricBindingSchema[] = [
    {field: 'w7_reactor1_temp', sources: ['反应釜1温度值']},
    {field: 'w7_reactor2_temp', sources: ['反应釜2温度值']},
    {field: 'w7_reactor3_temp', sources: ['反应釜3温度值']},
    {field: 'w7_reactor4_temp', sources: ['反应釜4温度值']},
    {field: 'w7_reactor5_temp', sources: ['反应釜5温度值']},
    {field: 'w7_reactor6_temp', sources: ['反应釜6温度值']},
    {field: 'w7_reactor7_temp', sources: ['反应釜7温度值']},
    {field: 'w7_reactor8_temp', sources: ['反应釜8温度值']},
    {field: 'w7_reactor9_temp', sources: ['反应釜9温度值']},
    {field: 'w7_reactor10_temp', sources: ['反应釜10温度值']},
    {field: 'w7_reactor1_pressure', sources: ['反应釜1压力值']},
    {field: 'w7_reactor2_pressure', sources: ['反应釜2压力值']},
    {field: 'w7_reactor3_pressure', sources: ['反应釜3压力值']},
    {field: 'w7_reactor4_pressure', sources: ['反应釜4压力值']},
    {field: 'w7_reactor5_pressure', sources: ['反应釜5压力值']},
    {field: 'w7_reactor6_pressure', sources: ['反应釜6压力值']},
    {field: 'w7_reactor7_pressure', sources: ['反应釜7压力值']},
    {field: 'w7_reactor8_pressure', sources: ['反应釜8压力值']},
    {field: 'w7_reactor9_pressure', sources: ['反应釜9压力值']},
    {field: 'w7_reactor10_pressure', sources: ['反应釜10压力值']},
    {field: 'w7_reactor1_current', sources: ['反应釜1电流值']},
    {field: 'w7_reactor2_current', sources: ['反应釜2电流值']},
    {field: 'w7_reactor3_current', sources: ['反应釜3电流值']},
    {field: 'w7_reactor4_current', sources: ['反应釜4电流值']},
    {field: 'w7_reactor5_current', sources: ['反应釜5电流值']},
    {field: 'w7_reactor6_current', sources: ['反应釜6电流值']},
    {field: 'w7_reactor7_current', sources: ['反应釜7电流值']},
    {field: 'w7_reactor8_current', sources: ['反应釜8电流值']},
    {field: 'w7_reactor9_current', sources: ['反应釜9电流值']},
    {field: 'w7_reactor10_current', sources: ['反应釜10电流值']},
    {field: 'w7_steam_instant', sources: ['蒸汽流量-瞬时']},
    {field: 'w7_steam_total', sources: ['蒸汽流量-累计']},
];

/** 明矾车间 workshop-08 */
export const WORKSHOP_08_METRIC_BINDINGS: MetricBindingSchema[] = [
    {field: 'w8_reactor1_pressure', sources: ['反应釜1压力值']},
    {field: 'w8_reactor2_pressure', sources: ['反应釜2压力值']},
    {field: 'w8_reactor3_pressure', sources: ['反应釜3压力值']},
    {field: 'w8_reactor4_pressure', sources: ['反应釜4压力值']},
    {field: 'w8_reactor1_current', sources: ['反应釜1电流值']},
    {field: 'w8_reactor2_current', sources: ['反应釜2电流值']},
    {field: 'w8_reactor3_current', sources: ['反应釜3电流值']},
    {field: 'w8_reactor4_current', sources: ['反应釜4电流值']},
    {field: 'w8_steam_instant', sources: ['明矾蒸汽流量-瞬时']},
    {field: 'w8_steam_total', sources: ['明矾蒸汽流量-累计']},
    {field: 'w8_old_steam_instant', sources: ['聚铝老厂蒸汽流量-瞬时']},
    {field: 'w8_old_steam_total', sources: ['聚铝老厂蒸汽流量-累计']},
    {field: 'w8_hg_steam_instant', sources: ['恒光蒸汽流量-瞬时']},
    {field: 'w8_hg_steam_total', sources: ['恒光蒸汽流量-累计']},
    {field: 'w8_output', sources: ['包装产量统计']},
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
    {
        workshopId: 'workshop-04',
        topicCode: 'JLXCGZ',
        metricBindings: WORKSHOP_04_METRIC_BINDINGS,
        alarmKeyMatcher: (key) => key.includes('报警') && !key.includes('设定值'),
    },
    {
        workshopId: 'workshop-05',
        topicCode: 'DTLSL',
        metricBindings: WORKSHOP_05_METRIC_BINDINGS,
        alarmKeyMatcher: (key) => key.includes('报警') && !key.includes('设定值'),
    },
    {
        workshopId: 'workshop-06',
        topicCode: 'JH_JLLST',
        metricBindings: WORKSHOP_06_METRIC_BINDINGS,
        alarmKeyMatcher: (key) =>
            !key.includes('设定值')
            && (key.includes('报警') || key.includes('故障') || key.includes('连锁')),
    },
    {
        workshopId: 'workshop-07',
        topicCode: 'YTLSL',
        metricBindings: WORKSHOP_07_METRIC_BINDINGS,
        alarmKeyMatcher: (key) => key.includes('报警') && !key.includes('设定值'),
    },
    {
        workshopId: 'workshop-08',
        topicCode: 'MFCJ',
        metricBindings: WORKSHOP_08_METRIC_BINDINGS,
        alarmKeyMatcher: (key) => key.includes('报警') && !key.includes('设定值'),
    },
];

export function getWorkshopBinding(workshopId: string): WorkshopBindingConfig | undefined {
    return WORKSHOP_BINDING_REGISTRY.find((item) => item.workshopId === workshopId);
}
