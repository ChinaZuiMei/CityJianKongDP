import { AlarmData } from '../model/types';

// 报警映射配置：将报警名称映射到具体的界面和部件
export const ALARM_MAPPING: Record<string, { screen: string; component: string; label: string }> = {
  // 主画面 - 反应槽
  '反应槽1温度低报警': { screen: 'main', component: 'tank1', label: '反应槽1' },
  '反应槽1温度高报警': { screen: 'main', component: 'tank1', label: '反应槽1' },
  '反应槽1温度高保护': { screen: 'main', component: 'tank1', label: '反应槽1' },
  '反应槽2温度低报警': { screen: 'main', component: 'tank2', label: '反应槽2' },
  '反应槽2温度高报警': { screen: 'main', component: 'tank2', label: '反应槽2' },
  '反应槽2温度高保护': { screen: 'main', component: 'tank2', label: '反应槽2' },
  
  // 主画面 - 流量
  '盐酸流量低报警': { screen: 'main', component: 'acid_flow', label: '盐酸硫酸流量' },
  
  // 罐区 - 储罐
  '1#盐酸罐液位低报警': { screen: 'tanks', component: 'hcl_tank1', label: '1#盐酸罐' },
  '1#盐酸罐液位高报警': { screen: 'tanks', component: 'hcl_tank1', label: '1#盐酸罐' },
  '2#盐酸罐液位低报警': { screen: 'tanks', component: 'hcl_tank2', label: '2#盐酸罐' },
  '2#盐酸罐液位高报警': { screen: 'tanks', component: 'hcl_tank2', label: '2#盐酸罐' },
  '3#盐酸罐液位低报警': { screen: 'tanks', component: 'hcl_tank3', label: '3#盐酸罐' },
  '3#盐酸罐液位高报警': { screen: 'tanks', component: 'hcl_tank3', label: '3#盐酸罐' },
  '1#硫酸罐液位低报警': { screen: 'tanks', component: 'h2so4_tank1', label: '1#硫酸罐' },
  '1#硫酸罐液位高报警': { screen: 'tanks', component: 'h2so4_tank1', label: '1#硫酸罐' },
  
  // 罐区 - 泄漏
  '1#泄漏检测值低报警': { screen: 'tanks', component: 'leak1', label: '泄漏检测1' },
  '1#泄漏检测值高报警': { screen: 'tanks', component: 'leak1', label: '泄漏检测1' },
  '2#泄漏检测值低报警': { screen: 'tanks', component: 'leak2', label: '泄漏检测2' },
  '2#泄漏检测值高报警': { screen: 'tanks', component: 'leak2', label: '泄漏检测2' },
  '3#泄漏检测值低报警': { screen: 'tanks', component: 'leak3', label: '泄漏检测3' },
  '3#泄漏检测值高报警': { screen: 'tanks', component: 'leak3', label: '泄漏检测3' },
  
  // 外部设备 - 聚铝老厂
  '老厂风机电流低报警': { screen: 'external', component: 'old_fan', label: '聚铝老厂-风机' },
  '老厂风机电流高报警': { screen: 'external', component: 'old_fan', label: '聚铝老厂-风机' },
  '老厂水泵1电流低报警': { screen: 'external', component: 'old_pump1', label: '聚铝老厂-循环泵1' },
  '老厂水泵1电流高报警': { screen: 'external', component: 'old_pump1', label: '聚铝老厂-循环泵1' },
  '老厂水泵2电流低报警': { screen: 'external', component: 'old_pump2', label: '聚铝老厂-循环泵2' },
  '老厂水泵2电流高报警': { screen: 'external', component: 'old_pump2', label: '聚铝老厂-循环泵2' },
  '老厂水泵3电流低报警': { screen: 'external', component: 'old_pump3', label: '聚铝老厂-循环泵3' },
  '老厂水泵3电流高报警': { screen: 'external', component: 'old_pump3', label: '聚铝老厂-循环泵3' },
  '老厂离心机电流低报警': { screen: 'external', component: 'old_centrifuge', label: '聚铝老厂-离心机' },
  '老厂离心机电流高报警': { screen: 'external', component: 'old_centrifuge', label: '聚铝老厂-离心机' },
  
  // 外部设备 - 滚筒干燥
  '滚筒风机电流低报警': { screen: 'external', component: 'drum_fan', label: '滚筒干燥-风机' },
  '滚筒风机电流高报警': { screen: 'external', component: 'drum_fan', label: '滚筒干燥-风机' },
  '滚筒水泵1电流低报警': { screen: 'external', component: 'drum_pump1', label: '滚筒干燥-循环泵1' },
  '滚筒水泵1电流高报警': { screen: 'external', component: 'drum_pump1', label: '滚筒干燥-循环泵1' },
  '滚筒水泵2电流低报警': { screen: 'external', component: 'drum_pump2', label: '滚筒干燥-循环泵2' },
  '滚筒水泵2电流高报警': { screen: 'external', component: 'drum_pump2', label: '滚筒干燥-循环泵2' },
};

const ALARM_DISPLAY_KEYWORDS = ['温度', '液位', '泄漏', '电流', '流量'];

export function formatAlarmDisplayName(alarmName: string): string {
  const matchedKeyword = ALARM_DISPLAY_KEYWORDS.find(keyword => alarmName.includes(keyword));

  if (!matchedKeyword) {
    return alarmName;
  }

  const keywordIndex = alarmName.indexOf(matchedKeyword);
  const simplifiedName = alarmName.slice(keywordIndex);

  return simplifiedName
    .replace('检测值', '')
    .replace('值低报警', '低报警')
    .replace('值高报警', '高报警')
    .replace('值低保护', '低保护')
    .replace('值高保护', '高保护');
}

// 检查部件是否有报警
export function hasAlarm(componentId: string, alarmData: AlarmData): boolean {
  for (const [alarmName, isActive] of Object.entries(alarmData)) {
    if (isActive && ALARM_MAPPING[alarmName]?.component === componentId) {
      return true;
    }
  }
  return false;
}

// 获取部件的所有活动报警名称
export function getAlarmNames(componentId: string, alarmData: AlarmData): string[] {
  const alarmNames: string[] = [];
  for (const [alarmName, isActive] of Object.entries(alarmData)) {
    if (isActive && ALARM_MAPPING[alarmName]?.component === componentId) {
      alarmNames.push(formatAlarmDisplayName(alarmName));
    }
  }
  return alarmNames;
}
