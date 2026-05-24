import {hasAlarm} from '../dashboard/lib/alarmUtils';
import type {AlarmData, ScadaData} from '../dashboard/model/types';

/**
 * 新聚铝液位：界面 ↔ MQTT 一一对应
 * 主题：/JH/sensor/XJLYW/pub
 */
export const WORKSHOP_TWO_UI_BINDINGS = [
    {
        tankId: 'hcl_tank1',
        label: '1#盐酸罐',
        levelField: 'hcl_tank1_level' as const,
        levelMqttKey: '1#盐酸罐液位值',
        leakField: 'leak1' as const,
        leakMqttKey: '1#泄漏检测值',
        leakUiLabel: '盐酸泄漏1',
        levelLowAlarm: '1#盐酸罐液位低报警',
        levelHighAlarm: '1#盐酸罐液位高报警',
        leakLowAlarm: '1#泄漏检测值低报警',
        leakHighAlarm: '1#泄漏检测值高报警',
    },
    {
        tankId: 'hcl_tank2',
        label: '2#盐酸罐',
        levelField: 'hcl_tank2_level' as const,
        levelMqttKey: '2#盐酸罐液位值',
        leakField: 'leak2' as const,
        leakMqttKey: '2#泄漏检测值',
        leakUiLabel: '盐酸泄漏2',
        levelLowAlarm: '2#盐酸罐液位低报警',
        levelHighAlarm: '2#盐酸罐液位高报警',
        leakLowAlarm: '2#泄漏检测值低报警',
        leakHighAlarm: '2#泄漏检测值高报警',
    },
    {
        tankId: 'hcl_tank3',
        label: '3#盐酸罐',
        levelField: 'hcl_tank3_level' as const,
        levelMqttKey: '3#盐酸罐液位值',
        leakField: 'leak3' as const,
        leakMqttKey: '3#泄漏检测值',
        leakUiLabel: '盐酸泄漏3',
        levelLowAlarm: '3#盐酸罐液位低报警',
        levelHighAlarm: '3#盐酸罐液位高报警',
        leakLowAlarm: '3#泄漏检测值低报警',
        leakHighAlarm: '3#泄漏检测值高报警',
    },
    {
        tankId: 'hcl_tank4',
        label: '4#盐酸罐',
        levelField: 'hcl_tank4_level' as const,
        levelMqttKey: '4#盐酸罐液位值',
        leakField: 'leak4' as const,
        leakMqttKey: '4#泄漏检测值',
        leakUiLabel: '盐酸泄漏4',
        levelLowAlarm: '4#盐酸罐液位低报警',
        levelHighAlarm: '4#盐酸罐液位高报警',
        leakLowAlarm: '4#泄漏检测值低报警',
        leakHighAlarm: '4#泄漏检测值高报警',
    },
    {
        tankId: 'hcl_tank5',
        label: '5#盐酸罐',
        levelField: 'hcl_tank5_level' as const,
        levelMqttKey: '5#盐酸罐液位值',
        leakField: null,
        leakMqttKey: null,
        leakUiLabel: null,
        levelLowAlarm: '5#盐酸罐液位低报警',
        levelHighAlarm: '5#盐酸罐液位高报警',
        leakLowAlarm: null,
        leakHighAlarm: null,
    },
] as const;

export type WorkshopTwoTankView = {
    id: string;
    label: string;
    level: number;
    hasAlarm: boolean;
};

export type WorkshopTwoLeakView = {
    id: number;
    component: 'leak1' | 'leak2' | 'leak3' | 'leak4';
    value: number;
};

export function buildWorkshopTwoTanks(data: ScadaData, alarmData: AlarmData): WorkshopTwoTankView[] {
    return WORKSHOP_TWO_UI_BINDINGS.map((binding) => {
        const level = data[binding.levelField];

        return {
            id: binding.tankId,
            label: binding.label,
            level: Number.isFinite(level) ? level : 0,
            hasAlarm: hasAlarm(binding.tankId, alarmData),
        };
    });
}

export function buildWorkshopTwoLeaks(data: ScadaData): WorkshopTwoLeakView[] {
    return WORKSHOP_TWO_UI_BINDINGS.filter((binding) => binding.leakField !== null).map((binding, index) => ({
        id: index + 1,
        component: binding.leakField!,
        value: data[binding.leakField!],
    }));
}

export function buildWorkshopTwoLeakPanel(data: ScadaData) {
    return WORKSHOP_TWO_UI_BINDINGS.filter((item) => item.leakField && item.leakUiLabel).map((binding) => ({
        label: binding.leakUiLabel!,
        value: data[binding.leakField!],
    }));
}
