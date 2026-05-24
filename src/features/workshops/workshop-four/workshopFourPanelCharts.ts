import * as echarts from 'echarts';
import type {EChartsOption} from 'echarts';
import 'echarts-liquidfill';
import {formatMetricValue} from '../../../utils/formatMetricValue';
import type {WorkshopFourExternalRow, WorkshopFourLeakRow} from './workshopFourSidePanelBindings';

function clampGaugeValue(value: number) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(500, value));
}

export function createWorkshopFourLeakBarOption(rows: WorkshopFourLeakRow[]): EChartsOption {
    const labels = rows.map((row) => row.label);
    const values = rows.map((row) => (Number.isFinite(row.value) ? row.value : 0));
    const maxValue = Math.max(...values.map((v) => Math.abs(v)), 0.2);
    const backgroundValues = rows.map(() => maxValue);

    return {
        grid: {left: '5%', right: '5%', bottom: '8%', top: '10%', containLabel: true},
        tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'none'},
            formatter: (params: unknown) => {
                const list = Array.isArray(params) ? params : [];
                const point = list[0] as { dataIndex?: number } | undefined;
                const idx = typeof point?.dataIndex === 'number' ? point.dataIndex : 0;
                return `${labels[idx]}<br/>数值 : ${formatMetricValue(values[idx])} ppm`;
            },
        },
        xAxis: {show: false, type: 'value', max: maxValue},
        yAxis: [
            {
                type: 'category',
                inverse: true,
                axisLabel: {show: true, color: '#fff', fontSize: 12},
                splitLine: {show: false},
                axisTick: {show: false},
                axisLine: {show: false},
                data: labels,
            },
            {
                type: 'category',
                inverse: true,
                axisTick: {show: false},
                axisLine: {show: false},
                show: true,
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 12,
                    formatter: (_value: string, index: number) => `${formatMetricValue(values[index])} ppm`,
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
                        {offset: 0, color: 'rgb(57,89,255,1)'},
                        {offset: 1, color: 'rgb(46,200,207,1)'},
                    ]),
                },
                barWidth: 8,
                data: values.map((v) => Math.max(v, 0)),
            },
            {
                name: '背景',
                type: 'bar',
                barWidth: 8,
                barGap: '-100%',
                data: backgroundValues,
                itemStyle: {color: 'rgba(24,31,68,1)', borderRadius: 30},
                silent: true,
            },
        ],
    };
}

export function createWorkshopFourFlowLiquidFillOption(instantRaw: number, totalRaw: number): EChartsOption {
    const instantValue = Number.isFinite(instantRaw) ? instantRaw : 0;
    const totalValue = Number.isFinite(totalRaw) ? totalRaw : 0;
    const instantMax = Math.max(instantValue * 1.4, 10);
    const totalMax = Math.max(totalValue * 1.2, 100);
    const instantPercent = Math.max(0, Math.min(instantValue / instantMax, 1));
    const totalPercent = Math.max(0, Math.min(totalValue / totalMax, 1));

    const buildLabel = (value: number, unit: string, fontSize: number) => ({
        formatter: () => `{value|${formatMetricValue(value)}}\n{unit|${unit}}`,
        rich: {
            value: {fontSize, fontWeight: 700, color: '#ffffff', lineHeight: fontSize + 6},
            unit: {fontSize: 10, fontWeight: 500, color: '#9fdcff', lineHeight: 14},
        },
    });

    return {
        backgroundColor: 'transparent',
        title: [
            {
                text: '瞬时流量',
                left: '22%',
                top: '74%',
                textAlign: 'center',
                textStyle: {fontSize: 14, fontWeight: 400, color: '#5dc3ea'}
            },
            {
                text: '累计流量',
                left: '73%',
                top: '74%',
                textAlign: 'center',
                textStyle: {fontSize: 14, fontWeight: 400, color: '#5dc3ea'}
            },
        ],
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                if (params?.seriesIndex === 0) {
                    return `瞬时流量<br/>数值 : ${formatMetricValue(instantValue)} m³/h`;
                }
                return `累计流量<br/>数值 : ${formatMetricValue(totalValue)} m³`;
            },
        },
        series: [
            {
                type: 'liquidFill',
                radius: '47%',
                center: ['25%', '45%'],
                color: [{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{offset: 0, color: '#446bf5'}, {offset: 1, color: '#2ca3e2'}],
                    globalCoord: false
                }],
                data: [instantPercent, instantPercent],
                backgroundStyle: {borderWidth: 1, color: 'rgba(51, 66, 127, 0.7)'},
                label: buildLabel(instantValue, 'm³/h', 22),
                outline: {borderDistance: 0, itemStyle: {borderWidth: 2, borderColor: '#112165'}},
            } as any,
            {
                type: 'liquidFill',
                radius: '47%',
                center: ['75%', '45%'],
                color: [{
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{offset: 0, color: '#2aa1e3'}, {offset: 1, color: '#08bbc9'}],
                    globalCoord: false
                }],
                data: [totalPercent, totalPercent],
                backgroundStyle: {borderWidth: 1, color: 'rgba(51, 66, 127, 0.7)'},
                label: buildLabel(totalValue, 'm³', 18),
                outline: {borderDistance: 0, itemStyle: {borderWidth: 2, borderColor: '#112165'}},
            } as any,
        ],
    };
}

