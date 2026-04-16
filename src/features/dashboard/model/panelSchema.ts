export type PanelSide = 'left' | 'right';

export type PanelWidgetType =
  | 'metric-list'
  | 'status-toggle-list'
  | 'gauge-group'
  | 'monitor-table'
  | 'chart';

export interface PanelRectSchema {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PanelThemeSchema {
  shellClassName?: string;
  bodyClassName?: string;
  titleClassName?: string;
  accent?: 'sky' | 'cyan';
}

export interface PanelMetricItemSchema {
  id: string;
  label: string;
  field: string;
  unit?: string;
  icon?: string;
  decimals?: number;
  statusRuleId?: string;
}

export interface PanelStatusToggleItemSchema {
  id: string;
  label: string;
  field: string;
  onText?: string;
  offText?: string;
}

export interface PanelGaugeItemSchema {
  id: string;
  label: string;
  field: string;
  unit?: string;
  min?: number;
  max?: number;
}

export interface PanelTableColumnSchema {
  id: string;
  label: string;
  field: string;
}

export interface PanelChartSeriesSchema {
  id: string;
  name: string;
  color?: string;
}

export interface PanelChartSchema {
  type: 'line' | 'bar' | 'gauge';
  datasetField?: string;
  categoriesField?: string;
  series: PanelChartSeriesSchema[];
  option?: Record<string, unknown>;
}

export interface BasePanelWidgetSchema {
  id: string;
  type: PanelWidgetType;
  title: string;
  subtitle?: string;
  rect: PanelRectSchema;
  theme?: PanelThemeSchema;
}

export interface MetricListPanelSchema extends BasePanelWidgetSchema {
  type: 'metric-list';
  items: PanelMetricItemSchema[];
}

export interface StatusToggleListPanelSchema extends BasePanelWidgetSchema {
  type: 'status-toggle-list';
  items: PanelStatusToggleItemSchema[];
}

export interface GaugeGroupPanelSchema extends BasePanelWidgetSchema {
  type: 'gauge-group';
  items: PanelGaugeItemSchema[];
}

export interface MonitorTablePanelSchema extends BasePanelWidgetSchema {
  type: 'monitor-table';
  columns: PanelTableColumnSchema[];
  rowsField: string;
}

export interface ChartPanelSchema extends BasePanelWidgetSchema {
  type: 'chart';
  chart: PanelChartSchema;
}

export type SidePanelWidgetSchema =
  | MetricListPanelSchema
  | StatusToggleListPanelSchema
  | GaugeGroupPanelSchema
  | MonitorTablePanelSchema
  | ChartPanelSchema;

export interface SidePanelSchema {
  id: string;
  side: PanelSide;
  rect: PanelRectSchema;
  widgets: SidePanelWidgetSchema[];
}
