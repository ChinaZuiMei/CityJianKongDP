import React from 'react';
import {AnimatePresence} from 'motion/react';
import {AlarmPanel, ScrollDashboard} from '../dashboard';
import {WorkshopFourLeftPanels, WorkshopFourRightPanels} from './workshop-four';
import type {WorkshopRuntimeData} from './types';
import tankImage from '../../mingfanImg/罐子.png';
import shipImage from '../../mingfanImg/chaungjian.png';
import {formatMetricValue} from '../../utils/formatMetricValue';

const regionHeaders = [
    {id: 'main-1', title: '主画面-区域1', subtitle: 'MAIN SCREEN - AREA 1', alarmRegionId: 'main' as const},
    {id: 'main-2', title: '主画面-区域2', subtitle: 'MAIN SCREEN - AREA 2', alarmRegionId: 'main' as const},
    {id: 'output', title: '产量区域', subtitle: 'OUTPUT AREA'},
];

type WorkshopFourTankMetric = {
    id: string;
    current: number;
    temperature: number;
    pressure: number;
};

function WorkshopFourTankCard({id, current, temperature, pressure}: WorkshopFourTankMetric) {
    return (
        <article className="workshop-five-tank-card">
            <img src={tankImage} alt={id} className="workshop-five-tank-card__image" draggable="false"/>
            <div className="workshop-five-tank-card__code">{id}</div>
            <div className="workshop-five-tank-card__metrics">
                <div className="workshop-five-tank-card__metric">{formatMetricValue(current)} A</div>
                <div className="workshop-five-tank-card__metric">{formatMetricValue(temperature)}°C</div>
                <div className="workshop-five-tank-card__metric">{formatMetricValue(pressure)} Mpa</div>
            </div>
        </article>
    );
}

function WorkshopFourMainScreen({tanks}: { tanks: WorkshopFourTankMetric[] }) {
    return (
        <section className="workshop-five-screen" aria-label="聚铝新厂喷雾干燥主画面">
            <div className="workshop-five-screen__tank-grid">
                {tanks.map((tank) => (
                    <div key={tank.id} className="workshop-five-screen__tank-slot">
                        <WorkshopFourTankCard {...tank} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function WorkshopFourOutputScreen({quantity}: { quantity: number }) {
    return (
        <section className="workshop-five-output" aria-label="喷雾干燥包装统计">
            <div className="workshop-five-output__meta">
                <div className="workshop-five-output__info-box">产线1包装统计</div>
                <div className="workshop-five-output__info-box">当前数量: {formatMetricValue(quantity)} P</div>
            </div>
            <div className="workshop-five-output__ship-wrap">
                <img src={shipImage} alt="产线1包装统计" className="workshop-five-output__ship" draggable="false"/>
            </div>
        </section>
    );
}

function WorkshopFourBody({
                              activeRegionIndex,
                              onActiveRegionIndexChange,
                              scadaData,
                          }: {
    activeRegionIndex: number;
    onActiveRegionIndexChange: (index: number) => void;
    scadaData: WorkshopRuntimeData['scadaData'];
}) {
    const mainTankGroups = React.useMemo<WorkshopFourTankMetric[][]>(() => ([
        [
            {
                id: 'FO101A',
                current: scadaData.w4_reactor1_current,
                temperature: scadaData.w4_reactor1_temp,
                pressure: scadaData.w4_reactor1_pressure
            },
            {
                id: 'FO101B',
                current: scadaData.w4_reactor2_current,
                temperature: scadaData.w4_reactor2_temp,
                pressure: scadaData.w4_reactor2_pressure
            },
            {
                id: 'FO101C',
                current: scadaData.w4_reactor3_current,
                temperature: scadaData.w4_reactor3_temp,
                pressure: scadaData.w4_reactor3_pressure
            },
        ],
        [
            {
                id: 'FO101D',
                current: scadaData.w4_reactor4_current,
                temperature: scadaData.w4_reactor4_temp,
                pressure: scadaData.w4_reactor4_pressure
            },
            {
                id: 'FO101E',
                current: scadaData.w4_reactor5_current,
                temperature: scadaData.w4_reactor5_temp,
                pressure: scadaData.w4_reactor5_pressure
            },
            {
                id: 'FO101F',
                current: scadaData.w4_reactor6_current,
                temperature: scadaData.w4_reactor6_temp,
                pressure: scadaData.w4_reactor6_pressure
            },
        ],
    ]), [scadaData]);

    const slides = [
        {id: 'main-1', content: <WorkshopFourMainScreen tanks={mainTankGroups[0]}/>},
        {id: 'main-2', content: <WorkshopFourMainScreen tanks={mainTankGroups[1]}/>},
        {id: 'output', content: <WorkshopFourOutputScreen quantity={scadaData.w4_output_packaging}/>},
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
            <div className="workshop-carousel__dots workshop-carousel__dots--bottom" aria-label="车间4轮播切换">
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

export function WorkshopFourView({
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
                className={leftPanelCollapsed ? 'w4-side-panel-toggle w4-side-panel-toggle--left w4-side-panel-toggle--collapsed' : 'w4-side-panel-toggle w4-side-panel-toggle--left'}
                onClick={() => setLeftPanelCollapsed((value) => !value)}
                aria-label={leftPanelCollapsed ? '展开左侧面板' : '收起左侧面板'}
            >
                {leftPanelCollapsed ? '▶' : '◀'}
            </button>
            <div
                className={leftPanelCollapsed ? 'w4-side-panel-column w4-side-panel-column--left w4-side-panel-column--collapsed-left' : 'w4-side-panel-column w4-side-panel-column--left'}>
                <WorkshopFourLeftPanels data={scadaData}/>
            </div>

            <button
                type="button"
                className={rightPanelCollapsed ? 'w4-side-panel-toggle w4-side-panel-toggle--right w4-side-panel-toggle--collapsed' : 'w4-side-panel-toggle w4-side-panel-toggle--right'}
                onClick={() => setRightPanelCollapsed((value) => !value)}
                aria-label={rightPanelCollapsed ? '展开右侧面板' : '收起右侧面板'}
            >
                {rightPanelCollapsed ? '◀' : '▶'}
            </button>
            <div
                className={rightPanelCollapsed ? 'w4-side-panel-column w4-side-panel-column--right w4-side-panel-column--collapsed-right' : 'w4-side-panel-column w4-side-panel-column--right'}>
                <WorkshopFourRightPanels data={scadaData}/>
            </div>

            <main className="relative z-10 flex-1 overflow-hidden bg-transparent">
                <ScrollDashboard
                    data={scadaData}
                    alarmData={alarmData}
                    hideRegionBody
                    headerRegions={regionHeaders}
                    activeRegionIndex={activeRegionIndex}
                    onActiveRegionIndexChange={setActiveRegionIndex}
                />
                <WorkshopFourBody
                    activeRegionIndex={activeRegionIndex}
                    onActiveRegionIndexChange={setActiveRegionIndex}
                    scadaData={scadaData}
                />
            </main>
        </>
    );
}
