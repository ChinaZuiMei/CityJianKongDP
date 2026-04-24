import React, { Suspense } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import 'echarts-liquidfill';
import { ScadaData } from '../model/types';
import './TankDataPanel.css';
import titleBg from '../../../images/小标题图片.png';
import loadingTruckImage from '../../../images/油罐车.png';

const ReactECharts = React.lazy(() => import('echarts-for-react'));

interface TankDataPanelProps {
  data: ScadaData;
  title?: string;
  subtitle?: string;
  position?: 'left' | 'right';
  mode?: 'level' | 'temperature' | 'external' | 'loading' | 'flow' | 'leak';
  top?: number;
  bottom?: number;
  embedded?: boolean;
  style?: React.CSSProperties;
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

function createLoadingPanelOption(data: ScadaData): EChartsOption {
  const rows = [
    {
      label: '瞬时流量',
      value: Number.isFinite(data.loading_instant) ? data.loading_instant : 0,
      unit: 'm³/h',
    },
    {
      label: '累计流量',
      value: Number.isFinite(data.loading_total) ? data.loading_total : 0,
      unit: 'm³',
    },
  ];

  const values = rows.map((row) => row.value);
  const maxValue = Math.max(...values.map((v) => Math.abs(v)), 1);
  const backgroundValues = rows.map(() => maxValue);

  return {
    grid: {
      left: '5%',
      right: '5%',
      bottom: '8%',
      top: '8%',
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
        return `${row.label}<br/>数值 : ${row.value.toFixed(1)} ${row.unit}`;
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
          fontSize: 12,
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
        data: rows.map((row) => row.label),
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
            return `${row.value.toFixed(1)} ${row.unit}`;
          },
        },
        data: values,
      },
    ],
    series: [
      {
        name: '流量',
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

function createLeakPanelOption(data: ScadaData): EChartsOption {
  const rows = [
    {
      label: '1# 泄漏',
      value: Math.max(Number.isFinite(data.leak1) ? data.leak1 : 0, 0),
      rawValue: Number.isFinite(data.leak1) ? data.leak1 : 0,
      unit: 'ppm',
    },
    {
      label: '2# 泄漏',
      value: Math.max(Number.isFinite(data.leak2) ? data.leak2 : 0, 0),
      rawValue: Number.isFinite(data.leak2) ? data.leak2 : 0,
      unit: 'ppm',
    },
    {
      label: '3# 泄漏',
      value: Math.max(Number.isFinite(data.leak3) ? data.leak3 : 0, 0),
      rawValue: Number.isFinite(data.leak3) ? data.leak3 : 0,
      unit: 'ppm',
    },
  ];

  const values = rows.map((row) => row.value);
  const maxValue = Math.max(...values.map((v) => Math.abs(v)), 0.2);
  const backgroundValues = rows.map(() => maxValue);

  return {
    grid: {
      left: '5%',
      right: '5%',
      bottom: '8%',
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
        return `${row.label}<br/>数值 : ${row.rawValue.toFixed(3)} ${row.unit}`;
      },
    },
    xAxis: {
      show: false,
      type: 'value',
      max: maxValue,
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisLabel: {
          show: true,
          color: '#fff',
          fontSize: 12,
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
        data: rows.map((row) => row.label),
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
          formatter: (_value: string, index: number) => `${rows[index].rawValue.toFixed(3)} ppm`,
        },
        data: values,
      },
    ],
    series: [
      {
        name: '泄漏值',
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

function createFlowLiquidFillOption(data: ScadaData): EChartsOption {
  return createFlowLiquidFillOptionByValues('', data.acid_flow_instant, data.acid_flow_total);
}

function createFlowLiquidFillOptionByValues(title: string, instantRaw: number, totalRaw: number): EChartsOption {
  const instantValue = Number.isFinite(instantRaw) ? instantRaw : 0;
  const totalValue = Number.isFinite(totalRaw) ? totalRaw : 0;
  const instantMax = Math.max(instantValue * 1.4, 10);
  const totalMax = Math.max(totalValue * 1.2, 100);
  const instantPercent = Math.max(0, Math.min(instantValue / instantMax, 1));
  const totalPercent = Math.max(0, Math.min(totalValue / totalMax, 1));

  const buildLabel = (value: number, unit: string, fontSize: number) => ({
    formatter: () => `{value|${value.toFixed(2)}}\n{unit|${unit}}`,
    rich: {
      value: {
        fontSize,
        fontWeight: 700,
        color: '#ffffff',
        lineHeight: fontSize + 6,
      },
      unit: {
        fontSize: 10,
        fontWeight: 500,
        color: '#9fdcff',
        lineHeight: 14,
      },
    },
  });

  return {
    backgroundColor: 'transparent',
    title: [
      {
        text: title,
        left: 'center',
        top: '3%',
        textAlign: 'center',
        textStyle: {
          fontSize: 13,
          fontWeight: 700,
          color: '#8fdfff',
          lineHeight: 16,
        },
      },
      {
        text: '瞬时流量',
        left: '22%',
        top: '74%',
        textAlign: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 400,
          color: '#5dc3ea',
          lineHeight: 16,
        },
      },
      {
        text: '累计流量',
        left: '73%',
        top: '74%',
        textAlign: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 400,
          color: '#5dc3ea',
          lineHeight: 16,
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const seriesIndex = typeof params?.seriesIndex === 'number' ? params.seriesIndex : 0;
        if (seriesIndex === 0) {
          return `瞬时流量<br/>数值 : ${instantValue.toFixed(2)} m³/h`;
        }
        return `累计流量<br/>数值 : ${totalValue.toFixed(2)} m³`;
      },
    },
    series: [
      {
        type: 'liquidFill',
        radius: '47%',
        center: ['25%', '45%'],
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#446bf5' },
              { offset: 1, color: '#2ca3e2' },
            ],
            globalCoord: false,
          },
        ],
        data: [instantPercent, instantPercent],
        backgroundStyle: {
          borderWidth: 1,
          color: 'rgba(51, 66, 127, 0.7)',
        },
        label: buildLabel(instantValue, 'm³/h', 22),
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#112165',
          },
        },
      } as any,
      {
        type: 'liquidFill',
        radius: '47%',
        center: ['75%', '45%'],
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#2aa1e3' },
              { offset: 1, color: '#08bbc9' },
            ],
            globalCoord: false,
          },
        ],
        data: [totalPercent, totalPercent],
        backgroundStyle: {
          borderWidth: 1,
          color: 'rgba(51, 66, 127, 0.7)',
        },
        label: buildLabel(totalValue, 'm³', 18),
        outline: {
          borderDistance: 0,
          itemStyle: {
            borderWidth: 2,
            borderColor: '#112165',
          },
        },
      } as any,
    ],
  };
}

