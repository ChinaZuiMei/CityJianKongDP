import React from 'react';
import type {ScadaData} from '../../dashboard/model/types';
import loadingTruckImage from '../../../images/油罐车.png';
import {
    WORKSHOP_FIVE_LEFT_PANEL_CONFIG,
    WORKSHOP_FIVE_RIGHT_PANEL_CONFIG,
    getWorkshopFiveLoadingValues,
} from './workshopFiveSidePanelBindings';
import {
    createWorkshopFiveExternalBarOption,
    createWorkshopFiveFlowLiquidFillOption,
    createWorkshopFiveLeakBarOption,
    createWorkshopFiveLoadingBarOption,
    createWorkshopFiveTemperatureGaugeOption,
} from './workshopFivePanelCharts';
import {WorkshopFiveChart, WorkshopFiveSidePanelShell} from './WorkshopFiveSidePanelShell';

function staticLevelRows(labels: string[], values: number[]) {
    return labels.map((label, index) => ({label, value: values[index] ?? 0}));
}

export function WorkshopFiveFixedFlowSidePanel({instant, total, title, subtitle}: {
    instant: number;
    total: number;
    title: string;
    subtitle: string;
}) {
    const option = React.useMemo(() => createWorkshopFiveFlowLiquidFillOption(instant, total), [instant, total]);
    return (
        <WorkshopFiveSidePanelShell title={title} subtitle={subtitle}>
            <WorkshopFiveChart option={option} className="w5-side-panel__chart w5-side-panel__chart--flow"/>
        </WorkshopFiveSidePanelShell>
    );
}

export function WorkshopFiveStaticLevelSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopFiveLeakBarOption(rows), [rows]);
    return (
        <WorkshopFiveSidePanelShell title={title} subtitle={subtitle}>
            <div className="w5-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopFiveChart option={option} className="w5-side-panel__chart w5-side-panel__chart--leak"/>
        </WorkshopFiveSidePanelShell>
    );
}

export function WorkshopFiveLoadingSidePanel({data, panelConfig}: {
    data: ScadaData;
    panelConfig: { title: string; subtitle: string; meta: readonly [string, string] }
}) {
    const loading = React.useMemo(() => getWorkshopFiveLoadingValues(data), [data]);
    const option = React.useMemo(() => createWorkshopFiveLoadingBarOption(loading.instant, loading.total), [loading.instant, loading.total]);
    return (
        <WorkshopFiveSidePanelShell title={panelConfig.title} subtitle={panelConfig.subtitle} variant="loading">
            <div className="w5-side-panel__meta"><span>{panelConfig.meta[0]}</span><span>{panelConfig.meta[1]}</span>
            </div>
            <div className="w5-side-panel__loading-status">
                <div className="w5-side-panel__loading-truck-wrap">
                    <div
                        className={loading.isActive ? 'animate-truck-loading text-emerald-600' : 'animate-truck-standby text-sky-300'}>
                        <img src={loadingTruckImage} alt="装车罐车" className="w5-side-panel__loading-truck"
                             draggable="false"/>
                    </div>
                </div>
                <div
                    className={loading.isActive ? 'data-glow-emerald w5-side-panel__loading-state' : 'data-glow w5-side-panel__loading-state'}>
                    {loading.isActive ? '装载中' : '待机中'}
                </div>
            </div>
            <WorkshopFiveChart option={option} className="w5-side-panel__chart w5-side-panel__chart--loading-bar"/>
        </WorkshopFiveSidePanelShell>
    );
}

export function WorkshopFiveStaticExternalSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopFiveExternalBarOption(rows), [rows]);
    return (
        <WorkshopFiveSidePanelShell title={title} subtitle={subtitle}>
            <div className="w5-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopFiveChart option={option} className="w5-side-panel__chart w5-side-panel__chart--external"/>
        </WorkshopFiveSidePanelShell>
    );
}

export function WorkshopFiveStaticTemperatureSidePanel({
                                                           labels,
                                                           values,
                                                           title,
                                                           subtitle,
                                                       }: {
    labels: [string, string];
    values: [number, number];
    title: string;
    subtitle: string;
}) {
    const option1 = React.useMemo(() => createWorkshopFiveTemperatureGaugeOption(values[0]), [values]);
    const option2 = React.useMemo(() => createWorkshopFiveTemperatureGaugeOption(values[1]), [values]);
    return (
        <WorkshopFiveSidePanelShell title={title} subtitle={subtitle}>
            <div className="w5-side-panel__temp-grid">
                <div className="w5-side-panel__temp-card">
                    <WorkshopFiveChart option={option1} className="w5-side-panel__temp-chart"/>
                    <div className="w5-side-panel__temp-label">{labels[0]}</div>
                </div>
                <div className="w5-side-panel__temp-card">
                    <WorkshopFiveChart option={option2} className="w5-side-panel__temp-chart"/>
                    <div className="w5-side-panel__temp-label">{labels[1]}</div>
                </div>
            </div>
        </WorkshopFiveSidePanelShell>
    );
}

const left = WORKSHOP_FIVE_LEFT_PANEL_CONFIG;
const right = WORKSHOP_FIVE_RIGHT_PANEL_CONFIG;

export function WorkshopFiveLeftFlowPanel() {
    return <WorkshopFiveFixedFlowSidePanel title={left.flow.title} subtitle={left.flow.subtitle}
                                           instant={left.flow.instant} total={left.flow.total}/>;
}

export function WorkshopFiveLeftLevelPanel() {
    return (
        <WorkshopFiveStaticLevelSidePanel
            title={left.level.title}
            subtitle={left.level.subtitle}
            labels={[...left.level.labels]}
            values={[...left.level.values]}
            meta={['低铁硫酸铝液位', '单位 / m']}
        />
    );
}

export function WorkshopFiveLeftLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopFiveLoadingSidePanel data={data} panelConfig={left.loading}/>;
}

export function WorkshopFiveRightTemperaturePanel() {
    return (
        <WorkshopFiveStaticTemperatureSidePanel
            title={right.temperature.title}
            subtitle={right.temperature.subtitle}
            labels={right.temperature.labels}
            values={right.temperature.values}
        />
    );
}

export function WorkshopFiveRightExternalPanel() {
    return <WorkshopFiveStaticExternalSidePanel title={right.external.title} subtitle={right.external.subtitle}
                                                labels={[...right.external.labels]} values={[...right.external.values]}
                                                meta={right.external.meta}/>;
}

export function WorkshopFiveRightLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopFiveLoadingSidePanel data={data} panelConfig={right.loading}/>;
}


