import React from 'react';
import type { EChartsOption } from 'echarts';
import type { AlarmData, ScadaData } from '../model/types';
import type {
  ChartPanelSchema,
  GaugeGroupPanelSchema,
  MetricListPanelSchema,
  MonitorTablePanelSchema,
  SidePanelSchema,
  SidePanelWidgetSchema,
  StatusToggleListPanelSchema,
} from '../model/panelSchema';
import { sidePanelSchemas } from '../schema/sidePanelSchema';
import { ChartPanel } from '../widgets/ChartPanel';
import { PanelShell } from '../ui/PanelShell';

interface SidePanelPreviewProps {
  data: ScadaData;
  alarmData: AlarmData;
  mqttConnected: boolean;
}

type PreviewValue = string | number | boolean | Array<Record<string, string | number>>;

type PreviewState = Record<string, PreviewValue>;

function buildPreviewState(data: ScadaData, mqttConnected: boolean): PreviewState {
  return {
    ...data,
    mqttConnected,
    hostGroupRows: [
      { name: '单元进水温度', value1: 47, value2: 41, value3: 45 },
      { name: '单元出水温度', value1: 46, value2: 44, value3: 45 },
      { name: '室外环境温度', value1: 24, value2: 21, value3: 34 },
      { name: '室内环境温度', value1: 11, value2: 13, value3: 15 },
    ],
  };
}

function getValue(state: PreviewState, field: string) {
  return state[field];
}

function formatMetricValue(value: PreviewValue, decimals = 1) {
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  return String(value ?? '--');
}

function createBarOption(schema: ChartPanelSchema, state: PreviewState): EChartsOption {
  const values = schema.chart.series.map((series) => {
    const raw = getValue(state, series.id);
    return typeof raw === 'number' ? raw : Math.round(Math.random() * 60 + 20);
  });

  return {
    animation: false,
    grid: { left: 16, right: 10, top: 18, bottom: 20, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: schema.chart.series.map((series) => series.name),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(125,211,252,0.2)' } },
      axisLabel: { color: '#cbd5e1', fontSize: 10 },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: 'rgba(125,211,252,0.08)' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        type: 'bar' as const,
        data: values,
        barWidth: 12,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: '#38bdf8',
        },
      },
    ],
  };
}

function createGaugeOption(schema: GaugeGroupPanelSchema, state: PreviewState): EChartsOption {
  return {
    animation: false,
    series: schema.items.map((item, index) => {
      const rawValue = getValue(state, item.field);
      const value = typeof rawValue === 'number' ? rawValue : 0;
      const centerX = schema.items.length === 1 ? '50%' : index === 0 ? '28%' : '72%';

      return {
        type: 'gauge' as const,
        center: [centerX, '58%'],
        radius: '48%',
        min: item.min ?? 0,
        max: item.max ?? 100,
        startAngle: 210,
        endAngle: -30,
        progress: {
          show: true,
          width: 8,
          itemStyle: { color: index === 0 ? '#38bdf8' : '#22d3ee' },
        },
        axisLine: {
          lineStyle: { width: 8, color: [[1, 'rgba(59,130,246,0.18)']] },
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          distance: 6,
          color: '#94a3b8',
          fontSize: 9,
        },
        pointer: {
          show: true,
          width: 3,
          length: '58%',
          itemStyle: { color: '#dbeafe' },
        },
        anchor: {
          show: true,
          size: 8,
          itemStyle: { color: '#e0f2fe' },
        },
        detail: {
          valueAnimation: false,
          offsetCenter: [0, '62%'],
          color: '#e2e8f0',
          fontSize: 14,
          formatter: `{value}${item.unit ?? ''}`,
        },
        title: {
          offsetCenter: [0, '88%'],
          color: '#cbd5e1',
          fontSize: 10,
        },
        data: [{ value, name: item.label }],
      };
    }),
  };
}

