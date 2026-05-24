import React from 'react';
import type {ScadaData} from '../../dashboard/model/types';
import loadingTruckImage from '../../../images/油罐车.png';
import {
    WORKSHOP_TWO_LEFT_PANEL_CONFIG,
    WORKSHOP_TWO_RIGHT_PANEL_CONFIG,
    getWorkshopTwoExternalRows,
    getWorkshopTwoFlowSlices,
    getWorkshopTwoLeakPanelRows,
    getWorkshopTwoLoadingValues,
    getWorkshopTwoTemperatureRows,
    type WorkshopTwoFlowSlice,
} from './workshopTwoSidePanelBindings';
import {
    createWorkshopTwoExternalBarOption,
    createWorkshopTwoFlowLiquidFillOption,
    createWorkshopTwoLeakBarOption,
    createWorkshopTwoLoadingBarOption,
    createWorkshopTwoTemperatureGaugeOption,
} from './workshopTwoPanelCharts';
import {WorkshopTwoChart, WorkshopTwoSidePanelShell} from './WorkshopTwoSidePanelShell';

function useCarousel<T>(items: T[], intervalMs = 3500) {
    const [index, setIndex] = React.useState(0);
    const [visible, setVisible] = React.useState(true);
    const timeoutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (items.length <= 1) return undefined;

        const timer = window.setInterval(() => {
            setVisible(false);
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                setIndex((current) => (current + 1) % items.length);
                setVisible(true);
                timeoutRef.current = null;
            }, 220);
        }, intervalMs);

        return () => {
            window.clearInterval(timer);
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [intervalMs, items.length]);

    return {
        active: (items[index] ?? items[0]) as T,
        visible,
    };
}

export function WorkshopTwoLeakSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_TWO_LEFT_PANEL_CONFIG.leak;
    const rows = React.useMemo(() => getWorkshopTwoLeakPanelRows(data), [data]);
    const option = React.useMemo(() => createWorkshopTwoLeakBarOption(rows), [rows]);

    return (
        <WorkshopTwoSidePanelShell title={config.title} subtitle={config.subtitle}>
            <div className="w2-side-panel__meta">
                <span>{config.meta[0]}</span>
                <span>{config.meta[1]}</span>
            </div>
            <WorkshopTwoChart option={option} className="w2-side-panel__chart w2-side-panel__chart--leak"/>
        </WorkshopTwoSidePanelShell>
    );
}

export function WorkshopTwoFlowSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_TWO_LEFT_PANEL_CONFIG.flow;
    const slices = React.useMemo(() => getWorkshopTwoFlowSlices(data), [data]);
    const {active, visible} = useCarousel<WorkshopTwoFlowSlice>(slices);
    const option = React.useMemo(
        () => createWorkshopTwoFlowLiquidFillOption(active.instant, active.total),
        [active.instant, active.total],
    );

    return (
        <WorkshopTwoSidePanelShell title={config.title} subtitle={config.subtitle}>
            <div className="w2-side-panel__meta">
                <span>{active.title}</span>
                <span>{config.meta[1]}</span>
            </div>
            <div className={visible ? 'w2-side-panel__fade' : 'w2-side-panel__fade w2-side-panel__fade--hidden'}>
                <WorkshopTwoChart option={option} className="w2-side-panel__chart w2-side-panel__chart--flow"/>
            </div>
        </WorkshopTwoSidePanelShell>
    );
}

