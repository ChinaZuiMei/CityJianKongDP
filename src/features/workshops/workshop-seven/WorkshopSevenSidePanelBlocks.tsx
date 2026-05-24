import React from 'react';
import type {ScadaData} from '../../dashboard/model/types';
import loadingTruckImage from '../../../images/油罐车.png';
import {
    WORKSHOP_SEVEN_LEFT_PANEL_CONFIG,
    WORKSHOP_SEVEN_RIGHT_PANEL_CONFIG,
    getWorkshopSevenLoadingValues,
} from './workshopSevenSidePanelBindings';
import {
    createWorkshopSevenExternalBarOption,
    createWorkshopSevenFlowLiquidFillOption,
    createWorkshopSevenLeakBarOption,
    createWorkshopSevenLoadingBarOption,
    createWorkshopSevenTemperatureGaugeOption,
} from './workshopSevenPanelCharts';
import {WorkshopSevenChart, WorkshopSevenSidePanelShell} from './WorkshopSevenSidePanelShell';

function staticLevelRows(labels: string[], values: number[]) {
    return labels.map((label, index) => ({label, value: values[index] ?? 0}));
}

export function WorkshopSevenFixedFlowSidePanel({instant, total, title, subtitle}: {
    instant: number;
    total: number;
    title: string;
    subtitle: string;
}) {
    const option = React.useMemo(() => createWorkshopSevenFlowLiquidFillOption(instant, total), [instant, total]);
    return (
        <WorkshopSevenSidePanelShell title={title} subtitle={subtitle}>
            <WorkshopSevenChart option={option} className="w7-side-panel__chart w7-side-panel__chart--flow"/>
        </WorkshopSevenSidePanelShell>
    );
}

export function WorkshopSevenStaticLevelSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopSevenLeakBarOption(rows), [rows]);
    return (
        <WorkshopSevenSidePanelShell title={title} subtitle={subtitle}>
            <div className="w7-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopSevenChart option={option} className="w7-side-panel__chart w7-side-panel__chart--leak"/>
        </WorkshopSevenSidePanelShell>
    );
}

export function WorkshopSevenLoadingSidePanel({data, panelConfig}: {
    data: ScadaData;
    panelConfig: { title: string; subtitle: string; meta: readonly [string, string] }
}) {
    const loading = React.useMemo(() => getWorkshopSevenLoadingValues(data), [data]);
    const option = React.useMemo(() => createWorkshopSevenLoadingBarOption(loading.instant, loading.total), [loading.instant, loading.total]);
    return (
        <WorkshopSevenSidePanelShell title={panelConfig.title} subtitle={panelConfig.subtitle} variant="loading">
            <div className="w7-side-panel__meta"><span>{panelConfig.meta[0]}</span><span>{panelConfig.meta[1]}</span>
            </div>
            <div className="w7-side-panel__loading-status">
                <div className="w7-side-panel__loading-truck-wrap">
                    <div
                        className={loading.isActive ? 'animate-truck-loading text-emerald-600' : 'animate-truck-standby text-sky-300'}>
                        <img src={loadingTruckImage} alt="装车罐车" className="w7-side-panel__loading-truck"
                             draggable="false"/>
                    </div>
                </div>
                <div
                    className={loading.isActive ? 'data-glow-emerald w7-side-panel__loading-state' : 'data-glow w7-side-panel__loading-state'}>
                    {loading.isActive ? '装载中' : '待机中'}
                </div>
            </div>
            <WorkshopSevenChart option={option} className="w7-side-panel__chart w7-side-panel__chart--loading-bar"/>
        </WorkshopSevenSidePanelShell>
    );
}

export function WorkshopSevenStaticExternalSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopSevenExternalBarOption(rows), [rows]);
    return (
        <WorkshopSevenSidePanelShell title={title} subtitle={subtitle}>
            <div className="w7-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopSevenChart option={option} className="w7-side-panel__chart w7-side-panel__chart--external"/>
        </WorkshopSevenSidePanelShell>
    );
}

export function WorkshopSevenStaticTemperatureSidePanel({
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
    const option1 = React.useMemo(() => createWorkshopSevenTemperatureGaugeOption(values[0]), [values]);
    const option2 = React.useMemo(() => createWorkshopSevenTemperatureGaugeOption(values[1]), [values]);
    return (
        <WorkshopSevenSidePanelShell title={title} subtitle={subtitle}>
            <div className="w7-side-panel__temp-grid">
                <div className="w7-side-panel__temp-card">
                    <WorkshopSevenChart option={option1} className="w7-side-panel__temp-chart"/>
                    <div className="w7-side-panel__temp-label">{labels[0]}</div>
                </div>
                <div className="w7-side-panel__temp-card">
                    <WorkshopSevenChart option={option2} className="w7-side-panel__temp-chart"/>
                    <div className="w7-side-panel__temp-label">{labels[1]}</div>
                </div>
            </div>
        </WorkshopSevenSidePanelShell>
    );
}

const left = WORKSHOP_SEVEN_LEFT_PANEL_CONFIG;
const right = WORKSHOP_SEVEN_RIGHT_PANEL_CONFIG;

export function WorkshopSevenLeftFlowPanel() {
    return <WorkshopSevenFixedFlowSidePanel title={left.flow.title} subtitle={left.flow.subtitle}
                                            instant={left.flow.instant} total={left.flow.total}/>;
}

export function WorkshopSevenLeftLevelPanel() {
    return (
        <WorkshopSevenStaticLevelSidePanel
            title={left.level.title}
            subtitle={left.level.subtitle}
            labels={[...left.level.labels]}
            values={[...left.level.values]}
            meta={['液体硫酸铝液位', '单位 / m']}
        />
    );
}

export function WorkshopSevenLeftLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopSevenLoadingSidePanel data={data} panelConfig={left.loading}/>;
}

export function WorkshopSevenRightTemperaturePanel() {
    return (
        <WorkshopSevenStaticTemperatureSidePanel
            title={right.temperature.title}
            subtitle={right.temperature.subtitle}
            labels={right.temperature.labels}
            values={right.temperature.values}
        />
    );
}

export function WorkshopSevenRightExternalPanel() {
    return <WorkshopSevenStaticExternalSidePanel title={right.external.title} subtitle={right.external.subtitle}
                                                 labels={[...right.external.labels]} values={[...right.external.values]}
                                                 meta={right.external.meta}/>;
}

export function WorkshopSevenRightLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopSevenLoadingSidePanel data={data} panelConfig={right.loading}/>;
}


