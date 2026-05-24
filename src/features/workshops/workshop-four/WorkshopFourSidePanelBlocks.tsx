import React from 'react';
import type {ScadaData} from '../../dashboard/model/types';
import loadingTruckImage from '../../../images/油罐车.png';
import {
    WORKSHOP_FOUR_LEFT_PANEL_CONFIG,
    WORKSHOP_FOUR_RIGHT_PANEL_CONFIG,
    getWorkshopFourLeftFlowValues,
    getWorkshopFourLoadingValues,
    getWorkshopFourRightFlowValues,
} from './workshopFourSidePanelBindings';
import {
    createWorkshopFourExternalBarOption,
    createWorkshopFourFlowLiquidFillOption,
    createWorkshopFourLeakBarOption,
    createWorkshopFourLoadingBarOption,
} from './workshopFourPanelCharts';
import {WorkshopFourChart, WorkshopFourSidePanelShell} from './WorkshopFourSidePanelShell';

function staticLevelRows(labels: string[], values: number[]) {
    return labels.map((label, index) => ({label, value: values[index] ?? 0}));
}

export function WorkshopFourFixedFlowSidePanel({instant, total, title, subtitle}: {
    instant: number;
    total: number;
    title: string;
    subtitle: string;
}) {
    const option = React.useMemo(() => createWorkshopFourFlowLiquidFillOption(instant, total), [instant, total]);
    return (
        <WorkshopFourSidePanelShell title={title} subtitle={subtitle}>
            <WorkshopFourChart option={option} className="w4-side-panel__chart w4-side-panel__chart--flow"/>
        </WorkshopFourSidePanelShell>
    );
}

export function WorkshopFourStaticLevelSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopFourLeakBarOption(rows), [rows]);
    return (
        <WorkshopFourSidePanelShell title={title} subtitle={subtitle}>
            <div className="w4-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopFourChart option={option} className="w4-side-panel__chart w4-side-panel__chart--leak"/>
        </WorkshopFourSidePanelShell>
    );
}

export function WorkshopFourLoadingSidePanel({data, panelConfig}: {
    data: ScadaData;
    panelConfig: { title: string; subtitle: string; meta: readonly [string, string] }
}) {
    const loading = React.useMemo(() => getWorkshopFourLoadingValues(data), [data]);
    const option = React.useMemo(() => createWorkshopFourLoadingBarOption(loading.instant, loading.total), [loading.instant, loading.total]);
    return (
        <WorkshopFourSidePanelShell title={panelConfig.title} subtitle={panelConfig.subtitle} variant="loading">
            <div className="w4-side-panel__meta"><span>{panelConfig.meta[0]}</span><span>{panelConfig.meta[1]}</span>
            </div>
            <div className="w4-side-panel__loading-status">
                <div className="w4-side-panel__loading-truck-wrap">
                    <div
                        className={loading.isActive ? 'animate-truck-loading text-emerald-600' : 'animate-truck-standby text-sky-300'}>
                        <img src={loadingTruckImage} alt="装车罐车" className="w4-side-panel__loading-truck"
                             draggable="false"/>
                    </div>
                </div>
                <div
                    className={loading.isActive ? 'data-glow-emerald w4-side-panel__loading-state' : 'data-glow w4-side-panel__loading-state'}>
                    {loading.isActive ? '装载中' : '待机中'}
                </div>
            </div>
            <WorkshopFourChart option={option} className="w4-side-panel__chart w4-side-panel__chart--loading-bar"/>
        </WorkshopFourSidePanelShell>
    );
}

export function WorkshopFourStaticExternalSidePanel({labels, values, title, subtitle, meta}: {
    labels: string[];
    values: number[];
    title: string;
    subtitle: string;
    meta: readonly [string, string];
}) {
    const rows = React.useMemo(() => staticLevelRows(labels, values), [labels, values]);
    const option = React.useMemo(() => createWorkshopFourExternalBarOption(rows), [rows]);
    return (
        <WorkshopFourSidePanelShell title={title} subtitle={subtitle}>
            <div className="w4-side-panel__meta"><span>{meta[0]}</span><span>{meta[1]}</span></div>
            <WorkshopFourChart option={option} className="w4-side-panel__chart w4-side-panel__chart--external"/>
        </WorkshopFourSidePanelShell>
    );
}

const left = WORKSHOP_FOUR_LEFT_PANEL_CONFIG;
const right = WORKSHOP_FOUR_RIGHT_PANEL_CONFIG;

export function WorkshopFourLeftFlowPanel({data}: { data: ScadaData }) {
    const flow = React.useMemo(() => getWorkshopFourLeftFlowValues(data), [data]);
    return <WorkshopFourFixedFlowSidePanel title={left.flow.title} subtitle={left.flow.subtitle}
                                           instant={flow.instant} total={flow.total}/>;
}

export function WorkshopFourLeftLevelPanel() {
    return <WorkshopFourStaticLevelSidePanel title={left.level.title} subtitle={left.level.subtitle}
                                             labels={[...left.level.labels]} values={[...left.level.values]}
                                             meta={['喷雾干燥液位', '单位 / m']}/>;
}

export function WorkshopFourLeftLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopFourLoadingSidePanel data={data} panelConfig={left.loading}/>;
}

export function WorkshopFourRightFlowPanel({data}: { data: ScadaData }) {
    const flow = React.useMemo(() => getWorkshopFourRightFlowValues(data), [data]);
    return <WorkshopFourFixedFlowSidePanel title={right.flow.title} subtitle={right.flow.subtitle}
                                           instant={flow.instant} total={flow.total}/>;
}

export function WorkshopFourRightExternalPanel() {
    return <WorkshopFourStaticExternalSidePanel title={right.external.title} subtitle={right.external.subtitle}
                                                labels={[...right.external.labels]} values={[...right.external.values]}
                                                meta={right.external.meta}/>;
}

export function WorkshopFourRightLoadingPanel({data}: { data: ScadaData }) {
    return <WorkshopFourLoadingSidePanel data={data} panelConfig={right.loading}/>;
}
