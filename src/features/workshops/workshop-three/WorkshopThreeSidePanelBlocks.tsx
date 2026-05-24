import React from 'react';
import type {ScadaData} from '../../dashboard/model/types';
import loadingTruckImage from '../../../images/油罐车.png';
import {
    WORKSHOP_THREE_LEFT_PANEL_CONFIG,
    WORKSHOP_THREE_RIGHT_PANEL_CONFIG,
    getWorkshopThreeExternalRows,
    getWorkshopThreeLevelRows,
    getWorkshopThreeOtherFlowSlices,
    getWorkshopThreeSteamFlowSlices,
    getWorkshopThreeLoadingValues,
    getWorkshopThreeTemperatureRows,
    type WorkshopThreeFlowSlice,
} from './workshopThreeSidePanelBindings';
import {
    createWorkshopThreeExternalBarOption,
    createWorkshopThreeFlowLiquidFillOption,
    createWorkshopThreeLevelBarOption,
    createWorkshopThreeLoadingBarOption,
    createWorkshopThreeTemperatureGaugeOption,
} from './workshopThreePanelCharts';
import {WorkshopThreeChart, WorkshopThreeSidePanelShell} from './WorkshopThreeSidePanelShell';

function useCarousel<T>(items: T[], intervalMs = 3500) {
    const [index, setIndex] = React.useState(0);
    const [visible, setVisible] = React.useState(true);
    const timeoutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (items.length <= 1) return undefined;
        const timer = window.setInterval(() => {
            setVisible(false);
            if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
            timeoutRef.current = window.setTimeout(() => {
                setIndex((current) => (current + 1) % items.length);
                setVisible(true);
                timeoutRef.current = null;
            }, 220);
        }, intervalMs);
        return () => {
            window.clearInterval(timer);
            if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
        };
    }, [intervalMs, items.length]);

    return {active: (items[index] ?? items[0]) as T, visible};
}

export function WorkshopThreeLevelSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_THREE_LEFT_PANEL_CONFIG.level;
    const rows = React.useMemo(() => getWorkshopThreeLevelRows(data), [data]);
    const option = React.useMemo(() => createWorkshopThreeLevelBarOption(rows), [rows]);
    return (
        <WorkshopThreeSidePanelShell title={config.title} subtitle={config.subtitle}>
            <div className="w3-side-panel__meta"><span>{config.meta[0]}</span><span>{config.meta[1]}</span></div>
            <WorkshopThreeChart option={option} className="w3-side-panel__chart w3-side-panel__chart--leak"/>
        </WorkshopThreeSidePanelShell>
    );
}

function WorkshopThreeFlowCarouselSidePanel({
                                                title,
                                                subtitle,
                                                unitMeta,
                                                slices,
                                            }: {
    title: string;
    subtitle: string;
    unitMeta: string;
    slices: WorkshopThreeFlowSlice[];
}) {
    const {active, visible} = useCarousel<WorkshopThreeFlowSlice>(slices);
    const option = React.useMemo(
        () => createWorkshopThreeFlowLiquidFillOption(active.instant, active.total),
        [active.instant, active.total],
    );
    return (
        <WorkshopThreeSidePanelShell title={title} subtitle={subtitle}>
            <div className="w3-side-panel__meta"><span>{active.title}</span><span>{unitMeta}</span></div>
            <div className={visible ? 'w3-side-panel__fade' : 'w3-side-panel__fade w3-side-panel__fade--hidden'}>
                <WorkshopThreeChart option={option} className="w3-side-panel__chart w3-side-panel__chart--flow"/>
            </div>
        </WorkshopThreeSidePanelShell>
    );
}

export function WorkshopThreeSteamFlowSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_THREE_LEFT_PANEL_CONFIG.steamFlow;
    const slices = React.useMemo(() => getWorkshopThreeSteamFlowSlices(data), [data]);
    return (
        <WorkshopThreeFlowCarouselSidePanel
            title={config.title}
            subtitle={config.subtitle}
            unitMeta={config.meta[1]}
            slices={slices}
        />
    );
}

export function WorkshopThreeOtherFlowSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_THREE_RIGHT_PANEL_CONFIG.otherFlow;
    const slices = React.useMemo(() => getWorkshopThreeOtherFlowSlices(data), [data]);
    return (
        <WorkshopThreeFlowCarouselSidePanel
            title={config.title}
            subtitle={config.subtitle}
            unitMeta={config.meta[1]}
            slices={slices}
        />
    );
}