function createLeakLiquidFillOption(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'liquidFill',
        data: [0.58, 0.5, 0.4, 0.28],
        radius: '60%',
        outline: { show: false },
        backgroundStyle: {
          borderColor: '#156ACF',
          borderWidth: 1,
          shadowColor: 'rgba(0, 0, 0, 0.4)',
          shadowBlur: 25,
          color: 'rgba(180,200,200,0.08)',
        },
        shape:
          'path://M367.855,428.202c-3.674-1.385-7.452-1.966-11.146-1.794c0.659-2.922,0.844-5.85,0.58-8.719 c-0.937-10.407-7.663-19.864-18.063-23.834c-10.697-4.043-22.298-1.168-29.902,6.403c3.015,0.026,6.074,0.594,9.035,1.728 c13.626,5.151,20.465,20.379,15.32,34.004c-1.905,5.02-5.177,9.115-9.22,12.05c-6.951,4.992-16.19,6.536-24.777,3.271 c-13.625-5.137-20.471-20.371-15.32-34.004c0.673-1.768,1.523-3.423,2.526-4.992h-0.014c0,0,0,0,0,0.014 c4.386-6.853,8.145-14.279,11.146-22.187c23.294-61.505-7.689-130.278-69.215-153.579c-61.532-23.293-130.279,7.69-153.579,69.202 c-6.371,16.785-8.679,34.097-7.426,50.901c0.026,0.554,0.079,1.121,0.132,1.688c4.973,57.107,41.767,109.148,98.945,130.793 c58.162,22.008,121.303,6.529,162.839-34.465c7.103-6.893,17.826-9.444,27.679-5.719c11.858,4.491,18.565,16.6,16.719,28.643 c4.438-3.126,8.033-7.564,10.117-13.045C389.751,449.992,382.411,433.709,367.855,428.202z',
        label: { show: false },
      } as any,
    ],
  };
}