export function createWorkshopFourLoadingBarOption(instant: number, total: number): EChartsOption {
    const rows = [
        {label: '瞬时流量', value: instant, unit: 'm³/h'},
        {label: '累计流量', value: total, unit: 'm³'},
    ];
    const values = rows.map((row) => row.value);
    const maxValue = Math.max(...values.map((v) => Math.abs(v)), 1);
    const backgroundValues = rows.map(() => maxValue);

    return {
        grid: {left: '5%', right: '5%', bottom: '8%', top: '8%', containLabel: true},
        tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'none'},
            formatter: (params: unknown) => {
                const list = Array.isArray(params) ? params : [];
                const point = list[0] as { dataIndex?: number } | undefined;
                const idx = typeof point?.dataIndex === 'number' ? point.dataIndex : 0;
                const row = rows[idx];
                return `${row.label}<br/>数值 : ${formatMetricValue(row.value)} ${row.unit}`;
            },
        },
        xAxis: {show: false, type: 'value'},
        yAxis: [
            {
                type: 'category',
                inverse: true,
                axisLabel: {show: true, color: '#fff', fontSize: 12},
                splitLine: {show: false},
                axisTick: {show: false},
                axisLine: {show: false},
                data: rows.map((row) => row.label),
            },
            {
                type: 'category',
                inverse: true,
                axisTick: {show: false},
                axisLine: {show: false},
                show: true,
                axisLabel: {
                    color: '#ffffff',
                    fontSize: 12,
                    formatter: (_value: string, index: number) => `${formatMetricValue(rows[index].value)} ${rows[index].unit}`,
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
                        {offset: 0, color: 'rgb(57,89,255,1)'},
                        {offset: 1, color: 'rgb(46,200,207,1)'},
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
                itemStyle: {color: 'rgba(24,31,68,1)', borderRadius: 30},
                silent: true,
            },
        ],
    };
}

export function createWorkshopFourTemperatureGaugeOption(value: number): EChartsOption {
    const safeValue = clampGaugeValue(value);
    const percent = safeValue / 500;

    return {
        backgroundColor: 'transparent',
        title: {
            text: `{num|${formatMetricValue(safeValue)}}`,
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
                        lineHeight: 24
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
                axisLine: {lineStyle: {width: 1, color: [[1, 'rgba(255,255,255,0)']]}},
                axisTick: {
                    show: true,
                    splitNumber: 6,
                    distance: -10,
                    lineStyle: {color: '#dff7ff', width: 1.5},
                    length: 3
                },
                splitLine: {show: true, distance: -10, length: 9, lineStyle: {color: '#98dcff', width: 2}},
                axisLabel: {
                    show: true,
                    color: '#ccefff',
                    fontSize: 8,
                    distance: -28,
                    formatter: (tickValue: number) => `${tickValue}`
                },
                pointer: {show: true, length: '53%', width: 3, offsetCenter: [0, '-8%'], itemStyle: {color: '#eefbff'}},
                anchor: {show: true, size: 6, itemStyle: {color: '#f7fdff', borderColor: '#96d9ff', borderWidth: 1.5}},
                detail: {show: false},
                title: {show: false},
                data: [{value: safeValue}],
            },
            {
                type: 'pie',
                radius: ['58%', '70%'],
                center: ['50%', '74%'],
                startAngle: 180,
                endAngle: 0,
                color: [{
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 0,
                    colorStops: [{offset: 0, color: 'transparent'}, {offset: 0.38, color: '#f7fcff'}, {
                        offset: 1,
                        color: '#5ebcff'
                    }]
                }, 'transparent'],
                legendHoverLink: false,
                z: 10,
                label: {show: false},
                labelLine: {show: false},
                data: [{value: 50 + percent * 50}, {value: 100 - (50 + percent * 50)}],
            } as any,
            {
                type: 'pie',
                label: {show: false},
                center: ['50%', '74%'],
                radius: ['0%', '54%'],
                startAngle: 180,
                data: [{
                    value: 50,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{offset: 0, color: 'rgba(0, 180, 255, 0.35)'}, {
                                offset: 1,
                                color: 'rgba(0, 60, 120, 0.15)'
                            }]
                        }, opacity: 0.2
                    }
                }, {value: 100, itemStyle: {color: 'transparent'}}],
            } as any,
        ],
    };
}

