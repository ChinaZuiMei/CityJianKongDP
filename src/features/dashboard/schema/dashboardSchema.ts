export interface RefreshPolicySchema {
  id: string;
  intervalMs: number;
  endpoint: string;
  mode: 'live' | 'mock';
}

export interface EventSchema {
  id: string;
  type: 'toggle' | 'select';
  target: string;
}

export interface DashboardSectionSchema {
  id: string;
  title: string;
  screen: 'main' | 'loading' | 'tanks' | 'external';
  column: 'primary' | 'secondary' | 'tertiary';
  minHeight: string;
  scaleClass?: string;
}

export interface DashboardWidgetSchema {
  id: string;
  title: string;
  widget: 'tankLeakPanel' | 'loadingMetricsPanel' | 'warningOverviewPanel';
  column: 'tertiary';
  minHeight: string;
}

export interface DashboardPageSchema {
  id: string;
  title: string;
  workshops: string[];
  sections: DashboardSectionSchema[];
  widgets: DashboardWidgetSchema[];
  refreshPolicies: RefreshPolicySchema[];
  events: EventSchema[];
}

export const dashboardPageSchema: DashboardPageSchema = {
  id: 'scada-overview',
  title: '中德环保生产监控大屏',
  workshops: ['一号车间', '二号车间', '三号车间', '成品库房'],
  sections: [
    {
      id: 'main-screen',
      title: '主画面',
      screen: 'main',
      column: 'primary',
      minHeight: 'minmax(320px, 42vh)',
      scaleClass: 'scale-[0.92] 3xl:scale-[0.97]',
    },
    {
      id: 'loading-screen',
      title: '装车',
      screen: 'loading',
      column: 'primary',
      minHeight: 'minmax(320px, 34vh)',
    },
    {
      id: 'tank-screen',
      title: '罐区',
      screen: 'tanks',
      column: 'secondary',
      minHeight: 'minmax(320px, 42vh)',
      scaleClass: 'scale-[0.94] 3xl:scale-[0.98]',
    },
    {
      id: 'external-screen',
      title: '外部设备',
      screen: 'external',
      column: 'secondary',
      minHeight: 'minmax(360px, 56vh)',
    },
  ],
  widgets: [
    {
      id: 'tank-leak-panel',
      title: '罐区介质监测',
      widget: 'tankLeakPanel',
      column: 'tertiary',
      minHeight: 'minmax(280px, 26vh)',
    },
    {
      id: 'loading-metrics-panel',
      title: '装车数据看板',
      widget: 'loadingMetricsPanel',
      column: 'tertiary',
      minHeight: 'minmax(280px, 26vh)',
    },
    {
      id: 'warning-overview-panel',
      title: '预警总览统计',
      widget: 'warningOverviewPanel',
      column: 'tertiary',
      minHeight: 'minmax(360px, 48vh)',
    },
  ],
  refreshPolicies: [
    {
      id: 'mqtt-live',
      intervalMs: 3000,
      endpoint: '/api/mqtt/latest',
      mode: 'live',
    },
    {
      id: 'alarm-live',
      intervalMs: 10000,
      endpoint: '/api/alarms/active',
      mode: 'live',
    },
    {
      id: 'mqtt-mock',
      intervalMs: 3000,
      endpoint: '/mqtt_latest_data.json',
      mode: 'mock',
    },
  ],
  events: [
    { id: 'toggle-alarm-panel', type: 'toggle', target: 'alarm-panel' },
    { id: 'select-workshop', type: 'select', target: 'workshop-filter' },
  ],
};