export function WorkshopTwoLoadingSidePanel({
                                                data,
                                                panelConfig = WORKSHOP_TWO_LEFT_PANEL_CONFIG.loading,
                                            }: {
    data: ScadaData;
    panelConfig?: typeof WORKSHOP_TWO_LEFT_PANEL_CONFIG.loading;
}) {
    const loading = React.useMemo(() => getWorkshopTwoLoadingValues(data), [data]);
    const option = React.useMemo(
        () => createWorkshopTwoLoadingBarOption(loading.instant, loading.total),
        [loading.instant, loading.total],
    );

    return (
        <WorkshopTwoSidePanelShell title={panelConfig.title} subtitle={panelConfig.subtitle} variant="loading">
            <div className="w2-side-panel__meta">
                <span>{panelConfig.meta[0]}</span>
                <span>{panelConfig.meta[1]}</span>
            </div>
            <div className="w2-side-panel__loading-status">
                <div className="w2-side-panel__loading-truck-wrap">
                    <div
                        className={loading.isActive ? 'animate-truck-loading text-emerald-600' : 'animate-truck-standby text-sky-300'}>
                        <img src={loadingTruckImage} alt="装车罐车" className="w2-side-panel__loading-truck"
                             draggable="false"/>
                    </div>
                    <div className={loading.isActive ? 'truck-road truck-road--fast' : 'truck-road truck-road--slow'}
                         aria-hidden/>
                </div>
                <div
                    className={loading.isActive ? 'data-glow-emerald w2-side-panel__loading-state' : 'data-glow w2-side-panel__loading-state'}>
                    {loading.isActive ? '装载中' : '待机中'}
                </div>
            </div>
            <div className="w2-side-panel__meta">
                <span>装车流量监测</span>
                <span>单位 / m³</span>
            </div>
            <WorkshopTwoChart option={option} className="w2-side-panel__chart w2-side-panel__chart--loading-bar"/>
        </WorkshopTwoSidePanelShell>
    );
}

export function WorkshopTwoTemperatureSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_TWO_RIGHT_PANEL_CONFIG.temperature;
    const rows = React.useMemo(() => getWorkshopTwoTemperatureRows(data), [data]);
    const option1 = React.useMemo(() => createWorkshopTwoTemperatureGaugeOption(rows[0].value), [rows]);
    const option2 = React.useMemo(() => createWorkshopTwoTemperatureGaugeOption(rows[1].value), [rows]);

    return (
        <WorkshopTwoSidePanelShell title={config.title} subtitle={config.subtitle}>
            <div className="w2-side-panel__meta">
                <span>{config.meta[0]}</span>
                <span>{config.meta[1]}</span>
            </div>
            <div className="w2-side-panel__temp-grid">
                <div className="w2-side-panel__temp-card">
                    <WorkshopTwoChart option={option1} className="w2-side-panel__temp-chart"/>
                    <div className="w2-side-panel__temp-label">{rows[0].label}</div>
                </div>
                <div className="w2-side-panel__temp-card">
                    <WorkshopTwoChart option={option2} className="w2-side-panel__temp-chart"/>
                    <div className="w2-side-panel__temp-label">{rows[1].label}</div>
                </div>
            </div>
        </WorkshopTwoSidePanelShell>
    );
}

export function WorkshopTwoExternalSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_TWO_RIGHT_PANEL_CONFIG.external;
    const variants = React.useMemo(() => (['old', 'drum'] as const), []);
    type ExternalSlice = {
        variant: 'old' | 'drum';
        rows: ReturnType<typeof getWorkshopTwoExternalRows>;
        meta: readonly [string, string];
    };
    const slices = React.useMemo<ExternalSlice[]>(
        () => variants.map((variant) => ({
            variant,
            rows: getWorkshopTwoExternalRows(data, variant),
            meta: variant === 'old' ? config.metaOld : config.metaDrum,
        })),
        [config.metaDrum, config.metaOld, data, variants],
    );
    const {active, visible} = useCarousel<ExternalSlice>(slices);
    const option = React.useMemo(() => createWorkshopTwoExternalBarOption(active.rows), [active.rows]);

    return (
        <WorkshopTwoSidePanelShell title={config.title} subtitle={config.subtitle}>
            <div className={visible ? 'w2-side-panel__fade' : 'w2-side-panel__fade w2-side-panel__fade--hidden'}>
                <div className="w2-side-panel__meta">
                    <span>{active.meta[0]}</span>
                    <span>{active.meta[1]}</span>
                </div>
                <WorkshopTwoChart option={option} className="w2-side-panel__chart w2-side-panel__chart--external"/>
            </div>
        </WorkshopTwoSidePanelShell>
    );
}

export function WorkshopTwoRightLoadingSidePanel({data}: { data: ScadaData }) {
    return <WorkshopTwoLoadingSidePanel data={data} panelConfig={WORKSHOP_TWO_RIGHT_PANEL_CONFIG.loading}/>;
}