export function WorkshopThreeLoadingSidePanel({
                                                  data,
                                                  panelConfig = WORKSHOP_THREE_LEFT_PANEL_CONFIG.loading,
                                              }: {
    data: ScadaData;
    panelConfig?: typeof WORKSHOP_THREE_LEFT_PANEL_CONFIG.loading;
}) {
    const loading = React.useMemo(() => getWorkshopThreeLoadingValues(data), [data]);
    const option = React.useMemo(
        () => createWorkshopThreeLoadingBarOption(loading.instant, loading.total),
        [loading.instant, loading.total],
    );
    return (
        <WorkshopThreeSidePanelShell title={panelConfig.title} subtitle={panelConfig.subtitle} variant="loading">
            <div className="w3-side-panel__meta"><span>{panelConfig.meta[0]}</span><span>{panelConfig.meta[1]}</span>
            </div>
            <div className="w3-side-panel__loading-status">
                <div className="w3-side-panel__loading-truck-wrap">
                    <div
                        className={loading.isActive ? 'animate-truck-loading text-emerald-600' : 'animate-truck-standby text-sky-300'}>
                        <img src={loadingTruckImage} alt="装车罐车" className="w3-side-panel__loading-truck"
                             draggable="false"/>
                    </div>
                    <div className={loading.isActive ? 'truck-road truck-road--fast' : 'truck-road truck-road--slow'}
                         aria-hidden/>
                </div>
                <div
                    className={loading.isActive ? 'data-glow-emerald w3-side-panel__loading-state' : 'data-glow w3-side-panel__loading-state'}>
                    {loading.isActive ? '装载中' : '待机中'}
                </div>
            </div>
            <div className="w3-side-panel__meta"><span>装车流量监测</span><span>单位 / m³</span></div>
            <WorkshopThreeChart option={option} className="w3-side-panel__chart w3-side-panel__chart--loading-bar"/>
        </WorkshopThreeSidePanelShell>
    );
}

export function WorkshopThreeTemperatureSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_THREE_RIGHT_PANEL_CONFIG.temperature;
    const rows = React.useMemo(() => getWorkshopThreeTemperatureRows(data), [data]);
    const option1 = React.useMemo(() => createWorkshopThreeTemperatureGaugeOption(rows[0].value), [rows]);
    const option2 = React.useMemo(() => createWorkshopThreeTemperatureGaugeOption(rows[1].value), [rows]);
    return (
        <WorkshopThreeSidePanelShell title={config.title} subtitle={config.subtitle}>
            <div className="w3-side-panel__meta"><span>{config.meta[0]}</span><span>{config.meta[1]}</span></div>
            <div className="w3-side-panel__temp-grid">
                <div className="w3-side-panel__temp-card">
                    <WorkshopThreeChart option={option1} className="w3-side-panel__temp-chart"/>
                    <div className="w3-side-panel__temp-label">{rows[0].label}</div>
                </div>
                <div className="w3-side-panel__temp-card">
                    <WorkshopThreeChart option={option2} className="w3-side-panel__temp-chart"/>
                    <div className="w3-side-panel__temp-label">{rows[1].label}</div>
                </div>
            </div>
        </WorkshopThreeSidePanelShell>
    );
}

export function WorkshopThreeExternalSidePanel({data}: { data: ScadaData }) {
    const config = WORKSHOP_THREE_RIGHT_PANEL_CONFIG.external;
    type ExternalSlice = {
        variant: 'old' | 'drum';
        rows: ReturnType<typeof getWorkshopThreeExternalRows>;
        meta: readonly [string, string];
    };
    const slices = React.useMemo<ExternalSlice[]>(
        () => (['old', 'drum'] as const).map((variant) => ({
            variant,
            rows: getWorkshopThreeExternalRows(data, variant),
            meta: variant === 'old' ? config.metaOld : config.metaDrum,
        })),
        [config.metaDrum, config.metaOld, data],
    );
    const {active, visible} = useCarousel<ExternalSlice>(slices);
    const option = React.useMemo(() => createWorkshopThreeExternalBarOption(active.rows), [active.rows]);
    return (
        <WorkshopThreeSidePanelShell title={config.title} subtitle={config.subtitle}>
            <div className={visible ? 'w3-side-panel__fade' : 'w3-side-panel__fade w3-side-panel__fade--hidden'}>
                <div className="w3-side-panel__meta"><span>{active.meta[0]}</span><span>{active.meta[1]}</span></div>
                <WorkshopThreeChart option={option} className="w3-side-panel__chart w3-side-panel__chart--external"/>
            </div>
        </WorkshopThreeSidePanelShell>
    );
}