export function createWorkshopFourExternalBarOption(rows: WorkshopFourExternalRow[]): EChartsOption {
    const values = rows.map((row) => (Number.isFinite(row.value) ? row.value : 0));
    const rawMax = Math.max(...values, 1);
    const maxValue = Math.max(10, Math.ceil(rawMax / 10) * 10);
    const barValues = values.map((value) => Math.max(value, maxValue * 0.08));
    const endCaps = barValues.map((value) => ({value, symbolPosition: 'end' as const}));

    return {
        backgroundColor: 'transparent',
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {type: 'none'},
            formatter: (params: unknown) => {
                const list = Array.isArray(params) ? params : [];
                const point = list.find((item) => (item as { seriesName?: string }).seriesName === '设备值') as {
                    axisValueLabel?: string;
                    value?: number
                } | undefined;
                const name = point?.axisValueLabel ?? '';
                const value = typeof point?.value === 'number' ? point.value : 0;
                return `${name}<br/>数值 : ${formatMetricValue(value)} A`;
            },
        },
        grid: {left: '3%', right: '3%', top: '8%', bottom: '16%', containLabel: false},
        xAxis: {
            type: 'category',
            data: rows.map((row) => row.label),
            max: rows.length - 1,
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: true, color: 'rgba(225, 245, 255, 0.92)', fontSize: 10, margin: 14},
        },
        yAxis: [{
            type: 'value',
            max: maxValue,
            splitLine: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false}
        }],
        series: [
            {
                name: '顶部',
                type: 'pictorialBar',
                symbolSize: [38, 16],
                symbolOffset: [0, -10],
                z: 12,
                itemStyle: {color: '#6fe6ff'},
                data: endCaps
            },
            {
                name: '底部',
                type: 'pictorialBar',
                symbolSize: [38, 16],
                symbolOffset: [0, 10],
                z: 12,
                itemStyle: {color: '#4fd8ff'},
                data: barValues
            },
            {
                name: '实线边框',
                type: 'pictorialBar',
                symbolSize: [56, 28],
                symbolOffset: [0, 18],
                z: 11,
                itemStyle: {color: 'transparent', borderColor: '#62deff', borderWidth: 3},
                data: barValues
            },
            {
                name: '虚线边框',
                type: 'pictorialBar',
                symbolSize: [70, 38],
                symbolOffset: [0, 24],
                z: 10,
                itemStyle: {color: 'transparent', borderColor: '#7be9ff', borderType: 'dashed', borderWidth: 3},
                data: barValues
            },
            {
                name: '设备值',
                type: 'bar',
                barWidth: 38,
                barGap: '-100%',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: 'rgba(132, 239, 255, 0.95)'},
                        {offset: 0.28, color: 'rgba(61, 201, 255, 0.88)'},
                        {offset: 1, color: 'rgba(18, 110, 203, 0.72)'},
                    ]),
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 11,
                    distance: 10,
                    formatter: ({dataIndex}: { dataIndex: number }) => `${formatMetricValue(values[dataIndex])}`,
                },
                data: barValues,
                z: 9,
            },
        ],
    };
}