function createLeakLiquidFillAltOption(): EChartsOption {
  return {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'liquidFill',
        data: [0.52, 0.46, 0.36, 0.26],
        radius: '64%',
        outline: { show: false },
        color: [
          'rgba(34, 211, 238, 0.85)',
          'rgba(56, 189, 248, 0.65)',
          'rgba(99, 102, 241, 0.45)',
        ],
        backgroundStyle: {
          borderColor: 'rgba(125, 211, 252, 0.65)',
          borderWidth: 1,
          shadowColor: 'rgba(2, 132, 199, 0.25)',
          shadowBlur: 18,
          color: 'rgba(180,200,200,0.06)',
        },
        // 使用圆形作为另一套展示风格
        shape: 'circle',
        amplitude: 4,
        waveLength: '75%',
        label: { show: false },
      } as any,
    ],
  };
}

type ExternalPanelVariant = 'old' | 'drum';

function createExternalEquipmentOption(data: ScadaData, variant: ExternalPanelVariant): EChartsOption {
  const categories =
    variant === 'drum'
      ? [
          { name: '风机', value: Number.isFinite(data.drum_fan_v) ? data.drum_fan_v : 0 },
          { name: '循环泵1', value: Number.isFinite(data.drum_pump1_v) ? data.drum_pump1_v : 0 },
          { name: '循环泵2', value: Number.isFinite(data.drum_pump2_v) ? data.drum_pump2_v : 0 },
          { name: '离心机', value: Number.isFinite(data.drum_centrifuge_v) ? data.drum_centrifuge_v : 0 },
        ]
      : [
          { name: '风机', value: Number.isFinite(data.old_fan_v) ? data.old_fan_v : 0 },
          { name: '循环泵1', value: Number.isFinite(data.old_pump1_v) ? data.old_pump1_v : 0 },
          { name: '循环泵2', value: Number.isFinite(data.old_pump2_v) ? data.old_pump2_v : 0 },
          { name: '循环泵3', value: Number.isFinite(data.old_pump3_v) ? data.old_pump3_v : 0 },
        ];

  const values = categories.map((item) => item.value);
  const rawMax = Math.max(...values, 1);
  const maxValue = Math.max(10, Math.ceil(rawMax / 10) * 10);
  const barValues = values.map((value) => Math.max(value, maxValue * 0.08));
  const endCaps = barValues.map((value) => ({ value, symbolPosition: 'end' as const }));

  return {
    backgroundColor: 'transparent',
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      formatter: (params: any) => {
        const point = Array.isArray(params) ? params.find((item) => item?.seriesName === '设备值') : params;
        const name = point?.axisValueLabel ?? '';
        const value = typeof point?.value === 'number' ? point.value : 0;
        return `${name}<br/>数值 : ${value.toFixed(1)} A`;
      },
    },
    grid: {
      left: '3%',
      right: '3%',
      top: '8%',
      bottom: '16%',
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: categories.map((item) => item.name),
      max: categories.length - 1,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: 'rgba(225, 245, 255, 0.92)',
        fontSize: 10,
        margin: 14,
      },
    },
    yAxis: [
      {
        type: 'value',
        max: maxValue,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '顶部',
        type: 'pictorialBar',
        symbolSize: [38, 16],
        symbolOffset: [0, -10],
        z: 12,
        itemStyle: {
          color: '#6fe6ff',
        },
        data: endCaps,
      },
      {
        name: '底部',
        type: 'pictorialBar',
        symbolSize: [38, 16],
        symbolOffset: [0, 10],
        z: 12,
        itemStyle: {
          color: '#4fd8ff',
        },
        data: barValues,
      },
      {
        name: '实线边框',
        type: 'pictorialBar',
        symbolSize: [56, 28],
        symbolOffset: [0, 18],
        z: 11,
        itemStyle: {
          color: 'transparent',
          borderColor: '#62deff',
          borderWidth: 3,
          shadowColor: 'rgba(111, 230, 255, 0.35)',
          shadowBlur: 8,
        },
        data: barValues,
      },
      {
        name: '虚线边框',
        type: 'pictorialBar',
        symbolSize: [70, 38],
        symbolOffset: [0, 24],
        z: 10,
        itemStyle: {
          color: 'transparent',
          borderColor: '#7be9ff',
          borderType: 'dashed',
          borderWidth: 3,
        },
        data: barValues,
      },
      {
        name: '设备值',
        type: 'bar',
        barWidth: 38,
        barGap: '-100%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(132, 239, 255, 0.95)' },
            { offset: 0.28, color: 'rgba(61, 201, 255, 0.88)' },
            { offset: 1, color: 'rgba(18, 110, 203, 0.72)' },
          ]),
          shadowColor: 'rgba(96, 228, 255, 0.28)',
          shadowBlur: 10,
        },
        label: {
          show: true,
          position: 'top',
          color: '#ffffff',
          fontSize: 11,
          distance: 10,
          formatter: ({ dataIndex }: { dataIndex: number }) => `${values[dataIndex].toFixed(1)}`,
        },
        data: barValues,
        z: 9,
      },
    ],
  };
}

