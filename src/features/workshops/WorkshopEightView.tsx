import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel, ScrollDashboard} from '../dashboard';
import type {WorkshopRuntimeData} from './types';
import tankImage from '../../mingfanImg/罐子.png';
import shipImage from '../../mingfanImg/chaungjian.png';
import {formatMetricValue} from '../../utils/formatMetricValue';
import {WorkshopEightLeftPanels, WorkshopEightRightPanels} from './workshop-eight';
import {resolveWorkshopEightAlarmRegion} from './workshopEightDataBindings';

const tankIds = ['F0101A', 'F0101B', 'F0101C', 'F0101D'] as const;

const regionHeaders = [
    {id: 'main', title: '主画面', subtitle: 'MAIN SCREEN', alarmRegionId: 'main' as const},
    {id: 'output', title: '产量统计', subtitle: 'OUTPUT STATISTICS', alarmRegionId: 'output' as const},
];

function WorkshopEightMainScreen({
                                     tanks,
                                 }: {
    tanks: Array<{ id: string; current: number; pressure: number }>;
}) {
    return (
        <section className="workshop-eight-carousel-screen" aria-label="明矾车间主画面">
            <div className="workshop-eight-tank-row">
                {tanks.map((tank) => (
                    <div key={tank.id} className="workshop-eight-tank-item">
                        <div className="workshop-eight-tank-item__label">{tank.id}</div>
                        <img src={tankImage} alt={tank.id} className="workshop-eight-tank-item__image"
                             draggable="false"/>
                        <div className="workshop-eight-tank-item__metrics">
                            <div className="workshop-eight-tank-item__metric">{formatMetricValue(tank.current)} A</div>
                            <div className="workshop-eight-tank-item__metric">{formatMetricValue(tank.pressure)} Mpa
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function WorkshopEightOutputScreen({output}: { output: number }) {
    return (
        <section className="workshop-five-output" aria-label="明矾车间产线1包装统计">
            <div className="workshop-five-output__meta">
                <div className="workshop-five-output__info-box">产线1包装统计</div>
                <div className="workshop-five-output__info-box">当前数量: {formatMetricValue(output)} P</div>
            </div>
            <div className="workshop-five-output__ship-wrap">
                <img src={shipImage} alt="产线1包装统计" className="workshop-five-output__ship" draggable="false"/>
            </div>
        </section>
    );
}

function WorkshopEightBody({
                               activeRegionIndex,
                               onActiveRegionIndexChange,
                               scadaData,
                           }: {
    activeRegionIndex: number;
    onActiveRegionIndexChange: (index: number) => void;
    scadaData: WorkshopRuntimeData['scadaData'];
}) {
    const tankMetrics = React.useMemo(
        () => [
            {id: tankIds[0], current: scadaData.w8_reactor1_current, pressure: scadaData.w8_reactor1_pressure},
            {id: tankIds[1], current: scadaData.w8_reactor2_current, pressure: scadaData.w8_reactor2_pressure},
            {id: tankIds[2], current: scadaData.w8_reactor3_current, pressure: scadaData.w8_reactor3_pressure},
            {id: tankIds[3], current: scadaData.w8_reactor4_current, pressure: scadaData.w8_reactor4_pressure},
        ],
        [scadaData],
    );

    const slides = [
        {id: 'main', content: <WorkshopEightMainScreen tanks={tankMetrics}/>},
        {id: 'output', content: <WorkshopEightOutputScreen output={scadaData.w8_output}/>},
    ];

    const reversedSlides = [...slides].reverse();
    const bodyTrackIndex = Math.max(0, slides.length - 1 - activeRegionIndex);

    return (
        <div className="workshop-five-body">
            <div className="workshop-five-body__track" style={{transform: `translateX(-${bodyTrackIndex * 100}%)`}}>
                {reversedSlides.map((slide) => (
                    <div key={slide.id} className="workshop-five-body__slide">
                        {slide.content}
                    </div>
                ))}
            </div>
            <div className="workshop-carousel__dots workshop-carousel__dots--bottom" aria-label="明矾车间轮播切换">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        type="button"
                        className={index === activeRegionIndex ? 'workshop-carousel__dot workshop-carousel__dot--active' : 'workshop-carousel__dot'}
                        onClick={() => onActiveRegionIndexChange(index)}
                        aria-label={`切换到${regionHeaders[index]?.title ?? `第 ${index + 1} 页`}`}
                        aria-current={index === activeRegionIndex ? 'true' : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

export function WorkshopEightView({
                                      scadaData,
                                      alarmData,
                                      activeAlarms,
                                      isAlarmPanelOpen,
                                      setIsAlarmPanelOpen,
                                  }: WorkshopRuntimeData) {
    const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
    const [activeRegionIndex, setActiveRegionIndex] = React.useState(0);

    return (
        <>
            <AnimatePresence>
                <AlarmPanel
                    alarms={activeAlarms}
                    alarmData={alarmData}
                    isOpen={isAlarmPanelOpen}
                    onClose={() => setIsAlarmPanelOpen(false)}
                />
            </AnimatePresence>

            <button
                type="button"
                className={leftPanelCollapsed ? 'w8-side-panel-toggle w8-side-panel-toggle--left w8-side-panel-toggle--collapsed' : 'w8-side-panel-toggle w8-side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'w8-side-panel-column w8-side-panel-column--left w8-side-panel-column--collapsed-left' : 'w8-side-panel-column w8-side-panel-column--left'}>
                <WorkshopEightLeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'w8-side-panel-toggle w8-side-panel-toggle--right w8-side-panel-toggle--collapsed' : 'w8-side-panel-toggle w8-side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'w8-side-panel-column w8-side-panel-column--right w8-side-panel-column--collapsed-right' : 'w8-side-panel-column w8-side-panel-column--right'}>
                <WorkshopEightRightPanels data={scadaData}/>
            </div>

            <main className="relative z-10 flex-1 overflow-hidden bg-transparent">
                <ScrollDashboard
                    data={scadaData}
                    alarmData={alarmData}
                    hideRegionBody
                    headerRegions={regionHeaders}
                    activeRegionIndex={activeRegionIndex}
                    onActiveRegionIndexChange={setActiveRegionIndex}
                    resolveAlarmRegion={resolveWorkshopEightAlarmRegion}
                />
                <WorkshopEightBody
                    activeRegionIndex={activeRegionIndex}
                    onActiveRegionIndexChange={setActiveRegionIndex}
                    scadaData={scadaData}
                />
            </main>
        </>
    );
}
