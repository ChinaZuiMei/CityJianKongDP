import type { SidePanelSchema } from '../model/panelSchema';

export const sidePanelSchemas: SidePanelSchema[] = [
  {
    id: 'left-panel-stack',
    side: 'left',
    rect: { x: 24, y: 96, width: 360, height: 780 },
    widgets: [
      {
        id: 'left-cooling-pump-metrics',
        type: 'metric-list',
        title: '冷却泵参数',
        subtitle: 'Cooling Pump Parameters',
        rect: { x: 0, y: 0, width: 360, height: 220 },
        items: [
          { id: 'pump-1', label: '#1冷却泵', field: 'old_pump1_v', unit: 'A', decimals: 2 },
          { id: 'pump-2', label: '#2冷却泵', field: 'old_pump2_v', unit: 'A', decimals: 2 },
          { id: 'pump-3', label: '#3冷却泵', field: 'old_pump3_v', unit: 'A', decimals: 2 },
        ],
      },
      {
        id: 'left-environment-chart',
        type: 'chart',
        title: '冷水机组信息',
        subtitle: 'Environmental Monitoring',
        rect: { x: 0, y: 244, width: 360, height: 240 },
        chart: {
          type: 'bar',
          series: [{ id: 'env-series', name: '环境监测', color: '#38bdf8' }],
        },
      },
      {
        id: 'left-cooling-pump-extra',
        type: 'metric-list',
        title: '冷却泵参数',
        subtitle: 'Cooling Pump Parameters',
        rect: { x: 0, y: 508, width: 360, height: 220 },
        items: [
          { id: 'pump-6', label: '#6冷却泵', field: 'drum_pump1_v', unit: 'A', decimals: 2 },
          { id: 'pump-7', label: '#7冷却泵', field: 'drum_pump2_v', unit: 'A', decimals: 2 },
          { id: 'pump-8', label: '#8冷却泵', field: 'drum_fan_v', unit: 'A', decimals: 2 },
        ],
      },
    ],
  },
  {
    id: 'right-panel-stack',
    side: 'right',
    rect: { x: 1536, y: 96, width: 360, height: 780 },
    widgets: [
      {
        id: 'right-device-status',
        type: 'status-toggle-list',
        title: '冷却设备状态',
        subtitle: 'Device Status',
        rect: { x: 0, y: 0, width: 360, height: 220 },
        items: [
          { id: 'fan', label: '#1冷却塔', field: 'mqttConnected', onText: 'on', offText: 'off' },
          { id: 'pump-a', label: '#2冷却塔', field: 'mqttConnected', onText: 'on', offText: 'off' },
          { id: 'pump-b', label: '#3冷却塔', field: 'mqttConnected', onText: 'on', offText: 'off' },
          { id: 'pump-c', label: '#4冷却塔', field: 'mqttConnected', onText: 'on', offText: 'off' },
        ],
      },
      {
        id: 'right-gauges',
        type: 'gauge-group',
        title: '环境监控',
        subtitle: 'Environmental Monitoring',
        rect: { x: 0, y: 244, width: 360, height: 220 },
        items: [
          { id: 'indoor-temp', label: '室内温度', field: 'tank1_temp', unit: '°C', min: 0, max: 50 },
          { id: 'outdoor-temp', label: '室外温度', field: 'tank2_temp', unit: '°C', min: 0, max: 50 },
        ],
      },
      {
        id: 'right-monitor-table',
        type: 'monitor-table',
        title: '主机群监控',
        subtitle: 'Host Group Monitoring',
        rect: { x: 0, y: 488, width: 360, height: 250 },
        columns: [
          { id: 'name', label: '机组', field: 'name' },
          { id: 'value-1', label: '#1机组', field: 'value1' },
          { id: 'value-2', label: '#2机组', field: 'value2' },
          { id: 'value-3', label: '#3机组', field: 'value3' },
        ],
        rowsField: 'hostGroupRows',
      },
    ],
  },
];
