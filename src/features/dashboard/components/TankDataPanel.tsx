import React, { Suspense } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { ScadaData } from '../model/types';
import './TankDataPanel.css';
import titleBg from '../../../images/小标题图片.png';

const ReactECharts = React.lazy(() => import('echarts-for-react'));

interface TankDataPanelProps {
  data: ScadaData;
}

interface TankMetric {
  id: keyof ScadaData;
  label: string;
  max: number;
  unit: string;
  color: [string, string];
}

const tankMetrics: TankMetric[] = [
  { id: 'hcl_tank1_level', label: '1# 盐酸罐', max: 3.6, unit: 'm', color: ['rgba(25, 208, 255, 0.18)', 'rgba(53, 211, 255, 1)'] },
  { id: 'hcl_tank2_level', label: '2# 盐酸罐', max: 3.6, unit: 'm', color: ['rgba(33, 149, 255, 0.16)', 'rgba(65, 159, 255, 1)'] },
  { id: 'hcl_tank3_level', label: '3# 盐酸罐', max: 3.6, unit: 'm', color: ['rgba(58, 119, 255, 0.14)', 'rgba(108, 193, 255, 1)'] },
  { id: 'h2so4_tank1_level', label: '1# 硫酸罐', max: 6.2, unit: 'm', color: ['rgba(31, 239, 216, 0.14)', 'rgba(76, 238, 221, 1)'] },
];

function createTankPanelOption(data: ScadaData): EChartsOption {
  const categoryLabels = ['盐酸罐', '盐酸罐', '盐酸罐', '硫酸罐'];
  const rows = tankMetrics.map((item, index) => {
    const rawValue = data[item.id];
    const safeValue = Number.isFinite(rawValue) ? rawValue : 0;
    return {
      ...item,
      index,
      rawValue: safeValue,
    };
  });

  const values = rows.map((row) => row.rawValue);
  const maxValue = Math.max(...values.map((v) => Math.abs(v)), 1);
  const backgroundValues = rows.map(() => maxValue);

  return {
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '10%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      formatter: (params: any) => {
        const list = Array.isArray(params) ? params : [];
        const point = list[0];
        const idx = typeof point?.dataIndex === 'number' ? point.dataIndex : 0;
        const row = rows[idx];
        const name = point?.name ?? categoryLabels[idx] ?? '';
        return (
          `${name}<br/>` +
          "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
          `液位 : ${row.rawValue.toFixed(2)} ${row.unit}<br/>`
        );
      },
    },
    xAxis: {
      show: false,
      type: 'value',
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLabel: {
          show: true,
          color: '#fff',
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: categoryLabels,
      },
      {
        type: 'category',
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        show: true,
        axisLabel: {
          color: '#ffffff',
          fontSize: 12,
          formatter: (_value: string, index: number) => {
            const row = rows[index];
            return `${row.rawValue.toFixed(2)} ${row.unit}`;
          },
        },
        data: values,
      },
    ],
    series: [
      {
        name: '液位',
        type: 'bar',
        zlevel: 1,
        itemStyle: {
          borderRadius: 30,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgb(57,89,255,1)' },
            { offset: 1, color: 'rgb(46,200,207,1)' },
          ]),
        },
        barWidth: 8,
        data: values,
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: 8,
        barGap: '-100%',
        data: backgroundValues,
        itemStyle: {
          color: 'rgba(24,31,68,1)',
          borderRadius: 30,
        },
        silent: true,
      },
    ],
  };
}

export const TankDataPanel: React.FC<TankDataPanelProps> = ({ data }) => {
  const option = React.useMemo(() => createTankPanelOption(data), [data]);
  const chartHeight = React.useMemo(() => {
    return Math.max(tankMetrics.length * 46 + 56, 240);
  }, []);

  return (
    <aside className="tank-data-panel">
      <section className="sci-panel tank-panel-top">
        <div className="sci-panel-header">
          <img src={titleBg} alt="" className="title-bg-image" />
          <div className="sci-panel-title">罐区可视化参数</div>
          <div className="sci-panel-subtitle">TANK AREA PARAMETERS</div>
        </div>
      </section>
      <section className="sci-panel tank-panel-main">
        <div className="sci-panel-body">
          <div className="tank-panel-chart-meta">
            <span>液位动态监测</span>
            <span>单位 / m</span>
          </div>
          <div className="tank-panel-chart" style={{ height: chartHeight }}>
            <Suspense fallback={<div className="tank-chart-fallback" />}>
              <ReactECharts
                option={option}
                notMerge
                lazyUpdate
                opts={{ renderer: 'canvas' }}
                style={{ width: '100%', height: '100%' }}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </aside>
  );
};
