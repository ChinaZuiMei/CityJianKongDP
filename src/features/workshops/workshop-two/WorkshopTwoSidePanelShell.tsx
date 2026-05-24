import React, {Suspense} from 'react';
import titleBg from '../../../images/小标题图片.png';
import './WorkshopTwoSidePanels.css';

interface WorkshopTwoSidePanelShellProps {
    title: string;
    subtitle: string;
    variant?: 'default' | 'loading';
    children: React.ReactNode;
}

export function WorkshopTwoSidePanelShell({
                                              title,
                                              subtitle,
                                              variant = 'default',
                                              children,
                                          }: WorkshopTwoSidePanelShellProps) {
    return (
        <aside className={`w2-side-panel${variant === 'loading' ? ' w2-side-panel--loading' : ''}`}>
            <section className="w2-side-panel__top">
                <div className="w2-side-panel__header">
                    <img src={titleBg} alt="" className="w2-side-panel__title-bg"/>
                    <div className="w2-side-panel__title">{title}</div>
                    <div className="w2-side-panel__subtitle">{subtitle}</div>
                </div>
            </section>
            <section className="w2-side-panel__main">
                <div className="w2-side-panel__body">{children}</div>
            </section>
        </aside>
    );
}

const ReactECharts = React.lazy(() => import('echarts-for-react'));

export function WorkshopTwoChart({
                                     option,
                                     className,
                                     height,
                                     onEvents,
                                 }: {
    option: object;
    className?: string;
    height?: number;
    onEvents?: Record<string, () => void>;
}) {
    return (
        <div className={className} style={height ? {height} : undefined}>
            <Suspense fallback={<div className="w2-side-panel__chart-fallback"/>}>
                <ReactECharts
                    option={option}
                    notMerge
                    lazyUpdate
                    opts={{renderer: 'canvas'}}
                    onEvents={onEvents}
                    style={{width: '100%', height: '100%'}}
                />
            </Suspense>
        </div>
    );
}