function clampGaugeValue(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(500, value));
}

function createTemperatureGaugeOption(value: number, name: string): EChartsOption {
  const safeValue = clampGaugeValue(value);
  const percent = safeValue / 500;

  return {
    backgroundColor: 'transparent',
    title: {
      text: `{num|${safeValue.toFixed(1)}}`,
      left: '50%',
      top: '58%',
      textAlign: 'center',
      textStyle: {
        rich: {
          num: {
            fontWeight: 600,
            color: '#f8f8fa',
            fontFamily: 'Microsoft YaHei, sans-serif',
            fontSize: 20,
            lineHeight: 24,
          },
        },
      },
    },
    series: [
      {
        type: 'gauge',
        radius: '86%',
        center: ['50%', '74%'],
        splitNumber: 10,
        min: 0,
        max: 500,
        startAngle: 180,
        endAngle: 0,
        axisLine: {
          lineStyle: {
            width: 1,
            color: [[1, 'rgba(255,255,255,0)']],
          },
        },
        axisTick: {
          show: true,
          splitNumber: 6,
          distance: -10,
          lineStyle: {
            color: '#dff7ff',
            width: 1.5,
            shadowColor: 'rgba(129, 210, 255, 0.7)',
            shadowBlur: 2,
          },
          length: 3,
        },
        splitLine: {
          show: true,
          distance: -10,
          length: 9,
          lineStyle: {
            color: '#98dcff',
            width: 2,
          },
        },
        axisLabel: {
          show: true,
          color: '#ccefff',
          fontSize: 8,
          distance: -28,
          formatter: (tickValue: number) => `${tickValue}`,
        },
        pointer: {
          show: true,
          length: '53%',
          width: 3,
          offsetCenter: [0, '-8%'],
          itemStyle: {
            color: '#eefbff',
            shadowColor: 'rgba(137, 208, 255, 0.65)',
            shadowBlur: 10,
          },
        },
        anchor: {
          show: true,
          size: 6,
          itemStyle: {
            color: '#f7fdff',
            borderColor: '#96d9ff',
            borderWidth: 1.5,
          },
        },
        detail: {
          show: false,
        },
        title: {
          show: false,
        },
        data: [
          {
            value: safeValue,
            name,
          },
        ],
      },
      {
        name,
        type: 'pie',
        radius: ['58%', '70%'],
        center: ['50%', '74%'],
        startAngle: 180,
        endAngle: 0,
        color: [
          {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              { offset: 0, color: 'transparent' },
              { offset: 0.38, color: '#f7fcff' },
              { offset: 1, color: '#5ebcff' },
            ],
          },
          'transparent',
        ],
        hoverAnimation: false,
        legendHoverLink: false,
        z: 10,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 50 + percent * 50,
          },
          {
            value: 100 - (50 + percent * 50),
          },
        ],
      },
      {
        type: 'pie',
        hoverAnimation: false,
        label: {
          show: false,
        },
        center: ['50%', '74%'],
        radius: ['0%', '54%'],
        startAngle: 180,
        data: [
          {
            value: 100,
            itemStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  { offset: 0, color: '#00c2eb' },
                  { offset: 1, color: '#094461' },
                ],
              },
              opacity: 0.2,
            },
          },
          {
            value: 100,
            itemStyle: {
              color: 'transparent',
            },
          },
        ],
      },
    ],
  };
}

