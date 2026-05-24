import React from 'react';
import type {ScadaData} from '../../dashboard/model/types';
import loadingTruckImage from '../../../images/油罐车.png';
import {
    WORKSHOP_SIX_LEFT_PANEL_CONFIG,
    WORKSHOP_SIX_RIGHT_PANEL_CONFIG,
    getWorkshopSixLoadingValues,
} from './workshopSixSidePanelBindings';
import {
    createWorkshopSixExternalBarOption,
    createWorkshopSixFlowLiquidFillOption,
    createWorkshopSixLeakBarOption,
    createWorkshopSixLoadingBarOption,
    createWorkshopSixTemperatureGaugeOption,
} from './workshopSixPanelCharts';
import {WorkshopSixChart, WorkshopSixSidePanelShell} from './WorkshopSixSidePanelShell';

function staticLevelRows(labels: string[], values: number[]) {
    return labels.map((label, index) => ({label, value: values[index] ?? 0}));
}

export function WorkshopSixFixedFlowSidePanel({instant, total, title, subtitle}: {
    instant: number;
    total: number;
    title: string;
    subtitle: string;
}) {
    const option = React.useMemo(() => createWorkshopSixFlowLiquidFillOption(instant, total), [instant, total]);
    return (
        <WorkshopSixSidePanelShell title={title} subtitle={subtitle}>
            <WorkshopSixChart option={option} className="w6-side-panel__chart w6-side-panel__chart--flow"/>
        </WorkshopSixSidePanelShell>
    );
}

export function WorkshopSixStaticLevelSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopSixLeakBarOption(rows), [rows]);
    return (
        <WorkshopSixSidePanelShell title={title} subtitle={subtitle}>
            <div className="w6-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopSixChart option={option} className="w6-side-panel__chart w6-side-panel__chart--leak"/>
        </WorkshopSixSidePanelShell>
    );
}

export function WorkshopSixLoadingSidePanel({data, panelConfig}: {
    data: ScadaData;
    panelConfig: { title: string; subtitle: string; meta: readonly [string, string] }
}) {
    const loading = React.useMemo(() => getWorkshopSixLoadingValues(data), [data]);
    const option = React.useMemo(() => createWorkshopSixLoadingBarOption(loading.instant, loading.total), [loading.instant, loading.total]);
    return (
        <WorkshopSixSidePanelShell title={panelConfig.title} subtitle={panelConfig.subtitle} variant="loading">
            <div className="w6-side-panel__meta"><span>{panelConfig.meta[0]}</span><span>{panelConfig.meta[1]}</span>
            </div>
            <div className="w6-side-panel__loading-status">
                <div className="w6-side-panel__loading-truck-wrap">
                    <div
                        className={loading.isActive ? 'animate-truck-loading text-emerald-600' : 'animate-truck-standby text-sky-300'}>
                        <img src={loadingTruckImage} alt="装车罐车" className="w6-side-panel__loading-truck"
                             draggable="false"/>
                    </div>
                </div>
                <div
                    className={loading.isActive ? 'data-glow-emerald w6-side-panel__loading-state' : 'data-glow w6-side-panel__loading-state'}>
                    {loading.isActive ? '装载中' : '待机中'}
                </div>
            </div>
            <WorkshopSixChart option={option} className="w6-side-panel__chart w6-side-panel__chart--loading-bar"/>
        </WorkshopSixSidePanelShell>
    );
}

export function WorkshopSixStaticExternalSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopSixExternalBarOption(rows), [rows]);
    return (
        <WorkshopSixSidePanelShell title={title} subtitle={subtitle}>
            <div className="w6-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopSixChart option={option} className="w6-side-panel__chart w6-side-panel__chart--external"/>
        </WorkshopSixSidePanelShell>
    );
}

export function WorkshopSixStaticTemperatureSidePanel({
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
    const option1 = React.useMemo(() => createWorkshopSixTemperatureGaugeOption(values[0]), [values]);
    const option2 = React.useMemo(() => createWorkshopSixTemperatureGaugeOption(values[1]), [values]);
    return (
        <WorkshopSixSidePanelShell title={title} subtitle={subtitle}>
            <div className="w6-side-panel__temp-grid">
                <div className="w6-side-panel__temp-card">
                    <WorkshopSixChart option={option1} className="w6-side-panel__temp-chart"/>
                    <div className="w6-side-panel__temp-label">{labels[0]}</div>
                </div>
                <div className="w6-side-panel__temp-card">
                    <WorkshopSixChart option={option2} className="w6-side-panel__temp-chart"/>
                    <div className="w6-side-panel__temp-label">{labels[1]}</div>
                </div>
            </div>
        </WorkshopSixSidePanelShell>
    );
}

const left = WORKSHOP_SIX_LEFT_PANEL_CONFIG;
const right = WORKSHOP_SIX_RIGHT_PANEL_CONFIG;

export function WorkshopSixLeftFlowPanel() {
    return <WorkshopSixFixedFlowSidePanel title={left.flow.title} subtitle={left.flow.subtitle}
                                          instant={left.flow.instant} total={left.flow.total}/>;
}

export function WorkshopSixLeftLevelPanel() {
    return (
        <WorkshopSixStaticLevelSidePanel
            title={left.level.title}
            subtitle={left.level.subtitle}
            labels={[...left.level.labels]}
            values={[...left.level.values]}
            meta={['聚合硫酸铁液位', '单位 / m']}
        />
    );
}

export function WorkshopSixLeftLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopSixLoadingSidePanel data={data} panelConfig={left.loading}/>;
}

export function WorkshopSixRightTemperaturePanel() {
    return (
        <WorkshopSixStaticTemperatureSidePanel
            title={right.temperature.title}
            subtitle={right.temperature.subtitle}
            labels={right.temperature.labels}
            values={right.temperature.values}
        />
    );
}

export function WorkshopSixRightExternalPanel() {
    return <WorkshopSixStaticExternalSidePanel title={right.external.title} subtitle={right.external.subtitle}
                                               labels={[...right.external.labels]} values={[...right.external.values]}
                                               meta={right.external.meta}/>;
}

export function WorkshopSixRightLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopSixLoadingSidePanel data={data} panelConfig={right.loading}/>;
}