function renderMetricList(schema: MetricListPanelSchema, state: PreviewState) {
  return (
    <PanelShell title={schema.title} subtitle={schema.subtitle}>
      <div className="space-y-3">
        {schema.items.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="text-sm font-bold text-slate-200">{item.label}</div>
            <div className="rounded-md border border-sky-300/18 bg-slate-950/20 px-3 py-1.5 font-mono text-sm font-black text-sky-100">
              {formatMetricValue(getValue(state, item.field), item.decimals)}
              {item.unit ? <span className="ml-1 text-[11px] text-slate-400">{item.unit}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function renderStatusToggleList(schema: StatusToggleListPanelSchema, state: PreviewState) {
  return (
    <PanelShell title={schema.title} subtitle={schema.subtitle}>
      <div className="space-y-3">
        {schema.items.map((item) => {
          const active = Boolean(getValue(state, item.field));
          return (
            <div key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-sky-300/10 bg-slate-950/16 px-3 py-2">
              <div className="text-sm font-bold text-slate-200">{item.label}</div>
              <span className={active ? 'side-panel-chip side-panel-chip--active' : 'side-panel-chip'}>
                {item.onText ?? 'on'}
              </span>
              <span className={!active ? 'side-panel-chip side-panel-chip--active' : 'side-panel-chip'}>
                {item.offText ?? 'off'}
              </span>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}

function renderGaugeGroup(schema: GaugeGroupPanelSchema, state: PreviewState) {
  return <ChartPanel title={schema.title} subtitle={schema.subtitle} option={createGaugeOption(schema, state)} />;
}

function renderMonitorTable(schema: MonitorTablePanelSchema, state: PreviewState) {
  const rows = getValue(state, schema.rowsField);
  const tableRows = Array.isArray(rows) ? rows : [];

  return (
    <PanelShell title={schema.title} subtitle={schema.subtitle}>
      <div className="grid grid-cols-4 gap-2 border-b border-sky-300/10 pb-2 text-[11px] font-black tracking-[0.14em] text-slate-400 uppercase">
        {schema.columns.map((column) => (
          <div key={column.id} className={column.id === 'name' ? '' : 'text-right'}>
            {column.label}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {tableRows.map((row, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 rounded-md border border-sky-300/8 bg-slate-950/16 px-2 py-2 text-sm text-slate-200">
            {schema.columns.map((column) => (
              <div key={column.id} className={column.id === 'name' ? 'font-bold' : 'text-right font-mono'}>
                {String(row[column.field] ?? '--')}
              </div>
            ))}
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function renderChart(schema: ChartPanelSchema, state: PreviewState) {
  return <ChartPanel title={schema.title} subtitle={schema.subtitle} option={createBarOption(schema, state)} />;
}

function renderWidget(schema: SidePanelWidgetSchema, state: PreviewState) {
  switch (schema.type) {
    case 'metric-list':
      return renderMetricList(schema, state);
    case 'status-toggle-list':
      return renderStatusToggleList(schema, state);
    case 'gauge-group':
      return renderGaugeGroup(schema, state);
    case 'monitor-table':
      return renderMonitorTable(schema, state);
    case 'chart':
      return renderChart(schema, state);
    default:
      return null;
  }
}

const SidePanelColumn: React.FC<{ schema: SidePanelSchema; state: PreviewState }> = ({ schema, state }) => {
  return (
    <div
      className={schema.side === 'left' ? 'side-panel-preview side-panel-preview--left' : 'side-panel-preview side-panel-preview--right'}
    >
      {schema.widgets.map((widget) => (
        <div
          key={widget.id}
          className="side-panel-preview__item"
          style={{ minHeight: `${widget.rect.height}px` }}
        >
          {renderWidget(widget, state)}
        </div>
      ))}
    </div>
  );
};

export function shouldEnableSidePanelPreview() {
  return import.meta.env.VITE_ENABLE_SIDE_PANEL_PREVIEW === 'true';
}

export const SidePanelPreview = ({ data, alarmData, mqttConnected }: SidePanelPreviewProps) => {
  const state = React.useMemo(() => buildPreviewState(data, mqttConnected), [data, mqttConnected]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {sidePanelSchemas.map((schema) => (
        <SidePanelColumn key={schema.id} schema={schema} state={state} />
      ))}
      <div className="hidden">{Object.keys(alarmData).length}</div>
    </div>
  );
};