export const TankDataPanel: React.FC<TankDataPanelProps> = ({
  data,
  title = '罐区可视化面板',
  subtitle = 'TANK AREA PARAMETERS',
  position = 'left',
  mode = 'level',
  top,
  bottom,
  embedded = false,
  style,
}) => {
  const [leakLiquidVariant, setLeakLiquidVariant] = React.useState<0 | 1>(0);
  const [externalVariant, setExternalVariant] = React.useState<ExternalPanelVariant>('old');
  const [externalVisible, setExternalVisible] = React.useState(true);
  const [flowVariant, setFlowVariant] = React.useState<'acid' | 'waste'>('acid');
  const [flowVisible, setFlowVisible] = React.useState(true);
  const externalSwitchTimeoutRef = React.useRef<number | null>(null);
  const flowSwitchTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (mode !== 'external') return;

    const timer = window.setInterval(() => {
      setExternalVisible(false);
      if (externalSwitchTimeoutRef.current !== null) {
        window.clearTimeout(externalSwitchTimeoutRef.current);
      }
      externalSwitchTimeoutRef.current = window.setTimeout(() => {
        setExternalVariant((current) => (current === 'old' ? 'drum' : 'old'));
        setExternalVisible(true);
        externalSwitchTimeoutRef.current = null;
      }, 220);
    }, 3000);

    return () => {
      window.clearInterval(timer);
      if (externalSwitchTimeoutRef.current !== null) {
        window.clearTimeout(externalSwitchTimeoutRef.current);
        externalSwitchTimeoutRef.current = null;
      }
    };
  }, [mode]);

  React.useEffect(() => {
    if (mode !== 'flow') return;

    const timer = window.setInterval(() => {
      setFlowVisible(false);
      if (flowSwitchTimeoutRef.current !== null) {
        window.clearTimeout(flowSwitchTimeoutRef.current);
      }
      flowSwitchTimeoutRef.current = window.setTimeout(() => {
        setFlowVariant((current) => (current === 'acid' ? 'waste' : 'acid'));
        setFlowVisible(true);
        flowSwitchTimeoutRef.current = null;
      }, 220);
    }, 3500);

    return () => {
      window.clearInterval(timer);
      if (flowSwitchTimeoutRef.current !== null) {
        window.clearTimeout(flowSwitchTimeoutRef.current);
        flowSwitchTimeoutRef.current = null;
      }
    };
  }, [mode]);

  const option = React.useMemo(() => createTankPanelOption(data), [data]);
  const tank1TempOption = React.useMemo(
    () => createTemperatureGaugeOption(data.tank1_temp, '1# 反应槽'),
    [data.tank1_temp],
  );
  const tank2TempOption = React.useMemo(
    () => createTemperatureGaugeOption(data.tank2_temp, '2# 反应槽'),
    [data.tank2_temp],
  );
  const flowOption = React.useMemo(
    () =>
      flowVariant === 'acid'
        ? createFlowLiquidFillOption(data)
        : createFlowLiquidFillOptionByValues('', data.waste_flow_instant, data.waste_flow_total),
    [data, flowVariant],
  );
  const loadingOption = React.useMemo(() => createLoadingPanelOption(data), [data]);
  const leakOption = React.useMemo(() => createLeakPanelOption(data), [data]);
  const leakLiquidOption = React.useMemo(
    () => (leakLiquidVariant === 0 ? createLeakLiquidFillOption() : createLeakLiquidFillAltOption()),
    [leakLiquidVariant],
  );
  const externalEquipmentOption = React.useMemo(
    () => createExternalEquipmentOption(data, externalVariant),
    [data, externalVariant],
  );
  const chartHeight = React.useMemo(() => {
    return Math.max(tankMetrics.length * 38 + 40, 200);
  }, []);

  return (
    <aside
      className={`tank-data-panel tank-data-panel--${position}${embedded ? ' tank-data-panel--embedded' : ''}`}
      style={{
        ...(!embedded && top !== undefined ? { top } : {}),
        ...(!embedded && bottom !== undefined ? { top: 'auto', bottom } : {}),
        ...style,
      }}
    >
      <section className="sci-panel tank-panel-top">
        <div className="sci-panel-header">
          <img src={titleBg} alt="" className="title-bg-image" />
          <div className="sci-panel-title">{title}</div>
          <div className="sci-panel-subtitle">{subtitle}</div>
        </div>
      </section>
      <section className="sci-panel tank-panel-main">
        <div className="sci-panel-body">
          {mode === 'temperature' ? (
            <>
              <div className="tank-panel-chart-meta">
                <span>主画面温度监测</span>
                <span>单位 / °C</span>
              </div>
              <div className="temp-gauge-grid">
                <div className="temp-gauge-card">
                  <div className="temp-gauge-chart">
                    <Suspense fallback={<div className="tank-chart-fallback" />}>
                      <ReactECharts
                        option={tank1TempOption}
                        notMerge
                        lazyUpdate
                        opts={{ renderer: 'canvas' }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Suspense>
                  </div>
                  <div className="temp-gauge-label">1# 反应槽温度</div>
                </div>
                <div className="temp-gauge-card">
                  <div className="temp-gauge-chart">
                    <Suspense fallback={<div className="tank-chart-fallback" />}>
                      <ReactECharts
                        option={tank2TempOption}
                        notMerge
                        lazyUpdate
                        opts={{ renderer: 'canvas' }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Suspense>
                  </div>
                  <div className="temp-gauge-label">2# 反应槽温度</div>
                </div>
              </div>
            </>
          ) : mode === 'external' ? (
            <div className={externalVisible ? 'external-panel-content' : 'external-panel-content external-panel-content--hidden'}>
              <div className="tank-panel-chart-meta">
                <span>{externalVariant === 'old' ? '聚铝老厂动态监测' : '滚筒干燥动态监测'}</span>
                <span>{externalVariant === 'old' ? '聚铝老厂' : '滚筒干燥'} / A</span>
              </div>
              <div className="tank-panel-chart external-panel-chart" style={{ height: 236 }}>
                <Suspense fallback={<div className="tank-chart-fallback" />}>
                  <ReactECharts
                    option={externalEquipmentOption}
                    notMerge
                    lazyUpdate
                    opts={{ renderer: 'canvas' }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              </div>
            </div>
          ) : mode === 'loading' ? (
            <>
              <div className="tank-panel-chart-meta">
                <span>聚铝装车状态</span>
                <span>实时监测</span>
              </div>
              <div className="loading-panel-status">
                <div className="loading-panel-truck-wrap">
                  <div
                    className={
                      data.loading_instant > 0
                        ? 'animate-truck-loading text-emerald-600'
                        : 'animate-truck-standby text-sky-300'
                    }
                  >
                    <img src={loadingTruckImage} alt="装车罐车" className="loading-panel-truck" draggable="false" />
                  </div>
                  <div
                    className={data.loading_instant > 0 ? 'truck-road truck-road--fast' : 'truck-road truck-road--slow'}
                    aria-hidden
                  />
                </div>
                <div className={data.loading_instant > 0 ? 'data-glow-emerald loading-panel-state' : 'data-glow loading-panel-state'}>
                  {data.loading_instant > 0 ? '装载中' : '待机中'}
                </div>
              </div>
              <div className="tank-panel-chart-meta">
                <span>装车流量监测</span>
                <span>单位 / m³</span>
              </div>
              <div className="tank-panel-chart" style={{ height: 108 }}>
                <Suspense fallback={<div className="tank-chart-fallback" />}>
                  <ReactECharts
                    option={loadingOption}
                    notMerge
                    lazyUpdate
                    opts={{ renderer: 'canvas' }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              </div>
            </>
          ) : mode === 'flow' ? (
            <>
              <div className="tank-panel-chart-meta">
                <span>{flowVariant === 'acid' ? '盐酸硫酸流量' : '东氟废水流量'}</span>
              </div>
              <div className={flowVisible ? 'external-panel-content' : 'external-panel-content external-panel-content--hidden'}>
                <div className="tank-panel-chart" style={{ height: 210 }}>
                  <Suspense fallback={<div className="tank-chart-fallback" />}>
                    <ReactECharts
                      option={flowOption}
                      notMerge
                      lazyUpdate
                      opts={{ renderer: 'canvas' }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Suspense>
                </div>
              </div>
            </>
          ) : mode === 'leak' ? (
            <>
              <div className="tank-panel-chart-meta">
                <span>盐酸泄漏监测</span>
                <span>单位 / ppm</span>
              </div>
              <div className="tank-panel-chart" style={{ height: 165 }}>
                <Suspense fallback={<div className="tank-chart-fallback" />}>
                  <ReactECharts
                    option={leakLiquidOption}
                    notMerge
                    lazyUpdate
                    opts={{ renderer: 'canvas' }}
                    onEvents={{
                      click: () => setLeakLiquidVariant((v) => (v === 0 ? 1 : 0)),
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              </div>
              <div className="tank-panel-chart" style={{ height: 150 }}>
                <Suspense fallback={<div className="tank-chart-fallback" />}>
                  <ReactECharts
                    option={leakOption}
                    notMerge
                    lazyUpdate
                    opts={{ renderer: 'canvas' }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Suspense>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </aside>
  );
};
